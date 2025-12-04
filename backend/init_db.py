# -*- coding: utf-8 -*-
"""
Script para inicializar la base de datos con datos de ejemplo
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from passlib.context import CryptContext
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB_NAME", "retinopatia_db")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def init_database():
    """Inicializar base de datos con datos de ejemplo"""
    print(f"[*] Conectando a: {MONGODB_URI}")
    print(f"[*] Base de datos: {DB_NAME}")

    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]

    print("[*] Inicializando base de datos...")
    
    # Verificar si la BD ya está inicializada
    pages_count = await db.pages.count_documents({})
    users_count = await db.users.count_documents({})
    
    if pages_count > 0 and users_count > 0:
        print("[INFO] Base de datos ya inicializada. Saltando inicialización.")
        client.close()
        return

    # Crear usuario admin
    print("[*] Creando usuario admin...")
    existing_admin = await db.users.find_one({"username": "admin"})

    if not existing_admin:
        admin_user = {
            "username": "admin",
            "email": "admin@retinopatia.com",
            "password": pwd_context.hash("admin123"),
            "role": "admin",
            "isActive": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        await db.users.insert_one(admin_user)
        print("[OK] Usuario admin creado (username: admin, password: admin123)")
    else:
        print("[INFO] Usuario admin ya existe")

    # Crear páginas de ejemplo
    print("[*] Creando paginas de ejemplo...")

    pages = [
        {
            "slug": "inicio",
            "title": "Deteccion de Retinopatia Diabetica",
            "subtitle": "Sistema de analisis automatizado mediante inteligencia artificial para la deteccion temprana de retinopatia diabetica",
            "heroImage": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
            "heroImageStyle": "cover",
            "sections": [
                {
                    "title": "Que es la Retinopatia Diabetica?",
                    "content": "La retinopatia diabetica es una complicacion de la diabetes que afecta los ojos. Se produce cuando los niveles altos de azucar en la sangre causan dano a los vasos sanguineos de la retina.",
                    "image": "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80",
                    "imageStyle": "cover",
                    "layout": "horizontal",
                    "order": 1
                },
                {
                    "title": "Importancia de la Deteccion Temprana",
                    "content": "La deteccion temprana es crucial para prevenir la perdida de vision. Nuestro sistema utiliza inteligencia artificial para analizar imagenes de fondo de ojo.",
                    "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
                    "imageStyle": "cover",
                    "layout": "horizontal",
                    "order": 2
                }
            ],
            "metaDescription": "Sistema de deteccion de retinopatia diabetica con IA",
            "isPublished": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "slug": "modelo",
            "title": "Modelo de Inteligencia Artificial",
            "subtitle": "Deep Learning para deteccion automatica de retinopatia diabetica",
            "heroImage": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
            "heroImageStyle": "cover",
            "sections": [
                {
                    "title": "Arquitectura del Modelo",
                    "content": "El modelo utiliza una arquitectura de Red Neuronal Convolucional (CNN) basada en ResNet50, pre-entrenada en ImageNet y ajustada especificamente para imagenes de fondo de ojo. Esta arquitectura permite extraer caracteristicas complejas de las imagenes para identificar patrones asociados con retinopatia diabetica.",
                    "image": "https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=600&q=80",
                    "imageStyle": "cover",
                    "layout": "horizontal",
                    "order": 1
                },
                {
                    "title": "Proceso de Entrenamiento",
                    "content": "El modelo fue entrenado con mas de 35,000 imagenes de retina clasificadas por oftalmologos expertos. Se utilizaron tecnicas de data augmentation para mejorar la generalizacion y evitar el sobreajuste. El entrenamiento se realizo durante 100 epocas con validacion cruzada.",
                    "image": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80",
                    "imageStyle": "cover",
                    "layout": "horizontal",
                    "order": 2
                },
                {
                    "title": "Validacion y Pruebas",
                    "content": "El modelo fue validado con un conjunto de datos independiente que nunca vio durante el entrenamiento. Se evaluaron multiples metricas incluyendo precision, sensibilidad, especificidad y area bajo la curva ROC (AUC). Los resultados demuestran un rendimiento comparable a oftalmologos experimentados.",
                    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
                    "imageStyle": "cover",
                    "layout": "horizontal",
                    "order": 3
                }
            ],
            "isPublished": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "slug": "proceso",
            "title": "Proceso de Analisis",
            "subtitle": "Sube una imagen de fondo de ojo para detectar signos de retinopatia diabetica",
            "heroImage": None,
            "heroImageStyle": "cover",
            "sections": [],
            "metaDescription": "Herramienta de analisis de imagenes de retina con IA",
            "isPublished": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
    ]

    for page in pages:
        existing_page = await db.pages.find_one({"slug": page["slug"]})
        if not existing_page:
            await db.pages.insert_one(page)
            print(f"[OK] Pagina '{page['slug']}' creada")
        else:
            print(f"[INFO] Pagina '{page['slug']}' ya existe")

    client.close()
    print("[OK] Base de datos inicializada correctamente")
    print("\nCredenciales de acceso:")
    print("  Username: admin")
    print("  Password: admin123")

if __name__ == "__main__":
    asyncio.run(init_database())
