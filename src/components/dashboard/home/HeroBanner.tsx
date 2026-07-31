import React from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '../../ui/card';

interface HeroBannerProps {
  conflicts: number;
  pendingQuotes: number;
  topLocation: { name: string; occupation: number };
}

export const HeroBanner: React.FC<HeroBannerProps> = React.memo(({ conflicts, pendingQuotes, topLocation }) => {
  return (
    <Card className="bg-gradient-to-br from-[#121E20] to-[#06434a] text-stone-100 p-6 relative overflow-hidden border border-[#05353a] shadow-md">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="relative z-10 space-y-3 max-w-2xl text-left">
        <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" />
          <span>Optimizador de Inventario OOH</span>
        </div>
        <h2 className="text-xl md:text-2xl font-display font-black tracking-tight">
          ¿Qué tenemos que resolver hoy?
        </h2>
        <p className="text-[11px] text-stone-200/90 leading-relaxed font-normal">
          La plataforma ha detectado <strong className="text-white font-bold">{conflicts} conflicto de disponibilidad</strong> y <strong className="text-white font-bold">{pendingQuotes} cotizaciones listas para envío</strong>. {topLocation.name} lidera la ocupación semanal con un {topLocation.occupation}%.
        </p>
      </div>
    </Card>
  );
});
