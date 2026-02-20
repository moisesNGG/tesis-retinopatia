import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { Upload, Image as ImageIcon, AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { pagesAPI, predictionAPI } from '../services/api';
import Hero from '../components/sections/Hero';
import ContentSection from '../components/sections/ContentSection';

const MODEL_NAMES = [
  'DenseNet121 + EA',
  'EfficientNet-B0 + EA',
  'ResNet50 + EA',
  'ViT-B/16',
  'YOLOv8x-cls',
];

const Proceso = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [consentChoice, setConsentChoice] = useState(null); // 'accept' | 'reject' | null
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
      setPageData({
        title: 'Proceso de Analisis',
        subtitle: 'Sube una imagen de fondo de ojo para detectar signos de retinopatia diabetica'
      });
    }
  };

  const handleUploadClick = () => {
    if (consentAccepted) {
      fileInputRef.current?.click();
    } else {
      setConsentChoice(null);
      setShowConsentDialog(true);
    }
  };

  const handleConsentAccept = () => {
    setConsentAccepted(true);
    setShowConsentDialog(false);
    setConsentChoice(null);
    // Abrir selector de archivo tras aceptar
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  const handleConsentReject = () => {
    setShowConsentDialog(false);
    setConsentChoice(null);
    // Redirigir al inicio
    window.location.href = '/';
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen valido');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Tamano maximo: 10MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setResult(null);

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
    setProgressValue(10);

    const progressInterval = setInterval(() => {
      setProgressValue((prev) => (prev < 85 ? prev + 5 : prev));
    }, 800);

    try {
      const data = await predictionAPI.analyze(selectedFile);
      setProgressValue(100);
      setResult(data);
    } catch (err) {
      setError('Error al analizar la imagen. Por favor intenta de nuevo.');
      console.error(err);
    } finally {
      clearInterval(progressInterval);
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setProgressValue(0);
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

  const getSeverityLabel = (severity) => {
    const labels = {
      none: 'Sin RD',
      mild: 'Leve',
      moderate: 'Moderada',
      severe: 'Severa',
      proliferative: 'Proliferativa'
    };
    return labels[severity] || severity;
  };

  if (!pageData) {
    return <Layout><div className="container py-12">Cargando...</div></Layout>;
  }

  return (
    <Layout>
      {pageData.heroImage && (
        <Hero
          title={pageData.title}
          subtitle={pageData.subtitle}
          image={pageData.heroImage}
          imageStyle={pageData.heroImageStyle || 'cover'}
          ctaText="Comenzar Analisis"
          ctaLink="#analizar"
        />
      )}

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
                Sigue estos pasos para obtener un analisis preciso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Asegurate de que la imagen sea de buena calidad y este bien enfocada</li>
                <li>La imagen debe mostrar claramente el fondo de ojo</li>
                <li>Formatos aceptados: JPG, PNG (maximo 10MB)</li>
                <li>La imagen sera analizada por 5 modelos de IA simultaneamente</li>
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
                    onClick={handleUploadClick}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      Haz clic para seleccionar una imagen
                    </p>
                    <p className="text-sm text-gray-500">
                      o arrastra y suelta aqui
                    </p>
                    {consentAccepted && (
                      <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Términos y condiciones aceptados
                      </p>
                    )}
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
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center font-medium">
                    Analizando imagen con 5 modelos de IA...
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-2">
                    {MODEL_NAMES.map((name) => (
                      <Badge key={name} variant="outline" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                  <Progress value={progressValue} className="w-full" />
                  <p className="text-xs text-gray-400 text-center">
                    Este proceso puede tardar 10-15 segundos
                  </p>
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
            <div className="space-y-6">
              {/* Consenso */}
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Diagnostico por Consenso</CardTitle>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Badge className={`text-base py-2 px-4 ${getSeverityColor(result.consensus.severity)}`}>
                      {result.consensus.prediction}
                    </Badge>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span>
                        Confianza: <strong>{(result.consensus.confidence * 100).toFixed(1)}%</strong>
                      </span>
                      <span>
                        Acuerdo: <strong>{result.consensus.agreement_count}/{result.consensus.total_models} modelos</strong>
                      </span>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recomendacion:</strong> {result.consensus.recommendation}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Tabla comparativa de modelos */}
              <Card>
                <CardHeader>
                  <CardTitle>Resultados por Modelo</CardTitle>
                  <CardDescription>
                    Comparativa de los 5 modelos de inteligencia artificial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Prediccion</TableHead>
                        <TableHead>Confianza</TableHead>
                        <TableHead>Severidad</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.results.map((r) => (
                        <TableRow key={r.model_name}>
                          <TableCell className="font-medium">{r.model_name}</TableCell>
                          <TableCell>{r.prediction}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={r.confidence * 100}
                                className="w-20 h-2"
                              />
                              <span className="text-sm text-gray-600 min-w-[3rem]">
                                {(r.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(r.severity)}>
                              {getSeverityLabel(r.severity)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900">
                  <strong>Importante:</strong> Estos resultados son generados por
                  sistemas de IA y tienen fines academicos. No sustituyen el diagnostico
                  de un profesional medico. Consulta con un oftalmologo para una
                  evaluacion completa.
                </p>
              </div>

              <Button onClick={resetAnalysis} variant="outline" className="w-full">
                Analizar Nueva Imagen
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Dialog de Consentimiento */}
      <Dialog open={showConsentDialog} onOpenChange={(open) => {
        if (!open) setShowConsentDialog(false);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              Términos y Condiciones de Uso
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4" style={{ maxHeight: '55vh' }}>
            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              {/* Seccion 1 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">
                  Finalidad y alcance del sistema
                </h3>
                <p>
                  RETINAIA es una plataforma de investigación en inteligencia artificial aplicada al análisis de imágenes médicas. Su propósito es evaluar el desempeño de modelos de aprendizaje profundo en la clasificación multietapa de retinopatía diabética dentro de un entorno experimental. Se trata de una herramienta metodológica para validación técnica y análisis comparativo de algoritmos. No es un producto sanitario certificado ni está habilitada para uso clínico. Su utilización se limita a contextos académicos y de investigación.
                </p>
              </div>

              {/* Seccion 2 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">
                  Privacidad, tratamiento y uso de imágenes
                </h3>
                <p>
                  Las imágenes cargadas se procesan únicamente durante la sesión activa para generar un resultado inmediato. No se almacenan de forma permanente ni se integran en bases de datos. El tratamiento se realiza bajo principios de confidencialidad, minimización de datos y uso restringido al propósito declarado. El usuario declara contar con autorización para utilizar las imágenes proporcionadas. La plataforma respeta estándares éticos aplicables a la investigación con datos médicos.
                </p>
              </div>

              {/* Seccion 3 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">
                  Advertencias y limitaciones de responsabilidad
                </h3>
                <p>
                  Los resultados corresponden a estimaciones algorítmicas sujetas a posibles márgenes de error. No constituyen diagnóstico médico ni reemplazan la evaluación de un profesional de la salud. La plataforma no emite recomendaciones clínicas ni debe utilizarse para la toma de decisiones médicas. El usuario reconoce el carácter experimental del sistema y sus limitaciones técnicas. El uso de la herramienta implica la aceptación de estas condiciones.
                </p>
              </div>
            </div>
          </ScrollArea>

          {/* Opciones de consentimiento */}
          <div className="border-t pt-4 space-y-3">
            <label
              className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                consentChoice === 'accept'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setConsentChoice('accept')}
            >
              <div className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                consentChoice === 'accept'
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {consentChoice === 'accept' && (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                )}
              </div>
              <span className="text-sm text-gray-700">
                Acepto todos los términos y condiciones descritos anteriormente
              </span>
            </label>

            <label
              className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                consentChoice === 'reject'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setConsentChoice('reject')}
            >
              <div className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                consentChoice === 'reject'
                  ? 'border-red-500 bg-red-500'
                  : 'border-gray-300'
              }`}>
                {consentChoice === 'reject' && (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                )}
              </div>
              <span className="text-sm text-gray-700">
                No acepto los términos y deseo abandonar la plataforma
              </span>
            </label>
          </div>

          <DialogFooter>
            <Button
              onClick={consentChoice === 'accept' ? handleConsentAccept : handleConsentReject}
              disabled={!consentChoice}
              className={
                consentChoice === 'accept'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : consentChoice === 'reject'
                  ? 'bg-red-600 hover:bg-red-700'
                  : ''
              }
            >
              {consentChoice === 'accept'
                ? 'Continuar'
                : consentChoice === 'reject'
                ? 'Abandonar plataforma'
                : 'Selecciona una opción'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Proceso;
