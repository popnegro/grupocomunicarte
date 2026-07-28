// components/cards/MetricCard.tsx
import { BaseCard } from '@/src/components/ui/BaseCard';

interface MetricCardProps {
  value: string | number;
  unit?: string;
  label: string;
  change?: {
    value: number;
    positive: boolean;
  };
}

export function MetricCard({ value, unit, label, change }: MetricCardProps) {
  return (
    <BaseCard variant="elevated" padding="lg" className="text-center">
      <div className="flex items-baseline justify-center gap-1 mb-2">
        <span className="text-4xl font-bold text-primary-400">{value}</span>
        {unit && <span className="text-lg text-gray-600">{unit}</span>}
      </div>

      {change && (
        <div className={`text-sm font-medium mb-3 ${change.positive ? 'text-success-300' : 'text-error-300'}`}>
          {change.positive ? '↑' : '↓'} {change.value}%
        </div>
      )}

      <p className="text-gray-600 text-sm">{label}</p>
    </BaseCard>
  );
}
