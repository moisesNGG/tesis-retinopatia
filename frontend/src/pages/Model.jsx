import React, { useEffect, useState } from 'react';
import { getPage } from '../api';
import { DynamicSection } from '../components/DynamicSection';
import { Loader2 } from 'lucide-react';

export function Model() {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getPage('modelo');
                setPageData(data);
            } catch (error) {
                console.error("Failed to load model page", error);
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
            <div className="bg-blue-50 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        {pageData.title}
                    </h1>
                    <p className="mt-4 text-lg text-slate-600">
                        Detalles técnicos y arquitectura de nuestra solución.
                    </p>
                </div>
            </div>

            <div>
                {pageData.sections.map((section) => (
                    <DynamicSection key={section.id} section={section} />
                ))}
            </div>
        </div>
    );
}
