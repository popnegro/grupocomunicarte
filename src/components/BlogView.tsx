import React from "react";

interface BlogViewProps {
  slug: string;
}

export const BlogView: React.FC<BlogViewProps> = ({ slug }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
        <h3 className="text-lg font-black text-slate-900">Últimos Artículos de Análisis Industrial</h3>
        
        <div className="space-y-4">
          <div className="border border-slate-150 rounded-xl p-4 space-y-2 hover:border-slate-300 transition-colors cursor-pointer">
            <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider">TENDENCIAS DOOH</span>
            <h4 className="font-extrabold text-sm text-slate-900 hover:underline">Cómo medir el OTS (Opportunity to See) con precisión móvil en vía pública</h4>
            <p className="text-slate-500 text-xs">Descubre cómo los datos de geolocalización celular permiten validar de forma estadística el flujo real frente a los monopostes...</p>
          </div>

          <div className="border border-slate-150 rounded-xl p-4 space-y-2 hover:border-slate-300 transition-colors cursor-pointer">
            <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider">TECNOLOGÍA</span>
            <h4 className="font-extrabold text-sm text-slate-900 hover:underline">Pantallas 3D anamórficas: El futuro del impacto visual urbano</h4>
            <p className="text-slate-500 text-xs">Un análisis técnico de cómo los gabinetes cóncavos engañan el ojo del observador peatonal para generar sensación de tridimensionalidad...</p>
          </div>
        </div>
      </div>
    </div>
  );
};