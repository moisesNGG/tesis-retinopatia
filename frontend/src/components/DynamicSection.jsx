import React from 'react';

export function DynamicSection({ section }) {
    return (
        <div className="py-12 md:py-16 border-b border-slate-100 last:border-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">
                            {section.title}
                        </h2>
                        <div className="prose prose-lg text-slate-600">
                            <p>{section.content}</p>
                        </div>
                    </div>
                    {section.image_url && (
                        <div className="mt-10 lg:mt-0">
                            <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
                                <img
                                    src={section.image_url}
                                    alt={section.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
