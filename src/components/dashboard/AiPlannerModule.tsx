import React, { useState } from "react";
import { DoohScreen } from "../../types";
import { MediaKit, Role } from "./types";
import { useToast } from "../ui/Toast";
import { safeFetchJson } from "../../lib/apiClient";
import { 
  Sparkles, 
  DollarSign, 
  Target, 
  MapPin, 
  HelpCircle, 
  Cpu, 
  ArrowRight, 
  CheckCircle, 
  Tv, 
  TrendingUp, 
  Users, 
  Activity,
  FilePlus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AiPlannerModuleProps {
  screens: DoohScreen[];
  token: string | null;
  onAddMediaKit: (mk: MediaKit) => void;
  userRole: Role;
}

interface PlanResult {
  selectedScreenIds: string[];
  durationWeeks: number;
  totalCost: number;
  totalEstimatedImpacts: number;
  mediaMixExplanation: string;
  roiMetrics: {
    brandRecallIncreasePercent: number;
    predictedCpm: number;
    estimatedReach: number;
  };
}

export const AiPlannerModule: React.FC<AiPlannerModuleProps> = ({
  screens,
  token,
  onAddMediaKit,
  userRole,
}) => {
  const { toast } = useToast();
  // Input fields
  const [budget, setBudget] = useState<number>(500000);
  const [objective, setObjective] = useState<string>("Branding");
  const [zonePreference, setZonePreference] = useState<string>("Centro");

  // State for AI processing
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Custom message loading cycle
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Analizando inventario disponible en Mendoza...",
    "Consultando modelos predictivos de impacto (CPM)...",
    "Optimizando mix de medios exteriores con Gemini AI...",
    "Generando plan de cobertura y proyección de ROI..."
  ];

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Dynamic loading text step interval
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    try {
      const res = await safeFetchJson<{ success: boolean; data?: any; error?: string }>("/api/ai/plan-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          budget,
          objective,
          zonePreference,
        }),
      });

      if (res.ok && res.data?.success && res.data.data) {
        setResult(res.data.data);
      } else {
        setError(res.data?.error || res.error || "Hubo un error al procesar la planificación con Inteligencia Artificial.");
      }
    } catch (err: any) {
      setError(err.message || "Error de red al conectar con el servidor.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // Convert recommended plan to MediaKit
  const handleConvertToMediaKit = () => {
    if (!result) return;

    const mkId = `mk-ai-${Date.now()}`;
    const recommendedScreensDetails = screens.filter(s => result.selectedScreenIds.includes(s.id));

    const soportesEdicion = recommendedScreensDetails.map(s => ({
      id: s.id,
      notas: "Recomendado automáticamente por Planificador IA",
      prioridad: "Alta" as const,
      duracionSem: result.durationWeeks || 4
    }));

    const newMediaKit: MediaKit = {
      id: mkId,
      nombre: `Plan IA: ${objective} - Presupuesto $${budget.toLocaleString()}`,
      clienteId: "cl-04", // Default Café Central or a general client
      clienteNombre: "Franquicias Café Central",
      ciudad: "Mendoza",
      screenIds: result.selectedScreenIds,
      version: 1,
      estado: "Borrador",
      fecha: new Date().toISOString().split('T')[0],
      presupuesto: result.totalCost,
      objetivo: `${objective} - Zona Preferida: ${zonePreference}`,
      comentarios: [
        {
          id: `comment-${Date.now()}`,
          user: "Planificador IA",
          text: `Plan de campaña generado automáticamente por IA. ${result.mediaMixExplanation}`,
          date: new Date().toLocaleString()
        }
      ],
      historial: [
        {
          id: `history-${Date.now()}`,
          action: "Propuesta recomendada y estructurada por Planificador IA",
          date: new Date().toLocaleString(),
          user: "Inteligencia Artificial"
        }
      ],
      soportesEdicionInline: soportesEdicion
    };

    onAddMediaKit(newMediaKit);
    toast.success("¡Plan de campaña IA convertido a MediaKit exitosamente! Podrás verlo y editarlo en la sección 'Editor de MediaKits'.", "Plan Convertido");
  };

  // Lookup full screen info for selected IDs
  const recommendedScreens = result
    ? screens.filter((s) => result.selectedScreenIds.includes(s.id))
    : [];

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans space-y-6 text-left">
      
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-[10px] bg-[#06434a]/10 text-[#06434a] border border-[#06434a]/20 font-bold tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1 w-fit">
          <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500 animate-pulse" />
          <span>DOOH Brain Engine</span>
        </span>
        <h2 className="text-xl font-bold text-stone-950 font-display mt-2">
          Planificador Comercial Inteligente (IA)
        </h2>
        <p className="text-xs text-stone-500 mt-1 max-w-2xl font-semibold">
          Indica el presupuesto de tu cliente, el objetivo principal de la pauta y las zonas geográficas de interés. El motor generará una recomendación optimizada de soportes basada en rentabilidad, impactos semanales y predicción de retorno de marca.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: input form */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-lg p-6 shadow-2xs space-y-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-[#06434a]" />
            <span>Configurar Pauta</span>
          </h3>

          <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs">
            
            {/* Budget */}
            <div className="space-y-1.5">
              <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">
                Presupuesto Semanal Máximo (ARS)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="number"
                  required
                  min={10000}
                  max={50000000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-md bg-stone-50/50 focus:outline-none focus:border-[#06434a]"
                />
              </div>
              <p className="text-[9px] text-stone-400 font-medium">Recomendado: Mayor a $100,000 para mix mínimo.</p>
            </div>

            {/* Campaign Objective */}
            <div className="space-y-1.5">
              <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">
                Objetivo de Campaña
              </label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50/50 focus:outline-none cursor-pointer"
              >
                <option value="Branding">Branding Masivo (Recordación)</option>
                <option value="Tráfico">Generación de Tráfico Directo</option>
                <option value="Lanzamiento">Lanzamiento de Producto Nuevo</option>
                <option value="Estacional">Pauta de Temporada / PyME</option>
              </select>
            </div>

            {/* Zone Preference */}
            <div className="space-y-1.5">
              <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">
                Zona de Preferencia
              </label>
              <select
                value={zonePreference}
                onChange={(e) => setZonePreference(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50/50 focus:outline-none cursor-pointer"
              >
                <option value="Centro">Mendoza Centro (Gran Flujo Peatonal)</option>
                <option value="Palmares">Palmares / Luján (Público de Alto Valor)</option>
                <option value="Godoy Cruz">Godoy Cruz / Acceso Sur (Vehicular)</option>
                <option value="Las Heras">Las Heras (Tráfico Mixto)</option>
                <option value="Metropolitana">Metropolitana (LeadMóviles en ruta)</option>
                <option value="Cualquiera">Cualquier Zona (Optimización Absoluta)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#06434a] hover:bg-[#0b5e67] disabled:bg-stone-200 text-white font-extrabold uppercase text-[10px] rounded-md cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Optimizando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Estructurar Plan con IA</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right column: results display */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-stone-200 rounded-lg p-12 text-center flex flex-col items-center justify-center space-y-4 h-[350px]"
              >
                <Loader2 className="h-8 w-8 text-[#06434a] animate-spin" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-widest animate-pulse">Procesando Consulta IA</h4>
                  <p className="text-[10px] text-stone-500 font-medium">{loadingMessages[loadingStep]}</p>
                </div>
              </motion.div>
            )}

            {!loading && error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-red-950">Error del Servidor</h4>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            {!loading && !result && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-stone-50 border border-dashed border-stone-200 rounded-lg p-16 text-center space-y-3 h-[350px] flex flex-col items-center justify-center"
              >
                <Cpu className="h-10 w-10 text-stone-300" />
                <h3 className="text-xs font-bold text-stone-850">Esperando Parámetros</h3>
                <p className="text-[10px] text-stone-500 max-w-md mx-auto">
                  Selecciona la configuración del cliente en el panel de la izquierda y presiona "Estructurar Plan con IA" para iniciar el algoritmo predictivo de pauta.
                </p>
              </motion.div>
            )}

            {!loading && result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                
                {/* Plan Overview KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-stone-200 p-4 rounded-lg flex flex-col justify-between shadow-2xs">
                    <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider font-mono">Presupuesto Sugerido</span>
                    <span className="text-lg font-black text-emerald-600 font-mono mt-1">${result.totalCost.toLocaleString()} ARS</span>
                    <span className="text-[9px] text-stone-400 font-medium mt-1">Costo semanal estimado</span>
                  </div>
                  
                  <div className="bg-white border border-stone-200 p-4 rounded-lg flex flex-col justify-between shadow-2xs">
                    <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider font-mono">Impactos Semanales Totales</span>
                    <span className="text-lg font-black text-[#06434a] font-mono mt-1">{result.totalEstimatedImpacts.toLocaleString()}</span>
                    <span className="text-[9px] text-stone-400 font-medium mt-1">Visualizaciones masivas directas</span>
                  </div>

                  <div className="bg-white border border-stone-200 p-4 rounded-lg flex flex-col justify-between shadow-2xs">
                    <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider font-mono">Duración Óptima</span>
                    <span className="text-lg font-black text-purple-600 font-mono mt-1">{result.durationWeeks} Semanas</span>
                    <span className="text-[9px] text-stone-400 font-medium mt-1">Sugerencia recomendada por IA</span>
                  </div>
                </div>

                {/* ROI metrics cards */}
                <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span>Métricas de Retorno (ROI Proyectado)</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                    <div className="p-3 bg-stone-50 rounded-lg">
                      <span className="block text-[8px] font-bold text-stone-400 uppercase">Aumento de Recordación</span>
                      <span className="text-base font-black text-[#06434a] mt-1 block">+{result.roiMetrics.brandRecallIncreasePercent}%</span>
                      <span className="text-[8px] text-stone-400 block mt-0.5">Brand Recall index de Mendoza</span>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-lg">
                      <span className="block text-[8px] font-bold text-stone-400 uppercase">CPM Promedio Proyectado</span>
                      <span className="text-base font-black text-stone-850 mt-1 block">${result.roiMetrics.predictedCpm.toLocaleString()} ARS</span>
                      <span className="text-[8px] text-stone-400 block mt-0.5">Costo por mil visualizaciones</span>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-lg">
                      <span className="block text-[8px] font-bold text-stone-400 uppercase">Alcance Único Estimado</span>
                      <span className="text-base font-black text-emerald-600 mt-1 block">{result.roiMetrics.estimatedReach.toLocaleString()} personas</span>
                      <span className="text-[8px] text-stone-400 block mt-0.5">Contactos limpios de duplicación</span>
                    </div>
                  </div>
                </div>

                {/* AI Explanation of Media Mix */}
                <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span>Justificación de Mix de Soportes & Plan</span>
                  </h4>
                  <div className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-4 rounded border border-stone-150 text-justify font-sans">
                    {result.mediaMixExplanation}
                  </div>
                </div>

                {/* Recommended Screens Cards */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <Tv className="h-4 w-4" />
                    <span>Soportes Seleccionados por IA ({recommendedScreens.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedScreens.map((screen) => (
                      <div key={screen.id} className="bg-white border border-stone-200 rounded-lg p-4 flex gap-3 shadow-3xs hover:border-stone-300 transition-colors">
                        <div className="h-10 w-10 rounded bg-[#06434a]/10 flex items-center justify-center text-[#06434a] shrink-0 font-bold text-xs font-mono">
                          {screen.id}
                        </div>
                        <div className="min-w-0 text-left space-y-1">
                          <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase border bg-stone-50 text-stone-600">
                            {screen.zona} • {screen.tipo}
                          </span>
                          <h5 className="text-xs font-bold text-stone-900 truncate font-display">{screen.nombre}</h5>
                          <div className="flex gap-4 text-[9px] font-mono text-stone-400 font-bold">
                            <span>Tarifa: <strong className="text-stone-700">${screen.precio.toLocaleString()} /sem</strong></span>
                            <span>Impacto: <strong className="text-stone-700">{screen.impactos.toLocaleString()} /sem</strong></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Convert to MediaKit Button */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    onClick={() => {
                      setResult(null);
                      setError(null);
                    }}
                    className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Borrar Plan
                  </button>
                  
                  <button
                    onClick={handleConvertToMediaKit}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold uppercase text-[10px] rounded-full flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                  >
                    <FilePlus className="h-4 w-4" />
                    <span>Exportar a MediaKit</span>
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
