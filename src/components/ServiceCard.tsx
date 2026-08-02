import React from "react";
import * as LucideIcons from "lucide-react";
import { Card } from "@/components/ui";
import { DynamicIcon } from "@/components/DynamicIcon";

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
      className="group flex cursor-pointer flex-col justify-between rounded-xl border border-[#E7E5E4] bg-white p-6 text-left shadow-sm transition-all duration-300 hover:border-[#06434a]/40 hover:shadow-[0_12px_24px_rgba(6,67,74,0.04)]"
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-[#06434a]/10 text-[#06434a] flex items-center justify-center shrink-0 group-hover:bg-[#06434a] group-hover:text-white transition-all duration-300">
            <DynamicIcon name={icon} className="h-5 w-5" />
          </div>
          <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 font-sans text-[9px] font-extrabold uppercase tracking-widest text-accent">
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
      
      <div className="mt-4 flex items-center justify-between border-t border-[#E7E5E4] pt-4 text-xs font-bold text-[#06434a] transition-colors duration-200 group-hover:text-accent">
        <span className="font-sans">Consultar por este servicio</span>
        <LucideIcons.ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </Card>
  );
};
