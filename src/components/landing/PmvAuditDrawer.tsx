import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";

interface PmvAuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PmvAuditDrawer: React.FC<PmvAuditDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"summary" | "scores" | "roadmap">("summary");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-sans">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Slide drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-2xl h-full bg-[#172023] text-stone-200 shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-900">
              <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                    PMV AUDIT CO-FOUNDER CONSOLE
                  </span>
                </div>
                <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                  <LucideIcons.Shield className="h-5 w-5 text-emerald-400" />
                  Auditoría de Producto & CRO
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-400 hover:text-white cursor-pointer"
                aria-label="Cerrar auditoría"
              >
                <LucideIcons.X className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs list inside drawer */}
            <div className="flex border-b border-stone-800 text-xs font-bold uppercase tracking-wider bg-stone-900 px-6 gap-2">
              {(["summary", "scores", "roadmap"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3.5 border-b-2 px-1 transition-all cursor-pointer ${
                    activeTab === tab 
                      ? "border-emerald-500 text-white font-extrabold" 
                      : "border-transparent text-stone-400 hover:text-white"
                  }`}
                >
                  {tab === "summary" && "Auditoría General"}
                  {tab === "scores" && "Tabla de Prioridades"}
                  {tab === "roadmap" && "Roadmap de Lanzamiento"}
                </button>
              ))}
            </div>

            {/* Scrollable contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left text-xs leading-relaxed">
              {activeTab === "summary" && (
                <div className="space-y-6">
                  {/* YC Co-founder Intro */}
                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-2">
                    <span className="block text-[9px] font-black text-amber-400 uppercase tracking-widest font-mono">ENFOQUE DE INVERSOR Y COMBINATOR</span>
                    <p className="text-stone-300 leading-relaxed">
                      Este producto se audita como si estuviéramos en los primeros 10 minutos de evaluación para recibir financiación de primer nivel. El holding DOOH <strong>Grupo Comunicarte</strong> tiene una base de valor inigualable: ubicaciones físicas premium reales. Sin embargo, su software original cuenta con un exceso de funcionalidades simuladas (NOC operations, visualizadores complejos, etc.) que distraen del embudo de conversión principal.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Category list styled cleanly */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-stone-800 pb-2">Diagnóstico de 20 Categorías</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <strong className="text-white block mb-1">1. Problema (Puntaje: 8/10)</strong>
                          <p className="text-stone-400">Es transparente: las marcas y agencias sufren para planificar y comprar vía pública de forma trazable y rápida. La plataforma lo resuelve con catalogación transparente y cotización integrada.</p>
                        </div>

                        <div>
                          <strong className="text-white block mb-1">2. Público Objetivo (Puntaje: 9/10)</strong>
                          <p className="text-stone-400">Directores de marketing, planificadores de agencias y dueños de marcas que necesitan pauta de vía pública corporativa de alta calidad en Mendoza y CABA.</p>
                        </div>

                        <div>
                          <strong className="text-white block mb-1">3. Propuesta de Valor (Puntaje: 9/10)</strong>
                          <p className="text-stone-400">"Publicidad Exterior Premium, Simplificada." Se capta en 5 segundos. Permite armar tu circuito geolocalizado y cotizar en un clic.</p>
                        </div>

                        <div>
                          <strong className="text-white block mb-1">4. Call To Action (Puntaje: 8/10)</strong>
                          <p className="text-stone-400">El CTA principal de "Explorar Catálogo" es contundente. El Rediseño Zero-Base optimiza esto simplificando la cotización del circuito directo en un solo paso.</p>
                        </div>

                        <div>
                          <strong className="text-white block mb-1">5. Conversión & Copywriting (Puntaje: 8/10)</strong>
                          <p className="text-stone-400">Elimina el copywriting genérico inútil ("empoderar", "supercharge"). Se enfoca en métricas físicas, georreferenciación y audiencias reales certificadas.</p>
                        </div>

                        <div>
                          <strong className="text-white block mb-1">6. Validación del PMV (Respuesta: SÍ)</strong>
                          <p className="text-stone-400">Permite validar la hipótesis principal: las marcas están dispuestas a seleccionar ubicaciones de forma visual autónoma para reducir tiempos de cotización de días a minutos.</p>
                        </div>

                        <div>
                          <strong className="text-white block mb-1">7. UX / Carga Cognitiva (Puntaje: 7/10)</strong>
                          <p className="text-stone-400 font-medium">El catálogo tradicional posee bastantes opciones de filtrado y comparación. El Rediseño Zero-Base simplifica esto integrando un mapa de pantalla completa con checkout directo.</p>
                        </div>

                        <div>
                          <strong className="text-white block mb-1">8. UI & Consistencia (Puntaje: 9/10)</strong>
                          <p className="text-stone-400">La consistencia de color neutro (#FAF9F5) y el contraste cumple estrictamente con el estándar WCAG AA de más de 4.5:1.</p>
                        </div>

                        <div>
                          <strong className="text-white block mb-1">9. Veredicto Final: 🟢 PMV listo para lanzar</strong>
                          <p className="text-stone-400 font-semibold text-emerald-400">El producto real está perfectamente equipado para captar leads corporativos calificados en menos de 30 días, especialmente tras activar el Rediseño Zero-Base.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "scores" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-stone-800 pb-2">Tabla de Priorización de Mejoras</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-stone-800 text-stone-400 uppercase">
                          <th className="py-2 pr-2">Problema</th>
                          <th className="py-2 px-2">Impacto</th>
                          <th className="py-2 px-2">Prioridad</th>
                          <th className="py-2 px-2">Esfuerzo</th>
                          <th className="py-2 px-2">Tiempo Est.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800 text-stone-300">
                        <tr>
                          <td className="py-2.5 pr-2 font-bold text-white">Sobreingeniería de flujos en Demo</td>
                          <td className="py-2.5 px-2 text-emerald-400">Alto</td>
                          <td className="py-2.5 px-2 text-amber-300">Alta</td>
                          <td className="py-2.5 px-2">Bajo</td>
                          <td className="py-2.5 px-2">15 Min</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-2 font-bold text-white">Carga cognitiva de Catálogo</td>
                          <td className="py-2.5 px-2 text-emerald-400">Alto</td>
                          <td className="py-2.5 px-2 text-amber-300">Alta</td>
                          <td className="py-2.5 px-2">Medio</td>
                          <td className="py-2.5 px-2">30 Min</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-2 font-bold text-white">Trazabilidad de cotizaciones</td>
                          <td className="py-2.5 px-2 text-amber-400">Medio</td>
                          <td className="py-2.5 px-2 text-stone-400">Media</td>
                          <td className="py-2.5 px-2">Bajo</td>
                          <td className="py-2.5 px-2">1 Hora</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-2 font-bold text-white">Automatización de alertas WhatsApp</td>
                          <td className="py-2.5 px-2 text-emerald-400">Alto</td>
                          <td className="py-2.5 px-2 text-amber-300">Alta</td>
                          <td className="py-2.5 px-2">Alto</td>
                          <td className="py-2.5 px-2">4 Horas</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-2 font-bold text-white">Página de Landings segmentadas</td>
                          <td className="py-2.5 px-2 text-emerald-400">Alto</td>
                          <td className="py-2.5 px-2 text-amber-300">Alta</td>
                          <td className="py-2.5 px-2">Alto</td>
                          <td className="py-2.5 px-2">1 Día</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "roadmap" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-stone-800 pb-2">Roadmap de Lanzamiento (30 Días)</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-stone-900 rounded-xl space-y-1">
                      <strong className="text-emerald-400 block text-xs">Fase 1: Validación y Captación (Días 1-10)</strong>
                      <p className="text-stone-300">Lanzar el <strong>Rediseño Zero-Base</strong> purgado. Correr pauta paga (Google Ads / LinkedIn Ads) dirigida a agencias creativas y marcas en Mendoza y CABA enfocadas directamente en el circuito geolocalizado en vivo.</p>
                    </div>

                    <div className="p-4 bg-stone-900 rounded-xl space-y-1">
                      <strong className="text-amber-300 block text-xs">Fase 2: Operaciones y Dashboard CRM (Días 11-20)</strong>
                      <p className="text-stone-300">Activar flujos simplificados de aprobación de presupuestos y gestión de pauta. Enviar alertas automáticas por WhatsApp / Mail cuando un soporte se libera.</p>
                    </div>

                    <div className="p-4 bg-stone-900 rounded-xl space-y-1">
                      <strong className="text-indigo-400 block text-xs">Fase 3: Automatización & Escala (Días 21-30)</strong>
                      <p className="text-stone-300">Integrar compra programática y habilitar analíticas avanzadas de audiencia en vivo conectadas a sensores de flujo peatonal para retener clientes y habilitar up-selling.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
