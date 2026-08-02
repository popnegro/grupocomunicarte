// components/cards/FeatureCard.tsx
import { Card, CardContent } from "../cards"; // Changed import to our new card components
import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function FeatureCard({
  icon,
  title,
  description,
  color = 'primary',
  action,
}: FeatureCardProps) {
  const colorClasses = {
    primary: 'text-primary-400',
    secondary: 'text-secondary-400',
    success: 'text-success-300', // Adjusted to match scale
    warning: 'text-warning-300', // Adjusted to match scale
  };

  return (
    <Card variant="base" padding="lg" className="group">
      <CardContent>
        {/* Icon Container */}
        <div className={cn(colorClasses[color], 'text-4xl mb-4 transition-transform group-hover:scale-110')}>
          {icon}
        </div>

        {/* Content */}
        <h3 className="text-2xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-base mb-4">{description}</p>

        {/* CTA */}
        {action && (
          <a
            href={action.href}
            onClick={action.onClick}
            className="inline-flex items-center text-primary-400 font-medium text-sm hover:text-primary-500 transition-colors"
          >
            {action.label}
            <span className="ml-2">→</span>
          </a>
        )}
      </CardContent>
    </Card>
  );
}
