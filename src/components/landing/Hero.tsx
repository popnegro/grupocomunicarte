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
      accent: "bg-stone-50",
      border: "hover:border-stone-400 hover:bg-stone-50/55",
    },
    {
      id: "Buenos Aires" as const,
      name: "Buenos Aires",
      description: "Casco metropolitano de máxima exposición",
      stats: buenosAiresStats,
      accent: "bg-stone-50",
      border: "hover:border-stone-400 hover:bg-stone-50/55",
    },
  ];

  return (
    <section id="hero-section" className="relative pt-16 pb-28 md:pt-24 md:pb-36 max-w-7xl mx-auto px-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Copywriting B2B premium */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 bg-[#06434a]/5 border border-[#06434a]/12 text-[10px] md:text-xs font-bold tracking-wider text-[#06434a] uppercase px-4 py-1.5 rounded-full select-none">
            <TrendingUp className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Red de Soportes Urbanos de Alta Gama</span>
          </div>

          <h1 className="text-4xl md:text-[56px] text-stone-900 tracking-tight leading-[1.05] font-serif font-black">
            Planificá y auditá tu <br />
            pauta <span className="text-[#06434a] italic">OOH de alta gama.</span>
          </h1>

          <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-xl font-medium">
            Accedé en tiempo real a nuestra red exclusiva de pantallas LED de gran formato, dispositivos tradicionales geolocalizados y unidades de LED Móvil. Seleccioná ubicaciones de alto tránsito, personalizá tu MediaKit y recibí métricas certificadas de audiencia urbana.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto bg-[#06434a] hover:bg-[#0b5e67] text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-xs transition-all text-center cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explorar Catálogo Activo</span>
              <ChevronRight className="h-4 w-4 stroke-[2.5]" />
            </button>
            <a
              href="#contacto"
              className="w-full sm:w-auto text-center border border-stone-200 bg-white hover:bg-stone-50 text-stone-850 font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Agendar Asesoría</span>
            </a>
          </div>

          {/* Trusted By Section */}
          <div className="pt-8 border-t border-stone-200/60 space-y-3">
            <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">MARCAS QUE ANUNCIAN CON NOSOTROS</span>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-stone-400 font-mono text-[11px] font-black tracking-tighter opacity-80">
              <span className="hover:text-stone-900 transition-colors cursor-default">TOYOTA AR</span>
              <span className="hover:text-stone-900 transition-colors cursor-default">COCA-COLA CO</span>
              <span className="hover:text-stone-900 transition-colors cursor-default">STARBUCKS</span>
              <span className="hover:text-stone-900 transition-colors cursor-default">PATAGONIA S.A.</span>
              <span className="hover:text-stone-900 transition-colors cursor-default">MERCADOLIBRE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Visual Mockup / DOOH Command Widget */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-stone-50 border border-stone-200 shadow-2xs rounded-xl overflow-hidden relative group p-6 flex flex-col justify-between select-none space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-stone-200/50 border border-stone-300 px-2.5 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-[#06434a] animate-pulse" />
                <span className="text-[9px] uppercase font-extrabold text-stone-700 tracking-wider font-mono">NOC LIVE OPS</span>
              </div>
              <span className="text-[9px] bg-white text-stone-500 font-mono font-extrabold px-2 py-1 rounded border border-stone-200 uppercase">Mendoza & BA</span>
            </div>

            {/* Simulated Live Analytics Bar */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="block text-[9px] uppercase font-bold text-stone-400 tracking-widest font-mono">Frecuencia de Loop</span>
                <div className="flex items-baseline gap-1.5 text-left">
                  <span className="text-3xl font-serif font-black text-stone-900 tracking-tight">15s</span>
                  <span className="text-xs text-stone-500 font-semibold">Spot certificado</span>
                </div>
              </div>

              {/* Progress visual list of screens running */}
              <div className="space-y-2.5 bg-white p-4 rounded-lg border border-stone-200 text-left text-xs">
                <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">
                  <span>Soporte en Ejecución</span>
                  <span className="text-[#06434a] font-extrabold">Rotando</span>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-stone-850 font-extrabold text-[11px]">
                    <span className="truncate">Palmares Open Mall UHD</span>
                    <span className="font-mono text-stone-400 text-[10px]">98% Brillo</span>
                  </div>
                  <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#06434a] h-full rounded-full w-4/5 animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 text-[10px] text-stone-500 border-t border-stone-100">
                  <span>Impactos Hoy</span>
                  <strong className="font-mono text-stone-900 font-black">+145,280</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-xs font-bold text-stone-700">
              <div className="text-left">
                <span className="block text-[8px] uppercase font-bold text-stone-400 tracking-wider font-mono">Uptime Certificado</span>
                <span className="font-mono font-extrabold text-stone-900">99.92%</span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] uppercase font-bold text-stone-400 tracking-wider font-mono">Ubicaciones Premium</span>
                <span className="font-mono font-extrabold text-[#06434a]">17 Activas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PLAZA SELECTOR CARD DECK - "Elegir Plaza es el Primer Paso" */}
      <div className="mt-24 md:mt-28 space-y-6">
        <div className="text-center md:text-left space-y-1">
          <span className="text-[10px] text-[#06434a] font-extrabold uppercase tracking-widest font-mono">Paso 1: ¿Dónde querés anunciar?</span>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight font-display">
            Seleccioná tu Plaza Comercial
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            La pauta exterior requiere anclaje geográfico. Elegí la plaza de interés para filtrar los soportes publicitarios correspondientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {plazarCards.map((plaza) => {
            const isSelected = selectedCity === plaza.id;
            return (
              <div
                key={plaza.id}
                id={`plaza-card-${plaza.id.toLowerCase().replace(" ", "-")}`}
                onClick={() => onCitySelect(plaza.id)}
                className={`group relative p-6 bg-white border rounded-xl transition-all duration-300 cursor-pointer select-none ${
                  isSelected
                    ? "border-[#06434a] bg-stone-50/10 shadow-2xs"
                    : "border-stone-200 hover:border-stone-350 hover:bg-stone-50/10"
                }`}
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-[#06434a]/10 text-[#06434a]" : "bg-stone-50 text-stone-500 group-hover:text-stone-800"}`}>
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

                  <p className="text-xs text-stone-500 font-medium text-left">
                    {plaza.description}
                  </p>

                  {/* Dynamic stats list */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-150 text-center text-stone-700">
                    <div>
                      <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wide font-mono">Fijos</span>
                      <span className="text-xs font-bold font-mono">{plaza.stats.fixed}</span>
                    </div>
                    <div className="border-x border-stone-200">
                      <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wide font-mono">Móviles</span>
                      <span className="text-xs font-bold font-mono text-amber-600">{plaza.stats.mobile}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wide font-mono">Visitas/D</span>
                      <span className="text-xs font-bold font-mono text-[#06434a]">{plaza.stats.impacts}</span>
                    </div>
                  </div>

                  {/* Selected Indicator Bar */}
                  <div className="pt-2 text-left">
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
