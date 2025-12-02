from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, pages, prediction
from pathlib import Path
import os

# Crear instancia de FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="API Backend para sistema de deteccion de retinopatia diabetica"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Eventos de inicio y cierre
@app.on_event("startup")
async def startup_event():
    """Ejecutar al iniciar la aplicacion"""
    await connect_to_mongo()
    print(f"[OK] {settings.APP_NAME} v{settings.VERSION} iniciado")

@app.on_event("shutdown")
async def shutdown_event():
    """Ejecutar al cerrar la aplicacion"""
    await close_mongo_connection()
    print("[*] Aplicacion cerrada")

# Registrar rutas
app.include_router(auth.router, prefix="/api")
app.include_router(pages.router, prefix="/api")
app.include_router(prediction.router, prefix="/api")

# Ruta raiz
@app.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "message": f"{settings.APP_NAME} v{settings.VERSION}",
        "status": "running",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

# Servir archivos estáticos del frontend
PUBLIC_DIR = Path(__file__).parent.parent.parent / "public"
print(f"[DEBUG] Buscando frontend en: {PUBLIC_DIR}")
print(f"[DEBUG] Existe: {PUBLIC_DIR.exists()}")

if PUBLIC_DIR.exists():
    print(f"[INFO] Frontend encontrado en {PUBLIC_DIR}")
    # Montar la carpeta public como archivos estáticos
    app.mount("/static", StaticFiles(directory=str(PUBLIC_DIR)), name="static")
    
    # SPA fallback - servir index.html para cualquier ruta no encontrada
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Servir la aplicación React (SPA)"""
        # No servir archivos estáticos que ya están en /api o /docs
        if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi"):
            raise Exception("Not found")
        
        index_file = PUBLIC_DIR / "index.html"
        if index_file.exists():
            return FileResponse(index_file, media_type="text/html")
        
        return {"error": "Frontend index.html not found"}
else:
    print(f"[WARNING] Frontend no encontrado en {PUBLIC_DIR}")
