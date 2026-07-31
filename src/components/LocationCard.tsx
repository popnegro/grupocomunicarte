import React from "react";
import { MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardFooter } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

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

  return (
    <Card
      onClick={onSelect}
      className={`group relative flex flex-col h-full bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
        isInCart
          ? "border-[#06434a] ring-1 ring-[#06434a]/10"
          : "border-stone-200/80 hover:border-stone-300"
      }`}
    >
      {/* Image / Visual Header */}
      <div className="relative aspect-[1.5/1] bg-stone-900 flex items-center justify-center text-white overflow-hidden shrink-0 rounded-t-xl">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-103"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-950 to-stone-800 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-103">
            <span className="text-3xl font-extrabold tracking-tight text-white/5 select-none uppercase">
              {name.substring(0, 3).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-stone-950/15 group-hover:opacity-20 transition-opacity" />

        {/* Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge
            variant="outline"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/95 text-stone-800 border border-stone-200/60 shadow-xs backdrop-blur-xs`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-rose-500"}`} />
            <span>{type}</span>
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-5 pb-0 flex-grow flex flex-col justify-between">
        <div className="space-y-3.5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-1 group-hover:text-[#06434a] transition-colors font-display">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 text-stone-500 text-xs">
              <MapPin className="h-3.5 w-3.5 text-[#C47D50] shrink-0" />
              <span className="truncate">{zone}, {province}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
            <div className="text-center">
              <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">
                Impactos diarios est.
              </span>
              <span className="block text-xs font-bold text-stone-800 font-display">
                {formattedImpacts}
              </span>
            </div>
            <div className="text-center border-l border-stone-200/50">
              <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">
                Inversión Semanal
              </span>
              <span className="block text-xs font-bold text-stone-800 font-display">
                ${price.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          {/* Children content from BaseCard */}
          <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500 font-medium font-sans">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Garantía de pauta 100% activa las 24 horas</span>
          </div>
        </div>
      </CardContent>

      {/* Footer Actions */}
      <CardFooter
        className="p-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3 mt-4"
        onClick={(e) => e.stopPropagation()} // Stop modal from opening when clicking controls
      >
        <div className="flex items-center gap-2">
          {onFocusOnMap && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFocusOnMap();
              }}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-[#C47D50] transition-colors border border-stone-200/40 bg-white"
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
                  : "bg-stone-950 hover:bg-[#C47D50] text-white shadow-xs"
              }`}
            >
              {isInCart ? "Agregado" : "Añadir"}
            </button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-[#C47D50]" />
          {zone}, {province}
        </span>
      }
      statValue={formattedImpacts}
      statLabel="Impactos diarios est."
      statTrend={{
        type: "up",
        value: "+12% MoM",
      }}
      footer={footerElement}
      hoverable={true}
      shadowSize="sm"
      borderRadius="2xl"
      backgroundColor="white"
    >
      <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500 font-medium font-sans">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        <span>Garantía de pauta 100% activa las 24 horas</span>
      </div>
    </BaseCard>
  );
};
