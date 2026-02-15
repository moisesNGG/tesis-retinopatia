# Production stage - Backend con frontend servido (MongoDB en Railway)
FROM ubuntu:22.04
WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependencias del sistema (incluyendo OpenCV deps para ultralytics + git-lfs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    python3 \
    python3-pip \
    libgl1 \
    libglib2.0-0 \
    git \
    git-lfs \
    && git lfs install \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de backend
COPY backend/requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copiar código del backend
COPY backend/ .

# Copiar pesos de modelos de IA
COPY backend/models_weights/ /app/models_weights/

# Verificar que los archivos de modelos son binarios reales (no LFS pointers)
RUN echo "[MODEL CHECK] Verificando archivos de modelos..." && \
    for f in /app/models_weights/densenet121_ea/best_model.pth \
             /app/models_weights/efficientnet_b0_ea/best_model.pth \
             /app/models_weights/resnet50_ea/best_model.pth \
             /app/models_weights/vit_b16/vit_b16_best.pt \
             /app/models_weights/yolov8x_cls/best.pt; do \
        if [ -f "$f" ]; then \
            SIZE=$(stat -c%s "$f"); \
            echo "  [INFO] $f -> ${SIZE} bytes"; \
            if [ "$SIZE" -lt 1000 ]; then \
                echo "  [ERROR] $f parece ser un LFS pointer (muy pequeno: ${SIZE} bytes)"; \
                echo "  [ERROR] Contenido:"; cat "$f"; echo ""; \
            else \
                echo "  [OK] $f es un archivo binario real"; \
            fi; \
        else \
            echo "  [WARN] $f NO encontrado"; \
        fi; \
    done

# Copiar frontend pre-compilado desde la carpeta public (ya compilado localmente)
COPY public/ /app/public/

# Copiar carpeta uploads (logo y recursos estáticos)
COPY uploads/ /app/uploads/

# Verificar que se copiaron los archivos del frontend
RUN echo "[FRONTEND COPY CHECK]" && ls -la /app/public/ && echo "[OK] Frontend files copiados"

# Crear script de inicio simplificado (MongoDB en Railway)
RUN cat > /start.sh << 'ENDSCRIPT'
#!/bin/bash
set -e
echo "[INFO] Iniciando FastAPI backend..."
echo "[INFO] MongoDB URL: Railway MongoDB service"
cd /app
exec python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
ENDSCRIPT
RUN chmod +x /start.sh

# Exponer puerto
EXPOSE 8000

# Health check (start-period alto para dar tiempo a cargar modelos)
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Comando para iniciar
CMD ["/bin/bash", "/start.sh"]
