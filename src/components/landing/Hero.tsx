import React from "react";
import { motion } from "motion/react";
import { TrendingUp, MapPin, Sparkles, ChevronRight, Check } from "lucide-react";
import { DoohScreen } from "../../types";

interface HeroProps {
  screens: DoohScreen[];
  selectedCity: string;
  onCitySelect: (city: "Mendoza" | "Buenos Aires") => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  screens,
  selectedCity,
  onCitySelect,
  onExploreClick,
}) => {
  // Calculate stats dynamically for each plaza
  const getCityStats = (city: "Mendoza" | "Buenos Aires") => {
    const cityScreens = screens.filter((s) => s.ciudad === city);
    const fixed = cityScreens.filter((s) => s.categoria === "Pantallas LED" || s.categoria === "Tradicionales").length;
    const mobile = cityScreens.filter((s) => s.categoria === "LED Móvil").length;
    const totalImpacts = cityScreens.reduce((sum, s) => sum + s.impactos, 0);

    return {
      total: cityScreens.length,
      fixed,
      mobile,
      impacts: totalImpacts >= 1000 ? `${Math.round(totalImpacts / 1000)}k+` : totalImpacts,
    };
  };

  const mendozaStats = getCityStats("Mendoza");
  const buenosAiresStats = getCityStats("Buenos Aires");

  const plazarCards = [
    {
      id: "Mendoza" as const,
      name: "Mendoza",
      description: "Polo estratégico del Oeste Argentino",
      stats: mendozaStats,
      accent: "from-sky-500/10 to-[#06434a]/10",
      border: "hover:border-[#06434a]/30",
    },
    {
      id: "Buenos Aires" as const,
      name: "Buenos Aires",
      description: "Casco metropolitano de máxima exposición",
      stats: buenosAiresStats,
      accent: "from-amber-500/10 to-[#06434a]/10",
      border: "hover:border-[#06434a]/30",
    },
  ];

  return (
    <section id="hero-section" className="relative pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Copywriting B2B premium */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-[#06434a]/8 border border-[#06434a]/15 text-[10px] md:text-xs font-bold tracking-widest text-[#06434a] uppercase px-4 py-1.5 rounded-full">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Marketplace de Inventario Publicitario</span>
          </div>

          <h1 className="text-4xl md:text-6xl text-stone-900 tracking-tight leading-[1.08] font-display font-black">
            Conectá tu marca con <br />
            <span className="text-[#06434a]">audiencias reales</span> en la calle
          </h1>

          <p className="text-stone-500/90 text-sm md:text-base leading-relaxed max-w-2xl">
            Descubrí de forma interactiva nuestra red de pantallas LED de alta definición, 
            soportes estáticos premium y unidades de LED Móvil. Seleccioná ubicaciones estratégicas, 
            creá tu propio MediaKit y recibí una propuesta comercial a medida de tus objetivos.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto bg-[#06434a] hover:bg-[#0b5e67] text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full shadow-lg shadow-[#06434a]/10 hover:shadow-[#06434a]/20 transition-all text-center cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explorar Catálogo Completo</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Visual Mockup */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md aspect-[1.35/1] bg-[#111618] border border-stone-200/50 shadow-2xl rounded-2xl overflow-hidden relative group p-6 flex flex-col justify-between select-none">
            {/* Subtle tech grid */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:16px_24px]" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#06434a]/25 rounded-full blur-3xl" />

            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] uppercase font-bold text-emerald-400 font-mono">Disponibilidad en Tiempo Real</span>
              </div>
              <span className="text-[9px] bg-[#06434a]/30 text-emerald-300 font-mono px-2 py-0.5 rounded-md border border-[#06434a]/50">DOOH ACTIVE</span>
            </div>

            <div className="space-y-2.5 z-10">
              <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-widest block">GRUPO COMUNICARTE</span>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-tight font-display">
                Circuito de Pantallas Inteligentes
              </h3>
              <div className="h-0.5 w-12 bg-emerald-400 rounded-full" />
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4 z-10 text-xs">
              <div>
                <span className="block text-[8px] uppercase font-bold text-stone-400">Plazas Habilitadas</span>
                <span className="font-mono font-black text-white">Mendoza & BA</span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] uppercase font-bold text-stone-400">Total Soportes</span>
                <span className="font-mono font-black text-emerald-400">21 Unidades Activas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PLAZA SELECTOR CARD DECK - "Elegir Plaza es el Primer Paso" */}
      <div className="mt-20 md:mt-24 space-y-6">
        <div className="text-center md:text-left space-y-1">
          <span className="text-[10px] text-[#06434a] font-extrabold uppercase tracking-widest">Paso 1: ¿Dónde querés anunciar?</span>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight font-display">
            Seleccioná tu Plaza Comercial
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            La pauta exterior requiere anclaje geográfico. Elegí la plaza de interés para filtrar los soportes publicitarios correspondientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plazarCards.map((plaza) => {
            const isSelected = selectedCity === plaza.id;
            return (
              <div
                key={plaza.id}
                id={`plaza-card-${plaza.id.toLowerCase().replace(" ", "-")}`}
                onClick={() => onCitySelect(plaza.id)}
                className={`group relative p-6 bg-white border rounded-[20px] transition-all duration-300 cursor-pointer select-none ${
                  isSelected
                    ? "border-[#06434a] ring-2 ring-[#06434a]/8 shadow-md"
                    : "border-stone-200/80 hover:border-stone-300 hover:shadow-sm"
                }`}
              >
                {/* Visual Accent Corner Bubble */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${plaza.accent} rounded-bl-full opacity-60 pointer-events-none group-hover:scale-105 transition-transform`} />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${isSelected ? "bg-[#06434a]/10 text-[#06434a]" : "bg-stone-50 text-stone-500 group-hover:text-stone-800"}`}>
                        <MapPin className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-bold text-stone-900 font-display">
                        {plaza.name}
                      </h3>
                    </div>

                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#06434a] text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-400 font-medium">
                    {plaza.description}
                  </p>

                  {/* Dynamic stats list */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-100 text-center text-stone-700">
                    <div>
                      <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wide">Fijos</span>
                      <span className="text-xs font-bold font-mono">{plaza.stats.fixed}</span>
                    </div>
                    <div className="border-x border-stone-150">
                      <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wide">Móviles</span>
                      <span className="text-xs font-bold font-mono text-amber-600">{plaza.stats.mobile}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wide">Visitas/D</span>
                      <span className="text-xs font-bold font-mono text-[#06434a]">{plaza.stats.impacts}</span>
                    </div>
                  </div>

                  {/* Selected Indicator Bar */}
                  <div className="pt-2">
                    <span className={`text-[10px] font-black uppercase flex items-center gap-1 ${isSelected ? "text-[#06434a]" : "text-stone-400 group-hover:text-stone-700"}`}>
                      <span>{isSelected ? "Plaza Seleccionada" : "Seleccionar Plaza"}</span>
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
