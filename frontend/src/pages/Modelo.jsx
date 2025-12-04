import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/sections/Hero';
import ContentSection from '../components/sections/ContentSection';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Brain, Database, Target, TrendingUp } from 'lucide-react';
import { pagesAPI } from '../services/api';

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
      icon: Target,
      label: 'Precisión',
      value: '94.2%',
      description: 'Accuracy en el conjunto de prueba'
    },
    {
      icon: TrendingUp,
      label: 'Sensibilidad',
      value: '92.8%',
      description: 'Detección de casos positivos'
    },
    {
      icon: Database,
      label: 'Dataset',
      value: '35,000+',
      description: 'Imágenes de entrenamiento'
    },
    {
      icon: Brain,
      label: 'Modelo',
      value: 'ResNet50',
      description: 'Arquitectura CNN'
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

      <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Métricas de Rendimiento
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

      <section className="py-10 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Clasificación de Severidad
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            El modelo clasifica las imágenes en 5 categorías diferentes
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="py-1.5 px-3 text-sm shadow-sm">
              Sin Retinopatía
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
