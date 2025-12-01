import React, { useState } from 'react';
import { uploadImage, diagnoseImage } from '../api';
import { Upload, CheckCircle, AlertCircle, Loader2, FileImage } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export function Process() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setLoading(true);
        try {
            // 1. Upload
            const uploadRes = await uploadImage(selectedFile);

            // 2. Diagnose
            const diagnosisRes = await diagnoseImage(uploadRes.url);
            setResult(diagnosisRes);
            toast.success("Análisis completado");
        } catch (error) {
            console.error(error);
            toast.error("Error al procesar la imagen");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                        Diagnóstico Asistido
                    </h1>
                    <p className="mt-4 text-lg text-slate-600">
                        Sube una imagen de fondo de ojo para realizar el análisis automático.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8">
                        {/* Upload Area */}
                        <div className="flex flex-col items-center justify-center">
                            {!previewUrl ? (
                                <label className="w-full flex flex-col items-center justify-center h-64 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-12 h-12 text-slate-400 mb-4" />
                                        <p className="mb-2 text-sm text-slate-500">
                                            <span className="font-semibold">Click para subir</span> o arrastra y suelta
                                        </p>
                                        <p className="text-xs text-slate-500">PNG, JPG (MAX. 10MB)</p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
                                </label>
                            ) : (
                                <div className="relative w-full max-w-md mx-auto">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full rounded-lg shadow-md"
                                    />
                                    <button
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setPreviewUrl(null);
                                            setResult(null);
                                        }}
                                        className="absolute top-2 right-2 bg-white/90 p-1 rounded-full shadow-sm hover:bg-white text-slate-600"
                                    >
                                        <span className="sr-only">Cambiar imagen</span>
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleAnalyze}
                                disabled={!selectedFile || loading}
                                className={cn(
                                    "flex items-center px-8 py-3 text-base font-medium rounded-full text-white transition-all shadow-lg",
                                    !selectedFile || loading
                                        ? "bg-slate-300 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30"
                                )}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <Activity className="w-5 h-5 mr-2" />
                                        Analizar Imagen
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Results Section */}
                    {result && (
                        <div className="border-t border-slate-100 bg-slate-50 p-8">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Resultados del Análisis</h3>

                            <div className={cn(
                                "rounded-xl p-6 flex items-start gap-4",
                                result.has_disease ? "bg-red-50 border border-red-100" : "bg-green-50 border border-green-100"
                            )}>
                                {result.has_disease ? (
                                    <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                                ) : (
                                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                                )}

                                <div>
                                    <h4 className={cn(
                                        "text-xl font-bold mb-1",
                                        result.has_disease ? "text-red-900" : "text-green-900"
                                    )}>
                                        {result.has_disease ? "Signos de Rinopatía Detectados" : "No se detectaron signos de enfermedad"}
                                    </h4>
                                    <p className={cn(
                                        "text-sm mb-2",
                                        result.has_disease ? "text-red-700" : "text-green-700"
                                    )}>
                                        Confianza del modelo: {(result.confidence * 100).toFixed(1)}%
                                    </p>
                                    <p className="text-slate-600 text-sm">
                                        Nota: Este resultado es generado por un sistema de IA y debe ser validado por un profesional médico.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
