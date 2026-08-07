import React from "react";
import * as LucideIcons from "lucide-react";

interface NosotrosViewProps {
  slug: string;
}

export const NosotrosView: React.FC<NosotrosViewProps> = ({ slug }) => {
  return (
    <div className="space-y-6">
      {/* Core Corporate Values */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
        <h3 className="text-xl font-black text-slate-900">Nuestra Trayectoria en Vía Pública</h3>
        <p className="text-slate-500 text-xs leading-relaxed font-medium">
          Grupo Comunicarte nació hace más de 20 años como un proyecto familiar de cartelería urbana en Mendoza. Hoy, gracias a la confianza de nuestros anunciantes y la digitalización tecnológica de nuestros soportes, nos consolidamos como la referencia multipantalla en el oeste argentino y la autopista metropolitana bonaerense.
        </p>

        <div className="relative border-l border-slate-200 pl-4 space-y-6 text-xs pt-2">
          <div className="relative">
            <span className="absolute -left-[21px] top-0.5 h-3.5 w-3.5 rounded-full bg-slate-950 border-4 border-white" />
            <span className="font-extrabold text-slate-900 block text-xs">Año 2004 - Fundación</span>
            <p className="text-slate-500 mt-1">Colocación de la primera valla estática en el microcentro de Mendoza.</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[21px] top-0.5 h-3.5 w-3.5 rounded-full bg-slate-400 border-4 border-white" />
            <span className="font-extrabold text-slate-900 block text-xs">Año 2012 - Cobertura Provincial</span>
            <p className="text-slate-500 mt-1">Llegamos a San Rafael, Maipú y Luján de Cuyo con más de 250 caras estáticas.</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[21px] top-0.5 h-3.5 w-3.5 rounded-full bg-slate-400 border-4 border-white" />
            <span className="font-extrabold text-slate-900 block text-xs">Año 2018 - El Salto Digital (DOOH)</span>
            <p className="text-slate-500 mt-1">Inauguración de la primera pantalla LED de alta frecuencia en Sarmiento y 9 de Julio.</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[21px] top-0.5 h-3.5 w-3.5 rounded-full bg-slate-900 animate-pulse border-4 border-white" />
            <span className="font-extrabold text-slate-900 block text-xs">Presente - Expansión Metropolitana y SmartWeb</span>
            <p className="text-slate-500 mt-1">Lanzamiento del portal interactivo B2B y alianza estratégica en Buenos Aires.</p>
          </div>
        </div>
      </div>
    </div>
  );
};