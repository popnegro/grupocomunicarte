import React from "react";
import { Calendar } from "lucide-react";
import { DoohScreen } from "../../types";
import { getDynamicReservationEndDate } from "../../utils/availability";

interface AvailabilityTimelineProps {
  screen: DoohScreen;
  occupancyMatrix: Record<string, string[]>;
  isReserved: boolean;
}

const WEEKS = ["Semana 1 (Ago)", "Semana 2 (Ago)", "Semana 3 (Ago)", "Semana 4 (Ago)"];

export const AvailabilityTimeline = React.memo(({ screen, occupancyMatrix, isReserved }: AvailabilityTimelineProps) => {
  const screenWeeks = occupancyMatrix[screen.id] || ["available", "available", "available", "available"];

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-150 pb-1.5 font-display">
        <Calendar className="h-4 w-4 text-[#06434a]" />
        Disponibilidad y Ciclos (Agosto)
      </h3>
      <div className="grid grid-cols-4 gap-2 pt-1">
        {WEEKS.map((week, idx) => {
          let status = screenWeeks[idx] || "available";
          if (isReserved) {
            const endDateStr = getDynamicReservationEndDate(screen, occupancyMatrix);
            const weekEnds = [new Date("2026-08-07"), new Date("2026-08-14"), new Date("2026-08-21"), new Date("2026-08-31")];
            const endDate = new Date(endDateStr);
            const weekStart = idx === 0 ? new Date("2026-08-01") : weekEnds[idx - 1];
            if (endDate >= weekStart) {
              status = "reserved";
            }
          }

          let statusLabel = "Disponible";
          let statusColor = "bg-emerald-50 border-emerald-200 text-emerald-800";
          if (status === "campaign") {
            statusLabel = "Campaña Activa";
            statusColor = "bg-teal-50 border-teal-200 text-teal-800";
          } else if (status === "reserved") {
            statusLabel = "Reservado";
            statusColor = "bg-stone-50 border-stone-200 text-stone-600";
          } else if (status === "maintenance") {
            statusLabel = "Próximamente";
            statusColor = "bg-amber-50 border-amber-200 text-amber-800 font-bold";
          }

          return (
            <div key={week} className={`border rounded-xl p-2 text-center flex flex-col justify-between gap-1 min-h-[48px] shadow-2xs ${statusColor}`}>
              <span className="text-[8px] font-bold uppercase tracking-widest opacity-85 block">Semana {idx + 1}</span>
              <span className="text-[9px] font-black uppercase leading-none block">{statusLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});