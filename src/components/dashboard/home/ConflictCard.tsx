import React from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { LoadingState } from '../shared/StateIndicators';
import { CardProps } from './types';
import { Reserva } from '../types';

interface ConflictCardProps extends CardProps {
  reservation: Reserva;
  conflictingCampaign: { name: string; period: string };
  onNavigateToTab: (tab: string) => void;
  triggerToast: (message: string) => void;
}

export const ConflictCard: React.FC<ConflictCardProps> = React.memo(({ loading, reservation, conflictingCampaign, onNavigateToTab, triggerToast }) => {
  const handleResolve = () => {
    onNavigateToTab("reservas");
    triggerToast("Redirigiendo a resolución de reservas conflictivas...");
  };

  return (
    <Card className="bg-red-50/40 border border-red-200 rounded-2xl p-5 hover:bg-red-50/60 transition-all shadow-xs space-y-3.5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-red-100/50 text-red-600 flex items-center justify-center border border-red-200">
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
          <div className="text-left min-w-0">
            <span className="text-[8px] bg-red-500/10 text-red-700 border border-red-200 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Conflicto de Reserva
            </span>
            <h4 className="text-xs font-bold text-red-900 mt-1 font-display">
              Overbooking detectado en {reservation.screenNombre}
            </h4>
          </div>
        </div>
        <span className="text-[10px] text-red-500 font-extrabold font-mono uppercase tracking-widest animate-pulse shrink-0">Urgente</span>
      </div>
      {loading ? (
        <div className="space-y-2 pl-12">
          <LoadingState />
        </div>
      ) : (
        <p className="text-[11px] text-stone-600 leading-relaxed pl-12 font-medium">
          La pauta de <strong className="text-stone-900 font-bold">{reservation.clienteNombre} ({reservation.id})</strong> se superpone del {reservation.fechaInicio} al {reservation.fechaFin} con la campaña activa de <strong className="text-stone-900 font-bold">{conflictingCampaign.name} ({conflictingCampaign.period})</strong>.
        </p>
      )}
      <div className="flex items-center justify-between gap-4 pl-12 pt-1.5">
        <div className="text-[10px] text-stone-500 font-bold bg-white px-2.5 py-1 rounded-lg border border-stone-200 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
          <span>Sugerencia IA: Reemplazar por Palmares con 10% bonificado</span>
        </div>
        <Button
          size="sm"
          onClick={handleResolve}
          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] uppercase rounded-lg cursor-pointer transition-all shadow-xs"
        >
          Resolver Conflicto
        </Button>
      </div>
    </Card>
  );
});
