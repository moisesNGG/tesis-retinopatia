import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/sections/Hero';
import ContentSection from '../components/sections/ContentSection';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Brain, Layers, Grid3X3, Sparkles, Eye, Zap, Network, ScanSearch, Cpu } from 'lucide-react';
import { pagesAPI } from '../services/api';

const MODEL_ARCHITECTURES = [
  {
    name: 'DenseNet121 + EA',
    arch: 'DenseNet121 + 6 Conv + External Attention',
    feature: 'Conexiones densas + atencion externa',
    icon: Layers,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    name: 'EfficientNet-B0 + EA',
    arch: 'EfficientNet-B0 + 6 Conv + External Attention',
    feature: 'Escalado compuesto eficiente',
    icon: Zap,
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'ResNet50 + EA',
    arch: 'ResNet50 + 5 Conv + External Attention',
    feature: 'Conexiones residuales profundas',
    icon: Network,
    color: 'from-violet-500 to-violet-600',
  },
  {
    name: 'ViT-B/16',
    arch: 'Vision Transformer B/16',
    feature: 'Atencion multi-cabeza global',
    icon: Eye,
    color: 'from-amber-500 to-amber-600',
  },
  {
    name: 'YOLOv8x-cls',
    arch: 'YOLOv8x Classification',
    feature: 'Deteccion en tiempo real',
    icon: ScanSearch,
    color: 'from-rose-500 to-rose-600',
  },
];

const Modelo = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const data = await pagesAPI.getBySlug('modelo');
      setPageData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    {
      icon: Brain,
      label: '5 Modelos',
      value: 'Ensemble',
      description: 'Ensemble de 5 arquitecturas de deep learning'
    },
    {
      icon: Grid3X3,
      label: '5 Clases',
      value: 'Multiclase',
      description: 'Clasificacion en 5 niveles de severidad'
    },
    {
      icon: Cpu,
      label: 'Entrada',
      value: '224x224',
      description: 'Resolucion de entrada de las imagenes'
    },
    {
      icon: Sparkles,
      label: 'Atencion',
      value: 'External',
      description: 'Mecanismo de atencion en 3 modelos'
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="container py-12 space-y-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Hero
        title={pageData.title}
        subtitle={pageData.subtitle}
        image={pageData.heroImage}
        imageStyle={pageData.heroImageStyle || 'cover'}
        ctaText="Probar el Modelo"
        ctaLink="/proceso"
      />

      {/* Metricas del ensemble */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Caracteristicas del Sistema
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="text-center shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="mx-auto w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-2">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-blue-600">
                      {metric.value}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="font-semibold text-gray-900 text-sm mb-1">
                      {metric.label}
                    </p>
                    <p className="text-xs text-gray-600">
                      {metric.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Arquitecturas de modelos */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
            Arquitecturas del Ensemble
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto text-sm">
            El sistema utiliza 5 modelos de deep learning con arquitecturas complementarias para maximizar la precision del diagnostico.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODEL_ARCHITECTURES.map((model) => {
              const Icon = model.icon;
              return (
                <Card key={model.name} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 bg-gradient-to-br ${model.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-4.5 w-4.5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{model.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-500 mb-2">{model.arch}</p>
                    <Badge variant="outline" className="text-xs">
                      {model.feature}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Estrategia del ensemble */}
      <section className="py-10 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Estrategia de Consenso
          </h2>
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                Los 5 modelos analizan la imagen simultaneamente. El diagnostico final se determina por <strong>voto de consenso</strong> — la clasificacion mas votada es el resultado, con la confianza promedio de los modelos que coinciden. Este enfoque reduce el riesgo de error de cualquier modelo individual y proporciona un diagnostico mas robusto.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CMS content sections */}
      {pageData.sections && pageData.sections.length > 0 && (
        <div className="bg-gradient-to-b from-white to-gray-50">
          {pageData.sections
            .sort((a, b) => a.order - b.order)
            .map((section, index) => (
              <ContentSection
                key={section._id}
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

      {/* Clasificacion de severidad */}
      <section className="py-10 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Clasificacion de Severidad
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            El ensemble clasifica las imagenes en 5 categorias de severidad
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="py-1.5 px-3 text-sm shadow-sm">
              Sin Retinopatia
            </Badge>
            <Badge variant="outline" className="py-1.5 px-3 text-sm bg-yellow-50 shadow-sm">
              RD Leve
            </Badge>
            <Badge variant="outline" className="py-1.5 px-3 text-sm bg-orange-50 shadow-sm">
              RD Moderada
            </Badge>
            <Badge variant="outline" className="py-1.5 px-3 text-sm bg-red-50 shadow-sm">
              RD Severa
            </Badge>
            <Badge variant="outline" className="py-1.5 px-3 text-sm bg-red-100 shadow-sm">
              RD Proliferativa
            </Badge>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Modelo;
