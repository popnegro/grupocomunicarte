// components/ui/Section.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  variant?: 'default' | 'alt' | 'dark';
}

export function Section({
  id,
  className = '',
  children,
  variant = 'default',
}: SectionProps) {
  const bgClasses = {
    default: 'bg-white',
    alt: 'bg-gray-50',
    dark: 'bg-gray-800 text-white', // changed gray-900 to 800 to match new palette
  };

  return (
    <section
      id={id}
      className={cn(
        'py-20 px-4 md:px-8 lg:px-16',
        bgClasses[variant],
        className
      )}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
