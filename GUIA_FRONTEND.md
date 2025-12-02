# Sistema de Deteccion de Retinopatia Diabetica - Frontend

## Inicio Rapido

1. cd frontend
2. npm install
3. cp .env.example .env
4. npm start

## Credenciales Admin
- Usuario: admin
- Password: admin123

## Rutas
- / - Inicio
- /modelo - Modelo IA
- /proceso - Analisis de imagen
- /admin - Panel admin

## Integracion IA
Archivo: frontend/src/pages/Proceso.jsx
Actualiza process.env.REACT_APP_AI_MODEL_URL con tu endpoint

Formato esperado de respuesta:
{
  "prediction": "string",
  "confidence": 0.87,
  "severity": "moderate",
  "details": {},
  "recommendation": "string"
}
