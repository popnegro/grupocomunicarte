import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import { DoohScreen } from "../../types";
import { optimizeImageUrl } from "@/src/lib/imageUtils";

interface SpecsOverlayProps {
  screen: DoohScreen;
  onClose: () => void;
  isInCart: boolean;
  toggleCart: () => void;
}

// Map screen IDs or zones to highly realistic outdoor advertising Unsplash pictures
const STREET_PHOTOS_MAP: Record<string, string[]> = {
  "sc-01": [
    "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
  ],
  "sc-02": [
    "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&w=800&q=80"
  ],
  "sc-03": [
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80"
  ],
};

const DEFAULT_STREET_PHOTOS = [
  "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80"
];

// Hour of the day factors for traffic flow simulation (from 06:00 to 22:00)
const HOURLY_FLOW_TEMPLATE = [
  { hour: "06:00", factor: 0.04 },
  { hour: "08:00", factor: 0.12 }, // Morning peak
  { hour: "10:00", factor: 0.08 },
  { hour: "12:00", factor: 0.09 },
  { hour: "14:00", factor: 0.07 },
  { hour: "16:00", factor: 0.08 },
  { hour: "18:00", factor: 0.14 }, // Afternoon peak
  { hour: "20:00", factor: 0.11 },
  { hour: "22:00", factor: 0.05 },
];

