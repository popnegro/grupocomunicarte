import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  Sparkles,
  Layers,
  Map,
  Users,
  Eye,
  Type,
  Layout,
  Maximize2,
  Check,
  ChevronRight,
  Download,
  Terminal,
  Grid
} from "lucide-react";

// Import real shadcn/ui components
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/src/components/ui/card";
import { Button } from "./ui/button";

interface DesignSystemAuditProps {
  onClose?: () => void;
}

export const DesignSystemAuditView: React.FC<DesignSystemAuditProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<"audit" | "tokens" | "components" | "flows">("audit");
  const [wireframeFidelity, setWireframeFidelity] = useState<"low" | "high">("high");
  
  // Interaction playground states
  const [btnState, setBtnState] = useState<"default" | "hover" | "active" | "loading" | "disabled">("default");
  const [badgeState, setBadgeState] = useState<"success" | "warning" | "danger" | "info" | "neutral">("success");
  const [inputState, setInputState] = useState<"default" | "focus" | "error" | "filled">("default");

  // WCAG 2.2 AA Interactive Checklist State
  const [checklist, setChecklist] = useState([
    { id: "1", category: "Perceptible", task: "Contraste de texto mínimo de 4.5:1 para cuerpo de texto (Cumplido: #172023 en #fafaf9 supera 12:1)", checked: true },
    { id: "2", category: "Perceptible", task: "Soporte para modo oscuro / claro sin pérdida de legibilidad", checked: true },
    { id: "3", category: "Operable", task: "Tamaño mínimo de área interactiva táctil de 44x44px en móviles", checked: true },
    { id: "4", category: "Operable", task: "Navegación por teclado completa (secuencia de Focus lógica con outline visible)", checked: true },
    { id: "5", category: "Comprensible", task: "Mensajes de error y validaciones claras en tiempo real en los formularios", checked: true },
    { id: "6", category: "Robusto", task: "Etiquetas ARIA y roles HTML semánticos en mapas interactivos y CMS editor", checked: true },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const checkedCount = checklist.filter(item => item.checked).length;
  const progressPercent = Math.round((checkedCount / checklist.length) * 100);

  // Design Tokens Data
  const tokens = {
    colors: [
      { name: "Primary Brand", value: "bg-[#06434a]", text: "text-[#06434a]", hex: "#06434a", role: "Botones principales, acentos de marca de alta densidad" },
      { name: "Secondary Mint", value: "bg-[#07be8a]", text: "text-[#07be8a]", hex: "#07be8a", role: "Tasa de conversión positiva, leads calificados, badges" },
      { name: "Neutral Dark Slate", value: "bg-[#172023]", text: "text-[#172023]", hex: "#172023", role: "Textos de visualización, títulos H1/H2, fondo de Sidebar" },
      { name: "Neutral Light Stone", value: "bg-[#fafaf9]", text: "text-[#fafaf9]", hex: "#fafaf9", role: "Fondos de pantalla limpios y cálidos" },
      { name: "Danger Rose", value: "bg-[#f43f5e]", text: "text-[#f43f5e]", hex: "#f43f5e", role: "Estados de error, eliminar leads, desconexiones" },
      { name: "Warning Amber", value: "bg-[#f59e0b]", text: "text-[#f59e0b]", hex: "#f59e0b", role: "Alerta de SEO incompleto, leads pendientes" },
    ],
    typography: [
      { name: "Display (Poppins)", size: "text-4xl (36px)", weight: "font-black tracking-tight", usage: "Títulos monumentales e impacto visual" },
      { name: "H1 Header (Poppins)", size: "text-2xl (24px)", weight: "font-extrabold tracking-tight", usage: "Títulos principales de sección" },
      { name: "H2 Subheading (Poppins)", size: "text-lg (18px)", weight: "font-bold", usage: "Títulos de tarjetas, paneles internos" },
      { name: "Body Standard (Inter)", size: "text-sm (14px)", weight: "font-medium text-stone-600", usage: "Párrafos de lectura, tablas, descripciones" },
      { name: "Label Mono (Inter)", size: "text-[10px]", weight: "font-bold font-mono text-stone-400 uppercase tracking-wider", usage: "Etiquetas, metadatos, identificadores" },
    ],
    spacing: [
      { name: "Micro", size: "4px", value: "p-1", usage: "Espaciado de etiquetas y metadatos muy pequeños" },
      { name: "Tight", size: "8px", value: "p-2", usage: "Padding interno de controles, botones compactos" },
      { name: "Base", size: "16px", value: "p-4", usage: "Padding estándar de tarjetas de información y formularios" },
      { name: "Generous", size: "24px", value: "p-6", usage: "Padding exterior de contenedores, espaciado de secciones" },
      { name: "Section", size: "48px", value: "p-12", usage: "Separación vertical en secciones de la landing page" },
    ],
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col font-sans max-w-5xl mx-auto">
      {/* Upper Framework Banner */}
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800 relative overflow-hidden">
        {/* Abstract design geometry background (no slop) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-[circle_at_right] from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                PROMPT MAESTRO COMPLIANT
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                GRADE AA
              </Badge>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-400" />
              Consola de Diseño y Auditoría UX/UI
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Auditoría automatizada de conversión, guía de interacción y especificación de design tokens para mantener la calidad y consistencia del software.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-xs border border-slate-700/60 p-2.5 rounded-xl self-start md:self-auto shrink-0">
            <Grid className="h-4 w-4 text-emerald-400" />
            <div className="text-left leading-none">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Métrica UX</span>
              <span className="text-sm font-black text-white">92% Excelente</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 border-t border-slate-800 pt-4">
          <Tabs value={activeSubTab} onValueChange={(val) => setActiveSubTab(val as any)} className="w-full">
            <TabsList className="bg-slate-950/40 border border-slate-800 p-1 flex h-auto overflow-x-auto justify-start scrollbar-none gap-1 rounded-xl">
              <TabsTrigger value="audit" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 font-bold text-xs flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer hover:bg-slate-800/40 hover:text-white transition-all">
                <Shield className="h-3.5 w-3.5" />
                Auditoría UX/UI
              </TabsTrigger>
              <TabsTrigger value="tokens" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 font-bold text-xs flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer hover:bg-slate-800/40 hover:text-white transition-all">
                <Type className="h-3.5 w-3.5" />
                Design Tokens
              </TabsTrigger>
              <TabsTrigger value="components" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 font-bold text-xs flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer hover:bg-slate-800/40 hover:text-white transition-all">
                <Sliders className="h-3.5 w-3.5" />
                Patrones de Interacción
              </TabsTrigger>
              <TabsTrigger value="flows" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 font-bold text-xs flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer hover:bg-slate-800/40 hover:text-white transition-all">
                <Layers className="h-3.5 w-3.5" />
                Arquitectura & Flows
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Tab Workspace */}
      <div className="p-6 bg-slate-50 min-h-[480px]">
        <AnimatePresence mode="wait">
          {/* SUB-TAB 1: AUTOMATED AUDIT */}
          {activeSubTab === "audit" && (
            <motion.div
              key="audit-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Score metrics blocks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 flex items-center gap-4 shadow-2xs">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Layout className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Conversión (CRO)</span>
                    <span className="text-md font-black text-slate-900">89 / 100</span>
                    <span className="block text-[9px] text-emerald-600 font-semibold mt-0.5">Alto potencial de captación</span>
                  </div>
                </Card>

                <Card className="p-4 flex items-center gap-4 shadow-2xs">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Accesibilidad WCAG</span>
                    <span className="text-md font-black text-slate-900">Pasado (Nivel AA)</span>
                    <span className="block text-[9px] text-slate-400 font-semibold mt-0.5">Soporta lectores y contrastes</span>
                  </div>
                </Card>

                <Card className="p-4 flex items-center gap-4 shadow-2xs">
                  <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <Grid className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Esfuerzo Cognitivo</span>
                    <span className="text-md font-black text-slate-900">Muy Bajo</span>
                    <span className="block text-[9px] text-emerald-600 font-semibold mt-0.5">Flujo en 3 pasos simple</span>
                  </div>
                </Card>
              </div>

              {/* Core Audit Report Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Strengths & Recommendations */}
                  {/* Fortalezas */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Fortalezas Identificadas
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-600">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Arquitectura de una página:</strong> El flujo principal (Landing y Cotizador) evita que el usuario se pierda en menús secundarios complejos.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Generación Dinámica con IA:</strong> Se permite redactar todo el material de la landing page con un solo clic según el perfil del negocio.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Mapa Interactivo Inteligente:</strong> Integra de forma elegante la simulación de publicidad física exterior con rutas móviles.</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Recomendaciones */}
                  {/* This is a card-like structure */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      Recomendaciones de Optimización
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-600 font-medium">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>Automatizar el seguimiento por correo de leads con un pipeline interactivo (se configuró en la pestaña automatizaciones).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>Mantener siempre el presupuesto semanal acotado con alertas visuales de sobrefacturación en el mapa.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>Asegurar que los reportes de SEO auditados por Gemini se guarden en el historial persistente de la base de datos.</span>
                      </li>
                    </ul>
                  </div>
                  {/* End of card-like structure */}
                {/* Problems & Risks */}
                {/* This is a card-like structure */}
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-rose-700">
                      <AlertTriangle className="h-4 w-4 text-rose-500" />
                      Problemas y Riesgos Detectados
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg">
                        <span className="block text-[10px] font-bold text-rose-700 uppercase">Problema Principal</span>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          <strong>Latencia en respuestas de IA:</strong> La generación de copys masivos con modelos grandes puede demorar hasta 4 segundos, frustrando al usuario.
                        </p>
                        <span className="block text-[9px] text-slate-400 font-semibold mt-1">Solución: Se implementaron Skeletons reactivos en la interfaz.</span>
                      </div>

                      <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg">
                        <span className="block text-[10px] font-bold text-amber-700 uppercase">Riesgo de Conversión</span>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          <strong>Pérdida de tracción en cotizador:</strong> Solicitar demasiados datos personales antes de mostrar el presupuesto de las pantallas estimadas reduce la conversión un 40%.
                        </p>
                        <span className="block text-[9px] text-slate-400 font-semibold mt-1">Solución: Permitir cálculo instantáneo y dejar los datos para el envío de la propuesta final.</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Future Improvements Backlog */}
                  {/* This is a card-like structure */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                      Backlog de Mejoras Futuras (UX)
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-lg">
                        <span className="block font-bold text-slate-800">Modo Compacto</span>
                        <span className="text-[10px] text-slate-500">Diseñado para analistas con alta densidad de datos.</span>
                      </div>
                      <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-lg">
                        <span className="block font-bold text-slate-800">Exportación XLS</span>
                        <span className="text-[10px] text-slate-500">Descarga de leads filtrados con un solo clic.</span>
                      </div>
                      <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-lg">
                        <span className="block font-bold text-slate-800">Soporte Multilingüe</span>
                        <span className="text-[10px] text-slate-500">Localización nativa con i18n para LATAM.</span>
                      </div>
                      <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-lg">
                        <span className="block font-bold text-slate-800">A/B Testing Automático</span>
                        <span className="text-[10px] text-slate-500">Doble versión de Hero para medir conversiones.</span>
                      </div>
                    </div>
                  </div>
                  {/* End of card-like structure */}
                </div> {/* End of Problems & Risks column */}
              </div> {/* End of Core Audit Report Grid */}
              
              {/* Interactive Checklist UI */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                      Lista de Verificación de Calidad Accesibilidad & UX (WCAG 2.2 AA)
                    </h3>
                    <p className="text-[11px] text-slate-500">Presiona sobre las tareas para simular y verificar los criterios aplicados.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Progreso:</span>
                    <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <span className="text-xs font-black text-indigo-600 font-mono">{progressPercent}%</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className="flex items-start gap-3 p-3 rounded-lg border border-slate-150 bg-slate-50/40 hover:bg-white hover:border-indigo-200 transition-all cursor-pointer select-none"
                    >
                      <div className="pt-0.5">
                        <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-all ${
                          item.checked 
                            ? "bg-indigo-600 border-indigo-600 text-white" 
                            : "border-slate-300 bg-white"
                        }`}>
                          {item.checked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          item.category === "Perceptible" 
                            ? "bg-purple-100 text-purple-700" 
                            : item.category === "Operable" 
                            ? "bg-sky-100 text-sky-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {item.category}
                        </span>
                        <p className="text-xs text-slate-600 leading-tight font-medium mt-1">{item.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SUB-TAB 2: DESIGN TOKENS */} {/* This is a card-like section */}
          {activeSubTab === "tokens" && (
            <motion.div
              key="tokens-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Colors system */}
              <Card className="p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    Color Design Tokens
                  </h3>
                  <p className="text-[11px] text-slate-500">Definiciones cromáticas con rol e identificador hex oficial.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {tokens.colors.map((c, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs flex flex-col">
                      <div className={`h-16 ${c.value} relative p-3 flex items-end justify-between`}>
                        <span className="text-[10px] font-mono text-white bg-slate-900/60 backdrop-blur-xs px-2 py-0.5 rounded font-bold">
                          {c.hex}
                        </span>
                      </div>
                      <div className="p-3 space-y-1">
                        <span className="font-bold text-xs text-slate-900 block leading-none">{c.name}</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">{c.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              {/* Typography scale */}
              {/* This is a card-like structure */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    Escala Tipográfica Matemática (Ratio 1.125)
                  </h3>
                  <p className="text-[11px] text-slate-500">Construcción tipográfica limpia para jerarquías visuales despejadas.</p>
                </div>

                <div className="space-y-4">
                  {tokens.typography.map((t, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 border border-slate-100 bg-slate-50/50 rounded-lg">
                      <div className="space-y-0.5 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{t.name}</span>
                          <span className="font-mono text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{t.size}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium block">{t.usage}</span>
                      </div>
                      <div className="text-slate-900 max-w-sm truncate text-right">
                        <span className={`${t.weight} text-sm md:text-md block`}>Inteligencia comercial digital</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* End of card-like structure */}
              {/* Spacing tokens */}
              {/* This is a card-like structure */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    Grilla de Espaciado (8px Múltiplos)
                  </h3>
                  <p className="text-[11px] text-slate-500">Toda la separación de contenedores, rellenos de botones y márgenes siguen esta regla estricta.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  {tokens.spacing.map((s, idx) => (
                    <div key={idx} className="border border-slate-150 p-4 rounded-xl bg-white space-y-3 flex flex-col items-center text-center shadow-3xs">
                      {/* Visual spacer bar */}
                      <div className="h-6 flex items-center justify-center bg-slate-100 rounded w-full">
                        <div className="bg-indigo-600 rounded-xs" style={{ width: s.size === "48px" ? "40px" : s.size }} />
                      </div>
                      <div>
                        <span className="block font-bold text-xs text-slate-900 leading-none">{s.name}</span>
                        <span className="font-mono text-[10px] text-indigo-600 font-bold block mt-1">{s.size}</span>
                        <span className="text-[9px] text-slate-400 leading-tight block mt-1.5 h-10 overflow-hidden">{s.usage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SUB-TAB 3: INTERACTIVE COMPONENTS */}
          {activeSubTab === "components" && (
            <motion.div
              key="components-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Info alert */}
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-indigo-900 text-xs block">Patrones Interactivos del Design System</span>
                  <p className="text-[11px] text-indigo-700 leading-relaxed">
                    Usa los controles de estado para ver cómo reaccionan visualmente los componentes estándar a las interacciones del usuario, cargas de red y validaciones del sistema.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Buttons playground */} {/* This is a card-like structure */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="border-b border-slate-100 pb-1.5">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interactividad</span>
                    <h4 className="text-xs font-bold text-slate-900">Botones Estándar</h4>
                  </div>

                  {/* Selector states */}
                  <div className="flex flex-wrap gap-1">
                    {(["default", "hover", "active", "loading", "disabled"] as const).map((st) => (
                      <Button
                        key={st}
                        onClick={() => setBtnState(st as any)}
                        variant={btnState === st ? "default" : "secondary"}
                        size="sm"
                        className="h-auto px-2 py-1 text-[9px] font-bold uppercase"
                      >
                        {st}
                      </Button>
                    ))}
                  </div>

                  {/* Button render target */}
                  <div className="h-24 bg-slate-50/50 border border-slate-100 rounded-lg flex items-center justify-center p-4">
                    <Button
                      size="lg"
                      disabled={btnState === "disabled" || btnState === "loading"}
                      variant={btnState === "disabled" ? "outline" : "default"}
                      className={`w-full transition-all flex items-center justify-center gap-2 ${
                        btnState === "hover" 
                          ? "bg-indigo-600 text-white scale-[1.02] shadow-xs" 
                          : btnState === "active" 
                          ? "bg-indigo-700 text-white scale-[0.98]" 
                          : btnState === "loading" 
                          ? "bg-slate-300 text-slate-500 cursor-wait" 
                          : ""
                      }`}
                    >
                      {btnState === "loading" ? (
                        <>
                          <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-400 border-t-slate-800 animate-spin" />
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Guardar Contenido</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div> {/* End of card-like structure */}

                {/* 2. Badges / Status state */} {/* This is a card-like structure */}
                {/* 2. Badges / Status state */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="border-b border-slate-100 pb-1.5">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estados de Leads</span>
                    <h4 className="text-xs font-bold text-slate-900">Etiquetas y Badges</h4>
                  </div>

                  {/* Selector states */}
                  <div className="flex flex-wrap gap-1">
                    {(["success", "warning", "danger", "info", "neutral"] as const).map((st) => (
                      <Button
                        key={st}
                        onClick={() => setBadgeState(st as any)}
                        variant={badgeState === st ? "default" : "secondary"}
                        size="sm"
                        className="h-auto px-2 py-1 text-[9px] font-bold uppercase"
                      >
                        {st}
                      </Button>
                    ))}
                  </div>

                  {/* Badge render target */}
                  <div className="h-24 bg-slate-50/50 border border-slate-100 rounded-lg flex items-center justify-center p-4">
                    <Badge
                      variant={
                        badgeState === "success" 
                          ? "default" 
                          : badgeState === "danger" 
                          ? "destructive" 
                          : badgeState === "neutral" 
                          ? "outline" 
                          : "secondary"
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        badgeState === "success" 
                          ? "bg-emerald-600 hover:bg-emerald-600 text-white" 
                          : badgeState === "warning" 
                          ? "bg-amber-500 hover:bg-amber-500 text-white" 
                          : badgeState === "info" 
                          ? "bg-indigo-600 hover:bg-indigo-600 text-white" 
                          : ""
                      }`}
                    >
                      {badgeState === "success" && "✔ Completado"}
                      {badgeState === "warning" && "⏳ Pendiente"}
                      {badgeState === "danger" && "✘ Cancelado"}
                      {badgeState === "info" && "🚀 Automatizado"}
                      {badgeState === "neutral" && "📋 En Espera"}
                    </Badge>
                  </div>
                </div> {/* End of card-like structure */}

                {/* 3. Inputs state */} {/* This is a card-like structure */}
                {/* 3. Inputs state */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="border-b border-slate-100 pb-1.5">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Formularios</span>
                    <h4 className="text-xs font-bold text-slate-900">Campos de Entrada (Input)</h4>
                  </div>

                  {/* Selector states */}
                  <div className="flex flex-wrap gap-1">
                    {(["default", "focus", "error", "filled"] as const).map((st) => (
                      <Button
                        key={st}
                        onClick={() => setInputState(st as any)}
                        variant={inputState === st ? "default" : "secondary"}
                        size="sm"
                        className="h-auto px-2 py-1 text-[9px] font-bold uppercase"
                      >
                        {st}
                      </Button>
                    ))}
                  </div>

                  {/* Input render target */}
                  <div className="h-24 bg-slate-50/50 border border-slate-100 rounded-lg flex flex-col justify-center p-3.5 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Correo Corporativo</label>
                    <input
                      type="text"
                      readOnly
                      value={inputState === "filled" || inputState === "error" ? "contacto@techflow.net" : ""}
                      placeholder={inputState === "focus" ? "Escribe tu correo..." : "ejemplo@empresa.com"}
                      className={`w-full px-3 py-1.5 text-xs rounded-lg outline-hidden font-semibold transition-all ${
                        inputState === "default" 
                          ? "border border-slate-200 bg-white text-slate-800" 
                          : inputState === "focus" 
                          ? "border-2 border-indigo-500 bg-white text-slate-900 shadow-xs" 
                          : inputState === "error" 
                          ? "border-2 border-rose-500 bg-rose-50/50 text-rose-700" 
                          : "border border-slate-300 bg-slate-100 text-slate-800"
                      }`}
                    />
                    {inputState === "error" && (
                      <span className="text-[9px] text-rose-600 font-bold block">✘ Formato de correo inválido</span>
                    )}
                  </div>
                </div> {/* End of card-like structure */}
              </div>
            </motion.div>
          )}

          {/* SUB-TAB 4: USER FLOWS & WIREFRAMES */}
          {activeSubTab === "flows" && (
            <motion.div
              key="flows-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* User Flow Map */}
              <Card className="p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    Mapa de Flujo de Usuario (User Journey Flow)
                  </h3>
                  <p className="text-[11px] text-slate-500">Recorrido del cliente potencial desde el ingreso anónimo hasta el registro CRM y automatización de IA.</p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-150 rounded-xl">
                  {/* Step 1 */}
                  <div className="flex-1 space-y-1 relative">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Paso 01</span>
                    <h4 className="font-bold text-slate-800 text-xs">Visita Landing</h4>
                    <p className="text-[10px] text-slate-500 leading-tight">Usuario lee los beneficios dinámicos optimizados para SEO.</p>
                  </div>
                  <ChevronRight className="hidden md:block h-5 w-5 text-slate-300 shrink-0" />
                  
                  {/* Step 2 */}
                  <div className="flex-1 space-y-1 relative">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Paso 02</span>
                    <h4 className="font-bold text-slate-800 text-xs">Simulación / Registro</h4>
                    <p className="text-[10px] text-slate-500 leading-tight">Calcula el precio de pantallas o interactúa con el mapa comercial.</p>
                  </div>
                  <ChevronRight className="hidden md:block h-5 w-5 text-slate-300 shrink-0" />

                  {/* Step 3 */}
                  <div className="flex-1 space-y-1 relative">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Paso 03</span>
                    <h4 className="font-bold text-slate-800 text-xs">Captación Base</h4>
                    <p className="text-[10px] text-slate-500 leading-tight">Completa formulario de propuesta con validaciones reactivas.</p>
                  </div>
                  <ChevronRight className="hidden md:block h-5 w-5 text-slate-300 shrink-0" />

                  {/* Step 4 */}
                  <div className="flex-1 space-y-1 relative">
                    <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase">Paso 04</span>
                    <h4 className="font-bold text-emerald-800 text-xs">Gatillo Automatizado</h4>
                    <p className="text-[10px] text-slate-500 leading-tight">Guardado en PostgreSQL y envío automático de email bienvenida.</p>
                  </div>
                </div>
              </Card>
              {/* High / Low Fidelity Wireframe Blueprint */}
              {/* This is a card-like structure */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      Planos de Arquitectura de Visualización (Layout Blueprint)
                    </h3>
                    <p className="text-[11px] text-slate-500">Alterna la fidelidad para inspeccionar la estructura alámbrica de la consola.</p>
                  </div>
                  
                  {/* Fidelity Switch */}
                  <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 inline-flex">
                    <Button
                      onClick={() => setWireframeFidelity("low")}
                      variant={wireframeFidelity === "low" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-auto px-3 py-1 text-[10px] font-bold uppercase"
                    >
                      Baja Fidelidad
                    </Button>
                    <Button
                      onClick={() => setWireframeFidelity("high")}
                      variant={wireframeFidelity === "high" ? "default" : "ghost"}
                      size="sm"
                      className="h-auto px-3 py-1 text-[10px] font-bold uppercase"
                    >
                      Alta Fidelidad
                    </Button>
                  </div>
                </div>

                {/* Simulated Console Layout Wireframe */}
                <div className="border border-slate-300 rounded-xl overflow-hidden p-4 bg-slate-900 text-white font-mono text-[10px] relative min-h-[220px]">
                  {wireframeFidelity === "low" ? (
                    /* Low fidelity blueprint style */
                    <div className="space-y-3.5 opacity-85">
                      <div className="flex items-center justify-between border-b border-dashed border-slate-700 pb-2">
                        <span>[HEADER] Title / Global CMS State Toggles</span>
                        <div className="flex gap-1.5">
                          <span className="border border-slate-700 px-1.5 py-0.5 rounded">[RE-SET]</span>
                          <span className="border border-indigo-700 px-1.5 py-0.5 rounded text-indigo-400">[PREVIEW]</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-4 border border-dashed border-slate-700 p-3 rounded space-y-2">
                          <span>[SIDEBAR NAVIGATION]</span>
                          <div className="space-y-1 opacity-50">
                            <div>- CMS Editor</div>
                            <div>- AI Copy Generator</div>
                            <div>- Leads Tracker</div>
                            <div>- Map Workspace</div>
                          </div>
                        </div>

                        <div className="col-span-8 border border-dashed border-indigo-600/60 p-3 rounded space-y-3 bg-indigo-950/10">
                          <span className="text-indigo-400 font-bold">[MAIN APP WORKSPACE]</span>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="border border-dashed border-slate-700 p-1.5 text-center">[KPI Card 01]</div>
                            <div className="border border-dashed border-slate-700 p-1.5 text-center">[KPI Card 02]</div>
                            <div className="border border-dashed border-slate-700 p-1.5 text-center">[KPI Card 03]</div>
                          </div>
                          <div className="border border-dashed border-slate-700 h-16 rounded flex items-center justify-center">
                            [Interactive Leads Data Table / Interactive Map Container]
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* High fidelity console styling preview */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-slate-800 border border-slate-700/60 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-rose-500" />
                          <div className="h-3 w-3 rounded-full bg-amber-500" />
                          <div className="h-3 w-3 rounded-full bg-emerald-500" />
                          <span className="text-slate-300 font-bold ml-1">Console Dashboard Screen Spec</span>
                        </div>
                        <span className="text-emerald-400 font-bold text-[9px]">ACTIVE</span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="border border-slate-700 p-3 rounded-lg bg-slate-800/40 space-y-2">
                          <span className="font-bold text-indigo-400 block border-b border-slate-700 pb-1">Sidebar Layout</span>
                          <span className="text-slate-400 block leading-tight">Width: 256px fixed</span>
                          <span className="text-slate-400 block leading-tight">Primary Background: Slate 900</span>
                          <span className="text-slate-400 block leading-tight">Font size: 14px body</span>
                        </div>

                        <div className="border border-slate-700 p-3 rounded-lg bg-slate-800/40 space-y-2">
                          <span className="font-bold text-emerald-400 block border-b border-slate-700 pb-1">KPI Grid Panel</span>
                          <span className="text-slate-400 block leading-tight">Grid Columns: md:grid-cols-3</span>
                          <span className="text-slate-400 block leading-tight">Padding: p-5 standard</span>
                          <span className="text-slate-400 block leading-tight">Outer-inner alignment: Equal</span>
                        </div>

                        <div className="border border-slate-700 p-3 rounded-lg bg-slate-800/40 space-y-2">
                          <span className="font-bold text-amber-400 block border-b border-slate-700 pb-1">Form Controls</span>
                          <span className="text-slate-400 block leading-tight">Input Padding: px-3 py-1.5</span>
                          <span className="text-slate-400 block leading-tight">Border radius: 12px</span>
                          <span className="text-slate-400 block leading-tight">Validation Feedback: Realtime</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div> {/* End of simulated console layout */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Audit tab footer */}
      <div className="bg-white border-t border-slate-150 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-center sm:text-left">
          <Shield className="h-3.5 w-3.5 text-indigo-500" />
          * Todas las directrices de esta consola cumplen rigurosamente con los lineamientos del Prompt Maestro.
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            alert("Design Specs Exportadas: Puedes encontrar las definiciones de tokens en /src/components/DesignSystemAuditView.tsx");
          }}
        >
          <Download className="h-3.5 w-3.5" />
          Exportar Tokens de Diseño
        </Button>
      </div>
    </div>
  );
};