/*
🏠 PÁGINA DE INICIO - COMPONENTE PRINCIPAL

Este es el componente de la página de inicio con ejemplos
y enlaces a otros componentes.
*/

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../App';

// 📦 Importar componentes UI de Shadcn
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const PaginaInicio = () => {
  const [estadoAPI, setEstadoAPI] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 🔄 Verificar conexión con la API al cargar
  useEffect(() => {
    const verificarAPI = async () => {
      try {
        const response = await axios.get(`${API_URL}/`);
        setEstadoAPI(response.data);
      } catch (error) {
        console.error('Error conectando con la API:', error);
        setEstadoAPI({ error: 'No se pudo conectar con el backend' });
      } finally {
        setCargando(false);
      }
    };

    verificarAPI();
  }, []);

  return (
    <div className="min-h-screen p-6">
      {/* 🎯 Encabezado principal */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-6xl font-bold text-white mb-4 text-shadow">
            🚀 ¡Hola Mundo!
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Tu proyecto default está listo. Explora los componentes de ejemplo
            y empieza a construir tu aplicación increíble.
          </p>
          
          {/* 🔍 Estado de la API */}
          <div className="flex justify-center items-center gap-4 mb-8">
            {cargando ? (
              <Badge variant="secondary" className="pulse">
                🔄 Verificando conexión...
              </Badge>
            ) : estadoAPI?.error ? (
              <Badge variant="destructive">
                ❌ Error: {estadoAPI.error}
              </Badge>
            ) : (
              <Badge variant="default" className="bg-green-500">
                ✅ Backend conectado: {estadoAPI?.mensaje}
              </Badge>
            )}
          </div>
        </div>

        {/* 📋 Grid de componentes de ejemplo */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* 📖 Componente de ejemplo */}
          <Card className="card hover-scale cursor-pointer">
            <div className="p-6">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="card-title">Componente Ejemplo</h3>
              <p className="text-white/70 mb-4">
                Aprende cómo hacer llamadas a la API y manejar estados.
              </p>
              <Link to="/ejemplo">
                <Button className="btn-primary w-full">
                  Ver Ejemplo
                </Button>
              </Link>
            </div>
          </Card>

          {/* 📝 Formulario ejemplo */}
          <Card className="card hover-scale cursor-pointer">
            <div className="p-6">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="card-title">Formulario Ejemplo</h3>
              <p className="text-white/70 mb-4">
                Aprende cómo enviar datos al backend usando formularios.
              </p>
              <Link to="/formulario">
                <Button className="btn-primary w-full">
                  Ver Formulario
                </Button>
              </Link>
            </div>
          </Card>

          {/* 📋 Lista de mensajes */}
          <Card className="card hover-scale cursor-pointer">
            <div className="p-6">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="card-title">Lista de Mensajes</h3>
              <p className="text-white/70 mb-4">
                Aprende cómo obtener y mostrar datos desde la base de datos.
              </p>
              <Link to="/mensajes">
                <Button className="btn-primary w-full">
                  Ver Lista
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* 📚 Instrucciones para desarrolladores */}
        <Card className="card">
          <div className="p-8">
            <h2 className="card-title text-2xl mb-6">
              📚 Instrucciones para Desarrollar
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  🎨 Frontend (React)
                </h3>
                <ul className="text-white/80 space-y-2 text-sm">
                  <li>• Crea componentes en: <code className="bg-black/20 px-2 py-1 rounded">src/components/</code></li>
                  <li>• Usa componentes UI de: <code className="bg-black/20 px-2 py-1 rounded">src/components/ui/</code></li>
                  <li>• Agrega rutas en: <code className="bg-black/20 px-2 py-1 rounded">App.js</code></li>
                  <li>• Estilos con Tailwind CSS y CSS personalizado</li>
                  <li>• API URL: <code className="bg-black/20 px-2 py-1 rounded">{API_URL}</code></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  ⚙️ Backend (FastAPI)
                </h3>
                <ul className="text-white/80 space-y-2 text-sm">
                  <li>• Endpoints en: <code className="bg-black/20 px-2 py-1 rounded">backend/server.py</code></li>
                  <li>• Todos los endpoints usan prefijo: <code className="bg-black/20 px-2 py-1 rounded">/api</code></li>
                  <li>• Base de datos MongoDB conectada</li>
                  <li>• Modelos Pydantic para validación</li>
                  <li>• Documentación en: <code className="bg-black/20 px-2 py-1 rounded">/docs</code></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-black/20 rounded-lg">
              <h4 className="text-white font-semibold mb-2">🚀 Comandos útiles:</h4>
              <div className="text-sm text-white/80 space-y-1">
                <p>• Reiniciar servicios: <code>sudo supervisorctl restart all</code></p>
                <p>• Ver logs del backend: <code>tail -f /var/log/supervisor/backend.*.log</code></p>
                <p>• Instalar dependencias frontend: <code>cd frontend && yarn add paquete</code></p>
                <p>• Instalar dependencias backend: <code>cd backend && pip install paquete</code></p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaginaInicio;