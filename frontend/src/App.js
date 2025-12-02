/*
🚀 APLICACIÓN PRINCIPAL - PROYECTO DEFAULT 🚀

Este es tu archivo principal de React. Aquí defines las rutas
y organizas tus componentes.

📝 INSTRUCCIONES PARA AGREGAR COMPONENTES:
1. Crea un archivo nuevo en src/components/
2. Importa el componente aquí
3. Agrégalo a las rutas o úsalo directamente
4. Usa los componentes de UI que están en src/components/ui/

💡 EJEMPLOS INCLUIDOS:
- ComponenteEjemplo: Muestra cómo hacer llamadas a la API
- FormularioEjemplo: Muestra cómo enviar datos al backend
- ListaMensajes: Muestra cómo obtener y mostrar datos

🎨 COMPONENTES UI DISPONIBLES:
- Button, Card, Input, Dialog, Toast, etc.
- Ubicados en: src/components/ui/
*/

import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// 📦 Importar componentes
import PaginaInicio from "./components/PaginaInicio";
import ComponenteEjemplo from "./components/ComponenteEjemplo";
import FormularioEjemplo from "./components/FormularioEjemplo";
import ListaMensajes from "./components/ListaMensajes";

// 🌐 URL del backend (IMPORTANTE: No cambiar esta configuración)
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api`;

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <BrowserRouter>
        <Routes>
          {/* 🏠 Página de inicio */}
          <Route path="/" element={<PaginaInicio />} />
          
          {/* 📖 Página de ejemplo de componente */}
          <Route path="/ejemplo" element={<ComponenteEjemplo />} />
          
          {/* 📝 Página de formulario */}
          <Route path="/formulario" element={<FormularioEjemplo />} />
          
          {/* 📋 Página de lista de mensajes */}
          <Route path="/mensajes" element={<ListaMensajes />} />
          
          {/* 
          🔧 AGREGAR NUEVAS RUTAS AQUÍ:
          <Route path="/mi-nueva-pagina" element={<MiNuevoComponente />} />
          */}
        </Routes>
      </BrowserRouter>
      
      {/* 🎉 Toaster para notificaciones */}
      <Toaster 
        position="top-right"
        richColors
        closeButton
      />
    </div>
  );
}

export default App;

/*
📚 CÓMO AGREGAR UN NUEVO COMPONENTE:

1. Crea el archivo del componente:
   src/components/MiComponente.js

2. Escribe tu componente:
   import React from 'react';
   
   const MiComponente = () => {
     return (
       <div>
         <h1>Mi Nuevo Componente</h1>
       </div>
     );
   };
   
   export default MiComponente;

3. Impórtalo en App.js:
   import MiComponente from "./components/MiComponente";

4. Agrégalo a las rutas:
   <Route path="/mi-ruta" element={<MiComponente />} />

5. ¡Listo! Ve a http://localhost:3000/mi-ruta para verlo
*/