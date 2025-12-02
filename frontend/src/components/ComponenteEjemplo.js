/*
📖 COMPONENTE DE EJEMPLO - LLAMADAS A LA API

Este componente muestra cómo:
- Hacer llamadas GET a la API
- Manejar estados de carga
- Mostrar datos dinámicos
- Usar componentes UI de Shadcn
*/

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../App';

// 📦 Importar componentes UI
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

const ComponenteEjemplo = () => {
  // 🔄 Estados del componente
  const [saludo, setSaludo] = useState('');
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensajeAPI, setMensajeAPI] = useState('');

  // 🌐 Función para obtener saludo personalizado
  const obtenerSaludo = async () => {
    if (!nombre.trim()) {
      alert('Por favor ingresa un nombre');
      return;
    }

    setCargando(true);
    try {
      const response = await axios.get(`${API_URL}/saludo/${nombre}`);
      setSaludo(response.data.mensaje);
    } catch (error) {
      console.error('Error al obtener saludo:', error);
      setSaludo('Error al conectar con la API 😔');
    } finally {
      setCargando(false);
    }
  };

  // 🏠 Obtener mensaje principal al cargar
  useEffect(() => {
    const obtenerMensajePrincipal = async () => {
      try {
        const response = await axios.get(`${API_URL}/`);
        setMensajeAPI(response.data.mensaje);
      } catch (error) {
        console.error('Error:', error);
        setMensajeAPI('Error de conexión');
      }
    };

    obtenerMensajePrincipal();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* 🔙 Navegación */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="secondary" className="btn-secondary">
              ← Volver al Inicio
            </Button>
          </Link>
        </div>

        {/* 🎯 Encabezado */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl font-bold text-white mb-4 text-shadow">
            📖 Componente de Ejemplo
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Este componente demuestra cómo hacer llamadas a la API,
            manejar estados y usar componentes UI modernos.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* 📡 Sección de conexión API */}
          <Card className="card">
            <div className="p-6">
              <h2 className="card-title mb-4">🔌 Conexión con la API</h2>
              
              <div className="mb-4">
                <Badge variant={mensajeAPI.includes('Hola') ? 'default' : 'destructive'}>
                  {mensajeAPI ? `✅ ${mensajeAPI}` : '🔄 Conectando...'}
                </Badge>
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">📍 Endpoint usado:</h4>
                <code className="text-green-300 text-sm">
                  GET {API_URL}/
                </code>
              </div>
              
              <div className="mt-4 bg-black/20 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">💻 Código:</h4>
                <pre className="text-green-300 text-xs overflow-x-auto">
{`const response = await axios.get(\`\${API_URL}/\`);
setMensajeAPI(response.data.mensaje);`}
                </pre>
              </div>
            </div>
          </Card>

          {/* 📝 Sección interactiva */}
          <Card className="card">
            <div className="p-6">
              <h2 className="card-title mb-4">👋 Saludo Personalizado</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">
                    Ingresa tu nombre:
                  </label>
                  <Input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre aquí..."
                    className="form-input"
                    onKeyPress={(e) => e.key === 'Enter' && obtenerSaludo()}
                  />
                </div>
                
                <Button
                  onClick={obtenerSaludo}
                  disabled={cargando}
                  className="btn-primary w-full"
                >
                  {cargando ? '🔄 Obteniendo saludo...' : '👋 Obtener Saludo'}
                </Button>
                
                {saludo && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mt-4">
                    <p className="text-white font-medium text-center">
                      {saludo}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 bg-black/20 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">📍 Endpoint usado:</h4>
                <code className="text-green-300 text-sm">
                  GET {API_URL}/saludo/{nombre || '{nombre}'}
                </code>
              </div>
            </div>
          </Card>
        </div>

        {/* 📚 Información educativa */}
        <Card className="card mt-8">
          <div className="p-8">
            <h2 className="card-title text-2xl mb-6">
              📚 Lo que Aprendes en Este Componente
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="text-white font-semibold mb-2">Estados React</h3>
                <p className="text-white/70 text-sm">
                  useState para manejar datos dinámicos y estados de carga
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">🌐</div>
                <h3 className="text-white font-semibold mb-2">Llamadas API</h3>
                <p className="text-white/70 text-sm">
                  Axios para hacer peticiones HTTP al backend
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="text-white font-semibold mb-2">Componentes UI</h3>
                <p className="text-white/70 text-sm">
                  Shadcn UI para interfaces modernas y accesibles
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-black/20 rounded-lg">
              <h4 className="text-white font-semibold mb-3">🛠️ Próximos pasos:</h4>
              <ul className="text-white/80 space-y-2 text-sm">
                <li>• Crea tu propio componente siguiendo este patrón</li>
                <li>• Experimenta con diferentes endpoints de la API</li>
                <li>• Agrega más estados y funcionalidades</li>
                <li>• Prueba otros componentes UI disponibles</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ComponenteEjemplo;