import React from 'react';
import { BaseCard } from '@/src/components/ui/BaseCard';
import { IconType } from 'react-icons';

interface DataSummaryCardProps {
  title: string;
  subtitle: string;
  value: string;
  icon: IconType;
  change?: string;
  changeType?: 'positive' | 'negative';
}

const DataSummaryCard: React.FC<DataSummaryCardProps> = ({
  title,
  subtitle,
  value,
  icon: Icon,
  change,
  changeType,
}) => {
  return (
    <BaseCard>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="text-2xl">
            <Icon />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">{value}</p>
          {change && (
            <p className={`text-sm ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export { DataSummaryCard };
