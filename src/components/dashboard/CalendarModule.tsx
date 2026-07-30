import React, { useState } from "react";
import { DoohScreen } from "../../types";
import { 
  Calendar, 
  Clock, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle, 
  Wrench,
  Sparkles,
  Lock
} from "lucide-react";

interface CalendarModuleProps {
  screens: DoohScreen[];
  onUpdateScreenStatus: (id: string, status: string) => void;
}

export const CalendarModule: React.FC<CalendarModuleProps> = ({
  screens,
  onUpdateScreenStatus,
}) => {
  const [showToast, setShowToast] = useState<string | null>(null);

  // Weeks range of August
  const weeks = ["Semana 1 (Ago)", "Semana 2 (Ago)", "Semana 3 (Ago)", "Semana 4 (Ago)"];

  // Local grid matrix representation of occupancy statuses
  // States: "available" | "campaign" | "reserved" | "maintenance"
  const [occupancyMatrix, setOccupancyMatrix] = useState<{ [key: string]: string[] }>({
    "sc-01": ["campaign", "campaign", "reserved", "available"],
    "sc-02": ["reserved", "available", "available", "campaign"],
    "sc-03": ["maintenance", "available", "available", "available"],
    "sj-01": ["campaign", "campaign", "campaign", "reserved"],
    "ba-01": ["reserved", "campaign", "campaign", "available"]
  });

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleCellClick = (screenId: string, weekIndex: number) => {
    const screen = screens.find((s) => s.id === screenId);
    if (!screen) return;

    const currentList = occupancyMatrix[screenId] || ["available", "available", "available", "available"];
    const currentStatus = currentList[weekIndex];
    
    let nextStatus = "available";
    if (currentStatus === "available") nextStatus = "maintenance";
    else if (currentStatus === "maintenance") nextStatus = "reserved";
    else if (currentStatus === "reserved") nextStatus = "campaign";

    const nextList = [...currentList];
    nextList[weekIndex] = nextStatus;

    setOccupancyMatrix((prev) => ({
      ...prev,
      [screenId]: nextList
    }));

    triggerToast(`Estado de ${screen.nombre} (Semana ${weekIndex + 1}) actualizado a: ${nextStatus.toUpperCase()}`);
  };

  const getCellStyles = (status: string) => {
    switch (status) {
      case "campaign":
        return "bg-teal-500/15 border-[#06434a]/30 text-teal-800 hover:bg-teal-500/25";
      case "reserved":
        return "bg-blue-500/15 border-blue-400/30 text-blue-800 hover:bg-blue-500/25";
      case "maintenance":
        return "bg-amber-500/15 border-amber-400/30 text-amber-800 hover:bg-amber-500/25";
      default:
        return "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100/50";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans space-y-6 text-left">
      
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-bold py-3 px-5 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
          Gobernanza Temporal
        </span>
        <h2 className="text-xl font-bold text-stone-950 font-display mt-2">
          Calendario de Ocupación por Soporte
        </h2>
      </div>

      {/* Legend bar */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-wrap items-center gap-4 text-[10px] font-bold text-stone-600">
        <span className="text-stone-400 uppercase tracking-wider font-mono">Referencias:</span>
        
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 bg-stone-50 border border-stone-200 rounded" />
          <span>Disponible</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 bg-blue-100 border border-blue-300 rounded" />
          <span>Reservado (Cotización aprobada)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 bg-teal-100 border border-teal-300 rounded" />
          <span>Campaña Activa (Reproduciendo)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 bg-amber-100 border border-amber-300 rounded" />
          <span>Bloqueado (Mantenimiento Técnico)</span>
        </div>
      </div>

      {/* Timeline Grid Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs text-stone-600">
          <thead className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">
            <tr>
              <th className="p-4 w-1/3">Nombre del Soporte (Ciudad)</th>
              {weeks.map((week) => (
                <th key={week} className="p-4 text-center">{week}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium">
            {screens.slice(0, 8).map((screen) => {
              const rowStatuses = occupancyMatrix[screen.id] || ["available", "available", "available", "available"];
              
              return (
                <tr key={screen.id} className="hover:bg-stone-50/20">
                  <td className="p-4">
                    <span className="font-bold text-stone-900 block">{screen.nombre}</span>
                    <span className="text-[10px] text-stone-400 font-semibold">{screen.ciudad} • {screen.zona}</span>
                  </td>

                  {rowStatuses.map((status, index) => (
                    <td key={index} className="p-3">
                      <div
                        onClick={() => handleCellClick(screen.id, index)}
                        className={`py-3.5 px-2 rounded-xl text-center border font-bold text-[10px] uppercase transition-all duration-150 cursor-pointer select-none ${getCellStyles(status)}`}
                      >
                        {status === "campaign" && "Campaña"}
                        {status === "reserved" && "Reservado"}
                        {status === "maintenance" && "Bloqueado"}
                        {status === "available" && "Disponible"}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-stone-400 leading-relaxed">
        💡 <strong>Consejo comercial:</strong> Haz clic en cualquier celda de la grilla para alternar el estado de reserva o programar un bloqueo por mantenimiento técnico.
      </p>

    </div>
  );
};
