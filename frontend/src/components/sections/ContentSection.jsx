import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const ContentSection = ({ title, content, image, imagePosition = 'right', variant = 'default' }) => {
  const isImageLeft = imagePosition === 'left';

  if (variant === 'card') {
    return (
      <Card className="mb-4 shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-blue-900">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {content}
          </p>
          {image && (
            <div className="mt-4">
              <img
                src={image}
                alt={title}
                className="w-full max-h-64 object-cover rounded-lg shadow-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!image ? (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {content}
            </p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${isImageLeft ? 'lg:grid-flow-dense' : ''}`}>
            <div className={isImageLeft ? 'lg:col-start-2' : ''}>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {title}
              </h2>
              <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                {content}
              </p>
            </div>
            <div className={isImageLeft ? 'lg:col-start-1 lg:row-start-1' : ''}>
              <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentSection;
