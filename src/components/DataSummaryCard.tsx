import React from 'react';
import { IconType } from 'react-icons';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card";

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
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{subtitle}</CardDescription>
          </div>
          <div className="text-2xl">
            <Icon />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="mt-4"> {/* This div was inside BaseCard's children */}
          <p className="text-3xl font-bold">{value}</p>
          {change && (
            <p className={`text-sm ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { DataSummaryCard };
