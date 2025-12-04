import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { pagesAPI } from '../../services/api';

const PageEditor = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    loadPageData();
  }, [slug, navigate]);

  const loadPageData = async () => {
    try {
      setLoading(true);
      const data = await pagesAPI.getBySlug(slug);
      setPageData(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la página');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      await pagesAPI.update(slug, pageData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setPageData({ ...pageData, [field]: value });
  };

  const updateSection = (index, field, value) => {
    const newSections = [...pageData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setPageData({ ...pageData, sections: newSections });
  };

  const addSection = () => {
    const newSection = {
      _id: Date.now().toString(),
      title: 'Nueva Sección',
      content: '',
      image: '',
      order: pageData.sections.length + 1
    };
    setPageData({
      ...pageData,
      sections: [...pageData.sections, newSection]
    });
  };

  const deleteSection = (index) => {
    const newSections = pageData.sections.filter((_, i) => i !== index);
    setPageData({ ...pageData, sections: newSections });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Editar: {pageData.title}
                </h1>
                <p className="text-sm text-gray-600">/{slug}</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                'Guardando...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 max-w-4xl">
        {saved && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Cambios guardados exitosamente
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título Principal</Label>
                <Input
                  id="title"
                  value={pageData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Textarea
                  id="subtitle"
                  value={pageData.subtitle}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="heroImage">URL Imagen Principal</Label>
                <Input
                  id="heroImage"
                  value={pageData.heroImage}
                  onChange={(e) => updateField('heroImage', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div>
                <Label htmlFor="heroImageStyle">Estilo de Imagen Principal</Label>
                <select
                  id="heroImageStyle"
                  value={pageData.heroImageStyle || 'cover'}
                  onChange={(e) => updateField('heroImageStyle', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <option value="cover">Llenar (recorta si es necesario)</option>
                  <option value="contain">Ajustar (muestra completa)</option>
                  <option value="original">Original (sin restricciones)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Controla cómo se muestra la imagen principal
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Secciones */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Secciones de Contenido</CardTitle>
                <Button onClick={addSection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Sección
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {pageData.sections.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No hay secciones. Haz clic en "Agregar Sección" para crear una.
                </p>
              ) : (
                pageData.sections.map((section, index) => (
                  <div
                    key={section._id}
                    className="p-4 bg-gray-50 rounded-lg border space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        Sección {index + 1}
                      </h3>
                      <Button
                        onClick={() => deleteSection(index)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <Label>Título de la Sección</Label>
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          updateSection(index, 'title', e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Contenido</Label>
                      <Textarea
                        value={section.content}
                        onChange={(e) =>
                          updateSection(index, 'content', e.target.value)
                        }
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label>URL de Imagen (opcional)</Label>
                      <Input
                        value={section.image || ''}
                        onChange={(e) =>
                          updateSection(index, 'image', e.target.value)
                        }
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>

                    {section.image && (
                      <>
                        <div>
                          <Label>Posición de Imagen</Label>
                          <select
                            value={section.layout || 'horizontal'}
                            onChange={(e) =>
                              updateSection(index, 'layout', e.target.value)
                            }
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          >
                            <option value="horizontal">Al lado del texto</option>
                            <option value="vertical">Debajo del texto</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Dónde se muestra la imagen respecto al texto
                          </p>
                        </div>

                        <div>
                          <Label>Estilo de Imagen</Label>
                          <select
                            value={section.imageStyle || 'cover'}
                            onChange={(e) =>
                              updateSection(index, 'imageStyle', e.target.value)
                            }
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          >
                            <option value="cover">Llenar (recorta si es necesario)</option>
                            <option value="contain">Ajustar (muestra completa)</option>
                            <option value="original">Original (sin restricciones)</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Controla cómo se muestra esta imagen
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
