from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

# Configuración del entorno
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Conexión a MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Crear la aplicación principal
app = FastAPI(
    title="Mi API",
    description="API Backend",
    version="1.0.0"
)

# Router con prefijo /api
api_router = APIRouter(prefix="/api")

# MODELOS PYDANTIC
# Define aquí tus modelos de datos

# RUTAS DE LA API
@api_router.get("/")
async def root():
    return {
        "message": "API funcionando",
        "status": "ok"
    }

# Incluir el router en la app
app.include_router(api_router)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos del frontend (para producción)
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_build_dir = ROOT_DIR.parent / "frontend" / "build"
if frontend_build_dir.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_build_dir / "static")), name="static")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Servir el frontend de React en producción"""
        if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None

        file_path = frontend_build_dir / full_path
        if file_path.is_file():
            return FileResponse(file_path)

        return FileResponse(frontend_build_dir / "index.html")

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Servidor iniciado")
    logger.info(f"Conectado a MongoDB: {mongo_url}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Conexión a MongoDB cerrada")