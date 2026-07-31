import React from 'react';
import { Layers, Briefcase, Percent, TrendingUp } from 'lucide-react';
import { Card } from '../../ui/card';
import { LoadingState, ErrorState } from '../shared/StateIndicators';
import { CardProps } from './types';

interface OperationMetricsProps extends CardProps {
  metrics: {
    occupation: number;
    activeCampaigns: number;
    conversionRate: string;
    projectedRevenue: number;
  };
  error: Error | null;
}

const MetricRow: React.FC<{ icon: React.ElementType, label: string, value: string | number }> = ({ icon: Icon, label, value }) => (
  <div data-testid={`metric-row-${label}`} className="flex items-center justify-between border-b border-stone-100 pb-2">
    <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold">
      <Icon className="h-3.5 w-3.5 text-[#06434a]" />
      <span>{label}</span>
    </div>
    <span className="font-bold text-stone-900 text-xs font-mono">{value}</span>
  </div>
);

export const OperationMetrics: React.FC<OperationMetricsProps> = React.memo(({ loading, metrics, error }) => {
  return (
    <Card className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-xs">
      <h4 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest font-mono">
        Métricas de Operación
      </h4>

      {loading ? (
        <div className="space-y-3">
          <LoadingState count={4} />
        </div>
      ) : error ? (
        <ErrorState message={error.message} />
      ) : (
        <div className="space-y-3">
          <MetricRow icon={Layers} label="Ocupación Global" value={`${metrics.occupation}%`} />
          <MetricRow icon={Briefcase} label="Campañas Activas" value={metrics.activeCampaigns} />
          <MetricRow icon={Percent} label="Tasa Conversión" value={`${metrics.conversionRate}%`} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold">
              <TrendingUp className="h-3.5 w-3.5 text-[#06434a]" />
              <span>Ingresos Proyectados</span>
            </div>
            <span className="font-extrabold text-stone-900 text-xs font-mono">
              ${(metrics.projectedRevenue / 1000000).toFixed(2)}M
            </span>
          </div>
        </div>
      )}
    </Card>
  );
});
