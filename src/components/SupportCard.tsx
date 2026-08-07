import React from "react";
import { Card } from "../design-system";
import { DynamicIcon } from "./DynamicIcon";

export interface SupportCardProps {
  icon: string;
  category: string;
  title: string;
  description: string;
  size: string;
  brightness: string;
  refreshRate: string;
  iconColorClass?: string;
  iconBgClass?: string;
}

export const SupportCard: React.FC<SupportCardProps> = ({
  icon,
  category,
  title,
  description,
  size,
  brightness,
  refreshRate,
  iconColorClass = "text-[#06434a]",
  iconBgClass = "bg-[#06434a]/10",
}) => {
  return (
    <Card variant="premium" className="flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        <div className={`p-3 ${iconBgClass} ${iconColorClass} rounded-xl inline-block`}>
          <DynamicIcon name={icon} className="h-5 w-5" />
        </div>
        <div>
          <span className="block font-bold text-[9px] uppercase text-stone-400 tracking-wider">
            {category}
          </span>
          <h4 className="font-bold text-base text-stone-900 mt-1 font-sans">
            {title}
          </h4>
        </div>
        <p className="text-stone-500/90 text-xs leading-relaxed font-sans font-normal">
          {description}
        </p>
      </div>
      <div className="border-t border-[#E7E5E4] pt-4.5 space-y-2 text-xs font-sans">
        <div className="flex justify-between font-normal">
          <span className="text-stone-400">Tamaño:</span> 
          <span className="text-stone-700 font-semibold">{size}</span>
        </div>
        <div className="flex justify-between font-normal">
          <span className="text-stone-400">Brillo:</span> 
          <span className="text-stone-700 font-semibold">{brightness}</span>
        </div>
        <div className="flex justify-between font-normal">
          <span className="text-stone-400">Refresh Rate:</span> 
          <span className="text-stone-700 font-semibold">{refreshRate}</span>
        </div>
      </div>
    </Card>
  );
};
