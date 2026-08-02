// components/cards/ServiceCard.tsx
import { Card, CardContent } from "../cards"; // Changed import to our new card components
import { ReactNode } from 'react';

interface ServiceCardProps {
  image: string;
  badge?: string;
  title: string;
  description: string;
  highlights: string[];
  cta: {
    label: string;
    href: string;
  };
}

export function ServiceCard({
  image,
  badge,
  title,
  description,
  highlights,
  cta,
}: ServiceCardProps) {
  return (
    <Card variant="base" padding="none" className="overflow-hidden group">
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="absolute h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className="absolute top-4 left-4 bg-primary-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-base mb-4">{description}</p>

        {/* Highlights */}
        <ul className="space-y-2 mb-6">
          {highlights.map((highlight, idx) => (
            <li key={idx} className="flex items-start text-sm text-gray-700">
              <span className="text-success-300 mr-2 mt-1">✓</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={cta.href}
          className="inline-block bg-primary-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors"
        >
          {cta.label}
        </a>
      </CardContent>
    </Card>
  );
}
