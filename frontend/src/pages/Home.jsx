import React, { useEffect, useState } from 'react';
import { getPage } from '../api';
import { DynamicSection } from '../components/DynamicSection';
import { Loader2 } from 'lucide-react';

export function Home() {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getPage('home');
                setPageData(data);
            } catch (error) {
                console.error("Failed to load home page", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!pageData) return <div>Error loading content</div>;

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-slate-900 py-24 sm:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Medical background"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        {pageData.title}
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
                        Detección asistida por Inteligencia Artificial para el diagnóstico temprano de patologías retinianas.
                    </p>
                </div>
            </div>

            {/* Dynamic Sections */}
            <div>
                {pageData.sections.map((section) => (
                    <DynamicSection key={section.id} section={section} />
                ))}
            </div>
        </div>
    );
}
