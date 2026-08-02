import React from "react";
import { BaseCard } from "@components/BaseCard";
import { Cpu, Film, Layers, CheckCircle } from "lucide-react";

export interface MediaCardProps {
  id: string;
  title: string;
  format: "Video" | "Imagen" | "Animación HTML" | string;
  resolution: string;
  aspectRatio: "square" | "video" | "wide";
  physicalSize: string;
  refreshRate: string;
  estimatedCpm: number;
  imageSrc?: string;
  isActive?: boolean;
  onSelect?: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  id,
  title,
  format,
  resolution,
  aspectRatio,
  physicalSize,
  refreshRate,
  estimatedCpm,
  imageSrc,
  isActive = false,
  onSelect,
}) => {
  // Format badge representing content file support
  const formatBadge = (
    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-stone-900 text-white shadow-xs">
      <Film className="h-3 w-3 text-[#C47D50]" />
      <span>{format}</span>
    </div>
  );

  // Footer Actions / Detail spec
  const footerElement = (
    <div className="flex items-center justify-between w-full text-xs">
      <div className="flex flex-col">
        <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">
          Tamaño Físico
        </span>
        <span className="font-bold text-stone-800 font-display">
          {physicalSize}
        </span>
      </div>
      <div className="flex flex-col text-right">
        <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">
          Tasa Refresco
        </span>
        <span className="font-semibold text-[#C47D50]">
          {refreshRate}
        </span>
      </div>
    </div>
  );

  return (
    <BaseCard
      onClick={onSelect}
      imageSrc={imageSrc || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"}
      imageAlt={title}
      imageAspectRatio={aspectRatio}
      badge={formatBadge}
      title={title}
      subtitle={
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-stone-400 font-medium">
          <Cpu className="h-3.5 w-3.5 text-[#C47D50] shrink-0" />
          RESOLUCIÓN: {resolution}
        </span>
      }
      statValue={estimatedCpm}
      statLabel="CPM Base Estimado (ARS)"
      statTrend={{
        type: "neutral",
        value: "Flicker-Free",
      }}
      footer={footerElement}
      hoverable={true}
      shadowSize="sm"
      borderRadius="2xl"
      backgroundColor="white"
      className={isActive ? "border-[#C47D50] ring-2 ring-[#C47D50]/10" : ""}
    >
      <div className="space-y-1.5 pt-1 font-sans text-xs font-normal text-stone-500">
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-stone-400 shrink-0" />
          <span>Formatos admitidos: MP4 (H.264), JPG, PNG</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>Sincronización automatizada por CMS</span>
        </div>
      </div>
    </BaseCard>
  );
};
