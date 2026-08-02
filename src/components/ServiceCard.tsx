import React from "react";
import * as LucideIcons from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { DynamicIcon } from "./DynamicIcon";

export interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  badge: string;
  onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  badge,
  onClick,
}) => {
  return (
    <Card
      className="bg-white border border-[#E7E5E4] p-6 text-left rounded-xl hover:border-[#06434a]/40 shadow-sm hover:shadow-[0_12px_24px_rgba(6,67,74,0.04)] transition-all duration-300 flex flex-col justify-between group cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-[#06434a]/10 text-[#06434a] flex items-center justify-center shrink-0 group-hover:bg-[#06434a] group-hover:text-white transition-all duration-300">
            <DynamicIcon name={icon} className="h-5 w-5" />
          </div>
          <span className="text-[9px] bg-[#07BE8A]/10 border border-[#07BE8A]/20 text-[#07BE8A] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full font-sans">
            {badge}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-md font-bold font-sans text-[#172023] group-hover:text-[#06434a] transition-colors duration-200">
            {title}
          </h3>
          <p className="text-stone-500/95 text-xs leading-relaxed font-sans font-normal">
            {description}
          </p>
        </div>
      </div>
      
      <div className="pt-4 mt-4 border-t border-[#E7E5E4] flex items-center justify-between text-xs font-bold text-[#06434a] group-hover:text-[#07BE8A] transition-colors duration-200">
        <span className="font-sans">Consultar por este servicio</span>
        <LucideIcons.ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </Card>
  );
};
