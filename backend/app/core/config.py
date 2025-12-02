from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Proyecto API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    # MongoDB - Local en el contenedor
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017")
    MONGODB_DB_NAME: str = "retinopatia_db"

    # JWT
    JWT_SECRET_KEY: str = "tu-secreto-super-seguro-cambiar-en-produccion"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 horas

    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
        "https://tesis-rinopatia-production.up.railway.app",  # Railway production
    ]

    # AI Model (placeholder - actualizar cuando tengas el modelo)
    AI_MODEL_PATH: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
