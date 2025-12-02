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

// Páginas principales
import Inicio from "./pages/Inicio";
import Modelo from "./pages/Modelo";
import Proceso from "./pages/Proceso";

// Páginas admin
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import PageEditor from "./pages/admin/PageEditor";

// 🌐 URL del backend
// Si está definida la variable de entorno, usar esa
// Si no, usar la URL actual del servidor (importante para producción)
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;
export { BACKEND_URL };
export const API_URL = `${BACKEND_URL}/api`;

function App() {
  return (
    <div className="App min-h-screen">
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/modelo" element={<Modelo />} />
          <Route path="/proceso" element={<Proceso />} />

          {/* Rutas admin */}
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/pages/:slug" element={<PageEditor />} />
        </Routes>
      </BrowserRouter>

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