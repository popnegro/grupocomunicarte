import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { DoohScreen } from "../../types";
import { useCartStore } from "../../stores/cartStore";
import { useCms } from "../CmsContext";
import { Info, MapPin, Plus, Check } from "lucide-react";
import { TechnicalSpecs } from "./TechnicalSpecs";
import { LocationBenefits } from "./LocationBenefits";
import { AvailabilityTimeline } from "./AvailabilityTimeline";
import { MobileRoute } from "./MobileRoute";
import { TYPE_STYLES } from "../../constants/screencard";

interface ScreenDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  screen: DoohScreen;
  availability: { status: string; toastMessage: string; ctaLabel: string };
  locationBenefits: { label: string; icon: string; description: string }[];
  onFocusOnMap?: () => void;
}

export const ScreenDetailDialog = ({ isOpen, onOpenChange, screen, availability, locationBenefits, onFocusOnMap }: ScreenDetailDialogProps) => {
  const { cart, toggleCart } = useCartStore();
  const { occupancyMatrix } = useCms();
  const isInCart = cart.includes(screen.id);
  const isReserved = availability.status === "reserved";
  const typeStyle = TYPE_STYLES[screen.tipo] || TYPE_STYLES.default;

  const handleFocusClick = () => {
    onFocusOnMap?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border border-stone-200 shadow-2xl rounded-3xl flex flex-col lg:grid lg:grid-cols-12 max-h-[92vh] gap-0">
        <DialogTitle className="sr-only">{screen.nombre}</DialogTitle>
        <DialogDescription className="sr-only">Detalles técnicos e información de cobertura del soporte {screen.nombre}</DialogDescription>

        {/* Left Column: Visual Media Player & Stats Overview */}
        <div className="lg:col-span-6 bg-stone-950 text-white flex flex-col justify-between relative overflow-hidden h-75 lg:h-auto min-h-75 lg:rounded-l-[23px]">
          {screen.video ? (
            <video src={screen.video} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-90" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 flex flex-col items-center justify-center">
              <span className="text-4xl font-black tracking-widest text-white/5 select-none uppercase">{screen.nombre.substring(0, 3)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/20 to-stone-950/50 pointer-events-none" />
          <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-white text-stone-900 px-3.5 py-1.5 rounded-full text-[9px] font-bold tracking-wider uppercase border border-stone-200">
            <span className={`h-2 w-2 rounded-full ${typeStyle.dot}`} />
            {screen.tipo}
          </div>
          <div className="mt-auto p-6 md:p-8 relative z-10 space-y-4">
            <div className="space-y-1">
              <span className="inline-block text-[8px] bg-white/10 border border-white/20 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">ID: {screen.id.toUpperCase()}</span>
              <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight font-display">{screen.nombre}</h2>
              <p className="text-stone-300 text-xs flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-amber-500" /> {screen.zona}, {screen.ciudad || "Mendoza"}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-white/15">
              <div className="bg-stone-900/60 backdrop-blur-md p-2.5 rounded-xl border border-white/5 text-center">
                <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">Impactos Diarios</span>
                <span className="block text-sm font-bold text-white font-display mt-0.5">{screen.impactos.toLocaleString("es-AR")}</span>
              </div>
              <div className="bg-stone-900/60 backdrop-blur-md p-2.5 rounded-xl border border-white/5 text-center">
                <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">Audiencia Mensual</span>
                <span className="block text-sm font-bold text-white font-display mt-0.5">{(screen.impactos * 30).toLocaleString("es-AR")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications Detail */}
        <div className="lg:col-span-6 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] lg:max-h-full">
          <div className="space-y-5">
            {isReserved && (
              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3.5 flex items-start gap-2.5 text-stone-750 animate-in fade-in duration-200">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-left">
                  <span className="font-extrabold uppercase text-[8.5px] tracking-wider text-amber-800 block">Soporte Reservado</span>
                  <p className="text-[10px] text-stone-600 font-medium leading-normal">{availability.toastMessage}</p>
                </div>
              </div>
            )}
            {screen.nota && (
              <div className="space-y-1">
                <span className="text-[8px] bg-stone-150 border border-stone-200 text-stone-600 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">Reseña Técnica y Entorno</span>
                <p className="text-xs text-stone-600 leading-relaxed italic bg-stone-50 p-4 rounded-xl border border-stone-200/40">"{screen.nota}"</p>
              </div>
            )}
            <MobileRoute screen={screen} />
            <TechnicalSpecs screen={screen} />
            <LocationBenefits benefits={locationBenefits} />
            <AvailabilityTimeline screen={screen} occupancyMatrix={occupancyMatrix} isReserved={isReserved} />
          </div>

          <div className="pt-5 border-t border-stone-100 mt-6 flex items-center justify-between gap-4">
            <div className="text-stone-500 text-[10px] uppercase font-bold leading-tight">
              <span className="block font-black text-[#06434a]">Comercialización Directa</span>Sujeto a disponibilidad del ciclo
            </div>
            <div className="flex items-center gap-2">
              {onFocusOnMap && <button onClick={handleFocusClick} className="px-3.5 py-2 text-xs font-bold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-full transition-all cursor-pointer flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-stone-400" /><span>Ubicar</span></button>}
              <button onClick={() => toggleCart(screen.id)} className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm ${isInCart ? "bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200" : isReserved ? "bg-stone-800 hover:bg-stone-900 text-white" : "bg-[#06434a] hover:bg-[#0b5e67] text-white"}`}>
                {isInCart ? <><Check className="h-4 w-4 text-emerald-600" /><span>Quitar</span></> : <><Plus className="h-4 w-4" /><span>{availability.ctaLabel}</span></>}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
