import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { DoohScreen } from "../../types";
import { optimizeImageUrl } from "@/src/lib/imageUtils";
import { useCms } from "../CmsContext";
import { getScreenAvailability, getDynamicReservationEndDate } from "../../utils/availability";

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

// Dynamically generate location-specific benefits based on metadata (Feature 3)
const getScreenLocationBenefits = (screen: DoohScreen) => {
  const benefits: { label: string; icon: string; description: string }[] = [];

  // 1. Pedestrian and Vehicle Traffic
  if (screen.tipo === "Peatonal") {
    benefits.push({
      label: "Alto Flujo Peatonal",
      icon: "Users",
      description: "Zona comercial de alta densidad con tránsito peatonal continuo e intenso."
    });
  } else if (screen.tipo === "Vehicular") {
    benefits.push({
      label: "Alto Impacto Vehicular",
      icon: "Car",
      description: "Avenida de velocidad controlada con flujo constante y gran alcance de visualización."
    });
  } else if (screen.tipo === "Mixto") {
    benefits.push({
      label: "Impacto Sinérgico Mixto",
      icon: "Layers",
      description: "Excelente visibilidad y alcance estratégico para conductores y peatones."
    });
  }

  const nameLower = screen.nombre.toLowerCase();
  const zoneLower = screen.zona.toLowerCase();

  // 2. Specific landmark highlights
  if (nameLower.includes("palmares") || zoneLower.includes("palmares")) {
    benefits.push({
      label: "Centro Comercial Palmares",
      icon: "ShoppingBag",
      description: "Ubicación estratégica junto al principal polo de consumo premium y retail."
    });
    benefits.push({
      label: "Cafeterías y Gastronomía",
      icon: "Coffee",
      description: "Rodeado de reconocidas cadenas gastronómicas, cafés de especialidad y cines."
    });
  } else if (nameLower.includes("sarmiento") || nameLower.includes("9 de julio") || zoneLower.includes("centro")) {
    benefits.push({
      label: "Centro Comercial & Bancario",
      icon: "Coins",
      description: "Cercanía inmediata a bancos principales, oficinas corporativas y administrativas."
    });
    benefits.push({
      label: "Transporte Público Próximo",
      icon: "Bus",
      description: "Conexión directa con paradas de autobuses metropolitanos de alta frecuencia."
    });
  } else if (nameLower.includes("arístides") || zoneLower.includes("arístides") || nameLower.includes("mitre")) {
    benefits.push({
      label: "Polo Gastronómico y Nocturno",
      icon: "Utensils",
      description: "Área de gran afluencia de público los 7 días de la semana por restaurantes y bares."
    });
    benefits.push({
      label: "Esquina Semafórica",
      icon: "Timer",
      description: "Dwell Time prolongado que garantiza una lectura completa del spot publicitario."
    });
  } else {
    if (screen.tipo === "LeadMóvil" || screen.tipo === "Móvil") {
      benefits.push({
        label: "Cobertura Itinerante",
        icon: "Truck",
        description: "Recorrido dinámico por los principales centros comerciales y avenidas neurálgicas."
      });
    } else {
      benefits.push({
        label: "Área Comercial Activa",
        icon: "TrendingUp",
        description: "Zona comercial con actividad económica consolidada y tránsito continuo."
      });
    }
  }

  if (nameLower.includes("parque") || nameLower.includes("universidad") || zoneLower.includes("universitaria")) {
    benefits.push({
      label: "Zona Universitaria",
      icon: "GraduationCap",
      description: "Paso obligado de estudiantes, docentes y profesionales universitarios de la región."
    });
  }

  return benefits;
};

