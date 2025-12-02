import React from 'react';
import { Heart, Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-600 p-1 rounded">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">
                Marca
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Sistema de detección de retinopatía diabética mediante
              inteligencia artificial. Proyecto de tesis académica.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              Aviso Importante
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Este sistema es para fines académicos y de investigación.
              No sustituye el diagnóstico médico profesional.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              Proyecto Académico
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Desarrollado como proyecto de tesis para avanzar
              en la detección temprana de enfermedades oculares.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-center text-xs text-gray-600">
            Hecho con <Heart className="inline h-3 w-3 text-red-500" /> para la salud visual
          </p>
          <p className="text-center text-xs text-gray-500 mt-1">
            {new Date().getFullYear()} - Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
