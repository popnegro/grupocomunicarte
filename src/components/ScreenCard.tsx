import React, { useState } from "react";
import { DoohScreen } from "../types";
import { useCms } from "./CmsContext";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import {
  Zap,
  Shield,
  Sparkles,
  Plus,
  Check,
  MapPin,
  Eye,
  DollarSign,
  X,
  Calendar,
  Clock,
  Cpu,
  Layers,
  Activity,
  Maximize2,
  Info,
  Sliders,
  ChevronRight
} from "lucide-react";

interface ScreenCardProps {
  screen: DoohScreen;
  onFocusOnMap?: () => void;
}

export const ScreenCard: React.FC<ScreenCardProps> = ({ screen, onFocusOnMap }) => {
  const { cart, toggleCart, weeks } = useCms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isInCart = cart.includes(screen.id);

  // Map types to premium styles and badges
  const typeStyles = {
    Peatonal: {
      bg: "bg-sky-50 border-sky-100 text-sky-700 dark:bg-sky-950/20 dark:border-sky-900/30 dark:text-sky-300",
      dot: "bg-sky-500",
      res: "P2.5 High-Definition LED",
      size: "2.4m x 1.8m (4.32m²)",
      brightness: "4,500 nits (Sensor Auto-Dimming)",
    },
    Vehicular: {
      bg: "bg-teal-50 border-teal-100 text-teal-700 dark:bg-teal-950/20 dark:border-teal-900/30 dark:text-teal-300",
      dot: "bg-teal-500",
      res: "P4 Premium Outdoor Cabinets",
      size: "6.0m x 3.0m (18.0m²)",
      brightness: "7,500 nits (Ultra High-Contrast)",
    },
    Mixto: {
      bg: "bg-purple-50 border-purple-100 text-purple-700 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-300",
      dot: "bg-purple-500",
      res: "P3.0 Professional Outdoor",
      size: "4.0m x 3.0m (12.0m²)",
      brightness: "6,000 nits (Smart Energy-Saving)",
    },
    LeadMóvil: {
      bg: "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-300",
      dot: "bg-amber-500",
      res: "Formato Móvil (Linear Route)",
      size: "Pantalla Móvil Premium 4.8m x 2.4m",
      brightness: "6,500 nits (Full Day-Visible Smart LED)",
    },
    Móvil: {
      bg: "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-300",
      dot: "bg-amber-500",
      res: "Formato Móvil (Linear Route)",
      size: "Pantalla Móvil Premium 4.8m x 2.4m",
      brightness: "6,500 nits (Full Day-Visible Smart LED)",
    },
  }[screen.tipo] || {
    bg: "bg-slate-50 border-slate-100 text-slate-700",
    dot: "bg-slate-500",
    res: "P3 Professional LED",
    size: "4m x 3m",
    brightness: "5,500 nits",
  };

  const formattedImpacts =
    screen.impactos >= 1000
      ? (screen.impactos / 1000).toFixed(1) + "k"
      : String(screen.impactos);

  const cpmValue = Math.round((screen.precio / screen.impactos) * (1000 / 7));

  // Simulated availability for the next 6 months based on ID hash
  const months = ["Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", "Enero"];
  const getAvailabilityForMonth = (monthName: string, id: string) => {
    // Generate a simple deterministic status based on character codes
    const sum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + monthName.length;
    const rem = sum % 3;
    if (rem === 0) return { label: "Disponible", color: "bg-emerald-50 text-emerald-700 border-emerald-150" };
    if (rem === 1) return { label: "Reservado", color: "bg-amber-50 text-amber-700 border-amber-150" };
    return { label: "Parcialmente Reservado", color: "bg-blue-50 text-blue-700 border-blue-150" };
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="h-full"
      >
        <Card
          className={`group relative flex flex-col h-full bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
            isInCart
              ? "border-slate-900 ring-2 ring-slate-900/5"
              : (screen.tipo === "LeadMóvil" || screen.tipo === "Móvil")
              ? "border-amber-400 hover:border-amber-500 ring-2 ring-amber-500/5 bg-amber-50/10"
              : "border-slate-200 hover:border-slate-350"
          }`}
        >
          {/* Visual Header / Thumbnail */}
          <div className="relative h-32 bg-slate-900 flex items-center justify-center text-white overflow-hidden shrink-0">
            {screen.video ? (
              <video
                src={screen.video}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 to-slate-800 flex items-center justify-center">
                <span className="text-3xl font-black tracking-tight text-white/20 select-none">
                  {screen.nombre.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Zoom Overlay on Hover */}
            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
              <span className="px-3 py-1.5 bg-white/90 text-slate-900 rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 transform scale-90 group-hover:scale-100 transition-transform">
                <Maximize2 className="h-3.5 w-3.5" />
                Ver Ficha Técnica
              </span>
            </div>

            {/* Type Badge on Image */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm border bg-white text-slate-800 border-slate-100">
              <span className={`h-1.5 w-1.5 rounded-full ${typeStyles.dot}`} />
              {screen.tipo}
            </div>

            {/* Exclusive LeadMóvil badge */}
            {(screen.tipo === "LeadMóvil" || screen.tipo === "Móvil") && (
              <div className="absolute top-3 right-12 z-10 bg-amber-500 text-slate-950 text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded shadow-md">
                EXCLUSIVO
              </div>
            )}

            {/* Focus on map option */}
            {onFocusOnMap && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFocusOnMap();
                }}
                title="Ubicar en el mapa"
                className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 transition-colors shadow-sm"
              >
                <MapPin className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-4 pb-0 flex-grow flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-bold text-slate-900 leading-tight line-clamp-1 group-hover:text-slate-950 transition-colors">
                  {screen.nombre}
                </h3>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider ${
                  screen.status === "Activo" || screen.status === "Disponible" || screen.status === "disponible"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-150"
                    : "bg-rose-50 text-rose-700 border border-rose-150"
                }`}>
                  {screen.status === "Activo" || screen.status === "Disponible" || screen.status === "disponible" ? "Disponible" : "No disponible"}
                </span>
              </div>

              <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{screen.zona}</span>
              </div>

              {/* Specs / KPIs */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg text-center">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Impactos/Día
                  </span>
                  <span className="block text-xs font-bold text-slate-800">
                    {formattedImpacts}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg text-center">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    CPM Estimado
                  </span>
                  <span className="block text-xs font-bold text-slate-800">
                    ${cpmValue}
                  </span>
                </div>
              </div>

              {screen.nota && (
                <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-md border border-slate-100/50 mb-3 line-clamp-2">
                  "{screen.nota}"
                </p>
              )}
            </div>
          </CardContent>

          {/* Pricing & Cart Action */}
          <CardFooter className="p-4 pt-3 border-t border-slate-100/80 flex items-center justify-between gap-3">
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Precio Semanal
              </span>
              <span className="text-sm font-black text-slate-950">
                {screen.precio === 0 ? (
                  <span className="text-blue-600 text-xs font-extrabold uppercase bg-blue-50 border border-blue-150 px-1.5 py-0.5 rounded">Consultar</span>
                ) : (
                  <>
                    ${screen.precio.toLocaleString("es-AR")}
                    <span className="text-[10px] text-slate-400 font-normal">/sem</span>
                  </>
                )}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCart(screen.id);
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                isInCart
                  ? "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200"
                  : "bg-slate-950 hover:bg-slate-800 text-white shadow-sm"
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>En Cotizador</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Agregar</span>
                </>
              )}
            </button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* DETAILED INTERACTIVE MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border border-slate-200 shadow-2xl rounded-2xl flex flex-col lg:grid lg:grid-cols-12 max-h-[90vh] gap-0">
          <DialogTitle className="sr-only">{screen.nombre}</DialogTitle>
          <DialogDescription className="sr-only">Detalles técnicos e información del soporte publicitario {screen.nombre}</DialogDescription>

          {/* Left Column: Visual Media Player & Stats Overview */}
          <div className="lg:col-span-6 bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden h-[300px] lg:h-auto min-h-[300px]">
                {/* Visual Backdrop Player */}
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
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black tracking-widest text-white/10 select-none uppercase">
                      {screen.nombre.substring(0, 3)}
                    </span>
                  </div>
                )}

                {/* Gradient shade on player top and bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 pointer-events-none" />

                {/* Screen Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/95 text-slate-900 px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase shadow-lg">
                  <span className={`h-2 w-2 rounded-full ${typeStyles.dot}`} />
                  {screen.tipo}
                </div>

                {/* Overlaid Title & Quick Insights */}
                <div className="mt-auto p-6 relative z-10 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-slate-800/80 border border-slate-700 text-slate-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      ID: {screen.id.toUpperCase()}
                    </span>
                    <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight">
                      {screen.nombre}
                    </h2>
                    <p className="text-slate-300 text-xs flex items-center gap-1 font-semibold">
                      <MapPin className="h-3 w-3 text-emerald-400" /> {screen.zona}, Mendoza
                    </p>
                  </div>

                  {/* Core Metrics Indicators */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                    <div className="bg-slate-900/60 backdrop-blur-md p-2 rounded-lg border border-slate-800">
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        Imp. Semanales
                      </span>
                      <span className="block text-sm font-black text-white">
                        {(screen.impactos * 7).toLocaleString("es-AR")}
                      </span>
                    </div>
                    <div className="bg-slate-900/60 backdrop-blur-md p-2 rounded-lg border border-slate-800">
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        CPM ARS
                      </span>
                      <span className="block text-sm font-black text-white">
                        ${cpmValue}
                      </span>
                    </div>
                    <div className="bg-slate-900/60 backdrop-blur-md p-2 rounded-lg border border-slate-800">
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        Impacto Diario
                      </span>
                      <span className="block text-sm font-black text-white">
                        {formattedImpacts}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Tabs & Specifications Detail */}
              <div className="lg:col-span-6 p-6 flex flex-col justify-between overflow-y-auto max-h-[60vh] lg:max-h-full">
                <div className="space-y-6">
                  {/* Header / Editorial review */}
                  <div className="space-y-2">
                    <span className="text-[9px] bg-slate-100 text-slate-600 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Reseña de Ubicación
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-150">
                      "{screen.nota || "Ubicación comercial de alto impacto con visibilidad garantizada las 24 horas. Ideal para campañas masivas o de marca que buscan alta penetración local."}"
                    </p>
                  </div>

                  {/* LeadMóvil Route stops list */}
                  {(screen.tipo === "LeadMóvil" || screen.tipo === "Móvil") && screen.ruta && screen.ruta.length > 0 && (
                    <div className="space-y-3 bg-amber-50/50 border border-amber-100 p-4 rounded-xl shadow-xs">
                      <h3 className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-amber-150 pb-1.5">
                        <MapPin className="h-4 w-4 text-amber-600 animate-bounce" />
                        Recorrido Lineal y Paradas ({screen.ruta.length})
                      </h3>
                      <div className="relative border-l-2 border-dashed border-amber-300 pl-4 ml-2 space-y-3.5 pt-1.5">
                        {screen.ruta.map((stop, idx) => (
                          <div key={idx} className="relative text-xs">
                            <span className="absolute -left-[21px] top-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-amber-500 ring-4 ring-amber-50" />
                            <div className="space-y-0.5">
                              <span className="text-[9px] text-amber-600 font-bold uppercase tracking-wider">
                                Parada {idx + 1} {idx === 0 ? "(Inicio)" : idx === screen.ruta!.length - 1 ? "(Fin)" : ""}
                              </span>
                              <span className="font-semibold text-slate-800 block">{stop.nombre}</span>
                              <span className="font-mono text-[9px] text-slate-500">{stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Specifications Section */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                      <Cpu className="h-4 w-4 text-slate-800" />
                      Ficha Técnica Avanzada
                    </h3>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold block">Modelo LED / Resolución</span>
                        <span className="font-semibold text-slate-800 block">{typeStyles.res}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold block">Tamaño Físico</span>
                        <span className="font-semibold text-slate-800 block">{typeStyles.size}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold block">Brillo Máximo</span>
                        <span className="font-semibold text-slate-800 block">{typeStyles.brightness}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold block">Tasa de Refresco</span>
                        <span className="font-semibold text-slate-800 block">3,840 Hz (Flicker-Free)</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold block">Formatos Aceptados</span>
                        <span className="font-semibold text-slate-800 block">MP4, JPG, PNG (16:9)</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold block">Frecuencia Loop</span>
                        <span className="font-semibold text-slate-800 block">Spot de 15s / Loop de 120s</span>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Availability Calendar */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                      <Calendar className="h-4 w-4 text-slate-800" />
                      Historial y Disponibilidad
                    </h3>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Cronograma de reservas estimadas para los próximos meses del ciclo de pauta actual:
                    </p>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {months.map((month) => {
                        const status = getAvailabilityForMonth(month, screen.id);
                        return (
                          <div
                            key={month}
                            className={`border rounded-lg p-2 text-center flex flex-col justify-between gap-1.5 min-h-[56px] ${status.color}`}
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                              {month.substring(0, 3)}
                            </span>
                            <span className="text-[8px] font-black leading-tight block uppercase">
                              {status.label.split(" ")[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Pricing Panel & Dynamic Interaction CTA */}
                <div className="pt-6 border-t border-slate-100 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
                      Inversión Recomendada
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-950">
                        {screen.precio === 0 ? (
                          <span className="text-blue-600 font-extrabold text-base bg-blue-50 border border-blue-150 px-2 py-0.5 rounded uppercase">Consultar</span>
                        ) : (
                          `$${(screen.precio * weeks).toLocaleString("es-AR")}`
                        )}
                      </span>
                      {screen.precio > 0 && (
                        <span className="text-xs text-slate-500 font-semibold">
                          ({weeks} {weeks === 1 ? "semana" : "semanas"})
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {screen.precio === 0 ? "Precio comercial a convenir" : `Tarifa base: $${screen.precio.toLocaleString("es-AR")} ARS / semana`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {onFocusOnMap && (
                      <button
                        onClick={() => {
                          onFocusOnMap();
                          setIsModalOpen(false);
                        }}
                        className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Ubicar</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        toggleCart(screen.id);
                      }}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md ${
                        isInCart
                          ? "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200"
                          : "bg-slate-950 hover:bg-slate-850 text-white"
                      }`}
                    >
                      {isInCart ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Remover de Cotización</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          <span>Añadir a Cotización</span>
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
