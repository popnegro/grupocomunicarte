import React, { useState } from "react";
import { motion } from "motion/react";
import { Shield, Radio, Activity, AlertTriangle, CheckCircle2, Server, Hammer, Eye, FileText, Send, Calendar, RefreshCcw, Plus, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useCms } from "./CmsContext";

interface NocAlert {
  id: string;
  screenId: string;
  screenName: string;
  type: string;
  severity: "Baja" | "Media" | "Crítica";
  message: string;
  time: string;
  status: "active" | "resolved";
}

interface KanbanTask {
  id: string;
  screenName: string;
  zone: string;
  type: string;
  stage: "Planificación" | "Impresión/Assets" | "Carga Digital" | "Auditoría" | "Mantenimiento";
  technician: string;
  dueDate: string;
}

export const OperationsNocView: React.FC = () => {
  const { screens } = useCms();
  const [activeTab, setActiveTab] = useState<"board" | "alerts">("board");
  
  // Local state for interactive alerts
  const [alerts, setAlerts] = useState<NocAlert[]>([
    { id: "al-1", screenId: "sc-02", screenName: "Palmares Open Mall", type: "Conectividad", severity: "Crítica", message: "Pérdida de ping por más de 15 minutos. Enlace principal inactivo.", time: "Hace 4 min", status: "active" },
    { id: "al-2", screenId: "sc-04", screenName: "Av. Aristides frente al Parque", type: "Sensor de Luz", severity: "Media", message: "Sensor de brillo ambiental reporta valores fuera de rango (Luminancia excesiva).", time: "Hace 12 min", status: "active" },
    { id: "al-3", screenId: "sc-08", screenName: "Godoy Cruz Belgrano", type: "Reproductor", severity: "Baja", message: "Falta de sincronización en playlist comercial de tarde.", time: "Hace 1 hora", status: "active" },
  ]);

  // Local state for kanban board
  const [tasks, setTasks] = useState<KanbanTask[]>([
    { id: "task-1", screenName: "Sarmiento y 9 de Julio", zone: "Centro", type: "DOOH", stage: "Carga Digital", technician: "Ignacio Torres", dueDate: "Hoy" },
    { id: "task-2", screenName: "Las Heras y Mitre", zone: "Las Heras", type: "DOOH", stage: "Planificación", technician: "Micaela Gómez", dueDate: "Mañana" },
    { id: "task-3", screenName: "LeadMóvil Mendoza Express", zone: "Metropolitana", type: "Móvil", stage: "Auditoría", technician: "Esteban Ruiz", dueDate: "Hoy" },
    { id: "task-4", screenName: "Guaymallén Centro", zone: "Guaymallén", type: "DOOH", stage: "Impresión/Assets", technician: "Bautista Sosa", dueDate: "02/08" },
    { id: "task-5", screenName: "Chacras de Coria Acceso", zone: "Luján", type: "DOOH", stage: "Mantenimiento", technician: "Ignacio Torres", dueDate: "05/08" },
  ]);

  // Form states for reporting incident
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formScreenId, setFormScreenId] = useState<string>(screens[0]?.id || "");
  const [formType, setFormType] = useState<string>("Conectividad");
  const [formSeverity, setFormSeverity] = useState<"Baja" | "Media" | "Crítica">("Media");
  const [formMsg, setFormMsg] = useState<string>("");

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((al) => (al.id === id ? { ...al, status: "resolved" } : al))
    );
  };

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMsg) return;
    const selectedScreen = screens.find((s) => s.id === formScreenId);
    const newAlert: NocAlert = {
      id: `al-${Date.now()}`,
      screenId: formScreenId,
      screenName: selectedScreen ? selectedScreen.nombre : "Pantalla OOH",
      type: formType,
      severity: formSeverity,
      message: formMsg,
      time: "Ahora",
      status: "active",
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setFormMsg("");
    setShowForm(false);
  };

  const activeAlertsCount = alerts.filter((a) => a.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header Info Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Radio className="h-5 w-5 text-slate-800 animate-pulse" />
            Centro de Operaciones (NOC) & Monitoreo
          </h2>
          <p className="text-xs text-slate-500">
            Control de conectividad, carga de spots comerciales, verificación fotográfica en calle e incidentes técnicos.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => setShowForm(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm self-start md:self-auto h-9.5"
        >
          <Plus className="h-4 w-4" />
          Reportar Incidente
        </button>
      </div>

      {/* NOC Performance Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Estado General de Red</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xl font-extrabold text-slate-950 block">94.8% Online</span>
          <span className="text-[9px] text-slate-400 block font-semibold">10 de 11 nodos activos</span>
        </div>

        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Alarmas Activas</span>
          <span className={`text-xl font-black block ${activeAlertsCount > 0 ? "text-rose-600 animate-pulse" : "text-slate-950"}`}>
            {activeAlertsCount} Alertas
          </span>
          <span className="text-[9px] text-slate-400 block font-semibold">Requiere atención en Palmares</span>
        </div>

        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Carga Publicitaria (Ocupación)</span>
          <span className="text-xl font-extrabold text-slate-950 block">76.3%</span>
          <span className="text-[9px] text-emerald-600 block font-semibold">↑ 4.2% esta semana</span>
        </div>

        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Auditorías Pendientes (PoP)</span>
          <span className="text-xl font-extrabold text-slate-950 block">3 Pendientes</span>
          <span className="text-[9px] text-slate-400 block font-semibold">Verificación fotográfica requerida</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("board")}
          className={`px-4 py-2 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
            activeTab === "board"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Flujo de Trabajo Operativo
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-4 py-2 text-xs font-bold border-b-2 -mb-[2px] transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "alerts"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Consola de Alertas de Red
          {activeAlertsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 text-[9px] font-black rounded-full uppercase">
              {activeAlertsCount}
            </span>
          )}
        </button>
      </div>

      {/* Render selected sub-tab */}
      {activeTab === "board" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {(["Planificación", "Impresión/Assets", "Carga Digital", "Auditoría", "Mantenimiento"] as const).map((stage) => {
            const stageTasks = tasks.filter((t) => t.stage === stage);
            return (
              <div key={stage} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col h-[450px]">
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3 shrink-0">
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{stage}</span>
                  <span className="bg-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.2 rounded">
                    {stageTasks.length}
                  </span>
                </div>

                {/* Column Body Tasks */}
                <div className="space-y-3 overflow-y-auto flex-grow min-h-0 pr-0.5">
                  {stageTasks.length === 0 ? (
                    <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-slate-400 text-[10px] bg-white/50 py-10">
                      Sin tareas activas
                    </div>
                  ) : (
                    stageTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2.5 hover:border-slate-300 transition-all text-xs"
                      >
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-slate-900 line-clamp-1">{task.screenName}</h4>
                          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">
                            {task.zone} • {task.type}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1 text-[9px] border-t border-slate-100 pt-2 text-slate-400 font-semibold uppercase">
                          <span>👤 {task.technician.split(" ")[0]}</span>
                          <span className="text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded font-bold font-mono">
                            📅 {task.dueDate}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Alerts List */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-50/50 border-b border-slate-100 p-4.5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Historial Reciente de Alertas de Nodos</span>
              <button
                onClick={() => {
                  setAlerts((prev) => prev.map((a) => ({ ...a, status: "resolved" })));
                }}
                className="text-[10px] text-slate-500 hover:text-slate-900 font-bold uppercase flex items-center gap-1 cursor-pointer"
              >
                <RefreshCcw className="h-3 w-3" />
                Resolver Todas
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {alerts.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No hay incidentes ni alertas registradas en el NOC.
                </div>
              ) : (
                alerts.map((al) => (
                  <div
                    key={al.id}
                    className={`p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors ${
                      al.status === "resolved" ? "bg-slate-50/40 opacity-60" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3 text-xs">
                      {al.status === "resolved" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : al.severity === "Crítica" ? (
                        <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5 animate-bounce" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900">{al.screenName}</span>
                          <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                            al.severity === "Crítica"
                              ? "bg-rose-50 text-rose-700 border-rose-100"
                              : al.severity === "Media"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-blue-50 text-blue-700 border-blue-100"
                          }`}>
                            {al.severity}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">
                            {al.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed max-w-lg">
                          {al.message}
                        </p>
                        <span className="text-[9px] text-slate-400 font-semibold block uppercase">
                          Reportado: {al.time}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-end self-end sm:self-start">
                      {al.status === "active" ? (
                        <Button
                          onClick={() => handleResolveAlert(al.id)}
                          size="sm"
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 h-auto rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Resolver Alarma
                        </Button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          Solucionado
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Incident reporting status guidelines */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                Protocolo de Emergencias NOC
              </h3>
              <div className="space-y-3 text-[11px] leading-relaxed text-slate-500">
                <div className="flex gap-2">
                  <span className="h-4 w-4 rounded bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[9px] shrink-0">1</span>
                  <p><strong className="text-slate-800">Corte de Fibra/3G:</strong> Si el nodo pierde conectividad por más de 10 min, un técnico de guardia se desplaza automáticamente para reinicio físico de módem.</p>
                </div>
                <div className="flex gap-2">
                  <span className="h-4 w-4 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[9px] shrink-0">2</span>
                  <p><strong className="text-slate-800">Playlist Incompleta:</strong> Se procede a recargar el Media Player comercial remotamente desde el panel central de servidores en menos de 5 min.</p>
                </div>
                <div className="flex gap-2">
                  <span className="h-4 w-4 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[9px] shrink-0">3</span>
                  <p><strong className="text-slate-800">Sensores de Brillo:</strong> El software recalibra la emisión lumínica en Mendoza según la salida de sol y atardecer para evitar encandilamiento o pautas tenues.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Incident Modal dialog */}
      {showForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
                Reportar Nuevo Incidente
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-900 font-bold cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddIncident} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pantalla Afectada</label>
                <select
                  value={formScreenId}
                  onChange={(e) => setFormScreenId(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:ring-1 focus:ring-slate-900"
                >
                  {screens.map((sc) => (
                    <option key={sc.id} value={sc.id}>{sc.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo Alerta</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Conectividad">Conectividad</option>
                    <option value="Sensor de Luz">Sensor de Luz</option>
                    <option value="Media Player">Media Player</option>
                    <option value="Eléctrico">Eléctrico</option>
                    <option value="Físico/Estructura">Físico/Estructura</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Severidad</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as any)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Descripción del Problema</label>
                <textarea
                  rows={3}
                  value={formMsg}
                  onChange={(e) => setFormMsg(e.target.value)}
                  placeholder="Ej. El nodo de Palmares se apagó repentinamente tras descarga de media..."
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-2.5 h-auto rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                Enviar Alerta al NOC
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
