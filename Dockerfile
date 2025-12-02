# Build stage - Construir el frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Production stage - Backend con frontend servido y MongoDB
FROM ubuntu:22.04
WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependencias del sistema (incluyendo MongoDB y Python)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    gnupg \
    lsb-release \
    supervisor \
    python3 \
    python3-pip \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

# Instalar MongoDB desde el repositorio oficial
RUN curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor | tee /usr/share/keyrings/mongodb-server-7.0.gpg > /dev/null \
    && echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends mongodb-org \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /data/db /data/configdb /var/log/mongodb \
    && chown -R mongodb:mongodb /data/db /data/configdb /var/log/mongodb

# Copiar archivos de backend
COPY backend/requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copiar código del backend
COPY backend/ .

# Copiar el frontend compilado
COPY --from=frontend-builder /app/frontend/build ./public
ENV PORT=8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Crear supervisor config para ejecutar MongoDB y FastAPI
RUN mkdir -p /var/log/supervisor && cat > /etc/supervisor/conf.d/services.conf << 'EOF'
[supervisord]
nodaemon=true
logfile=/var/log/supervisor/supervisord.log
user=root

[program:mongodb]
command=/usr/bin/mongod --dbpath /data/db --bind_ip 127.0.0.1 --logpath /var/log/mongodb/mongod.log --quiet
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/mongodb.err.log
stdout_logfile=/var/log/supervisor/mongodb.out.log
user=mongodb

[program:fastapi]
command=/bin/bash -c "exec python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000"
directory=/app
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/fastapi.err.log
stdout_logfile=/var/log/supervisor/fastapi.out.log
EOF

# Crear script de inicio que maneja las variables
RUN cat > /start.sh << 'EOF'
#!/bin/bash
set -e

# Establecer variables por defecto
export PORT=${PORT:-8000}
export MONGODB_URI=${MONGODB_URI:-mongodb://127.0.0.1:27017}
export MONGODB_DB_NAME=${MONGODB_DB_NAME:-retinopatia_db}

echo "[*] Puerto: $PORT"
echo "[*] MongoDB URI: $MONGODB_URI"
echo "[*] MongoDB DB: $MONGODB_DB_NAME"

# Iniciar MongoDB en background
echo "[*] Iniciando MongoDB..."
/usr/bin/mongod --dbpath /data/db --bind_ip 127.0.0.1 --logpath /var/log/mongodb/mongod.log --quiet &
MONGO_PID=$!
sleep 3

# Iniciar FastAPI
echo "[*] Iniciando FastAPI en puerto $PORT..."
cd /app
exec python3 -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
EOF
RUN chmod +x /start.sh

# Exponer puerto
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Comando para iniciar todo
CMD ["/start.sh"]
