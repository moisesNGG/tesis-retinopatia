# 🚀 PROYECTO DEFAULT - INSTRUCCIONES COMPLETAS

¡Bienvenido a tu proyecto default! Este es un template completo con **React + FastAPI + MongoDB** que incluye ejemplos y documentación para que puedas empezar a desarrollar inmediatamente.

## 📋 ¿Qué Incluye Este Proyecto?

### 🎨 **Frontend (React)**
- ✅ Componentes de ejemplo con documentación
- ✅ Integración con Tailwind CSS para estilos modernos
- ✅ Componentes UI de Shadcn ya configurados
- ✅ Sistema de rutas con React Router
- ✅ Llamadas a API con Axios
- ✅ Notificaciones con Sonner (Toast)
- ✅ Diseño responsivo y moderno

### ⚙️ **Backend (FastAPI)**
- ✅ API REST con endpoints de ejemplo
- ✅ Conexión a MongoDB configurada
- ✅ Modelos Pydantic para validación
- ✅ CORS configurado correctamente
- ✅ Documentación automática en `/docs`
- ✅ Manejo de errores básico

### 🗄️ **Base de Datos (MongoDB)**
- ✅ Conexión configurada y lista para usar
- ✅ Ejemplos de CRUD operations
- ✅ Modelos con UUID (no ObjectId)

## 🌐 URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend API**: `${REACT_APP_BACKEND_URL}/api`
- **Documentación API**: `${REACT_APP_BACKEND_URL}/docs`

## 📁 Estructura del Proyecto

```
/app/
├── backend/                 # 🐍 Backend FastAPI
│   ├── server.py           # Servidor principal con ejemplos
│   ├── requirements.txt    # Dependencias Python
│   └── .env               # Variables de entorno
├── frontend/               # ⚛️ Frontend React
│   ├── src/
│   │   ├── App.js         # Componente principal
│   │   ├── App.css        # Estilos globales
│   │   ├── components/    # 📦 Tus componentes
│   │   │   ├── PaginaInicio.js
│   │   │   ├── ComponenteEjemplo.js
│   │   │   ├── FormularioEjemplo.js
│   │   │   ├── ListaMensajes.js
│   │   │   └── ui/        # Componentes UI de Shadcn
│   │   └── index.js       # Punto de entrada
│   ├── package.json       # Dependencias Node.js
│   └── .env              # Variables de entorno
└── INSTRUCCIONES.md       # Este archivo
```

## 🚀 Cómo Empezar

### 1. **Explorar los Componentes de Ejemplo**

Visita estas páginas para aprender:

- **🏠 Página de Inicio** (`/`): Información del proyecto y enlaces
- **📖 Componente Ejemplo** (`/ejemplo`): Aprende a hacer llamadas GET
- **📝 Formulario Ejemplo** (`/formulario`): Aprende a enviar datos POST
- **📋 Lista de Mensajes** (`/mensajes`): Aprende a mostrar listas de datos

### 2. **Crear Tu Primer Componente**

```bash
# 1. Crea el archivo del componente
touch /app/frontend/src/components/MiComponente.js
```

```javascript
// 2. Contenido básico del componente
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const MiComponente = () => {
  const [contador, setContador] = useState(0);

  return (
    <Card className="card p-6 m-4">
      <h2 className="card-title">Mi Nuevo Componente</h2>
      <p className="text-white/80 mb-4">Contador: {contador}</p>
      <Button 
        onClick={() => setContador(contador + 1)}
        className="btn-primary"
      >
        Incrementar
      </Button>
    </Card>
  );
};

export default MiComponente;
```

```javascript
// 3. Agregar al App.js
import MiComponente from "./components/MiComponente";

// En las rutas:
<Route path="/mi-componente" element={<MiComponente />} />
```

### 3. **Crear Tu Primer Endpoint**

```python
# En backend/server.py, agregar después de los endpoints existentes:

@api_router.get("/mi-endpoint")
async def mi_endpoint():
    return {"mensaje": "¡Mi primer endpoint!"}

@api_router.post("/mi-datos")
async def crear_mi_dato(dato: dict):
    # Guardar en MongoDB
    resultado = await db.mis_datos.insert_one(dato)
    return {"id": str(resultado.inserted_id), "dato": dato}
```

## 🎨 Componentes UI Disponibles

Tienes acceso a todos estos componentes modernos en `src/components/ui/`:

```javascript
// Botones y controles
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';

// Layout y contenedores
import { Card } from './ui/card';
import { Dialog } from './ui/dialog';
import { Sheet } from './ui/sheet';
import { Tabs } from './ui/tabs';

// Feedback
import { Badge } from './ui/badge';
import { Alert } from './ui/alert';
import { Progress } from './ui/progress';
import { toast } from 'sonner'; // Para notificaciones

// Y muchos más...
```

## 🌐 Cómo Hacer Llamadas a la API

