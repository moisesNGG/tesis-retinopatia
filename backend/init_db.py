# -*- coding: utf-8 -*-
"""
Script para inicializar la base de datos con datos de ejemplo
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from passlib.context import CryptContext

MONGODB_URI = "mongodb://localhost:27017"
DB_NAME = "retinopatia_db"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def init_database():
    """Inicializar base de datos con datos de ejemplo"""
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]

    print("[*] Inicializando base de datos...")

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
            "title": "Bienvenido al Proyecto",
            "subtitle": "Sistema moderno con React, FastAPI y MongoDB",
            "heroImage": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
            "sections": [
                {
                    "title": "Sobre el Proyecto",
                    "content": "Este es un proyecto moderno que integra un frontend React con un backend FastAPI y una base de datos MongoDB. Diseñado para ser escalable y fácil de personalizar.",
                    "image": "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80",
                    "order": 1
                },
                {
                    "title": "Características Principales",
                    "content": "Frontend moderno con React, Backend robusto con FastAPI, Base de datos NoSQL con MongoDB, Autenticación JWT, API RESTful completa, y más.",
                    "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
                    "order": 2
                }
            ],
            "metaDescription": "Proyecto moderno con React, FastAPI y MongoDB",
            "isPublished": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "slug": "modelo",
            "title": "Arquitectura del Proyecto",
            "subtitle": "Stack tecnológico y estructura del sistema",
            "heroImage": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
            "sections": [
                {
                    "title": "Stack Tecnológico",
                    "content": "React 18 para el frontend, FastAPI para el backend, MongoDB como base de datos, Docker para containerización, y Railway para deployment.",
                    "order": 1
                }
            ],
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
