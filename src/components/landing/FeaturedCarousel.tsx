import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles, Tv, ArrowRight, Eye } from "lucide-react";
import { DoohScreen } from "../../types";
import { ScreenCard } from "../ScreenCard";

interface FeaturedCarouselProps {
  screens: DoohScreen[];
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ screens }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter for highly premium screens (high impact or featured) to showcase
  const featuredScreens = useMemo(() => {
    // Select a beautiful variety of premium screens (e.g., screens with highest impacts or unique status)
    return screens
      .filter((s) => s.status === "Activo" || s.status === "Disponible")
      .slice(0, 6);
  }, [screens]);

  const maxIndex = Math.max(0, featuredScreens.length - 1);

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 6000); // 6 seconds auto-rotate
    return () => clearInterval(timer);
  }, [maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  if (featuredScreens.length === 0) return null;

  return (
    <section className="bg-stone-50 border-t border-stone-200/80 py-20 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Header content with premium design and typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#06434a]/5 border border-[#06434a]/10 text-[10px] font-bold tracking-widest text-[#06434a] uppercase px-3.5 py-1.5 rounded-full select-none">
              <Sparkles className="h-3.5 w-3.5 text-[#06434a] animate-pulse" />
              <span>SOPORTES DESTACADOS DE LA RED</span>
            </div>
            <h2 className="text-3xl md:text-4xl tracking-tight text-stone-900 font-display font-black leading-tight">
              Nuestra Red Premium <br />
              <span className="text-[#06434a]">de Alta Exposición Urbana</span>
            </h2>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-medium">
              Explorá una selección de nuestros soportes DOOH con mayor volumen de audiencia diaria. Hacé clic en cualquier tarjeta para ver su ficha técnica completa, métricas de visibilidad y disponibilidad en vivo.
            </p>
          </div>

          {/* Carousel controls with WCAG 2.2 AA touch targets and accessible labels */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <span className="text-xs font-mono font-bold text-stone-400 select-none mr-2">
              {currentIndex + 1} de {featuredScreens.length}
            </span>
            <button
              onClick={handlePrev}
              aria-label="Soporte anterior"
              className="h-11 w-11 rounded-full border border-stone-200 bg-white text-stone-700 hover:border-[#06434a] hover:text-[#06434a] hover:bg-stone-50 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-[#06434a] focus-visible:outline-none min-h-[44px] min-w-[44px]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Siguiente soporte"
              className="h-11 w-11 rounded-full border border-stone-200 bg-white text-stone-700 hover:border-[#06434a] hover:text-[#06434a] hover:bg-stone-50 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-[#06434a] focus-visible:outline-none min-h-[44px] min-w-[44px]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel slide viewport */}
        <div className="relative">
          <div 
            ref={containerRef}
            className="overflow-hidden px-1 py-4"
          >
            <motion.div
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
              className="flex gap-6 w-full cursor-grab active:cursor-grabbing"
              style={{ touchAction: "pan-y" }}
            >
              {featuredScreens.map((screen) => (
                <div
                  key={screen.id}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0"
                >
                  <ScreenCard screen={screen} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Pagination bar (dots with 44px touch targets) */}
          <div className="flex justify-center items-center gap-1 pt-4">
            {featuredScreens.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir al soporte ${idx + 1}`}
                className="h-11 w-11 flex items-center justify-center rounded-full transition-all focus-visible:ring-2 focus-visible:ring-[#06434a] focus-visible:outline-none focus:outline-none cursor-pointer"
              >
                <span className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? "w-8 bg-[#06434a]" 
                    : "w-2 bg-stone-300 hover:bg-stone-400"
                }`} />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
