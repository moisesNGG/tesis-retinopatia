import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// URL del backend
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api`;

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">Hola mundo!</h1>
              </div>
            </div>
          } />
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