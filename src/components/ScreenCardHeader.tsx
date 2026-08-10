import React from "react";
import { MapPin, Maximize2 } from "lucide-react";
import { DoohScreen } from "../types";
import { getGalleryMedia } from "../utils/screenMedia";

interface ScreenCardHeaderProps {
  screen: DoohScreen;
  typeStyle: { dot: string };
  isReserved: boolean;
  availabilityMessage: string;
  onFocusOnMap?: () => void;
}

export const ScreenCardHeader = React.memo(({ screen, typeStyle, isReserved, availabilityMessage, onFocusOnMap }: ScreenCardHeaderProps) => {
  const handleFocusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocusOnMap?.();
  };

  const isMobile = screen.tipo === "LeadMóvil" || screen.tipo === "Móvil";
  const gallery = getGalleryMedia(screen);
  const heroMedia = gallery.find((asset) => asset.isHero) || gallery[0] || null;
  const heroVideo = gallery.find((asset) => asset.type === "video");

  return (
    <div className={`relative aspect-[1.5/1] bg-stone-900 flex items-center justify-center text-white overflow-hidden shrink-0 rounded-t-[19px] transition-all duration-300 ${isReserved ? "grayscale saturate-50 opacity-80" : ""}`}>
      {isReserved && (
        <div className="absolute top-12 left-3 z-20 bg-stone-900/90 backdrop-blur-xs text-white text-[9px] font-bold px-2.5 py-1 rounded-lg shadow-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
          🕒 {availabilityMessage}
        </div>
      )}
      {heroVideo ? (
        <video src={heroVideo.url} poster={heroMedia?.posterUrl || heroMedia?.url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-103" />
      ) : heroMedia ? (
        <img src={heroMedia.posterUrl || heroMedia.url} alt={screen.nombre} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-103" loading="lazy" referrerPolicy="no-referrer" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950 to-stone-800 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-103">
          <span className="text-3xl font-extrabold tracking-tight text-white/5 select-none uppercase">{screen.nombre.substring(0, 3).toUpperCase()}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-stone-950/15 group-hover:opacity-20 transition-opacity" />
      <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
        <span className="px-4 py-2 bg-white text-stone-900 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-all duration-200">
          <Maximize2 className="h-3 w-3 text-[#06434a]" />
          Ver Ficha Técnica
        </span>
      </div>
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-white/95 text-stone-800 border border-stone-200 shadow-xs">
        <span className={`h-1.5 w-1.5 rounded-full ${typeStyle.dot}`} />
        {screen.tipo}
      </div>
      {isMobile && <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-[8px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm">Recorrido</div>}
      {onFocusOnMap && !isMobile && (
        <button onClick={handleFocusClick} title="Ubicar en el mapa" className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-[#06434a] transition-colors shadow-sm border border-stone-200"><MapPin className="h-3.5 w-3.5" /></button>
      )}
    </div>
  );
});
