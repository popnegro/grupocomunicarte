import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { LoadingState } from '../shared/StateIndicators';
import { CardProps } from './types';
import { Cotizacion } from '../types';

interface PendingQuoteCardProps extends CardProps {
  quote: Cotizacion;
  onApproveCotizacion: (id: string) => void;
  triggerToast: (message: string) => void;
}

export const PendingQuoteCard: React.FC<PendingQuoteCardProps> = React.memo(({ loading, quote, onApproveCotizacion, triggerToast }) => {
  const handleApprove = () => {
    onApproveCotizacion(quote.id);
    triggerToast("Cotización aprobada por cliente. Se ha generado la Reserva correspondiente.");
  };

  return (
    <Card className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition-all shadow-xs space-y-3.5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-stone-50 text-[#06434a] flex items-center justify-center border border-stone-100">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div className="text-left min-w-0">
            <span className="text-[8px] bg-[#06434a]/8 text-[#06434a] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Cotización Pendiente
            </span>
            <h4 className="text-xs font-bold text-stone-900 mt-1 font-display">
              #{quote.id} para {quote.clienteNombre} • ${quote.total.toLocaleString()}
            </h4>
          </div>
        </div>
        <span className="text-[10px] text-stone-400 font-medium font-mono shrink-0">Vence en {quote.validez}</span>
      </div>
      {loading ? (
        <div className="space-y-2 pl-12">
          <LoadingState />
        </div>
      ) : (
        <p className="text-[11px] text-stone-500 leading-relaxed pl-12">
          Aprobación interna completada. Descuento comercial del {quote.descuentoPercent}% aplicado. Esperando aprobación final del cliente.
        </p>
      )}
      <div className="flex items-center justify-end gap-2 pl-12 pt-1.5">
        <Button
          size="sm"
          onClick={handleApprove}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase rounded-lg cursor-pointer transition-all shadow-xs flex items-center gap-1.5"
        >
          <CheckCircle className="h-3 w-3" />
          <span>Aprobar desde Cliente</span>
        </Button>
      </div>
    </Card>
  );
});
