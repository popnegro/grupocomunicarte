import React from 'react';
import { FilePlus } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { LoadingState } from '../shared/StateIndicators';
import { CardProps } from './types';

interface MediaKitCardProps extends CardProps {
  onNavigateToTab: (tab: string) => void;
  triggerToast: (message: string) => void;
}

export const MediaKitCard: React.FC<MediaKitCardProps> = React.memo(({ loading, onNavigateToTab, triggerToast }) => {
  return (
    <Card className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition-all shadow-xs space-y-3.5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50">
            <FilePlus className="h-4.5 w-4.5" />
          </div>
          <div className="text-left min-w-0">
            <span className="text-[8px] bg-blue-500/10 text-blue-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              MediaKit Nuevo
            </span>
            <h4 className="text-xs font-bold text-stone-900 mt-1 font-display">
              Lanzamiento Toyota Hilux 2026 (Mendoza)
            </h4>
          </div>
        </div>
        <span className="text-[10px] text-stone-400 font-medium font-mono shrink-0">Hace 2 horas</span>
      </div>
      {loading ? (
        <div className="space-y-2 pl-12">
          <LoadingState />
        </div>
      ) : (
        <p className="text-[11px] text-stone-500 leading-relaxed pl-12">
          Recibido desde la Landing. El cliente solicita pautar 3 pantallas (Sarmiento, Palmares y Mendoza Express) para agosto. Requiere propuesta formal.
        </p>
      )}
      <div className="flex items-center justify-end gap-2 pl-12 pt-1.5">
        <Button
          size="sm"
          onClick={() => {
            onNavigateToTab("mediakit");
            triggerToast("Abriendo editor de MediaKit...");
          }}
          className="px-3.5 py-1.5 bg-[#06434a] hover:bg-[#0b5e67] text-white font-extrabold text-[10px] uppercase rounded-lg cursor-pointer transition-all shadow-xs"
        >
          Generar Cotización
        </Button>
      </div>
    </Card>
  );
});
