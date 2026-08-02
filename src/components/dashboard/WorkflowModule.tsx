import React, { useState } from "react";
import { Cotizacion, Reserva, Campaña, Role } from "./types";
import { DoohScreen } from "../../types";
import { 
  Check, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  Sliders, 
  FileText, 
  Play, 
  TrendingUp, 
  Percent, 
  Database,
  Trash2,
  X,
  HelpCircle,
  TrendingDown
} from "lucide-react";

interface WorkflowModuleProps {
  cotizaciones: Cotizacion[];
  reservas: Reserva[];
  campañas: Campaña[];
  screens: DoohScreen[];
  userRole: Role;
  onUpdateCotizacion: (id: string, data: Partial<Cotizacion>) => void;
  onUpdateReserva: (id: string, data: Partial<Reserva>) => void;
  onUpdateCampaña: (id: string, data: Partial<Campaña>) => void;
  onApproveCotizacion: (id: string) => void;
  onApproveReserva: (id: string) => void;
}

export const WorkflowModule: React.FC<WorkflowModuleProps> = ({
  cotizaciones,
  reservas,
  campañas,
  screens,
  userRole,
  onUpdateCotizacion,
  onUpdateReserva,
  onUpdateCampaña,
  onApproveCotizacion,
  onApproveReserva,
}) => {
  const [activeWorkflowSubTab, setActiveWorkflowSubTab] = useState<"quotes" | "reservas" | "campañas">("quotes");
  
  // Interactive editing states
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [showAiResolutionModal, setShowAiResolutionModal] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const selectedQuote = cotizaciones.find((q) => q.id === selectedQuoteId);

  // Calculates Quote cost live if discount changes
  const handleDiscountChange = (id: string, discount: number) => {
    const quote = cotizaciones.find((q) => q.id === id);
    if (!quote) return;
    
    // Simulates price calculation: base is original total / (1 - previous discount)
    const originalBase = quote.total / (1 - quote.descuentoPercent / 100);
    const newTotal = originalBase * (1 - discount / 100);

    onUpdateCotizacion(id, {
      descuentoPercent: Number(discount),
      total: Math.round(newTotal)
    });
  };

  // Automated conflict resolution helper: replaces the screen of a booking with another available screen
  const handleResolveConflictWithAi = (reservaId: string, originalScreenId: string) => {
    // Locate alternative screen in Mendoza (usually sc-02 or sc-03 is a great alternative)
    const alternative = screens.find((s) => s.id !== originalScreenId && s.ciudad === "Mendoza" && s.status === "Disponible");
    
    if (alternative) {
      onUpdateReserva(reservaId, {
        screenId: alternative.id,
        screenNombre: alternative.nombre,
        conflictiva: false // Clear conflict flags!
      });
      setShowAiResolutionModal(null);
      triggerToast(`¡Conflicto resuelto! Soporte reasignado a: ${alternative.nombre}`);
    } else {
      triggerToast("No se encontraron soportes alternativos libres en esta plaza.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans space-y-6">
      
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-bold py-3 px-5 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Module Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="text-left">
          <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            Pipeline Comercial
          </span>
          <h2 className="text-xl font-bold text-stone-950 font-display mt-2">
            Workflow Comercial Integrado
          </h2>
        </div>

        {/* Sub-tab selection menu */}
        <div className="flex bg-stone-100/80 p-1 rounded-xl border border-stone-200/50">
          {([
            { id: "quotes", label: `Cotizaciones (${cotizaciones.length})` },
            { id: "reservas", label: `Reservas (${reservas.length})` },
            { id: "campañas", label: `Campañas (${campañas.length})` }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveWorkflowSubTab(tab.id)}
              className={`py-1.5 px-4 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeWorkflowSubTab === tab.id
                  ? "bg-white text-[#06434a] font-black shadow-xs"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-tab Content: Quotes */}
      {activeWorkflowSubTab === "quotes" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quotes list */}
          <div className="lg:col-span-8 space-y-4">
            {cotizaciones.map((quote) => (
              <div
                key={quote.id}
                onClick={() => setSelectedQuoteId(quote.id)}
                className={`bg-white border text-left p-5 rounded-2xl cursor-pointer transition-all hover:shadow-xs space-y-4 ${
                  selectedQuoteId === quote.id 
                    ? "border-[#06434a] ring-1 ring-[#06434a]/15 shadow-2xs" 
                    : "border-stone-200"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[8px] font-mono font-bold text-stone-400">PROPUESTA ID: {quote.id}</span>
                    <h3 className="text-xs font-bold text-stone-900 mt-1 font-display leading-tight">
                      {quote.mediakitNombre}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
                      Cliente: {quote.clienteNombre}
                    </p>
                  </div>

                  <span className={`text-[7px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                    quote.estado === "Aceptada"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    {quote.estado}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-stone-100 pt-3 font-bold text-stone-800">
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Vence: {quote.validez}</span>
                  </div>

                  <span className="font-mono text-stone-900">
                    ${quote.total.toLocaleString()} <span className="text-[9px] text-stone-400 font-bold">({quote.descuentoPercent}% desc)</span>
                  </span>
                </div>

              </div>
            ))}
          </div>

          {/* Quote inspector & negotiator */}
          <div className="lg:col-span-4 bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left space-y-5">
            {selectedQuote ? (
              <div className="space-y-4">
                <div className="border-b border-stone-200 pb-3">
                  <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider font-mono">Negociador de Precios</span>
                  <h4 className="text-xs font-bold text-stone-900 mt-1 font-display">Cotización #{selectedQuote.id}</h4>
                </div>

                {/* Adjust discount slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-700">
                    <span>Bonificación Especial</span>
                    <span className="font-mono text-[#06434a] bg-[#06434a]/8 px-2 py-0.5 rounded-lg">{selectedQuote.descuentoPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={selectedQuote.descuentoPercent}
                    onChange={(e) => handleDiscountChange(selectedQuote.id, Number(e.target.value))}
                    className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#06434a]"
                  />
                  <span className="block text-[8px] text-stone-400 font-bold uppercase tracking-wider">Límite comercial: 30% máx.</span>
                </div>

                {/* Conditions form */}
                <div className="space-y-2.5 text-xs">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-bold text-stone-400 uppercase">Vencimiento de Oferta</label>
                    <input
                      type="date"
                      value={selectedQuote.validez}
                      onChange={(e) => onUpdateCotizacion(selectedQuote.id, { validez: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-bold text-stone-400 uppercase">Condiciones Generales</label>
                    <textarea
                      rows={3}
                      value={selectedQuote.condiciones}
                      onChange={(e) => onUpdateCotizacion(selectedQuote.id, { condiciones: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white text-[11px] leading-relaxed"
                    />
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-850">
                    <span>Total Final</span>
                    <span className="font-mono text-sm font-black text-[#06434a]">${selectedQuote.total.toLocaleString()}</span>
                  </div>

                  {selectedQuote.estado !== "Aceptada" && (
                    <button
                      onClick={() => {
                        onApproveCotizacion(selectedQuote.id);
                        triggerToast("Cotización aprobada por cliente. Se ha generado la Reserva correspondiente.");
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold uppercase py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 mt-2 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      <span>Cerrar Negociación y Reservar</span>
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-stone-400 text-xs">
                <FileText className="h-10 w-10 mx-auto text-stone-300 mb-2" />
                <span>Selecciona una cotización comercial para inspeccionar.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-tab Content: Reservations with Conflict Detection */}
      {activeWorkflowSubTab === "reservas" && (
        <div className="space-y-4 text-left">
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">
                <tr>
                  <th className="p-4">ID / Cliente</th>
                  <th className="p-4">Soporte Reservado</th>
                  <th className="p-4">Fechas Solicitadas</th>
                  <th className="p-4">Alertas de Conflicto</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {reservas.map((res) => {
                  return (
                    <tr key={res.id} className="hover:bg-stone-50/50">
                      <td className="p-4">
                        <span className="block text-[8px] font-mono font-bold text-stone-400">RESERVA: {res.id}</span>
                        <span className="font-bold text-stone-900">{res.clienteNombre}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-stone-800">{res.screenNombre}</span>
                        <span className="block text-[10px] text-stone-400">ID: {res.screenId}</span>
                      </td>
                      <td className="p-4 font-mono text-[10px]">
                        {res.fechaInicio} al {res.fechaFin}
                      </td>
                      <td className="p-4">
                        {res.conflictiva ? (
                          <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                            <span>Conflicto Overbooking</span>
                          </div>
                        ) : (
                          <span className="text-emerald-600 text-[11px] font-bold">✓ Sin superposiciones</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {res.conflictiva && (
                            <button
                              onClick={() => setShowAiResolutionModal(res.id)}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-extrabold uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Sparkles className="h-3 w-3 text-amber-100 animate-pulse" />
                              <span>IA Resolver</span>
                            </button>
                          )}

                          {res.estado !== "Confirmada" && (
                            <button
                              onClick={() => {
                                onApproveReserva(res.id);
                                triggerToast("¡Reserva confirmada de manera formal! Se ha creado la campaña comercial.");
                              }}
                              disabled={res.conflictiva}
                              className="px-3 py-1.5 bg-[#06434a] hover:bg-[#0b5e67] disabled:opacity-50 text-white text-[10px] font-extrabold uppercase rounded-lg cursor-pointer transition-colors"
                            >
                              Confirmar Reserva
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab Content: Campaigns progress */}
      {activeWorkflowSubTab === "campañas" && (
        <div className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campañas.map((camp) => (
              <div
                key={camp.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition-all shadow-2xs space-y-4"
              >
                <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[8px] font-mono font-bold text-stone-400">CAMPAÑA ID: {camp.id}</span>
                    <h3 className="text-xs font-bold text-stone-900 mt-1 font-display">
                      {camp.nombre}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
                      Cliente: {camp.clienteNombre}
                    </p>
                  </div>

                  <span className={`text-[7px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                    camp.estado === "Activa"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse"
                      : "bg-blue-50 text-blue-700 border border-blue-100"
                  }`}>
                    {camp.estado}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-stone-500 font-semibold text-[11px]">
                    <span>Soporte: <strong className="text-stone-800">{camp.screenNombre}</strong></span>
                    <span className="font-mono text-stone-850 font-black">{camp.progreso}% transcurrido</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#06434a] h-full rounded-full transition-all duration-500"
                      style={{ width: `${camp.progreso}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold pt-1">
                  <span>Inicio: {camp.fechaInicio}</span>
                  <span>Fin: {camp.fechaFin}</span>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Resolution Suggestion Modal */}
      {showAiResolutionModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-150 p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 text-left animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-sm font-black text-stone-950 font-display uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                <span>Resolución Inteligente IA</span>
              </h3>
              <button
                onClick={() => setShowAiResolutionModal(null)}
                className="p-1.5 hover:bg-stone-50 rounded-xl text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {(() => {
              const resObj = reservas.find((r) => r.id === showAiResolutionModal);
              if (!resObj) return null;

              return (
                <div className="space-y-4 text-xs text-stone-600">
                  <p className="leading-relaxed">
                    Nuestros algoritmos de disponibilidad han identificado que el soporte <strong className="text-stone-900 font-bold">{resObj.screenNombre} (sc-01)</strong> registra una superposición crítica de fechas.
                  </p>

                  <div className="bg-amber-50/50 border border-amber-200/80 p-3.5 rounded-xl space-y-1.5">
                    <span className="text-[8px] bg-amber-500/10 text-amber-700 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">Propuesta de Sustitución IA</span>
                    <p className="text-[11px] text-stone-700 font-semibold">
                      Sustituir por Aristides Villanueva LED (Mendoza), aplicando una bonificación compensatoria del 10% en tarifa base.
                    </p>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="block text-[8px] font-bold text-stone-400 uppercase">Impactos Alternativos</span>
                      <span className="text-[11px] font-black text-stone-800">22.0k impactos / día (+4k de ganancia)</span>
                    </div>

                    <div>
                      <span className="block text-[8px] font-bold text-stone-400 uppercase">Compensación</span>
                      <span className="text-[11px] font-black text-emerald-600 font-mono">-$15,000 ARS/sem</span>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 pt-4 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowAiResolutionModal(null)}
                      className="px-4 py-2 border border-stone-200 text-stone-600 font-bold uppercase text-[10px] rounded-full hover:bg-stone-50 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolveConflictWithAi(resObj.id, resObj.screenId)}
                      className="px-5 py-2 bg-[#06434a] hover:bg-[#0b5e67] text-white font-extrabold uppercase text-[10px] rounded-full cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      <span>Aplicar Sustitución IA</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

    </div>
  );
};
