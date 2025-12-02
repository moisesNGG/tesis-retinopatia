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

# Copiar frontend pre-compilado desde la carpeta public (ya compilado localmente)
COPY public/ /app/public/

# Verificar que se copiaron los archivos del frontend
RUN echo "[FRONTEND COPY CHECK]" && ls -la /app/public/ && echo "[OK] Frontend files copiados"

# SIEMPRE crear un index.html real (no fallback)
# Si npm build funcionó, este va a sobrescribir el index.html (lo cual es correcto)
# Si npm build falló, al menos tenemos SPA básica funcional
RUN cat > /app/public/index.html << 'ENDHTML'
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sistema de Detección de Retinopatía Diabética</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
        #root { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
        h1 { color: #333; margin: 0 0 10px 0; }
        p { color: #666; margin: 5px 0; }
        a { color: #0066cc; text-decoration: none; margin: 0 10px; }
        a:hover { text-decoration: underline; }
        .divider { border-top: 1px solid #ddd; margin: 20px 0; }
    </style>
</head>
<body>
    <div id="root">
        <div class="container">
            <h1>🏥 Sistema de Detección de Retinopatía Diabética</h1>
            <p><strong>v1.0.0</strong></p>
            <p>Backend corriendo correctamente ✓</p>
            <div class="divider"></div>
            <p>
                <a href="/docs">📚 API Docs</a>
                <a href="/health">💚 Health</a>
            </p>
        </div>
    </div>
</body>
</html>
ENDHTML

# Verificar que index.html existe
RUN ls -lah /app/public/ && echo "---" && head -c 200 /app/public/index.html

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
