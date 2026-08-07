import React from "react";
import * as LucideIcons from "lucide-react";

interface ServiciosViewProps {
  slug: string;
}

export const ServiciosView: React.FC<ServiciosViewProps> = ({ slug }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-lg inline-block">
            <LucideIcons.Tv className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-extrabold text-slate-900">Soportes Digitales Inteligentes (DOOH)</h4>
          <p className="text-slate-500 font-medium leading-relaxed">
            Nuestras pantallas LED disponen de conexión inalámbrica, permitiendo cambiar creatividades según el horario del día o clima imperante para maximizar la conversión.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg inline-block">
            <LucideIcons.Layers className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-extrabold text-slate-900">Cartelería Física de Gran Altura (OOH)</h4>
          <p className="text-slate-500 font-medium leading-relaxed">
            Estructuras monumentales diseñadas para presencia institucional ininterrumpida las 24 horas del día. Máxima cobertura de recordación acumulada.
          </p>
        </div>
      </div>
    </div>
  );
};