import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/sections/Hero';
import ContentSection from '../components/sections/ContentSection';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { pagesAPI } from '../services/api';

const Inicio = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const data = await pagesAPI.getBySlug('inicio');
      setPageData(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el contenido de la página');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-12 space-y-8">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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
      />

      <div className="bg-gradient-to-b from-white to-gray-50">
        {pageData.sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <ContentSection
              key={section._id}
              title={section.title}
              content={section.content}
              image={section.image}
              imagePosition={index % 2 === 0 ? 'right' : 'left'}
            />
          ))}
      </div>
    </Layout>
  );
};

export default Inicio;
