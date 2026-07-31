import React from 'react';
import { Clock } from 'lucide-react';

interface UrgentTasksSectionProps {
  children: React.ReactNode;
}

export const UrgentTasksSection: React.FC<UrgentTasksSectionProps> = ({ children }) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold text-stone-400 uppercase tracking-widest font-mono">
          Acciones Urgentes e Impactos del Día
        </h3>
        <span className="text-[10px] text-stone-500 font-bold bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Sincronizado en tiempo real
        </span>
      </div>
      <div className="lg:col-span-8 space-y-4">
        {children}
      </div>
    </div>
  );
};
