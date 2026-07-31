import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '../../ui/card';
import { LoadingState } from '../shared/StateIndicators';
import { CardProps } from './types';

interface UpcomingAvailabilityCardProps extends CardProps {
  screenName: string;
  daysToRelease: number;
  currentCampaign: string;
  suggestion: string;
}

export const UpcomingAvailabilityCard: React.FC<UpcomingAvailabilityCardProps> = React.memo(({ loading, screenName, daysToRelease, currentCampaign, suggestion }) => {
  return (
    <Card className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition-all shadow-xs space-y-2">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
          <ArrowUpRight className="h-4.5 w-4.5" />
        </div>
        <div className="text-left min-w-0">
          <span className="text-[8px] bg-amber-500/10 text-amber-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Inventario por Liberar
          </span>
          <h4 className="text-xs font-bold text-stone-900 mt-1 font-display">
            {screenName} — Se libera en {daysToRelease} días
          </h4>
        </div>
      </div>
      {loading ? (
        <div className="space-y-2 pl-12">
          <LoadingState />
        </div>
      ) : (
        <p className="text-[11px] text-stone-500 leading-relaxed pl-12">
          Campaña actual de {currentCampaign} finaliza pronto. {suggestion}
        </p>
      )}
    </Card>
  );
});
