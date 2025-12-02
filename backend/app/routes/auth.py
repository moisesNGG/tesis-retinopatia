from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserLogin, TokenResponse, UserCreate
from app.core.security import verify_password, create_access_token, get_password_hash
from app.core.database import get_database
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login de usuario admin"""
    db = get_database()

    # Buscar usuario
    user = await db.users.find_one({"username": credentials.username})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos"
        )

    # Verificar password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos"
        )

    # Crear token
    access_token = create_access_token(
        data={"sub": user["username"], "role": user.get("role", "admin")}
    )

    return TokenResponse(
        access_token=access_token,
        user={
            "username": user["username"],
            "email": user["email"],
            "role": user.get("role", "admin")
        }
    )

@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Registrar nuevo usuario admin (solo para setup inicial)"""
    db = get_database()

    # Verificar si el usuario ya existe
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario ya existe"
        )

    # Crear usuario
    user_dict = user_data.model_dump()
    user_dict["password"] = get_password_hash(user_data.password)
    user_dict["createdAt"] = datetime.utcnow()
    user_dict["updatedAt"] = datetime.utcnow()

    result = await db.users.insert_one(user_dict)

    return {
        "message": "Usuario creado exitosamente",
        "username": user_data.username
    }
