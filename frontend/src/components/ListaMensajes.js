/*
📋 LISTA DE MENSAJES - MOSTRAR DATOS

Este componente muestra cómo:
- Obtener datos con GET requests
- Mostrar listas dinámicas
- Actualizar datos en tiempo real
- Manejar estados de carga y error
*/

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../App';

// 📦 Importar componentes UI
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

const ListaMensajes = () => {
  // 🔄 Estados del componente
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  // 📥 Obtener mensajes de la API
  const obtenerMensajes = async () => {
    try {
      const response = await axios.get(`${API_URL}/mensajes`);
      setMensajes(response.data);
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      toast.error('Error al cargar los mensajes');
    } finally {
      setCargando(false);
      setActualizando(false);
    }
  };

  // 🔄 Actualizar lista
  const actualizarLista = async () => {
    setActualizando(true);
    await obtenerMensajes();
    toast.success('Lista actualizada 🔄');
  };

  // 🗑️ Limpiar todos los mensajes
  const limpiarMensajes = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar todos los mensajes?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/mensajes`);
      setMensajes([]);
      toast.success(`${response.data.cantidad_eliminada} mensajes eliminados 🗑️`);
    } catch (error) {
      console.error('Error al limpiar mensajes:', error);
      toast.error('Error al eliminar mensajes');
    }
  };

  // 🏁 Cargar mensajes al inicializar
  useEffect(() => {
    obtenerMensajes();
  }, []);

  // 📅 Formatear fecha
  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* 🔙 Navegación */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="secondary" className="btn-secondary">
              ← Volver al Inicio
            </Button>
          </Link>
        </div>

        {/* 🎯 Encabezado */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold text-white mb-4 text-shadow">
            📋 Lista de Mensajes
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Aquí se muestran todos los mensajes guardados en la base de datos.
            Aprende cómo obtener, mostrar y gestionar listas de datos.
          </p>
        </div>

        {/* 🎛️ Controles */}
        <Card className="card mb-8">
          <div className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="default" className="text-lg">
                  📊 Total: {mensajes.length} mensajes
                </Badge>
                
                <Badge variant={mensajes.length > 0 ? 'default' : 'secondary'}>
                  {mensajes.length > 0 ? '✅ Con datos' : '📭 Sin mensajes'}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={actualizarLista}
                  disabled={actualizando}
                  variant="outline"
                  className="btn-secondary"
                >
                  {actualizando ? '🔄 Actualizando...' : '🔄 Actualizar'}
                </Button>
                
                {mensajes.length > 0 && (
                  <Button
                    onClick={limpiarMensajes}
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    🗑️ Limpiar Todo
                  </Button>
                )}
                
                <Link to="/formulario">
                  <Button className="btn-primary">
                    ➕ Agregar Mensaje
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* 📋 Lista de mensajes */}
        {cargando ? (
          <Card className="card">
            <div className="p-12 text-center">
              <div className="text-4xl mb-4 animate-pulse">🔄</div>
              <p className="text-white/80">Cargando mensajes...</p>
            </div>
          </Card>
        ) : mensajes.length === 0 ? (
          <Card className="card">
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No hay mensajes aún
              </h3>
              <p className="text-white/70 mb-6">
                ¡Crea tu primer mensaje para empezar!
              </p>
              <Link to="/formulario">
                <Button className="btn-primary">
                  ✍️ Crear Primer Mensaje
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {mensajes.map((mensaje, index) => (
              <Card key={mensaje.id} className="card hover-scale">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {mensaje.autor.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">
                          {mensaje.autor}
                        </h3>
                        <p className="text-white/60 text-sm">
                          {formatearFecha(mensaje.fecha_creacion)}
                        </p>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-4 mb-4">
                    <p className="text-white leading-relaxed">
                      {mensaje.texto}
                    </p>
                  </div>
                  
                  <div className="text-xs text-white/50 font-mono">
                    ID: {mensaje.id}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 📚 Información educativa */}
        <Card className="card mt-8">
          <div className="p-8">
            <h2 className="card-title text-2xl mb-6">
              💡 Lo que Aprendes en Esta Lista
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="text-white font-semibold mb-2">useEffect</h3>
                <p className="text-white/70 text-sm">
                  Cargar datos automáticamente al montar el componente
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">📋</div>
                <h3 className="text-white font-semibold mb-2">Render Lists</h3>
                <p className="text-white/70 text-sm">
                  Mostrar arrays de datos usando map() y keys
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="text-white font-semibold mb-2">Actualización</h3>
                <p className="text-white/70 text-sm">
                  Refrescar datos y sincronizar con el backend
                </p>
              </div>
            </div>
            
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">📍 Endpoints usados:</h4>
                <div className="space-y-2 text-sm">
                  <code className="block text-green-300">GET {API_URL}/mensajes</code>
                  <code className="block text-red-300">DELETE {API_URL}/mensajes</code>
                </div>
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">🔧 Funcionalidades:</h4>
                <ul className="text-white/80 space-y-1 text-sm">
                  <li>• Carga automática de datos</li>
                  <li>• Actualización manual</li>
                  <li>• Eliminación masiva</li>
                  <li>• Estados de carga</li>
                  <li>• Formateo de fechas</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ListaMensajes;