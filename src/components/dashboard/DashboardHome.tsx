import React, { useState } from "react";
import { MediaKit, Cotizacion, Reserva, Campaña, Role } from "./types";
import { 
  CheckCircle, 
  AlertTriangle, 
  FilePlus, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  Sparkles, 
  TrendingUp, 
  Percent, 
  Layers, 
  Briefcase, 
  RefreshCw 
} from "lucide-react";

interface DashboardHomeProps {
  mediaKits: MediaKit[];
  cotizaciones: Cotizacion[];
  reservas: Reserva[];
  campañas: Campaña[];
  userRole: Role;
  onNavigateToTab: (tab: string) => void;
  onApproveReserva: (id: string) => void;
  onApproveCotizacion: (id: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  mediaKits,
  cotizaciones,
  reservas,
  campañas,
  userRole,
  onNavigateToTab,
  onApproveReserva,
  onApproveCotizacion,
}) => {
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Compute metrics
  const activeCampCount = campañas.filter(c => c.estado === "Activa").length;
  const totalLeads = mediaKits.length;
  const pendingQuotes = cotizaciones.filter(q => q.estado === "Enviada").length;

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto font-sans">
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-bold py-3 px-5 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Hero Welcome Box with contextual greeting depending on role */}
      <div className="bg-gradient-to-br from-[#121E20] to-[#06434a] text-stone-100 rounded-3xl p-6 relative overflow-hidden border border-[#05353a] shadow-md">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="relative z-10 space-y-3 max-w-2xl text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" />
            <span>Optimizador de Inventario OOH</span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-black tracking-tight">
            ¿Qué tenemos que resolver hoy?
          </h2>
          <p className="text-[11px] text-stone-200/90 leading-relaxed font-normal">
            La plataforma ha detectado <strong className="text-white font-bold">1 conflicto de disponibilidad</strong> y <strong className="text-white font-bold">2 cotizaciones listas para envío</strong>. Mendoza lidera la ocupación semanal con un 92%.
          </p>
        </div>
      </div>

      {/* Main Section: Action items "¿Qué tengo que hacer hoy?" */}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Action Tasks Column */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* 1. MediaKit nuevos */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition-all shadow-xs space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50">
                    <FilePlus className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[8px] bg-blue-500/10 text-blue-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      MediaKit Nuevo
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 mt-1 font-display">
                      Lanzamiento Toyota Hilux 2026 (Mendoza)
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 font-medium font-mono">Hace 2 horas</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed pl-12">
                Recibido desde la Landing. El cliente solicita pautar 3 pantallas (Sarmiento, Palmares y Mendoza Express) para agosto. Requiere propuesta formal.
              </p>
              <div className="flex items-center justify-end gap-2 pl-12 pt-1.5">
                <button
                  onClick={() => {
                    onNavigateToTab("mediakit");
                    triggerToast("Abriendo editor de MediaKit...");
                  }}
                  className="px-3.5 py-1.5 bg-[#06434a] hover:bg-[#0b5e67] text-white font-extrabold text-[10px] uppercase rounded-lg cursor-pointer transition-all shadow-xs"
                >
                  Generar Cotización
                </button>
              </div>
            </div>

            {/* 2. Cotizaciones pendientes */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition-all shadow-xs space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-stone-50 text-[#06434a] flex items-center justify-center border border-stone-100">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[8px] bg-[#06434a]/8 text-[#06434a] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Cotización Pendiente
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 mt-1 font-display">
                      #QT-101 para Toyota Mendoza • $1,440,000
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 font-medium font-mono">Vence en 5 días</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed pl-12">
                Aprobación interna completada. Descuento comercial del 10% aplicado. Esperando aprobación final del cliente.
              </p>
              <div className="flex items-center justify-end gap-2 pl-12 pt-1.5">
                <button
                  onClick={() => {
                    onApproveCotizacion("qt-101");
                    triggerToast("Cotización aprobada por cliente. Se ha generado la Reserva correspondiente.");
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase rounded-lg cursor-pointer transition-all shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle className="h-3 w-3" />
                  <span>Aprobar desde Cliente</span>
                </button>
              </div>
            </div>

            {/* 3. Conflictos de disponibilidad */}
            <div className="bg-red-50/40 border border-red-200 rounded-2xl p-5 hover:bg-red-50/60 transition-all shadow-xs space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-red-100/50 text-red-600 flex items-center justify-center border border-red-200">
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[8px] bg-red-500/10 text-red-700 border border-red-200 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Conflicto de Reserva
                    </span>
                    <h4 className="text-xs font-bold text-red-900 mt-1 font-display">
                      Overbooking detectado en Sarmiento y 9 de Julio (sc-01)
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] text-red-500 font-extrabold font-mono uppercase tracking-widest animate-pulse">Urgente</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed pl-12 font-medium">
                La pauta de <strong className="text-stone-900 font-bold">Toyota Mendoza (rv-402)</strong> se superpone del 5 al 10 de agosto con la campaña activa de <strong className="text-stone-900 font-bold">Cencosud S.A. (cp-502)</strong>.
              </p>
              <div className="flex items-center justify-between gap-4 pl-12 pt-1.5">
                <div className="text-[10px] text-stone-500 font-bold bg-white px-2.5 py-1 rounded-lg border border-stone-200 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                  <span>Sugerencia IA: Reemplazar por Palmares con 10% bonificado</span>
                </div>
                <button
                  onClick={() => {
                    onNavigateToTab("reservas");
                    triggerToast("Redirigiendo a resolución de reservas conflictivas...");
                  }}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] uppercase rounded-lg cursor-pointer transition-all shadow-xs"
                >
                  Resolver Conflicto
                </button>
              </div>
            </div>

            {/* 4. Campañas que comienzan hoy */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition-all shadow-xs space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Lanzamiento Hoy
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 mt-1 font-display">
                    Promo Invierno Café Central — San Juan (sj-01)
                  </h4>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed pl-12">
                La carga de piezas multimedia fue aprobada por Operaciones. El soporte comenzará la reproducción de spots en Plaza San Juan de manera automatizada a las 18:00 hs.
              </p>
            </div>

            {/* 5. Espacios próximos a liberarse */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition-all shadow-xs space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <ArrowUpRight className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <span className="text-[8px] bg-amber-500/10 text-amber-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Inventario por Liberar
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 mt-1 font-display">
                    Obelisco Pantalla Monumental (ba-01) — Se libera en 3 días
                  </h4>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed pl-12">
                Campaña actual de Telecom finaliza el 2 de agosto. Se sugiere contactar a Agencia JWT para ofrecer continuidad o habilitar preventa.
              </p>
            </div>

          </div>

          {/* Right Column: AI Alerts, KPIs */}
          <div className="lg:col-span-4 space-y-6 text-left">
            
            {/* Alertas IA Smart Assistant */}
            <div className="bg-gradient-to-b from-[#FAF9F5] to-stone-50 border border-stone-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-stone-200/60 pb-3">
                <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                <h4 className="text-[11px] font-extrabold text-stone-800 uppercase tracking-wider font-mono">
                  Sugerencias de Revenue IA
                </h4>
              </div>

              <div className="space-y-3.5">
                <div className="p-3 bg-white rounded-xl border border-stone-100 space-y-1.5 shadow-2xs">
                  <span className="text-[8px] bg-amber-500/10 text-amber-700 font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                    Sugerencia de Precios
                  </span>
                  <p className="text-[10px] text-stone-600 leading-relaxed">
                    Mendoza centro registra <strong className="text-stone-900 font-bold">92% de ocupación</strong> sostenida en LED Peatonal. Sugerimos incrementar tarifas un <strong className="text-stone-900 font-bold">12% global</strong> para nuevos contratos.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-100 space-y-1.5 shadow-2xs">
                  <span className="text-[8px] bg-[#06434a]/8 text-[#06434a] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                    Soporte Ocioso
                  </span>
                  <p className="text-[10px] text-stone-600 leading-relaxed">
                    La pantalla <strong className="text-stone-900 font-bold">Las Heras y Mitre (sc-03)</strong> tiene disponibilidad ociosa las próximas 3 semanas. Generar descuento relámpago del <strong className="text-stone-900 font-bold">25%</strong> para retail.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick KPIs Summary */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <h4 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest font-mono">
                Métricas de Operación
              </h4>

              <div className="space-y-3">
                {/* 1 */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold">
                    <Layers className="h-3.5 w-3.5 text-[#06434a]" />
                    <span>Ocupación Global</span>
                  </div>
                  <span className="font-bold text-stone-900 text-xs font-mono">81.4%</span>
                </div>

                {/* 2 */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold">
                    <Briefcase className="h-3.5 w-3.5 text-[#06434a]" />
                    <span>Campañas Activas</span>
                  </div>
                  <span className="font-bold text-stone-900 text-xs font-mono">{activeCampCount}</span>
                </div>

                {/* 3 */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold">
                    <Percent className="h-3.5 w-3.5 text-[#06434a]" />
                    <span>Tasa Conversión</span>
                  </div>
                  <span className="font-bold text-stone-900 text-xs font-mono">34.2%</span>
                </div>

                {/* 4 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold">
                    <TrendingUp className="h-3.5 w-3.5 text-[#06434a]" />
                    <span>Ingresos Proyectados</span>
                  </div>
                  <span className="font-extrabold text-stone-900 text-xs font-mono">$1.95M</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
