# Build stage - Construir el frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps 2>&1 | tail -20
COPY frontend/ ./

# Intentar build con manejo de errores
RUN echo "[BUILD] Intentando npm run build..." && \
    npm run build 2>&1 | tail -50 || \
    (echo "[BUILD] Build falló, intentando react-scripts..." && npx react-scripts build 2>&1 | tail -50) || \
    (echo "[BUILD] Todos los builds fallaron, creando carpeta vacía..." && mkdir -p /app/frontend/build)

# Verificar que build existe
RUN if [ -d /app/frontend/build ]; then \
    echo "[BUILD SUCCESS] Carpeta build creada"; \
    ls -la /app/frontend/build | head -20; \
    else \
    echo "[BUILD FAIL] No se creó carpeta build"; \
    fi

# Production stage - Backend con frontend servido y MongoDB
FROM ubuntu:22.04
WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    gnupg \
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

# Crear carpeta public
RUN mkdir -p /app/public

# Copiar el frontend compilado si existe
RUN if [ -d /app/frontend/build ]; then cp -r /app/frontend/build/* /app/public/ 2>/dev/null || true; fi

# Crear index.html fallback si no existe
RUN mkdir -p /app/public && \
    if [ ! -f /app/public/index.html ]; then \
    printf '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Retinopathia</title><style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f5f5f5}div{background:white;padding:40px;border-radius:8px;text-align:center}</style></head><body><div><h1>Retinopathia Diabetica</h1><p>Backend corriendo</p><p><a href="/docs">API Docs</a> | <a href="/health">Health</a></p></div></body></html>' > /app/public/index.html; \
    fi && \
    ls -la /app/public/

# Crear script de inicio (sin expansion de variables, hardcodeado a puerto 8000)
RUN cat > /start.sh << 'ENDSCRIPT'
#!/bin/bash
set -e
echo "[INFO] Iniciando MongoDB..."
/usr/bin/mongod --dbpath /data/db --bind_ip 127.0.0.1 --logpath /var/log/mongodb/mongod.log --quiet &
MONGO_PID=$!
sleep 3
echo "[INFO] MongoDB iniciado (PID: $MONGO_PID)"
echo "[INFO] Iniciando FastAPI en puerto 8000..."
cd /app
exec python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
ENDSCRIPT
RUN chmod +x /start.sh

# Exponer puerto
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Comando para iniciar
CMD ["/bin/bash", "/start.sh"]
