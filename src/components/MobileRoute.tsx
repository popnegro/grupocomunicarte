import React from "react";
import { MapPin } from "lucide-react";
import { DoohScreen } from "../../types";

interface MobileRouteProps {
  screen: DoohScreen;
}

export const MobileRoute = React.memo(({ screen }: MobileRouteProps) => {
  if (!screen.ruta || screen.ruta.length === 0) return null;

  return (
    <div className="space-y-3 bg-amber-50/40 border border-amber-200/60 p-4 rounded-xl">
      <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-amber-200/40 pb-1.5 font-display">
        <MapPin className="h-4 w-4 text-amber-600" />
        Recorrido Estratégico y Horarios
      </h3>
      {screen.horarios && <div className="text-xs text-stone-600 font-bold mb-2">Horario operativo: <span className="text-amber-700">{screen.horarios}</span></div>}
      <div className="relative border-l-2 border-dashed border-amber-300 pl-4 ml-2 space-y-3 pt-1">
        {screen.ruta.map((stop, idx) => (
          <div key={idx} className="relative text-xs">
            <span className="absolute -left-[21px] top-0.5 flex h-2 w-2 items-center justify-center rounded-full bg-amber-500" />
            <div>
              <span className="font-semibold text-stone-800 block leading-none">{stop.nombre}</span>
              <span className="text-[9px] text-stone-400">Punto de alta afluencia {idx === 0 ? "de salida" : idx === screen.ruta!.length - 1 ? "de retorno" : ""}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});