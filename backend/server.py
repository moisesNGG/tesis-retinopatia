from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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
import shutil

# Configuración del entorno
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Conexión a MongoDB
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db_name = os.environ.get('DB_NAME', 'rinopatia_db')
db = client[db_name]

# Crear la aplicación principal
app = FastAPI(
    title="RinoDetect API",
    description="API Backend para detección de rinopatía",
    version="1.0.0"
)

# Router con prefijo /api
api_router = APIRouter(prefix="/api")

# MODELOS PYDANTIC
class PageSection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    image_url: Optional[str] = None

class Page(BaseModel):
    slug: str
    title: str
    sections: List[PageSection]

class DiagnosisRequest(BaseModel):
    image_url: str

class DiagnosisResponse(BaseModel):
    id: str
    image_url: str
    has_disease: bool
    confidence: float
    timestamp: datetime

# RUTAS DE LA API

@api_router.get("/pages/{slug}", response_model=Page)
async def get_page(slug: str):
    page = await db.pages.find_one({"slug": slug})
    if page:
        return page
    
    # Default content if not found (Seed data)
    default_page = {
        "slug": slug,
        "title": slug.capitalize(),
        "sections": []
    }
    if slug == "home":
        default_page["title"] = "Inicio"
        default_page["sections"] = [
            {
                "id": "1",
                "title": "Bienvenido a RinoDetect",
                "content": "Una herramienta avanzada para la detección temprana de rinopatía diabética utilizando inteligencia artificial.",
                "image_url": "https://placehold.co/600x400?text=Medical+AI"
            }
        ]
    elif slug == "modelo":
        default_page["title"] = "Nuestro Modelo"
        default_page["sections"] = [
            {
                "id": "1",
                "title": "Red Neuronal Convolucional",
                "content": "Utilizamos una arquitectura de última generación entrenada con miles de imágenes de fondo de ojo.",
                "image_url": "https://placehold.co/600x400?text=Neural+Network"
            }
        ]
    
    # Save default to DB so it exists for editing
    await db.pages.insert_one(default_page)
    return default_page

@api_router.put("/pages/{slug}", response_model=Page)
async def update_page(slug: str, page_data: Page):
    if slug != page_data.slug:
        raise HTTPException(status_code=400, detail="Slug mismatch")
    
    await db.pages.replace_one({"slug": slug}, page_data.dict(), upsert=True)
    return page_data

@api_router.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose(request: DiagnosisRequest):
    # MOCK AI MODEL
    import random
    has_disease = random.choice([True, False])
    confidence = random.uniform(0.85, 0.99)
    
    diagnosis = {
        "id": str(uuid.uuid4()),
        "image_url": request.image_url,
        "has_disease": has_disease,
        "confidence": confidence,
        "timestamp": datetime.now(timezone.utc)
    }
    
    await db.diagnoses.insert_one(diagnosis)
    return diagnosis

UPLOAD_DIR = ROOT_DIR / "static" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    file_ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = UPLOAD_DIR / filename
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/static/uploads/{filename}"}

@api_router.get("/")
async def root():
    return {
        "message": "API funcionando",
        "status": "ok"
    }

# Incluir el router en la app
app.include_router(api_router)

# Mount static files for uploads
app.mount("/static", StaticFiles(directory=str(ROOT_DIR / "static")), name="static")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos del frontend (para producción)
frontend_build_dir = ROOT_DIR.parent / "frontend" / "build"

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    """Servir el frontend de React en producción"""
    if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi.json") or full_path.startswith("static/"):
        return None

    if frontend_build_dir.exists():
        file_path = frontend_build_dir / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(frontend_build_dir / "index.html")
    
    return {"message": "Frontend not built"}

@app.on_event("startup")
async def startup_event():
    logger.info("Servidor iniciado")
    logger.info(f"Conectado a MongoDB: {mongo_url}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Conexión a MongoDB cerrada")