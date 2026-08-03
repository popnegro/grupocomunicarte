import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, DollarSign, Target, MapPin, BarChart3, TrendingUp, HelpCircle, Save, Calendar, Check, ArrowRight, ListPlus } from "lucide-react";
import { Button } from "./ui/button";
import { useCms } from "./CmsContext";

export const CampaignPlannerView: React.FC = () => {
  const { screens, toggleCart, cart } = useCms();
  const [budget, setBudget] = useState<number>(250000);
  const [objective, setObjective] = useState<string>("Branding & Presencia");
  const [zonePreference, setZonePreference] = useState<string>("Centro");
  const [duration, setDuration] = useState<number>(4);
  const [loading, setLoading] = useState<boolean>(false);
  const [plannedCircuit, setPlannedCircuit] = useState<any | null>(null);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);

  const availableZones = ["Todas", "Centro", "Ciudad", "Palmares", "Las Heras", "Godoy Cruz", "Luján", "Guaymallén", "Maipú"];

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/plan-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget,
          objective,
          zonePreference: zonePreference === "Todas" ? "any" : zonePreference
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPlannedCircuit(data.data);
      }
    } catch (e) {
      console.error("Error calling plan-campaign", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = () => {
    if (!plannedCircuit) return;
    const newPlan = {
      id: `plan-${Date.now()}`,
      title: `Plan ${objective} - $${budget.toLocaleString("es-AR")}`,
      date: new Date().toLocaleDateString("es-AR"),
      budget,
      duration: plannedCircuit.durationWeeks || duration,
      screensCount: plannedCircuit.selectedScreenIds?.length || 0,
      impacts: plannedCircuit.totalEstimatedImpacts || 0,
      reach: plannedCircuit.roiMetrics?.estimatedReach || 0
    };
    setSavedPlans((prev) => [newPlan, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full uppercase tracking-wider">
              Smart OOH Engine
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Mendoza v3.6
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Planificador Inteligente de Campañas</h2>
          <p className="text-xs text-slate-400">
            Define tu presupuesto y objetivos comerciales para generar un circuito DOOH con distribución de pauta optimizada por IA.
          </p>
        </div>
        <Sparkles className="h-10 w-10 text-amber-400 shrink-0 hidden md:block animate-pulse" />
      </div>

      {/* Main Grid: Settings & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Campaign Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Configuración de Objetivos
            </h3>

            {/* Budget Input */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Presupuesto Total Estimado (ARS)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
                  className="pl-9 pr-4 py-2 bg-white text-slate-950 font-mono font-bold text-sm border border-slate-200 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <button onClick={() => setBudget(100000)} className="hover:text-slate-900 font-medium">Min: $100k</button>
                <button onClick={() => setBudget(250000)} className="hover:text-slate-900 font-medium">Recom: $250k</button>
                <button onClick={() => setBudget(500000)} className="hover:text-slate-900 font-medium">Premium: $500k</button>
              </div>
            </div>

            {/* Campaign Objective */}
            <div className="space-y-2.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Objetivo Estratégico de Pauta
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { name: "Branding & Presencia", desc: "Maximiza el volumen de impactos en zonas de alto tráfico mixto.", icon: Target },
                  { name: "Llamado a la Acción (CRO)", desc: "Orienta la pauta a zonas peatonales de Mendoza para interacción inmediata.", icon: Sparkles },
                  { name: "Flujo Vehicular Rápido", desc: "Prioriza grandes pantallas LED en autopistas y corredores rápidos.", icon: TrendingUp }
                ].map((obj) => (
                  <button
                    key={obj.name}
                    onClick={() => setObjective(obj.name)}
                    className={`p-3 rounded-xl border text-left transition-all flex gap-3 cursor-pointer ${
                      objective === obj.name
                        ? "border-slate-900 bg-slate-50 text-slate-900"
                        : "border-slate-150 bg-white text-slate-600 hover:bg-slate-50/50"
                    }`}
                  >
                    <obj.icon className={`h-5 w-5 mt-0.5 shrink-0 ${objective === obj.name ? "text-slate-900" : "text-slate-400"}`} />
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-slate-900">{obj.name}</span>
                      <span className="block text-[10px] text-slate-400 leading-normal">{obj.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Zone Filter */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Preferencia Geográfica
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableZones.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => setZonePreference(zone)}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                      zonePreference === zone
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Duration */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Duración de la Campaña</span>
                <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-mono font-bold">
                  {duration} Semanas
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                <span>1 Semana</span>
                <span>1 Mes</span>
                <span>3 Meses</span>
              </div>
            </div>

            {/* Trigger Button */}
            <Button
              onClick={handleGeneratePlan}
              disabled={loading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Optimizando Pauta...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  Diseñar Circuito Inteligente
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Side: Generated Proposal */}
        <div className="lg:col-span-8 space-y-6">
          {plannedCircuit ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* ROI & Key Indicators Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Impactos Estimados</span>
                  <span className="text-2xl font-black text-slate-950 font-mono block">
                    {(plannedCircuit.totalEstimatedImpacts * (plannedCircuit.durationWeeks || duration)).toLocaleString("es-AR")}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    En {(plannedCircuit.durationWeeks || duration)} semanas de campaña
                  </span>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">CPM Predicho Promedio</span>
                  <span className="text-2xl font-black text-slate-950 font-mono block">
                    ${plannedCircuit.roiMetrics?.predictedCpm?.toLocaleString("es-AR") || "3,200"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Costo por mil reproducciones
                  </span>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Recuerdo de Marca Estimado</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono block">
                    +{plannedCircuit.roiMetrics?.brandRecallIncreasePercent || 15}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    Retorno sobre objetivo de pauta
                  </span>
                </div>
              </div>

              {/* Proposal Details Card */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-900">Propuesta de Distribución en Mendoza</h3>
                    <p className="text-[10px] text-slate-400">Costo total de inversión: <strong className="text-[#06434a] font-bold">Bajo cotización</strong></p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSavePlan}
                      variant="outline"
                      size="sm"
                      className="h-8.5 font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Save className="h-3.5 w-3.5 text-slate-500" />
                      Guardar Propuesta
                    </Button>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Strategic Copy Description */}
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5 relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center translate-x-4 -translate-y-4">
                      <Sparkles className="h-5 w-5 text-amber-500 opacity-50" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Análisis de la Estrategia IA</span>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl relative z-10 font-medium">
                      {plannedCircuit.mediaMixExplanation}
                    </p>
                  </div>

                  {/* Selected Screens Circuits */}
                  <div className="space-y-3">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Circuito DOOH Recomendado ({plannedCircuit.selectedScreenIds?.length || 0} Pantallas)
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {screens
                        .filter((s) => plannedCircuit.selectedScreenIds?.includes(s.id))
                        .map((screen) => {
                          const isAlreadyInCart = cart.includes(screen.id);
                          return (
                            <div key={screen.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-xs flex items-start gap-3 hover:border-slate-300 transition-all">
                              <div className="h-8 w-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-sm">
                                {screen.tipo.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="space-y-1.5 flex-grow min-w-0">
                                <div className="space-y-0.5">
                                  <h4 className="text-xs font-bold text-slate-900 truncate">{screen.nombre}</h4>
                                  <span className="text-[9px] text-slate-400 font-semibold uppercase block tracking-wider">{screen.zona}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[10px]">
                                  <span className="font-semibold text-slate-500 font-mono">
                                    {screen.impactos.toLocaleString("es-AR")} imp/sem
                                  </span>
                                  <span className="font-bold text-[#06434a]">
                                    Bajo cotización
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleCart(screen.id)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isAlreadyInCart
                                    ? "bg-slate-900 border-slate-900 text-white"
                                    : "bg-white border-slate-200 text-slate-400 hover:text-slate-950 hover:border-slate-300"
                                }`}
                                title={isAlreadyInCart ? "En cotización" : "Añadir a mi Cotización"}
                              >
                                {isAlreadyInCart ? <Check className="h-3.5 w-3.5" /> : <ListPlus className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Simulated Daily Performance Curve (Pure SVG) */}
                  <div className="space-y-3 pt-2">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Simulación de Impacto Diario Acumulado (Audiencia Activa)
                    </span>
                    <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50">
                      <div className="h-28 w-full flex items-end gap-1.5 pt-4">
                        {[45, 55, 68, 85, 92, 110, 128, 115, 95, 120, 138, 150].map((val, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <span className="text-[8px] font-bold text-slate-400 font-mono">{(val * 100).toLocaleString("es-AR")}</span>
                            <div
                              className="w-full bg-slate-900 rounded-t-sm transition-all duration-1000 ease-out hover:bg-slate-800"
                              style={{ height: `${(val / 150) * 80}%` }}
                            />
                            <span className="text-[8px] font-black text-slate-400 uppercase font-mono">D{idx+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-2xl bg-white p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-md mx-auto shadow-sm">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-slate-50 border border-slate-100 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-slate-100 border border-slate-200/50 animate-ping [animation-duration:4s]" />
                <HelpCircle className="h-8 w-8 text-slate-400 relative z-10" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm">No se ha generado ningún circuito</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Completa los parámetros de presupuesto y preferencias en el panel de la izquierda para que nuestra inteligencia diseñe un circuito publicitario optimizado.
                </p>
              </div>
              <Button
                onClick={handleGeneratePlan}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs cursor-pointer px-4"
              >
                Generar Propuesta Inicial
              </Button>
            </div>
          )}

          {/* Saved Circuits Catalog */}
          {savedPlans.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Propuestas Guardadas ({savedPlans.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {savedPlans.map((plan) => (
                  <div key={plan.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block">{plan.title}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        Guardado el {plan.date} • {plan.screensCount} Pantallas • {plan.duration} Semanas
                      </span>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="font-mono font-bold text-slate-800 block">
                        {(plan.impacts * plan.duration).toLocaleString("es-AR")} imp.
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        Alcance: {plan.reach.toLocaleString("es-AR")} personas
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
