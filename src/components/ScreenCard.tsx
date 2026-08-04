import React, { useState } from "react";
import { DoohScreen } from "../types";
import { useCms } from "./CmsContext";
import { motion } from "motion/react";
import {
  CatalogCard,
  CatalogCardContent,
  CatalogCardFooter,
  CatalogCardBadge,
  CatalogCardAction,
} from "@/src/components/ui/catalog-card";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import {
  Plus,
  Check,
  MapPin,
  Maximize2,
  Calendar,
  Cpu,
  Info,
  Layers,
  ArrowUpDown
} from "lucide-react";

interface ScreenCardProps {
  screen: DoohScreen;
  onFocusOnMap?: () => void;
  isComparing?: boolean;
  onCompareToggle?: () => void;
}

export const ScreenCard: React.FC<ScreenCardProps> = ({
  screen,
  onFocusOnMap,
  isComparing = false,
  onCompareToggle,
}) => {
  const { cart, toggleCart } = useCms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isInCart = cart.includes(screen.id);

  // Map categories and types to premium styles and default specs
  const typeStyles = {
    Peatonal: {
      bg: "bg-sky-50 border-sky-100 text-sky-700",
      dot: "bg-sky-500",
      res: "P2.5 High-Definition LED",
      size: "3.5m x 2.0m",
      brightness: "5,500 nits (Auto-Dimming)",
    },
    Vehicular: {
      bg: "bg-teal-50 border-teal-100 text-teal-700",
      dot: "bg-teal-500",
      res: "P4 Premium Outdoor Cabinets",
      size: "8.0m x 3.0m",
      brightness: "7,500 nits (Ultra High-Contrast)",
    },
    Mixto: {
      bg: "bg-purple-50 border-purple-100 text-purple-700",
      dot: "bg-purple-500",
      res: "P3.0 Professional Outdoor",
      size: "5.0m x 3.0m",
      brightness: "6,500 nits (Smart Energy-Saving)",
    },
    LeadMóvil: {
      bg: "bg-amber-50 border-amber-100 text-amber-700",
      dot: "bg-amber-500",
      res: "Formato Móvil (Linear Route)",
      size: "4.0m x 2.0m Doble Cara",
      brightness: "7,500 nits (Full Day Smart LED)",
    },
    Móvil: {
      bg: "bg-amber-50 border-amber-100 text-amber-700",
      dot: "bg-amber-500",
      res: "Formato Móvil (Linear Route)",
      size: "4.0m x 2.0m Doble Cara",
      brightness: "7,500 nits (Full Day Smart LED)",
    },
  }[screen.tipo] || {
    bg: "bg-stone-50 border-stone-100 text-stone-700",
    dot: "bg-stone-500",
    res: "P3 Professional LED",
    size: "4m x 3m",
    brightness: "5,500 nits",
  };

  const formattedImpacts =
    screen.impactos >= 1000
      ? (screen.impactos / 1000).toFixed(1) + "k"
      : String(screen.impactos);

  // Simulated availability for the next 6 months
  const months = ["Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", "Enero"];
  const getAvailabilityForMonth = (monthName: string, id: string) => {
    const sum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + monthName.length;
    const rem = sum % 3;
    if (rem === 0) return { label: "Disponible", color: "bg-emerald-50 text-emerald-700 border-emerald-150" };
    if (rem === 1) return { label: "Reservado", color: "bg-amber-50 text-amber-700 border-amber-150" };
    return { label: "Parcial", color: "bg-blue-50 text-blue-700 border-blue-150" };
  };

  return (
    <>
      <motion.div
        layout="position"
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -15 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 28,
          opacity: { duration: 0.25 }
        }}
        className="h-full"
      >
        <CatalogCard
          onClick={() => setIsModalOpen(true)}
          tabIndex={0}
          role="button"
          aria-haspopup="dialog"
          aria-label={`Soporte publicitario ${screen.nombre}, ubicado en ${screen.zona}, ${screen.ciudad || "Mendoza"}. Estado: ${screen.status === "Activo" || screen.status === "Disponible" ? "Disponible" : "Reservado"}. Impactos semanales estimadas: ${formattedImpacts}. Presioná Enter para ver ficha técnica detallada.`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsModalOpen(true);
            }
          }}
          className={`group relative flex flex-col h-full overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06434a] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
            isInCart
              ? "border-[#06434a] ring-1 ring-[#06434a]/10"
              : (screen.tipo === "LeadMóvil" || screen.tipo === "Móvil")
              ? "border-amber-400 hover:border-amber-500"
              : "border-stone-200/80 hover:border-stone-300"
          }`}
        >
          {/* Visual Header / Thumbnail */}
          <div className="relative aspect-1.5/1 bg-stone-900 flex items-center justify-center text-white overflow-hidden shrink-0 rounded-t-[19px]">
            {screen.video ? (
              <video
                src={screen.video}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-103"
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-stone-950 to-stone-800 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-103">
                <span className="text-3xl font-extrabold tracking-tight text-white/5 select-none uppercase">
                  {screen.nombre.substring(0, 3).toUpperCase()}
                </span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-stone-950/15 group-hover:opacity-20 transition-opacity" />

            {/* Ficha Técnica Indicator */}
            <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
              <span className="px-4 py-2 bg-white text-stone-900 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-all duration-200">
                <Maximize2 className="h-3.5 w-3.5 text-[#06434a]" />
                Ver Ficha Técnica
              </span>
            </div>

            {/* Type Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-white/95 text-stone-800 border border-stone-200 shadow-xs">
              <span className={`h-1.5 w-1.5 rounded-full ${typeStyles.dot}`} />
              {screen.tipo}
            </div>

            {/* Mobile Route Badge */}
            {(screen.tipo === "LeadMóvil" || screen.tipo === "Móvil") && (
              <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-[8px] font-extrabold tracking-widest uppercase px-2.5 py-1.5 rounded-full shadow-sm">
                Recorrido
              </div>
            )}

            {/* Locate on Map Button */}
            {onFocusOnMap && !(screen.tipo === "LeadMóvil" || screen.tipo === "Móvil") && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFocusOnMap();
                }}
                title="Ubicar en el mapa"
                aria-label={`Ubicar ${screen.nombre} en el mapa`}
                className="absolute bottom-3 right-3 z-10 h-11 w-11 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-[#06434a] transition-all shadow-sm border border-stone-200 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06434a] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <MapPin className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Card Body */}
          <CatalogCardContent className="p-5 pb-0 grow flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2.5">
                  <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-1 group-hover:text-[#06434a] transition-colors font-display">
                    {screen.nombre}
                  </h3>
                  <CatalogCardBadge 
                    className={`text-[8px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                      screen.status === "Activo" || screen.status === "Disponible"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-150 hover:bg-emerald-50"
                        : "bg-stone-50 text-stone-650 border border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    {screen.status === "Activo" || screen.status === "Disponible" ? "Disponible" : "Reservado"}
                  </CatalogCardBadge>
                </div>

                <div className="flex items-center gap-1.5 text-stone-650 text-xs">
                  <MapPin className="h-3.5 w-3.5 text-stone-500 shrink-0" />
                  <span className="truncate">{screen.zona}</span>
                </div>
                <div className="inline-flex w-fit items-center gap-1 rounded-full border border-stone-200 bg-stone-50/80 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-stone-600">
                  <Maximize2 className="h-3 w-3 text-[#06434a]" />
                  Ver ficha
                </div>
              </div>

              {/* Specs & Performance KPI Bento Box */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
                <div className="text-center">
                  <span className="block text-[8px] font-black text-stone-600 uppercase tracking-widest">
                    Audiencia / Día
                  </span>
                  <span className="block text-xs font-bold text-stone-900 font-display mt-0.5">
                    {formattedImpacts} visitas
                  </span>
                </div>
                <div className="text-center border-l border-stone-200/50">
                  <span className="block text-[8px] font-black text-stone-600 uppercase tracking-widest">
                    Dimensión
                  </span>
                  <span className="block text-xs font-bold text-stone-900 font-display mt-0.5">
                    {screen.dimensiones || typeStyles.size}
                  </span>
                </div>
              </div>

              {screen.cobertura && (
                <div className="text-[11px] text-stone-650 flex items-center gap-1.5 bg-stone-50/40 px-2.5 py-1.5 rounded-lg border border-stone-100">
                  <Layers className="h-3 w-3 text-stone-500" />
                  <span className="truncate font-medium">{screen.cobertura}</span>
                </div>
              )}
            </div>
          </CatalogCardContent>

          {/* Cart & Compare Action Footer */}
          <CatalogCardFooter 
            className="p-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3 mt-4"
            onClick={(e) => e.stopPropagation()} // Stop modal from opening when clicking controls
          >
            {/* Comparison Checkbox */}
            {onCompareToggle ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCompareToggle();
                }}
                aria-pressed={isComparing}
                aria-label={isComparing ? `Quitar ${screen.nombre} del comparador` : `Agregar ${screen.nombre} al comparador`}
                className={`flex items-center gap-2 h-11 px-3.5 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer min-w-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06434a] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  isComparing
                    ? "bg-[#06434a]/10 text-[#06434a] border-[#06434a]/20"
                    : "bg-white text-stone-700 border-stone-200 hover:text-stone-900 hover:border-stone-300"
                }`}
              >
                <div className={`h-4 w-4 rounded-md flex items-center justify-center border transition-all ${
                  isComparing 
                    ? "bg-[#06434a] border-[#06434a]" 
                    : "border-stone-300 bg-white"
                }`}>
                  {isComparing && <Check className="h-2 w-2 text-white stroke-[4px]" />}
                </div>
                <span>Comparar</span>
              </button>
            ) : (
              <div className="text-[9px] text-stone-600 font-black uppercase tracking-widest">
                COBERTURA PREMIUM
              </div>
            )}

            {/* MediaKit Action Button */}
            <CatalogCardAction
              onClick={() => toggleCart(screen.id)}
              variant={isInCart ? "outline" : "default"}
              aria-label={isInCart ? `Quitar ${screen.nombre} de la cotización` : `Agregar ${screen.nombre} a la cotización`}
              className={`text-[10px] font-black uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06434a] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                isInCart ? "bg-stone-100 text-stone-900 hover:bg-stone-200" : "bg-amber-500 text-stone-950 hover:bg-amber-600"
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3px]" />
                  <span>En cotización</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Cotizar</span>
                </>
              )}
            </CatalogCardAction>
          </CatalogCardFooter>
        </CatalogCard>
      </motion.div>


      {/* DETAILED INTERACTIVE MODAL (PRICE-FREE EDITION) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border border-stone-200 shadow-2xl rounded-3xl flex flex-col lg:grid lg:grid-cols-12 max-h-[92vh] gap-0">
          <DialogTitle className="sr-only">{screen.nombre}</DialogTitle>
          <DialogDescription className="sr-only">Detalles técnicos e información de cobertura del soporte {screen.nombre}</DialogDescription>

          {/* Left Column: Visual Media Player & Stats Overview */}
          <div className="lg:col-span-6 bg-stone-950 text-white flex flex-col justify-between relative overflow-hidden h-75 lg:h-auto min-h-75 lg:rounded-l-[23px]">
            {screen.video ? (
              <video
                src={screen.video}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-stone-950 via-stone-900 to-stone-850 flex flex-col items-center justify-center">
                <span className="text-4xl font-black tracking-widest text-white/5 select-none uppercase">
                  {screen.nombre.substring(0, 3)}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/20 to-stone-950/50 pointer-events-none" />

            {/* Screen Badge */}
            <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-white text-stone-900 px-3.5 py-1.5 rounded-full text-[9px] font-bold tracking-wider uppercase border border-stone-200">
              <span className={`h-2 w-2 rounded-full ${typeStyles.dot}`} />
              {screen.tipo}
            </div>

            {/* Title & Quick Insights */}
            <div className="mt-auto p-6 md:p-8 relative z-10 space-y-4">
              <div className="space-y-1">
                <span className="inline-block text-[8px] bg-white/10 border border-white/20 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                  ID: {screen.id.toUpperCase()}
                </span>
                <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight font-display">
                  {screen.nombre}
                </h2>
                <p className="text-stone-300 text-xs flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-500" /> {screen.zona}, {screen.ciudad || "Mendoza"}
                </p>
              </div>

              {/* Metrics Indicators (No Prices) */}
              <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-white/15">
                <div className="bg-stone-900/60 backdrop-blur-md p-2.5 rounded-xl border border-white/5 text-center">
                  <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">
                    Impactos Diarios
                  </span>
                  <span className="block text-sm font-bold text-white font-display mt-0.5">
                    {screen.impactos.toLocaleString("es-AR")}
                  </span>
                </div>
                <div className="bg-stone-900/60 backdrop-blur-md p-2.5 rounded-xl border border-white/5 text-center">
                  <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">
                    Audiencia Mensual
                  </span>
                  <span className="block text-sm font-bold text-white font-display mt-0.5">
                    {(screen.impactos * 30).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Specifications Detail */}
          <div className="lg:col-span-6 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] lg:max-h-full">
            <div className="space-y-5">
              {/* Reseña */}
              <div className="space-y-1.5">
                <span className="text-[8px] bg-stone-100 text-stone-600 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Reseña Técnica y Entorno
                </span>
                <p className="text-xs text-stone-600 leading-relaxed italic bg-stone-50 p-4 rounded-xl border border-stone-200/40">
                  "{screen.nota || "Ubicación estratégica de gran alcance. Ideal para captar el flujo peatonal y vehicular de mayor densidad en la zona."}"
                </p>
              </div>

              {/* Route stop list for LED Móvil */}
              {(screen.tipo === "LeadMóvil" || screen.tipo === "Móvil") && screen.ruta && screen.ruta.length > 0 && (
                <div className="space-y-3 bg-amber-50/40 border border-amber-200/60 p-4 rounded-xl">
                  <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-amber-200/40 pb-1.5 font-display">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    Recorrido Estratégico y Horarios
                  </h3>
                  {screen.horarios && (
                    <div className="text-xs text-stone-600 font-bold mb-2">
                      Horario operativo: <span className="text-amber-700">{screen.horarios}</span>
                    </div>
                  )}
                  <div className="relative border-l-2 border-dashed border-amber-300 pl-4 ml-2 space-y-3 pt-1">
                    {screen.ruta.map((stop, idx) => (
                      <div key={idx} className="relative text-xs">
                        <span className="absolute -left-5.25 top-0.5 flex h-2 w-2 items-center justify-center rounded-full bg-amber-500" />
                        <div>
                          <span className="font-semibold text-stone-800 block leading-none">{stop.nombre}</span>
                          <span className="text-[9px] text-stone-400">Punto de alta afluencia {idx === 0 ? "de salida" : idx === screen.ruta!.length - 1 ? "de retorno" : ""}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical specs */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-1.5 font-display">
                  <Cpu className="h-4 w-4 text-[#06434a]" />
                  Especificaciones Técnicas
                </h3>

                <div className="grid grid-cols-2 gap-3.5 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Hardware / Resolución</span>
                    <span className="font-semibold text-stone-800 block">{screen.refreshRate ? "UHD Outdoor Screen" : typeStyles.res}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Dimensiones Físicas</span>
                    <span className="font-semibold text-stone-800 block">{screen.dimensiones || typeStyles.size}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Pico de Brillo</span>
                    <span className="font-semibold text-stone-800 block">{screen.brillo || typeStyles.brightness}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Tasa de Refresco</span>
                    <span className="font-semibold text-stone-800 block">{screen.refreshRate || "3,840 Hz (Flicker-Free)"}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Soporte Multimedia</span>
                    <span className="font-semibold text-stone-800 block">{screen.formato || "MP4, JPG, PNG"}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Frecuencia de Loop</span>
                    <span className="font-semibold text-stone-800 block">Spot de 15s en rotación constante</span>
                  </div>
                </div>
              </div>

              {/* Calendar list */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-1.5 font-display">
                  <Calendar className="h-4 w-4 text-[#06434a]" />
                  Ciclos de Pauta y Reservas
                </h3>
                <div className="grid grid-cols-6 gap-1.5 pt-1">
                  {months.map((month) => {
                    const status = getAvailabilityForMonth(month, screen.id);
                    return (
                      <div
                        key={month}
                        className={`border rounded-lg p-1.5 text-center flex flex-col justify-between gap-1 min-h-11 ${status.color}`}
                      >
                        <span className="text-[8px] font-bold uppercase tracking-wider opacity-85 block">
                          {month.substring(0, 3)}
                        </span>
                        <span className="text-[7px] font-black uppercase leading-none block">
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-5 border-t border-stone-150 mt-6 flex items-center justify-between gap-4">
              <div className="text-stone-500 text-[10px] uppercase font-bold leading-tight">
                <span className="block font-black text-[#06434a]">Cotización rápida</span>
                Sin compromiso y con disponibilidad real
              </div>

              <div className="flex items-center gap-2">
                {onFocusOnMap && (
                  <button
                    onClick={() => {
                      onFocusOnMap();
                      setIsModalOpen(false);
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-full transition-all cursor-pointer flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06434a] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <MapPin className="h-3.5 w-3.5 text-stone-400" />
                    <span>Ubicar</span>
                  </button>
                )}

                <button
                  onClick={() => toggleCart(screen.id)}
                  aria-label={isInCart ? `Quitar ${screen.nombre} de la cotización` : `Agregar ${screen.nombre} a la cotización`}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06434a] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    isInCart
                      ? "bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200"
                      : "bg-stone-950 hover:bg-[#06434a] text-white"
                  }`}
                >
                  {isInCart ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>En cotización</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Solicitar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
