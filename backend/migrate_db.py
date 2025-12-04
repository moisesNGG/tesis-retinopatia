# -*- coding: utf-8 -*-
"""
Script para migrar la base de datos agregando campos nuevos sin borrar datos existentes
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB_NAME", "retinopatia_db")

async def migrate_database():
    """Migrar base de datos agregando campos nuevos"""
    print(f"[*] Conectando a: {MONGODB_URI}")
    print(f"[*] Base de datos: {DB_NAME}")

    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]

    print("[*] Iniciando migración...")

    # 1. Agregar campos faltantes a páginas existentes (inicio y modelo)
    print("\n[*] Actualizando páginas existentes (inicio y modelo)...")

    pages_to_update = ["inicio", "modelo"]
    for slug in pages_to_update:
        page = await db.pages.find_one({"slug": slug})
        if page:
            # Agregar heroImageStyle si no existe
            if "heroImageStyle" not in page:
                await db.pages.update_one(
                    {"slug": slug},
                    {"$set": {"heroImageStyle": "cover"}}
                )
                print(f"  [OK] Agregado heroImageStyle a '{slug}'")

            # Actualizar secciones para agregar imageStyle y layout si no existen
            if "sections" in page:
                updated_sections = []
                for section in page["sections"]:
                    if "imageStyle" not in section:
                        section["imageStyle"] = "cover"
                    if "layout" not in section:
                        section["layout"] = "horizontal"
                    updated_sections.append(section)

                await db.pages.update_one(
                    {"slug": slug},
                    {"$set": {"sections": updated_sections, "updatedAt": datetime.utcnow()}}
                )
                print(f"  [OK] Actualizadas {len(updated_sections)} secciones en '{slug}'")
        else:
            print(f"  [INFO] Página '{slug}' no encontrada (se creará con init_db.py si es necesario)")

    # 2. Crear página "proceso" solo si no existe (solo título y subtítulo)
    print("\n[*] Verificando página 'proceso'...")

    proceso_page = await db.pages.find_one({"slug": "proceso"})
    if not proceso_page:
        print("  [*] Creando página 'proceso' (solo textos editables)...")
        new_proceso_page = {
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

        await db.pages.insert_one(new_proceso_page)
        print("  [OK] Página 'proceso' creada (título y subtítulo editables desde CMS)")
    else:
        print("  [INFO] Página 'proceso' ya existe, no se modificará")

    client.close()
    print("\n[OK] Migración completada correctamente")
    print("\nResumen:")
    print("  - Páginas 'inicio' y 'modelo': campos actualizados (sin perder datos)")
    print("  - Página 'proceso': creada o ya existía")
    print("\nAhora puedes editar cualquier página desde el CMS con los nuevos controles!")

if __name__ == "__main__":
    asyncio.run(migrate_database())