### GET Request
```javascript
import axios from 'axios';
import { API_URL } from '../App';

const obtenerDatos = async () => {
  try {
    const response = await axios.get(`${API_URL}/mi-endpoint`);
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### POST Request
```javascript
const enviarDatos = async (datos) => {
  try {
    const response = await axios.post(`${API_URL}/mi-datos`, datos);
    console.log('Datos enviados:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🎨 Estilos y Diseño

### Usar Clases CSS Personalizadas
```javascript
<button className="btn-primary">Botón Principal</button>
<div className="card">Tarjeta con efecto glass</div>
<h1 className="gradient-text">Texto con gradiente</h1>
```

### Usar Tailwind CSS
```javascript
<div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
  Contenido con Tailwind
</div>
```

### Combinar Ambos
```javascript
<div className="card p-6 m-4 hover:shadow-2xl">
  <h2 className="card-title text-2xl mb-4">Título</h2>
  <p className="text-white/80">Contenido</p>
</div>
```

## 🔧 Comandos Útiles

### Frontend
```bash
# Instalar nueva dependencia
cd /app/frontend && yarn add nombre-paquete

# Iniciar en modo desarrollo (ya está corriendo)
yarn start
```

### Backend
```bash
# Instalar nueva dependencia Python
cd /app/backend
pip install nombre-paquete
pip freeze > requirements.txt

# Ver logs del backend
tail -f /var/log/supervisor/backend.*.log
```

### Servicios
```bash
# Reiniciar todos los servicios
sudo supervisorctl restart all

# Reiniciar solo frontend
sudo supervisorctl restart frontend

# Reiniciar solo backend
sudo supervisorctl restart backend

# Ver estado de servicios
sudo supervisorctl status
```

## 📚 Recursos de Aprendizaje

### Documentación Oficial
- **React**: https://react.dev/
- **FastAPI**: https://fastapi.tiangolo.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Shadcn/UI**: https://ui.shadcn.com/

### APIs Incluidas
- **GET** `/api/` - Mensaje de bienvenida
- **GET** `/api/saludo/{nombre}` - Saludo personalizado
- **POST** `/api/mensaje` - Crear mensaje
- **GET** `/api/mensajes` - Obtener todos los mensajes
- **DELETE** `/api/mensajes` - Eliminar todos los mensajes

## 💡 Tips y Mejores Prácticas

### 1. **Organización de Componentes**
```
src/components/
├── ui/              # Componentes UI reutilizables
├── pages/           # Componentes de páginas
├── forms/           # Componentes de formularios
└── common/          # Componentes comunes
```

### 2. **Estados en React**
```javascript
// ✅ Buena práctica
const [usuario, setUsuario] = useState({ nombre: '', email: '' });
const [cargando, setCargando] = useState(false);
const [error, setError] = useState(null);

// ❌ Evitar
const [datos, setDatos] = useState(); // Sin valor inicial claro
```

### 3. **Manejo de Errores**
```javascript
const manejarAPI = async () => {
  try {
    setCargando(true);
    const response = await axios.get(`${API_URL}/datos`);
    setDatos(response.data);
    toast.success('¡Datos cargados!');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al cargar datos');
    setError(error.message);
  } finally {
    setCargando(false);
  }
};
```

### 4. **Backend con MongoDB**
```python
# ✅ Buena práctica - Usar modelos Pydantic
class MiModelo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nombre: str
    fecha: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

@api_router.post("/crear", response_model=MiModelo)
async def crear_item(item_data: MiModeloCreate):
    item = MiModelo(**item_data.dict())
    await db.mi_coleccion.insert_one(item.dict())
    return item
```

## 🐛 Solución de Problemas Comunes

### Frontend no se conecta al Backend
- Verifica que `REACT_APP_BACKEND_URL` esté configurado en `/app/frontend/.env`
- Asegúrate de usar el prefijo `/api` en todos los endpoints
- Revisa los logs: `tail -f /var/log/supervisor/backend.*.log`

### Error de CORS
- El CORS ya está configurado en `server.py`
- Si tienes problemas, verifica `CORS_ORIGINS` en `/app/backend/.env`

### MongoDB no conecta
- La conexión está configurada automáticamente
- La variable `MONGO_URL` no debe modificarse
- Usa `db.mi_coleccion` para acceder a las colecciones

### Componentes UI no funcionan
- Todos los componentes están en `/app/frontend/src/components/ui/`
- Importa usando: `import { Componente } from './ui/componente';`
- Revisa la documentación en el archivo del componente

## 🎯 Próximos Pasos

1. **Explora los componentes de ejemplo** para entender cómo funciona todo
2. **Modifica los estilos** en `App.css` para personalizar tu diseño
3. **Crea tus propios componentes** siguiendo los patrones establecidos
4. **Agrega nuevos endpoints** en `server.py` para tu lógica de negocio
5. **Experimenta con los componentes UI** disponibles

## 🆘 ¿Necesitas Ayuda?

- Revisa los **componentes de ejemplo** incluidos
- Consulta los **comentarios en el código** - están en español y son muy detallados
- Usa `console.log()` para debuggear en el frontend
- Usa `print()` o `logger.info()` para debuggear en el backend
- Revisa los logs con `tail -f /var/log/supervisor/backend.*.log`

---

🎉 **¡Ya tienes todo listo para crear tu aplicación increíble!**

Empieza explorando los ejemplos y luego construye sobre ellos. ¡Que tengas un excelente desarrollo! 🚀