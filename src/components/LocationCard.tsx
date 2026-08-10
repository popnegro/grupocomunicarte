import React from "react";
import { BaseCard } from "./BaseCard";
import { MapPin, ShieldCheck } from "lucide-react";

export interface LocationCardProps {
  id: string;
  name: string;
  zone: string;
  province: string;
  impacts: number;
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
  status,
  imageSrc,
  type,
  onSelect,
  onFocusOnMap,
  isInCart = false,
  onToggleCart,
}) => {
  const formattedImpacts =
    impacts >= 1000 ? `${(impacts / 1000).toFixed(0)}k` : impacts.toString();

  const isAvailable = status === "Disponible" || status === "Activo";

  const locationBadge = (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/95 text-stone-800 border border-stone-200/60 shadow-xs backdrop-blur-xs">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isAvailable ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      <span>{type}</span>
    </div>
  );

  const footerElement = (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col">
        <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">
          Inversión Semanal
        </span>

        <span className="text-sm font-bold text-stone-900 font-display flex items-baseline gap-0.5">
          <span>Tarifa bajo cotización</span>
        </span>
      </div>

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
    </div>
  );

  return (
    <BaseCard
      onClick={onSelect}
      imageSrc={
        imageSrc ||
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
      }
      imageAlt={name}
      imageAspectRatio="video"
      badge={locationBadge}
      title={name}
      subtitle={
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
