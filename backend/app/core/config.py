from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App
    APP_NAME: str = "RetinopatiaIA API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "retinopatia_db"

    # JWT
    JWT_SECRET_KEY: str = "tu-secreto-super-seguro-cambiar-en-produccion"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 horas

    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]

    # AI Model (placeholder - actualizar cuando tengas el modelo)
    AI_MODEL_PATH: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
