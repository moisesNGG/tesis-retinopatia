/*
📝 FORMULARIO EJEMPLO - ENVÍO DE DATOS

Este componente muestra cómo:
- Crear formularios con validación
- Enviar datos POST a la API
- Manejar respuestas y errores
- Usar componentes UI para formularios
*/

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../App';

// 📦 Importar componentes UI
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

const FormularioEjemplo = () => {
  // 🔄 Estados del formulario
  const [formData, setFormData] = useState({
    texto: '',
    autor: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [ultimoMensaje, setUltimoMensaje] = useState(null);

  // 📝 Manejar cambios en los inputs
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 📤 Enviar formulario
  const enviarFormulario = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.texto.trim() || !formData.autor.trim()) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setEnviando(true);
    try {
      const response = await axios.post(`${API_URL}/mensaje`, formData);
      
      // Éxito
      setUltimoMensaje(response.data);
      setFormData({ texto: '', autor: '' }); // Limpiar formulario
      toast.success('¡Mensaje enviado correctamente! 🎉');
      
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast.error('Error al enviar el mensaje 😔');
    } finally {
      setEnviando(false);
    }
  };

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
            📝 Formulario de Ejemplo
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Aprende cómo crear formularios, validar datos y enviarlos
            al backend usando POST requests.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* 📝 Formulario */}
          <Card className="card">
            <div className="p-6">
              <h2 className="card-title mb-6">✍️ Crear Nuevo Mensaje</h2>
              
              <form onSubmit={enviarFormulario} className="space-y-6">
                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">
                    Tu nombre:
                  </label>
                  <Input
                    type="text"
                    name="autor"
                    value={formData.autor}
                    onChange={manejarCambio}
                    placeholder="Ingresa tu nombre..."
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">
                    Mensaje:
                  </label>
                  <Textarea
                    name="texto"
                    value={formData.texto}
                    onChange={manejarCambio}
                    placeholder="Escribe tu mensaje aquí..."
                    className="form-input min-h-32 resize-none"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={enviando}
                  className="btn-primary w-full"
                >
                  {enviando ? '📤 Enviando...' : '📤 Enviar Mensaje'}
                </Button>
              </form>
              
              {/* 📊 Información del último mensaje enviado */}
              {ultimoMensaje && (
                <div className="mt-6 bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">✅ Mensaje enviado:</h4>
                  <div className="text-sm text-white/80 space-y-1">
                    <p><strong>ID:</strong> {ultimoMensaje.id}</p>
                    <p><strong>Autor:</strong> {ultimoMensaje.autor}</p>
                    <p><strong>Texto:</strong> {ultimoMensaje.texto}</p>
                    <p><strong>Fecha:</strong> {new Date(ultimoMensaje.fecha_creacion).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* 📚 Información educativa */}
          <Card className="card">
            <div className="p-6">
              <h2 className="card-title mb-4">💡 Cómo Funciona</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <span className="mr-2">1️⃣</span> Estados del Formulario
                  </h3>
                  <div className="bg-black/20 p-3 rounded text-xs text-green-300 overflow-x-auto">
                    <pre>{`const [formData, setFormData] = useState({
  texto: '',
  autor: ''
});`}</pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <span className="mr-2">2️⃣</span> Manejar Cambios
                  </h3>
                  <div className="bg-black/20 p-3 rounded text-xs text-green-300 overflow-x-auto">
                    <pre>{`const manejarCambio = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};`}</pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <span className="mr-2">3️⃣</span> Envío POST
                  </h3>
                  <div className="bg-black/20 p-3 rounded text-xs text-green-300 overflow-x-auto">
                    <pre>{`const response = await axios.post(
  \`\${API_URL}/mensaje\`,
  formData
);`}</pre>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <h4 className="text-white font-semibold mb-2">📍 Endpoint:</h4>
                <code className="text-blue-300 text-sm">
                  POST {API_URL}/mensaje
                </code>
              </div>
              
              <div className="mt-4 p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                <h4 className="text-white font-semibold mb-2">📦 Datos enviados:</h4>
                <pre className="text-purple-300 text-xs overflow-x-auto">
{JSON.stringify({
  texto: "Texto del mensaje",
  autor: "Nombre del autor"
}, null, 2)}
                </pre>
              </div>
            </div>
          </Card>
        </div>

        {/* 🎯 Características destacadas */}
        <Card className="card mt-8">
          <div className="p-8">
            <h2 className="card-title text-2xl mb-6">
              🌟 Características de Este Formulario
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="text-white font-semibold mb-2">Validación</h3>
                <p className="text-white/70 text-sm">
                  Campos requeridos y validación en tiempo real
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="text-white font-semibold mb-2">Estados</h3>
                <p className="text-white/70 text-sm">
                  Manejo de carga y estados del formulario
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">💾</div>
                <h3 className="text-white font-semibold mb-2">Base de Datos</h3>
                <p className="text-white/70 text-sm">
                  Los datos se guardan en MongoDB
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">🎉</div>
                <h3 className="text-white font-semibold mb-2">Feedback</h3>
                <p className="text-white/70 text-sm">
                  Notificaciones de éxito y error
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-black/20 rounded-lg">
              <h4 className="text-white font-semibold mb-3">📝 Para crear tu propio formulario:</h4>
              <ol className="text-white/80 space-y-2 text-sm">
                <li>1. Define los estados para los campos del formulario</li>
                <li>2. Crea la función para manejar cambios en los inputs</li>
                <li>3. Implementa la validación de datos</li>
                <li>4. Crea la función para enviar datos con POST</li>
                <li>5. Maneja las respuestas de éxito y error</li>
                <li>6. Agrega feedback visual para el usuario</li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FormularioEjemplo;