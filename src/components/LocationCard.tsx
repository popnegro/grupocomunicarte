import React from "react";
import { MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui";

export interface LocationCardProps {
  id: string;
  name: string;
  zone: string;
  province: string;
  impacts: number;
  price: number;
  status: "Disponible" | "Pautado" | string;
  imageSrc?: string;
  type: string;
  onSelect?: () => void;
  onFocusOnMap?: () => void;
  isInCart?: boolean;
  onToggleCart?: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  id,
  name,
  zone,
  province,
  impacts,
  price,
  status,
  imageSrc,
  type,
  onSelect,
  onFocusOnMap,
  isInCart = false,
  onToggleCart,
}) => {
  // Format daily impacts nicely
  const formattedImpacts = impacts >= 1000 
    ? `${(impacts / 1000).toFixed(0)}k` 
    : impacts.toString();

  const isAvailable = status === "Disponible" || status === "Activo";

  // Location Badge element
  const locationBadge = (
    <div className="flex items-center gap-1.5 rounded-full border border-stone-200/60 bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-800 shadow-xs backdrop-blur-xs">
      <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-rose-500"}`} />
      <span>{type}</span>
    </div>
  );

  // Footer Actions element
  const footerActions = (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col">
        <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">
          Inversión Semanal
        </span>
        <span className="text-sm font-bold text-stone-900 font-display flex items-baseline gap-0.5">
          <span className="text-[#06434a] font-semibold">$</span>
          {price.toLocaleString("es-AR")}
          <span className="text-[10px] text-stone-400 font-normal">/sem</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        {onFocusOnMap && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFocusOnMap();
            }}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-[#06434a] transition-colors border border-stone-200/40 bg-white"
            title="Ubicar en mapa"
          >
            <MapPin className="h-3.5 w-3.5" />
          </button>
        )}
        
        {onToggleCart && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCart();
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
              isInCart
                ? "bg-stone-100 text-stone-800 border border-stone-200"
                : "bg-stone-950 hover:bg-[#06434a] text-white shadow-xs"
            }`}
          >
            {isInCart ? "Agregado" : "Añadir"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <Card onClick={onSelect} className="group">
      {imageSrc && (
        <div 
          className="relative overflow-hidden w-full select-none aspect-video rounded-t-xl"
          style={{ 
            backgroundImage: `url(${imageSrc})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
        >
          {/* Badge is absolutely positioned on top of the image */}
          <div className="absolute top-4 left-4 z-10">
            {locationBadge}
          </div>
        </div>
      )}

      <CardContent>
        {/* If no image, show badge here */}
        {!imageSrc && locationBadge} 

        <CardHeader className="border-b-0 pb-0">
          <h3 className="text-lg md:text-xl font-display font-semibold text-stone-950 leading-snug tracking-tight">
            {name}
          </h3> 
          <p className="text-xs md:text-sm text-stone-500 font-sans font-normal leading-relaxed flex items-center gap-1">
            <MapPin className="h-3 w-3 text-[#06434a]" />
            {zone}, {province}
          </p>
        </CardHeader>
        
        {/* Stat Block section */}
        <div className="pt-2 space-y-2">
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl md:text-4xl font-display font-bold text-stone-950 tracking-tight">
              {formattedImpacts}
            </span>
          </div>
          <div className="text-xs font-bold text-stone-400 uppercase tracking-widest font-sans">
            Impactos diarios est.
          </div>
        </div>

        {/* Existing children from BaseCard */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500 font-medium font-sans">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>Garantía de pauta 100% activa las 24 horas</span>
        </div>
      </CardContent>

      <CardFooter>
        {footerActions}
      </CardFooter>
    </Card>
  );
};
