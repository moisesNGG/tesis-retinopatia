from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    """Conectar a MongoDB"""
    print("[*] Conectando a MongoDB...")
    db_instance.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db_instance.db = db_instance.client[settings.MONGODB_DB_NAME]
    print("[OK] MongoDB conectado exitosamente")

async def close_mongo_connection():
    """Cerrar conexion a MongoDB"""
    print("[*] Cerrando conexion a MongoDB...")
    db_instance.client.close()
    print("[OK] Conexion cerrada")

def get_database():
    """Obtener instancia de la base de datos"""
    return db_instance.db
