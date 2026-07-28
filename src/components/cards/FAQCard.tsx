// components/cards/FAQCard.tsx
"use client"; // Good practice for components using hooks

import { useState } from 'react';
import { BaseCard } from '@/src/components/ui/BaseCard';
import { cn } from '@/src/lib/utils';

interface FAQCardProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function FAQCard({ question, answer, defaultOpen = false }: FAQCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <BaseCard
      variant="outlined"
      padding="lg"
      className="cursor-pointer hover:shadow-md"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold flex-1 text-left">{question}</h3>
        <span className={cn(
            'text-2xl transition-transform duration-300',
            isOpen ? 'rotate-45' : ''
          )}
        >
          +
        </span>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-gray-600 text-base leading-relaxed">{answer}</p>
        </div>
      )}
    </BaseCard>
  );
}
