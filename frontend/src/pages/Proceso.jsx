import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Upload, Image as ImageIcon, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { pagesAPI } from '../services/api';
import Hero from '../components/sections/Hero';
import ContentSection from '../components/sections/ContentSection';

const Proceso = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [pageData, setPageData] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      const data = await pagesAPI.getBySlug('proceso');
      setPageData(data);
    } catch (err) {
      console.error('Error cargando datos del CMS:', err);
      // Si falla, usar valores por defecto
      setPageData({
        title: 'Proceso de Análisis',
        subtitle: 'Sube una imagen de fondo de ojo para detectar signos de retinopatía diabética'
      });
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Tamaño máximo: 10MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setResult(null);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona una imagen primero');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // TODO: Reemplazar con llamada real al endpoint de IA
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Simulación de análisis (reemplazar con fetch real)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock result - REEMPLAZAR cuando tengas el backend
      const mockResult = {
        prediction: 'Retinopatía Diabética Moderada',
        confidence: 0.87,
        severity: 'moderate',
        details: {
          microaneurysms: true,
          hemorrhages: true,
          exudates: false,
          neovascularization: false
        },
        recommendation: 'Se recomienda consulta con oftalmólogo. Se detectaron signos de retinopatía diabética moderada.'
      };

      /*
      // CÓDIGO REAL PARA CUANDO TENGAS EL BACKEND:
      const response = await fetch(process.env.REACT_APP_AI_MODEL_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error en el análisis');
      }

      const data = await response.json();
      setResult(data);
      */

      setResult(mockResult);
    } catch (err) {
      setError('Error al analizar la imagen. Por favor intenta de nuevo.');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      none: 'bg-green-100 text-green-800',
      mild: 'bg-yellow-100 text-yellow-800',
      moderate: 'bg-orange-100 text-orange-800',
      severe: 'bg-red-100 text-red-800',
      proliferative: 'bg-red-200 text-red-900'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  if (!pageData) {
    return <Layout><div className="container py-12">Cargando...</div></Layout>;
  }

  return (
    <Layout>
      {/* Hero section si hay imagen */}
      {pageData.heroImage && (
        <Hero
          title={pageData.title}
          subtitle={pageData.subtitle}
          image={pageData.heroImage}
          imageStyle={pageData.heroImageStyle || 'cover'}
          ctaText="Comenzar Análisis"
          ctaLink="#analizar"
        />
      )}

      {/* Secciones del CMS si existen */}
      {pageData.sections && pageData.sections.length > 0 && (
        <div className="bg-gradient-to-b from-white to-gray-50">
          {pageData.sections
            .sort((a, b) => a.order - b.order)
            .map((section, index) => (
              <ContentSection
                key={section._id || index}
                title={section.title}
                content={section.content}
                image={section.image}
                imageStyle={section.imageStyle || 'cover'}
                layout={section.layout || 'horizontal'}
                imagePosition={index % 2 === 0 ? 'right' : 'left'}
              />
            ))}
        </div>
      )}

      <div id="analizar" className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container max-w-5xl">
          {/* Mostrar título solo si no hay Hero */}
          {!pageData.heroImage && (
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {pageData.title}
              </h1>
              <p className="text-lg text-gray-600">
                {pageData.subtitle}
              </p>
            </div>
          )}

          {/* Instrucciones */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Instrucciones</CardTitle>
              <CardDescription>
                Sigue estos pasos para obtener un análisis preciso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Asegúrate de que la imagen sea de buena calidad y esté bien enfocada</li>
                <li>La imagen debe mostrar claramente el fondo de ojo</li>
                <li>Formatos aceptados: JPG, PNG (máximo 10MB)</li>
                <li>El análisis puede tardar unos segundos</li>
              </ol>
            </CardContent>
          </Card>

          {/* Upload Area */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Subir Imagen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {!preview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      Haz clic para seleccionar una imagen
                    </p>
                    <p className="text-sm text-gray-500">
                      o arrastra y suelta aquí
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-auto max-h-96 object-contain mx-auto"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className="flex-1"
                        size="lg"
                      >
                        {analyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analizando...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Analizar Imagen
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={resetAnalysis}
                        variant="outline"
                        disabled={analyzing}
                        size="lg"
                      >
                        Cambiar Imagen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          {analyzing && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center">
                    Analizando imagen con IA...
                  </p>
                  <Progress value={66} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {result && (
            <Card className="mb-8 border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Resultados del Análisis</CardTitle>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Predicción principal */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Diagnóstico</p>
                  <div className="flex items-center gap-3">
                    <Badge className={`text-base py-2 px-4 ${getSeverityColor(result.severity)}`}>
                      {result.prediction}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Confianza: {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Hallazgos */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Hallazgos Detectados
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(result.details).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-sm"
                      >
                        {value ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recomendación */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Recomendación:</strong> {result.recommendation}
                  </AlertDescription>
                </Alert>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">
                    <strong>Importante:</strong> Este resultado es generado por un
                    sistema de IA y tiene fines académicos. No sustituye el diagnóstico
                    de un profesional médico. Consulta con un oftalmólogo para una
                    evaluación completa.
                  </p>
                </div>

                <Button onClick={resetAnalysis} variant="outline" className="w-full">
                  Analizar Nueva Imagen
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Proceso;
