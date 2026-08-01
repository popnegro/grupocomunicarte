import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Layers, 
  DollarSign, 
  Download, 
  ArrowUpRight,
  TrendingDown,
  Building
} from "lucide-react";

export const ReportsModule: React.FC = () => {
  
  // Custom styled SVG Line Chart data (Revenue forecast curve)
  // Weeks of Q3 projection
  const revenueTrendData = [450, 520, 490, 610, 680, 750];
  const months = ["Feb", "Mar", "Abr", "May", "Jun", "Jul"];

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            Informes Corporativos
          </span>
          <h2 className="text-xl font-bold text-stone-950 font-display mt-2">
            Métricas de Conversión & Rendimiento Comercial
          </h2>
        </div>

        <button className="bg-white hover:bg-stone-50 text-stone-700 text-[10px] font-bold py-2 px-4 rounded-xl border border-stone-200 shadow-2xs flex items-center gap-1.5 cursor-pointer">
          <Download className="h-3.5 w-3.5 text-[#06434a]" />
          <span>Exportar Informe Ejecutivo</span>
        </button>
      </div>

      {/* Hero numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1 */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-2">
          <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Facturación Total Q2</span>
          <span className="text-2xl font-black text-stone-900 font-mono block">$6,450,000 <span className="text-xs font-bold text-stone-400">ARS</span></span>
          <div className="flex items-center gap-1 text-[9px] text-emerald-650 font-bold">
            <TrendingUp className="h-3 w-3" />
            <span>+14.2% vs Q1</span>
          </div>
        </div>

        {/* 2 */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-2">
          <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Coste por Mil (CPM) Medio</span>
          <span className="text-2xl font-black text-stone-900 font-mono block">$1,420 <span className="text-xs font-bold text-stone-400">ARS</span></span>
          <span className="block text-[9px] text-stone-400 font-semibold">Eficiencia publicitaria óptima</span>
        </div>

        {/* 3 */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-2">
          <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Impresiones Mensuales Entregadas</span>
          <span className="text-2xl font-black text-stone-900 font-mono block">1.8M <span className="text-xs font-bold text-stone-400">Vistas</span></span>
          <div className="flex items-center gap-1 text-[9px] text-emerald-650 font-bold">
            <TrendingUp className="h-3 w-3" />
            <span>+8% respecto al mes anterior</span>
          </div>
        </div>

        {/* 4 */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-2">
          <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Ocupación Media de LED</span>
          <span className="text-2xl font-black text-[#06434a] font-mono block">88.4%</span>
          <span className="block text-[9px] text-stone-400 font-semibold">92% de saturación en Mendoza Centro</span>
        </div>

      </div>

      {/* Visual Bezier Trend Chart (Custom premium React SVG path drawing) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SVG Bezier Line Chart */}
        <div className="lg:col-span-8 bg-white border border-stone-200 rounded-[32px] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono">
              Evolución de Ingresos y Tendencia Comercial
            </h4>
            <span className="text-[10px] text-stone-400 font-bold">Expresado en Miles de ARS</span>
          </div>

          {/* Render beautiful custom scalable responsive SVG line chart */}
          <div className="h-64 w-full bg-stone-50/50 rounded-lg p-4 border border-stone-100 flex flex-col justify-between relative">
            <div className="flex-1 w-full relative">
              <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
                {/* Horizontal guide grids */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />

                {/* Main Smooth Bezier curve path */}
                {/* Points: Feb: (0, 160) -> Mar: (100, 130) -> Apr: (200, 140) -> May: (300, 90) -> Jun: (400, 60) -> Jul: (500, 30) */}
                <path
                  d="M 10 160 C 80 140, 120 130, 180 135 C 240 140, 280 80, 350 85 C 420 90, 460 30, 490 25"
                  fill="none"
                  stroke="#06434a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Glowing area under path */}
                <path
                  d="M 10 160 C 80 140, 120 130, 180 135 C 240 140, 280 80, 350 85 C 420 90, 460 30, 490 25 L 490 200 L 10 200 Z"
                  fill="url(#chart-glow)"
                  opacity="0.15"
                />

                <defs>
                  <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06434a" />
                    <stop offset="100%" stopColor="#fafaf9" />
                  </linearGradient>
                </defs>

                {/* Point indicators */}
                <circle cx="10" cy="160" r="4.5" fill="#06434a" stroke="#fafaf9" strokeWidth="2" />
                <circle cx="180" cy="135" r="4.5" fill="#06434a" stroke="#fafaf9" strokeWidth="2" />
                <circle cx="350" cy="85" r="4.5" fill="#06434a" stroke="#fafaf9" strokeWidth="2" />
                <circle cx="490" cy="25" r="4.5" fill="#06434a" stroke="#fafaf9" strokeWidth="2" />
              </svg>
            </div>

            {/* Labels under graph */}
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-stone-400 px-2 pt-2 border-t border-stone-100">
              {months.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Regional performance breakdown metrics */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-[32px] p-6 shadow-2xs space-y-4 text-left">
          <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono">
            Rendimiento por Canal
          </h4>

          <div className="space-y-4">
            {/* 1 */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600 font-bold">
                <span>Pantallas LED Urbanas</span>
                <span className="font-mono text-stone-900">$4,250,000 ARS</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#06434a] h-full rounded-full" style={{ width: "72%" }} />
              </div>
            </div>

            {/* 2 */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600 font-bold">
                <span>Unidades LED Móviles</span>
                <span className="font-mono text-stone-900">$1,480,000 ARS</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: "48%" }} />
              </div>
            </div>

            {/* 3 */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600 font-bold">
                <span>Soportes Tradicionales Fijos</span>
                <span className="font-mono text-stone-900">$720,000 ARS</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-stone-500 h-full rounded-full" style={{ width: "24%" }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#06434a]/5 border border-[#06434a]/10 rounded-lg text-stone-700 space-y-1">
            <span className="text-[8px] font-extrabold text-[#06434a] uppercase tracking-widest">Resumen Analítico</span>
            <p className="text-[10px] text-[#06434a] leading-relaxed">
              Las pantallas LED fijas representan el <strong className="font-bold">65.8% del volumen de facturación</strong>. El LED Móvil registra el mayor ritmo de crecimiento intermensual (+18%).
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