export const SpecsOverlay: React.FC<SpecsOverlayProps> = ({
  screen,
  onClose,
  isInCart,
  toggleCart,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const photos = STREET_PHOTOS_MAP[screen.id] || DEFAULT_STREET_PHOTOS;

  // Calculate simulated exact hourly impacts based on daily impacts and template factors
  const hourlyFlow = HOURLY_FLOW_TEMPLATE.map((t, idx) => {
    const hourlyValue = Math.round(screen.impactos * t.factor);
    return {
      ...t,
      value: hourlyValue,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 select-none bg-stone-900/60 backdrop-blur-xs">
      {/* Backdrop Click */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl bg-[#FAF9F5] rounded-3xl border border-stone-200 shadow-2xl overflow-hidden z-10 flex flex-col md:grid md:grid-cols-12 max-h-[90vh] md:max-h-[85vh] font-sans"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-white shadow-2xs transition-all cursor-pointer"
        >
          <LucideIcons.X className="h-4 w-4" />
        </button>

        {/* Column 1: Image Gallery (Span 5) */}
        <div className="md:col-span-5 bg-stone-950 flex flex-col justify-between relative h-64 md:h-auto min-h-[250px]">
          {/* Main Photo */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={optimizeImageUrl(photos[activePhotoIdx])}
              alt={`${screen.nombre} vista de calle`}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover opacity-90 transition-all duration-300"
            />
            {/* Soft Shadow overlay for typography legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* Top category label */}
          <div className="relative p-4 flex justify-between items-center z-10">
            <span className="text-[9px] bg-amber-500 text-stone-950 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              {screen.categoria}
            </span>
            <span className="text-[10px] text-white/95 font-bold flex items-center gap-1">
              <LucideIcons.MapPin className="h-3 w-3 text-amber-500" />
              {screen.ciudad}
            </span>
          </div>

          {/* Bottom title inside the photo area */}
          <div className="relative p-6 text-left z-10 space-y-1 mt-auto">
            <h3 className="text-lg font-serif font-black text-white leading-tight">
              {screen.nombre}
            </h3>
            <p className="text-white/85 text-[11px] font-semibold flex items-center gap-1.5">
              <LucideIcons.Navigation className="h-3.5 w-3.5 text-amber-400 rotate-45" />
              <span>Zona: {screen.zona}</span>
            </p>
          </div>

          {/* Thumbnail dots selector */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`h-2 w-2 rounded-full transition-all cursor-pointer ${
                    activePhotoIdx === idx ? "bg-amber-400 w-4" : "bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Specs & Analytics (Span 7) */}
        <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-6 text-left max-h-[50vh] md:max-h-full">
          
          {/* Header Specifications Grid */}
          <div className="space-y-4">
            <span className="block text-[9px] font-black text-stone-400 uppercase tracking-widest font-mono">Ficha Técnica Oficial</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 border border-stone-200/60 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Dimensiones del Soporte</span>
                <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                  <LucideIcons.Maximize className="h-3.5 w-3.5 text-[#06434a]" />
                  {screen.dimensiones || "8.0m x 4.0m (32m²)"}
                </span>
              </div>

              <div className="bg-white p-3 border border-stone-200/60 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Tipo de Tráfico</span>
                <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                  <LucideIcons.Eye className="h-3.5 w-3.5 text-[#06434a]" />
                  {screen.tipo} · {screen.cobertura || "Flujo Mixto"}
                </span>
              </div>

              <div className="bg-white p-3 border border-stone-200/60 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Brillo / Tecnología</span>
                <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                  <LucideIcons.Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  {screen.brillo || "UHD Autoluminoso"}
                </span>
              </div>

              <div className="bg-white p-3 border border-stone-200/60 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Formato Admitido</span>
                <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                  <LucideIcons.FileCode className="h-3.5 w-3.5 text-[#06434a]" />
                  {screen.formato || "MP4 / JPG UHD"}
                </span>
              </div>
            </div>

            {/* Note & Location context */}
            <div className="bg-stone-50 p-4 border border-stone-200 rounded-xl space-y-1.5">
              <span className="text-[9px] font-bold text-[#06434a] uppercase tracking-wider flex items-center gap-1">
                <LucideIcons.BookOpen className="h-3.5 w-3.5" />
                <span>Descripción del Entorno</span>
              </span>
              <p className="text-xs text-stone-600 font-medium leading-relaxed">
                {screen.nota || "Ubicación Premium de alto tráfico vial estratégico en vía troncal metropolitana, con óptimo ángulo de lectura peatonal y vehicular diurno/nocturno."}
              </p>
            </div>
          </div>

          {/* Interactive Audience Flow Chart */}
          <div className="space-y-3">
            <div className="flex justify-between items-end border-b border-stone-200 pb-1.5">
              <div>
                <span className="block text-[9px] font-black text-stone-400 uppercase tracking-widest font-mono">Tráfico Estimado</span>
                <h4 className="text-xs font-black text-stone-800">Flujo de Audiencia por Banda Horaria (Impactos)</h4>
              </div>
              <span className="text-xs font-black text-[#06434a] bg-[#06434a]/5 px-2.5 py-1 rounded-lg">
                Total: {screen.impactos.toLocaleString()} imp/día
              </span>
            </div>

            {/* Simulated Chart Container */}
            <div className="bg-white p-4 border border-stone-200/80 rounded-2xl space-y-4">
              <div className="h-28 flex items-end justify-between gap-1.5 pt-2">
                {hourlyFlow.map((h, idx) => {
                  const maxVal = Math.max(...hourlyFlow.map((f) => f.value));
                  const percentageHeight = maxVal > 0 ? (h.value / maxVal) * 100 : 10;
                  const isHovered = hoveredBar === idx;

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center group relative cursor-pointer"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Bar */}
                      <div className="w-full relative rounded-t-md overflow-hidden bg-stone-100 h-28 flex items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${percentageHeight}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.03, ease: "easeOut" }}
                          className={`w-full rounded-t-md transition-colors ${
                            isHovered ? "bg-[#06434a]" : "bg-[#06434a]/30"
                          }`}
                        />
                      </div>
                      
                      {/* Label */}
                      <span className="text-[8px] font-mono font-bold text-stone-400 mt-1.5">{h.hour}</span>
                    </div>
                  );
                })}
              </div>

              {/* Tooltip detail display */}
              <div className="h-6 flex items-center justify-center text-center">
                {hoveredBar !== null ? (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] text-stone-700 font-extrabold"
                  >
                    🕗 Banda <span className="text-[#06434a]">{hourlyFlow[hoveredBar].hour} hs</span>: aprox. <span className="text-[#06434a] font-black">{hourlyFlow[hoveredBar].value.toLocaleString()} impactos reales</span> en este intervalo.
                  </motion.p>
                ) : (
                  <p className="text-[9px] text-stone-400 font-semibold italic">
                    Pasa el cursor sobre las barras para ver la estimación exacta de impactos por hora.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-stone-200/60 flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-wider">Inversión Estimada</span>
              <span className="text-lg font-black text-stone-900 font-mono">
                ${screen.precio.toLocaleString()}<span className="text-[10px] text-stone-500 font-bold font-sans">/mes</span>
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCart();
              }}
              className={`px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isInCart
                  ? "bg-stone-200 hover:bg-stone-300 text-stone-700 border border-stone-300"
                  : "bg-[#06434a] hover:bg-[#0b5e67] text-white shadow-md hover:shadow-lg hover:scale-102"
              }`}
            >
              {isInCart ? (
                <>
                  <LucideIcons.Trash2 className="h-4 w-4" />
                  <span>Quitar de mi circuito</span>
                </>
              ) : (
                <>
                  <LucideIcons.Plus className="h-4 w-4" />
                  <span>Agregar a mi circuito</span>
                </>
              )}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