export const SpecsOverlay: React.FC<SpecsOverlayProps> = ({
  screen,
  onClose,
  isInCart,
  toggleCart,
}) => {
  const { occupancyMatrix } = useCms();
  const availability = getScreenAvailability(screen, occupancyMatrix);
  const isReserved = availability.status === "reserved";
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const photos = STREET_PHOTOS_MAP[screen.id] || DEFAULT_STREET_PHOTOS;
  const locationBenefits = getScreenLocationBenefits(screen);

  // Availability weeks loaded directly from the single source of truth (Feature 4)
  const weeks = ["Semana 1 (Ago)", "Semana 2 (Ago)", "Semana 3 (Ago)", "Semana 4 (Ago)"];
  const screenWeeks = occupancyMatrix[screen.id] || ["available", "available", "available", "available"];

  const getWeekStyles = (status: string) => {
    switch (status) {
      case "campaign":
        return { label: "Campaña Activa", styles: "bg-teal-50 border-teal-200 text-teal-800" };
      case "reserved":
        return { label: "Reservado", styles: "bg-blue-50 border-blue-200 text-blue-800" };
      case "maintenance":
        return { label: "Bloqueado", styles: "bg-amber-50 border-amber-200 text-amber-800 font-bold" };
      default:
        return { label: "Disponible", styles: "bg-emerald-50 border-emerald-200 text-emerald-800" };
    }
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return <IconComponent className="h-5 w-5 text-[#06434a] shrink-0" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 select-none bg-[#161d16]/55 backdrop-blur-sm">
      {/* Backdrop Click */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl bg-[#f3fcef] rounded-2xl border border-[#bccbb9] shadow-2xl overflow-y-auto md:overflow-hidden z-10 flex flex-col md:grid md:grid-cols-12 max-h-[92vh] md:max-h-[85vh] font-sans"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 border border-[#bccbb9] text-[#3d4a3d] hover:text-[#006e2f] hover:bg-white shadow-sm transition-all cursor-pointer"
        >
          <LucideIcons.X className="h-4 w-4" />
        </button>

        {/* Column 1: Image Gallery (Span 5) */}
        <div className="md:col-span-5 bg-[#161d16] flex flex-col justify-between relative h-64 md:h-auto min-h-75">
          
          {isPlayingVideo ? (
            <div className="absolute inset-0 bg-stone-900 flex flex-col justify-between p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_1px)] bg-size-[4px_4px] opacity-25 pointer-events-none" />
              <div className="absolute inset-0 bg-linear-to-tr from-[#06434a] via-[#111] to-[#125e67] opacity-60 mix-blend-color-dodge animate-pulse duration-1000" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[8px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-xs uppercase tracking-widest flex items-center gap-1 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  Spot Simulado
                </span>
                <button 
                  onClick={() => setIsPlayingVideo(false)}
                  className="text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-1.5 rounded-full text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <LucideIcons.Image className="h-3 w-3" />
                  <span>Ver Foto</span>
                </button>
              </div>

              <div className="relative z-10 my-auto text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="space-y-2"
                >
                  <span className="text-stone-300 text-[10px] tracking-widest font-mono font-bold block uppercase">TU MARCA EN PANTALLA</span>
                  <h2 className="text-2xl font-black text-amber-400 uppercase tracking-tight leading-none drop-shadow-md">
                    ALTO IMPACTO <br/>
                    <span className="text-white text-xl font-serif italic font-medium">VISUAL 24/7</span>
                  </h2>
                </motion.div>
                
                <div className="inline-block bg-black/55 px-3 py-1 rounded-md border border-white/10">
                  <p className="text-[8.5px] font-mono text-stone-300 font-bold">
                    Pauta: Spot de 15s en rotación constante
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-stone-400 text-[8px] font-mono">
                <span>REPRODUCCIÓN DIGITAL</span>
                <span className="animate-pulse text-emerald-400 font-bold">● ONLINE</span>
              </div>
            </div>
          ) : (
            <>
              {/* Main Photo */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={optimizeImageUrl(photos[activePhotoIdx])}
                  alt={`${screen.nombre} vista de calle`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-90 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
              </div>

              {/* Play Simulation Button Overlay */}
              <button
                type="button"
                onClick={() => setIsPlayingVideo(true)}
                className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-[#06434a]/95 hover:bg-[#06434a] text-white text-[9px] font-black uppercase rounded-full flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-105"
              >
                <LucideIcons.Play className="h-3 w-3 text-amber-400 fill-amber-400" />
                Simular Video LED
              </button>
            </>
          )}

          {/* Top category label */}
          <div className="relative p-4 flex justify-between items-center z-10">
            <span className="text-[9px] bg-amber-500 text-stone-950 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              {screen.categoria}
            </span>
            {screen.ciudad && (
              <span className="text-[10px] text-white/95 font-bold flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-md">
                <LucideIcons.MapPin className="h-3 w-3 text-amber-500" />
                {screen.ciudad}
              </span>
            )}
          </div>

          {/* Bottom title inside the photo area */}
          {!isPlayingVideo && (
            <div className="relative p-6 text-left z-10 space-y-1 mt-auto">
              <h3 className="text-lg font-serif font-black text-white leading-tight">
                {screen.nombre}
              </h3>
              {screen.zona && (
                <p className="text-white/85 text-[11px] font-semibold flex items-center gap-1.5">
                  <LucideIcons.Navigation className="h-3.5 w-3.5 text-amber-400 rotate-45" />
                  <span>Zona: {screen.zona}</span>
                </p>
              )}
            </div>
          )}

          {/* Thumbnail dots selector */}
          {!isPlayingVideo && photos.length > 1 && (
            <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Ver foto ${idx + 1}`}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`h-2 w-2 rounded-full transition-all cursor-pointer ${
                    activePhotoIdx === idx ? "bg-amber-400 w-4" : "bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Specs & Benefits (Span 7) */}
        <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-6 text-left max-h-[50vh] md:max-h-full">
          
          <div className="space-y-6">
            {/* Status & Alerts Area */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/60 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="block text-[8px] font-black text-stone-400 uppercase tracking-widest font-mono">ESTADO DE DISPONIBILIDAD</span>
                <span className={`inline-flex items-center px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full border ${availability.badgeStyle}`}>
                  {availability.badgeLabel}
                </span>
              </div>
              {isReserved && (
                <div className="text-[10px] text-stone-600 font-medium leading-tight max-w-60 border-l-2 border-amber-300 pl-3.5 py-0.5">
                  <span className="block font-black text-amber-800 uppercase text-[8px] tracking-wider mb-0.5">Soporte Reservado</span>
                  {availability.toastMessage}
                </div>
              )}
            </div>

            {/* Header Specifications Grid - Feature 6 (No Placeholders) */}
            <div className="space-y-3">
              <span className="block text-[9px] font-black text-stone-400 uppercase tracking-widest font-mono">Ficha Técnica Oficial</span>
              
              <div className="grid grid-cols-2 gap-3.5">
                {screen.dimensiones && (
                  <div className="bg-white p-3 border border-stone-200/60 rounded-xl space-y-1">
                    <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider block">Dimensiones</span>
                    <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                      <LucideIcons.Maximize className="h-3.5 w-3.5 text-[#06434a] shrink-0" />
                      {screen.dimensiones}
                    </span>
                  </div>
                )}

                {screen.tipo && (
                  <div className="bg-white p-3 border border-stone-200/60 rounded-xl space-y-1">
                    <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider block">Tipo de Tránsito</span>
                    <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                      <LucideIcons.Eye className="h-3.5 w-3.5 text-[#06434a] shrink-0" />
                      {screen.tipo} {screen.cobertura ? `· ${screen.cobertura}` : ""}
                    </span>
                  </div>
                )}

                {screen.brillo && (
                  <div className="bg-white p-3 border border-stone-200/60 rounded-xl space-y-1">
                    <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider block">Brillo / Tecnología</span>
                    <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                      <LucideIcons.Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      {screen.brillo}
                    </span>
                  </div>
                )}

                {screen.formato && (
                  <div className="bg-white p-3 border border-stone-200/60 rounded-xl space-y-1">
                    <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider block">Formatos Admitidos</span>
                    <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                      <LucideIcons.FileCode className="h-3.5 w-3.5 text-[#06434a] shrink-0" />
                      {screen.formato}
                    </span>
                  </div>
                )}
              </div>

              {screen.nota && (
                <div className="bg-stone-50 p-4 border border-stone-200 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-[#06434a] uppercase tracking-wider flex items-center gap-1 font-mono">
                    <LucideIcons.BookOpen className="h-3.5 w-3.5 shrink-0" />
                    <span>Descripción del Entorno</span>
                  </span>
                  <p className="text-xs text-stone-600 font-medium leading-relaxed">
                    {screen.nota}
                  </p>
                </div>
              )}
            </div>

            {/* Feature 3: Location Benefits ("Beneficios de la ubicación") */}
            {locationBenefits.length > 0 && (
              <div className="space-y-3">
                <span className="block text-[9px] font-black text-stone-400 uppercase tracking-widest font-mono">Auditoría Geográfica</span>
                <h4 className="text-xs font-black text-stone-800 border-b border-stone-150 pb-1 flex items-center gap-1.5">
                  <LucideIcons.Compass className="h-4 w-4 text-[#06434a]" />
                  Beneficios de la Ubicación
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {locationBenefits.map((benefit, i) => (
                    <div key={i} className="flex gap-3 bg-white p-3 border border-stone-200/60 rounded-xl shadow-2xs">
                      <div className="h-9 w-9 rounded-lg bg-stone-50 border border-stone-150 flex items-center justify-center shrink-0">
                        {renderIcon(benefit.icon)}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-stone-900 block leading-tight">{benefit.label}</span>
                        <p className="text-[10px] text-stone-500 font-medium leading-normal">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feature 4: Availability Calendar (Synchronized from the Dashboard) */}
            <div className="space-y-3">
              <span className="block text-[9px] font-black text-stone-400 uppercase tracking-widest font-mono">Estado de Reserva Real</span>
              <h4 className="text-xs font-black text-stone-800 border-b border-stone-150 pb-1 flex items-center gap-1.5">
                <LucideIcons.CalendarRange className="h-4 w-4 text-[#06434a]" />
                Disponibilidad y Ciclos (Agosto)
              </h4>

              <div className="grid grid-cols-4 gap-2">
                {weeks.map((week, idx) => {
                  let status = screenWeeks[idx] || "available";
                  if (isReserved) {
                    const endDateStr = getDynamicReservationEndDate(screen, occupancyMatrix);
                    const weekEnds = [
                      new Date("2026-08-07"),
                      new Date("2026-08-14"),
                      new Date("2026-08-21"),
                      new Date("2026-08-31"),
                    ];
                    const endDate = new Date(endDateStr);
                    const weekStart = idx === 0 ? new Date("2026-08-01") : weekEnds[idx - 1];
                    if (endDate >= weekStart) {
                      status = "reserved";
                    }
                  } else if (availability.status === "upcoming" && idx === 0) {
                    status = "maintenance";
                  }

                  let statusLabel = "Disponible";
                  let statusColor = "bg-emerald-50 border-emerald-200 text-emerald-800";
                  if (status === "campaign") {
                    statusLabel = "Campaña Activa";
                    statusColor = "bg-teal-50 border-teal-200 text-teal-800";
                  } else if (status === "reserved") {
                    statusLabel = "Reservado";
                    statusColor = "bg-stone-50 border-stone-200 text-stone-600";
                  } else if (status === "maintenance") {
                    statusLabel = "Próximamente";
                    statusColor = "bg-amber-50 border-amber-200 text-amber-800 font-bold";
                  }

                  return (
                    <div
                      key={week}
                      className={`border rounded-xl p-2.5 text-center flex flex-col justify-between gap-1.5 min-h-14 shadow-2xs ${statusColor}`}
                    >
                      <span className="text-[8px] font-extrabold uppercase tracking-widest opacity-85 block">
                        Semana {idx + 1}
                      </span>
                      <span className="text-[9px] font-black uppercase leading-none block">
                        {statusLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer - Feature 1 Support (Encourages quoting if price is 0) */}
          <div className="pt-4 border-t border-[#bccbb9] flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-wider">Inversión Estimada</span>
              <span className="text-sm font-black text-[#006e2f] font-sans uppercase tracking-wide">
                {screen.precio === 0 ? "Consultar" : `${screen.precio.toLocaleString()} / Semana`}
              </span>
            </div>

            <button
              type="button"
              disabled={isReserved && !isInCart}
              onClick={(e) => {
                e.stopPropagation();
                if (isReserved && !isInCart) return;
                toggleCart();
              }}
              className={`px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isInCart
                  ? "bg-stone-200 hover:bg-stone-300 text-stone-700 border border-stone-300"
                  : isReserved
                  ? "bg-stone-100 text-stone-500 border border-stone-200 cursor-not-allowed"
                  : "bg-[#006e2f] hover:bg-[#005321] text-white shadow-md hover:shadow-lg hover:scale-102"
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
                  <span>{isReserved ? "Consultar disponibilidad" : availability.ctaLabel}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};