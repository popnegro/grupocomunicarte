import React from "react";
import { Compass } from "lucide-react";
import { ICON_COMPONENTS } from "../constants/screencard";

interface LocationBenefit {
  label: string;
  icon: string;
  description: string;
}

interface LocationBenefitsProps {
  benefits: LocationBenefit[];
}

export const LocationBenefits = React.memo(({ benefits }: LocationBenefitsProps) => {
  if (benefits.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-150 pb-1.5 font-display">
        <Compass className="h-4 w-4 text-[#06434a]" />
        Beneficios de la Ubicación
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {benefits.map((benefit, i) => {
          const IconComponent = ICON_COMPONENTS[benefit.icon] || Compass;
          return (
            <div key={i} className="flex items-start gap-2.5 bg-stone-50 p-2.5 rounded-xl border border-stone-200/50 animate-in fade-in-50 duration-150">
              <IconComponent className="h-4 w-4 text-[#06434a] mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-stone-900 block leading-tight">{benefit.label}</span>
                <span className="text-[10px] text-stone-500 block leading-tight">{benefit.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});