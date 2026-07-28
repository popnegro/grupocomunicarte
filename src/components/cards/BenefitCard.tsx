// components/cards/BenefitCard.tsx
import { BaseCard } from '@/src/components/ui/BaseCard';

interface BenefitCardProps {
  number: number;
  title: string;
  description: string;
}

export function BenefitCard({ number, title, description }: BenefitCardProps) {
  return (
    <BaseCard variant="outlined" padding="lg">
      {/* Number Badge */}
      <div className="text-4xl font-bold text-primary-400 mb-4">
        {String(number).padStart(2, '0')}
      </div>

      {/* Content */}
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-base leading-relaxed">{description}</p>
    </BaseCard>
  );
}
