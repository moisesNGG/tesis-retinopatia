# Guía de Despliegue en Railway

## Requisitos Previos
- Cuenta en [Railway.app](https://railway.app)
- Git instalado
- Proyecto en GitHub (público o privado)

## Pasos para Desplegar

### 1. Preparar el repositorio
```bash
# Asegúrate de que todo esté committeado
git add .
git commit -m "Preparar para despliegue monolítico en Railway"
git push origin main
```

### 2. Conectar con Railway
1. Ve a [railway.app](https://railway.app)
2. Haz login con GitHub
3. Haz clic en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Selecciona tu repositorio `tesis-rinopatia`

### 3. Configurar Variables de Entorno en Railway
En el dashboard de Railway, agrega estas variables:

```
MONGO_URL=mongodb+srv://usuario:contraseña@cluster.mongodb.net/
DB_NAME=tu_base_datos
ALLOWED_ORIGINS=["https://tu-dominio.railway.app"]
JWT_SECRET=tu_secret_muy_seguro
```

### 4. Esperar el despliegue
Railway detectará automáticamente:
- El `Dockerfile` para construir la imagen
- Instalará dependencias de Node y Python
- Compilará el frontend
- Desplegará todo en un solo contenedor

### 5. Verificar el despliegue
- La URL estará disponible en el dashboard de Railway
- Accede a `https://tu-app.railway.app`
- El API estará en `https://tu-app.railway.app/api`
- Docs en `https://tu-app.railway.app/docs`

## Estructura de la Aplicación Monolítica

```
Usuario → Railway Load Balancer
         ↓
    Docker Container
    ├─ Frontend (archivos estáticos)
    ├─ Backend (FastAPI)
    └─ Conexión MongoDB
```

## Después del Despliegue

- **Logs**: Revisa los logs en Railway → Logs
- **Redeploy**: Empuja cambios a main y se redeploy automáticamente
- **Variables**: Cambia variables en Railway Settings → Variables
- **Base de datos**: MongoDB debe estar accesible desde Railway

## Troubleshooting

### Error de conexión a MongoDB
- Verifica que `MONGO_URL` sea correcta
- Whitelist la IP de Railway en MongoDB Atlas (o usa 0.0.0.0)

### Frontend no se carga
- Revisa que `npm run build` funcione localmente
- Verifica que `frontend/build/index.html` exista

### Puerto incorrecto
- Railway automáticamente asigna el puerto en la variable `PORT`
- El Dockerfile ya está configurado para usarlo

### Base de datos sin datos
- Ejecuta `python backend/init_db.py` localmente para inicializar
- O crea los datos necesarios en MongoDB Atlas

## Base de Datos en Railway (Alternativa)

Si quieres usar PostgreSQL/MySQL en Railway en lugar de MongoDB:

1. Agrega una nueva infraestructura en Railway
2. Conecta la base de datos desde el panel
3. Las credenciales se inyectarán automáticamente como variables

## Monitoreo

- CPU y memoria: Dashboard de Railway
- Logs: Sección de Logs en Railway
- Health Check: `GET /health` responde cada 30 segundos
