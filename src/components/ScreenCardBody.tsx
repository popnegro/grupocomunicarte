import React from "react";
import { MapPin, Layers } from "lucide-react";
import { DoohScreen } from "../types";
import { Badge } from "./ui/badge";

interface ScreenCardBodyProps {
  screen: DoohScreen;
  typeStyle: { size: string };
  availability: { badgeStyle: string; badgeLabel: string };
}

export const ScreenCardBody = React.memo(({ screen, typeStyle, availability }: ScreenCardBodyProps) => {
  const formattedImpacts = screen.impactos >= 1000 ? `${(screen.impactos / 1000).toFixed(1)}k` : String(screen.impactos);

  return (
    <div className="p-5 pb-0 flex-grow flex flex-col justify-between">
      <div className="space-y-3.5">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2.5">
            <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-1 group-hover:text-[#06434a] transition-colors font-display">
              {screen.nombre}
            </h3>
            <Badge className={`text-[8px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider border hover:opacity-100 ${availability.badgeStyle}`}>
              {availability.badgeLabel}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-stone-500 text-xs">
            <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{screen.zona}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
          <div className="text-center"><span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">Audiencia / Día</span><span className="block text-xs font-bold text-stone-800 font-display">{formattedImpacts} visitas</span></div>
          <div className="text-center border-l border-stone-200/50"><span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">Dimensión</span><span className="block text-xs font-bold text-stone-800 font-display">{screen.dimensiones || typeStyle.size}</span></div>
        </div>
        {screen.cobertura && (
          <div className="text-[11px] text-stone-500 flex items-center gap-1 bg-stone-50/40 px-2 py-1.5 rounded-lg border border-stone-100"><Layers className="h-3 w-3 text-stone-400" /><span className="truncate">{screen.cobertura}</span></div>
        )}
      </div>
    </div>
  );
});