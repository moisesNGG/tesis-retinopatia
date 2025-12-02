import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, LogOut, Edit } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/admin');
      return;
    }

    setUser(JSON.parse(userData));
    loadPages();
  }, [navigate]);

  const loadPages = async () => {
    // Mock data - reemplazar con API real
    setPages([
      { _id: '1', slug: 'inicio', title: 'Página de Inicio', sectionsCount: 3, updatedAt: new Date() },
      { _id: '2', slug: 'modelo', title: 'Modelo de IA', sectionsCount: 3, updatedAt: new Date() },
      { _id: '3', slug: 'proceso', title: 'Proceso de Análisis', sectionsCount: 1, updatedAt: new Date() }
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/admin');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel Administrativo
              </h1>
              <p className="text-sm text-gray-600">
                Bienvenido, {user.username}
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/">
                <Button variant="outline">
                  Ver Sitio
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid gap-6">
          {/* Páginas */}
          <Card>
            <CardHeader>
              <CardTitle>Páginas del Sitio</CardTitle>
              <CardDescription>
                Edita el contenido de las páginas públicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pages.map((page) => (
                  <div
                    key={page._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {page.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          /{page.slug} • {page.sectionsCount} secciones
                        </p>
                      </div>
                    </div>
                    <Link to={`/admin/pages/${page.slug}`}>
                      <Button size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Guía rápida */}
          <Card>
            <CardHeader>
              <CardTitle>Guía Rápida</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Haz clic en "Editar" para modificar el contenido de cada página</li>
                <li>• Puedes editar títulos, subtítulos y secciones de contenido</li>
                <li>• Los cambios se guardan automáticamente en MongoDB</li>
                <li>• Las imágenes se pueden reemplazar mediante URLs</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
