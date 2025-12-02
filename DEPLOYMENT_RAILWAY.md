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
git commit -m "Preparar para despliegue monolítico en Railway con MongoDB local"
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
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=retinopatia_db
JWT_SECRET_KEY=tu_secret_muy_seguro_cambiar_en_produccion
DEBUG=false
ALLOWED_ORIGINS=["https://tu-dominio.railway.app"]
```

### 4. Esperar el despliegue
Railway detectará automáticamente:
- El `Dockerfile` para construir la imagen
- Instalará MongoDB dentro del contenedor
- Instalará dependencias de Node y Python
- Compilará el frontend
- Desplegará todo en un solo contenedor con:
  - MongoDB (base de datos)
  - FastAPI (backend)
  - Frontend compilado (archivos estáticos)

### 5. Verificar el despliegue
- La URL estará disponible en el dashboard de Railway
- Accede a `https://tu-app.railway.app`
- El API estará en `https://tu-app.railway.app/api`
- Docs en `https://tu-app.railway.app/docs`

## Estructura de la Aplicación Monolítica

```
Usuario → Railway Load Balancer → Puerto 8000
                                    ↓
                              Docker Container
                              ├─ MongoDB (local, puerto 27017)
                              ├─ FastAPI Backend (puerto 8000)
                              └─ Frontend compilado (archivos estáticos)
```

## Después del Despliegue

- **Logs**: Revisa los logs en Railway → Logs (verás MongoDB y FastAPI inicializándose)
- **Redeploy**: Empuja cambios a main y se redeploy automáticamente
- **Variables**: Cambia variables en Railway Settings → Variables
- **Base de datos**: MongoDB está integrada en el contenedor, automático

## Troubleshooting

### MongoDB no inicia
- Verifica los logs en Railway (busca "mongod")
- Revisa que haya espacio en disco en Railway

### Frontend no se carga
- Revisa que `npm run build` funcione localmente
- Verifica que `frontend/build/index.html` exista

### Datos se pierden al redeplegar
- Es normal, MongoDB está en el contenedor
- Para persistencia, usa MongoDB Atlas externa o volúmenes en Railway

### Puerto incorrecto
- Railway automáticamente asigna el puerto en la variable `PORT`
- FastAPI está configurado en puerto 8000

## Ventajas de esta solución

✅ **Todo en un solo lugar** - No necesitas servicios externos  
✅ **Monolítico** - Una sola aplicación, una sola URL  
✅ **Fácil de desplegar** - Railway lo construye automáticamente  
✅ **Rápido** - MongoDB local es más rápido que servicios externos  
✅ **Desarrollo local** - Puedes probar todo localmente antes de desplegar  

## Desarrollo Local

Para probar todo localmente:

```bash
# Terminal 1 - Instala y ejecuta MongoDB
mongod --dbpath ./data/db

# Terminal 2 - Backend
cd backend
pip install -r requirements.txt
python run.py

# Terminal 3 - Frontend
cd frontend
npm install
npm start
```

Accede a `http://localhost:3000` para el frontend y `http://localhost:8000` para el API.
