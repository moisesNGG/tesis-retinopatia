# Build stage - Construir el frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Production stage - Backend con frontend servido y MongoDB
FROM python:3.11-slim
WORKDIR /app

# Instalar dependencias del sistema (incluyendo MongoDB)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    lsb-release \
    supervisor \
    && curl -fsSL https://pgp.mongodb.com/server-7.0.asc | apt-key add - \
    && echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian bullseye/mongodb-org/7.0 main" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends mongodb-org-server mongodb-org-tools \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /data/db /data/configdb /var/log/mongodb \
    && chown -R mongodb:mongodb /data/db /data/configdb /var/log/mongodb

# Copiar archivos de backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código del backend
COPY backend/ .

# Copiar el frontend compilado
COPY --from=frontend-builder /app/frontend/build ./public

# Exponer puerto
EXPOSE 8000

# Variables de entorno
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Crear supervisor config para ejecutar MongoDB y FastAPI
RUN echo '[supervisord]\nnodaemon=true\nlogfile=/var/log/supervisor/supervisord.log\n\n[program:mongodb]\ncommand=/usr/bin/mongod --dbpath /data/db --bind_ip 127.0.0.1 --logpath /var/log/mongodb/mongod.log\nautostart=true\nautorestart=true\nstderr_logfile=/var/log/supervisor/mongodb.err.log\nstdout_logfile=/var/log/supervisor/mongodb.out.log\n\n[program:fastapi]\ncommand=python -m uvicorn app.main:app --host 0.0.0.0 --port 8000\ndirectory=/app\nautostart=true\nautorestart=true\nstderr_logfile=/var/log/supervisor/fastapi.err.log\nstdout_logfile=/var/log/supervisor/fastapi.out.log\n' > /etc/supervisor/conf.d/services.conf && mkdir -p /var/log/supervisor

# Comando para iniciar supervisor (que gestiona MongoDB y FastAPI)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/services.conf"]
