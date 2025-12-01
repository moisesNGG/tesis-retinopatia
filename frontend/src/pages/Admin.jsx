import React, { useEffect, useState } from 'react';
import { getPage, updatePage } from '../api';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function Admin() {
    const [selectedSlug, setSelectedSlug] = useState('home');
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadPage(selectedSlug);
    }, [selectedSlug]);

    async function loadPage(slug) {
        setLoading(true);
        try {
            const data = await getPage(slug);
            setPageData(data);
        } catch (error) {
            toast.error("Error cargando datos");
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async () => {
        if (!pageData) return;
        setSaving(true);
        try {
            await updatePage(selectedSlug, pageData);
            toast.success("Cambios guardados correctamente");
        } catch (error) {
            toast.error("Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    const updateSection = (index, field, value) => {
        const newSections = [...pageData.sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setPageData({ ...pageData, sections: newSections });
    };

    const addSection = () => {
        setPageData({
            ...pageData,
            sections: [
                ...pageData.sections,
                {
                    id: crypto.randomUUID(),
                    title: "Nueva Sección",
                    content: "Contenido aquí...",
                    image_url: ""
                }
            ]
        });
    };

    const removeSection = (index) => {
        const newSections = pageData.sections.filter((_, i) => i !== index);
        setPageData({ ...pageData, sections: newSections });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
                    <div className="flex space-x-2">
                        <select
                            value={selectedSlug}
                            onChange={(e) => setSelectedSlug(e.target.value)}
                            className="rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="home">Página Inicio</option>
                            <option value="modelo">Página Modelo</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : pageData ? (
                    <div className="bg-white shadow-sm rounded-lg border border-slate-200 p-6 space-y-8">
                        {/* Page Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Título de la Página
                            </label>
                            <input
                                type="text"
                                value={pageData.title}
                                onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>

                        <div className="border-t border-slate-200 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-slate-900">Secciones</h3>
                                <button
                                    onClick={addSection}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Agregar Sección
                                </button>
                            </div>

                            <div className="space-y-6">
                                {pageData.sections.map((section, index) => (
                                    <div key={section.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
                                        <button
                                            onClick={() => removeSection(index)}
                                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                                                    Título de Sección
                                                </label>
                                                <input
                                                    type="text"
                                                    value={section.title}
                                                    onChange={(e) => updateSection(index, 'title', e.target.value)}
                                                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                                                    Contenido
                                                </label>
                                                <textarea
                                                    rows={4}
                                                    value={section.content}
                                                    onChange={(e) => updateSection(index, 'content', e.target.value)}
                                                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                                                    URL de Imagen
                                                </label>
                                                <input
                                                    type="text"
                                                    value={section.image_url || ''}
                                                    onChange={(e) => updateSection(index, 'image_url', e.target.value)}
                                                    placeholder="https://..."
                                                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-200">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
