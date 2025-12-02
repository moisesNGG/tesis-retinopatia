from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, pages, prediction

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
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.VERSION
    }
