"""
🚀 SERVIDOR BACKEND - PROYECTO DEFAULT 🚀

Este archivo contiene tu servidor FastAPI básico con MongoDB.
Aquí puedes agregar tus endpoints y lógica de negocio.

📝 INSTRUCCIONES:
1. Los endpoints deben tener el prefijo /api (ej: /api/usuarios)
2. Usa los modelos Pydantic para validar datos
3. Conecta con MongoDB usando la variable 'db'
4. Agrega tus rutas al api_router

💡 EJEMPLOS DE USO:
- GET /api/ -> Mensaje de bienvenida
- POST /api/mensaje -> Crear un mensaje
- GET /api/mensajes -> Obtener todos los mensajes
"""

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
    title="🚀 Mi API Proyecto Default",
    description="API básica para empezar tu proyecto",
    version="1.0.0"
)

# Router con prefijo /api (IMPORTANTE: todos los endpoints deben usar este prefijo)
api_router = APIRouter(prefix="/api")

# 📋 MODELOS PYDANTIC - Define aquí tus estructuras de datos
class MensajeCreate(BaseModel):
    """Modelo para crear un nuevo mensaje"""
    texto: str
    autor: str

class Mensaje(BaseModel):
    """Modelo completo del mensaje"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    texto: str
    autor: str
    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# 🛣️ RUTAS DE LA API - Agrega aquí tus endpoints

@api_router.get("/")
async def raiz():
    """🏠 Endpoint principal - Mensaje de bienvenida"""
    return {
        "mensaje": "¡Hola Mundo! 🌍",
        "estado": "funcionando",
        "version": "1.0.0",
        "instrucciones": "Usa /docs para ver la documentación completa"
    }

@api_router.get("/saludo/{nombre}")
async def saludar(nombre: str):
    """👋 Saludo personalizado"""
    return {
        "mensaje": f"¡Hola {nombre}! 🎉",
        "fecha": datetime.now(timezone.utc).isoformat()
    }

@api_router.post("/mensaje", response_model=Mensaje)
async def crear_mensaje(mensaje_data: MensajeCreate):
    """📝 Crear un nuevo mensaje en la base de datos"""
    try:
        # Crear el objeto mensaje
        mensaje_dict = mensaje_data.dict()
        mensaje_obj = Mensaje(**mensaje_dict)
        
        # Guardar en MongoDB
        resultado = await db.mensajes.insert_one(mensaje_obj.dict())
        
        if resultado.inserted_id:
            return mensaje_obj
        else:
            raise HTTPException(status_code=500, detail="Error al guardar el mensaje")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@api_router.get("/mensajes", response_model=List[Mensaje])
async def obtener_mensajes():
    """📋 Obtener todos los mensajes"""
    try:
        mensajes = await db.mensajes.find().to_list(length=100)
        return [Mensaje(**mensaje) for mensaje in mensajes]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@api_router.delete("/mensajes")
async def limpiar_mensajes():
    """🗑️ Limpiar todos los mensajes (útil para testing)"""
    try:
        resultado = await db.mensajes.delete_many({})
        return {
            "mensaje": "Mensajes eliminados",
            "cantidad_eliminada": resultado.deleted_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# 🔧 CONFIGURACIÓN DE LA APLICACIÓN

# Incluir el router en la app principal
app.include_router(api_router)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """🚀 Evento al iniciar la aplicación"""
    logger.info("🚀 Servidor iniciado correctamente!")
    logger.info(f"📡 Conectado a MongoDB: {mongo_url}")
    logger.info("📚 Documentación disponible en: /docs")

@app.on_event("shutdown")
async def shutdown_db_client():
    """🔌 Cerrar conexión al apagar"""
    client.close()
    logger.info("🔌 Conexión a MongoDB cerrada")

# 📚 CÓMO AGREGAR NUEVOS ENDPOINTS:
"""
1. Define tu modelo Pydantic arriba (si necesitas)
2. Crea tu función con @api_router.get/post/put/delete
3. Usa async def para funciones asíncronas
4. Accede a la base de datos con 'db.tu_coleccion'
5. Reinicia el servidor si agregaste nuevos imports

Ejemplo:
@api_router.get("/usuarios")
async def obtener_usuarios():
    usuarios = await db.usuarios.find().to_list(length=100)
    return usuarios
"""