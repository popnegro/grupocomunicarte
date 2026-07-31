import React from "react";
import { Cpu, Film, Layers, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

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
  return (
    <Card
      onClick={onSelect}
      className={`group relative flex flex-col h-full bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
        isActive ? "border-[#06434a] ring-1 ring-[#06434a]/10" : "border-stone-200/80 hover:border-stone-300"
      }`}
    >
      {/* Image / Visual Header */}
      <div className="relative aspect-[1.5/1] bg-stone-900 flex items-center justify-center text-white overflow-hidden shrink-0 rounded-t-xl">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-103"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-950 to-stone-800 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-103">
            <span className="text-3xl font-extrabold tracking-tight text-white/5 select-none uppercase">
              {title.substring(0, 3).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-stone-950/15 group-hover:opacity-20 transition-opacity" />

        {/* Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-stone-900 text-white shadow-xs"
          >
            <Film className="h-3 w-3 text-[#C47D50]" />
            <span>{format}</span>
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-5 pb-0 flex-grow flex flex-col justify-between">
        <div className="space-y-3.5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-1 group-hover:text-[#06434a] transition-colors font-display">
              {title}
            </h3>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-stone-400 font-medium">
              <Cpu className="h-3.5 w-3.5 text-[#C47D50] shrink-0" />
              RESOLUCIÓN: {resolution}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
            <div className="text-center">
              <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">
                CPM Base Estimado (ARS)
              </span>
              <span className="block text-xs font-bold text-stone-800 font-display">
                {estimatedCpm}
              </span>
            </div>
            <div className="text-center border-l border-stone-200/50">
              <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wider">
                Tasa Refresco
              </span>
              <span className="block text-xs font-bold text-stone-800 font-display">
                {refreshRate}
              </span>
            </div>
          </div>

          {/* Children content from BaseCard */}
          <div className="space-y-1.5 pt-1 text-xs text-stone-500 font-sans font-normal">
            <div className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-stone-400 shrink-0" />
              <span>Formatos admitidos: MP4 (H.264), JPG, PNG</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Sincronización automatizada por CMS</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="p-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3 mt-4">
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
              Estado
            </span>
            <span className="font-semibold text-[#C47D50]">
              Flicker-Free
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
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
      <div className="space-y-1.5 pt-1 text-xs text-stone-500 font-sans font-normal">
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
