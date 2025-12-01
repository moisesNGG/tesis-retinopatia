import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Model } from "./pages/Model";
import { Process } from "./pages/Process";
import { Admin } from "./pages/Admin";

// URL del backend
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
export const API_URL = `${BACKEND_URL}/api`;

function App() {
  return (
    <div className="App min-h-screen bg-slate-50">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/modelo" element={<Model />} />
            <Route path="/proceso" element={<Process />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
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