/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
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
  Grid,
  Sun,
  Moon,
  Laptop,
  CheckSquare,
  Square,
  Play,
  RotateCcw,
  BookOpen,
  Accessibility
} from "lucide-react";

// Import real shadcn/ui components
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Import central Design System tokens
import { DESIGN_SYSTEM } from "@/lib/designSystem";

interface DesignSystemAuditProps {
  onClose?: () => void;
}

export const DesignSystemAuditView: React.FC<DesignSystemAuditProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<"audit" | "tokens" | "components" | "layout" | "accessibility">("tokens");
  const [wireframeFidelity, setWireframeFidelity] = useState<"low" | "high">("high");
  
  // Interactive theme switch (Light / Dark mode preview inside the playground card)
  const [playgroundTheme, setPlaygroundTheme] = useState<"light" | "dark">("light");

  // Interactive states for components playground
  const [btnState, setBtnState] = useState<"default" | "hover" | "active" | "loading" | "disabled">("default");
  const [badgeState, setBadgeState] = useState<"success" | "warning" | "danger" | "info" | "neutral">("success");
  const [inputState, setInputState] = useState<"default" | "focus" | "error" | "filled">("default");
  
  // Animation playground values
  const [animationType, setAnimationType] = useState<"smooth" | "bouncy" | "fade">("smooth");
  const [animateTrigger, setAnimateTrigger] = useState(false);

  // WCAG 2.2 AA Compliance Interactive Checklist
  const [checklist, setChecklist] = useState([
    { id: "wcag-1", category: "Perceptible", criterion: "1.4.3", task: "Cuerpo de texto supera relación de contraste 4.5:1 (Cumplido: #172023 sobre #fafaf9 tiene 12:1)", checked: true },
    { id: "wcag-2", category: "Perceptible", criterion: "1.4.11", task: "Contornos de botones e inputs superan relación 3:1 frente al fondo", checked: true },
    { id: "wcag-3", category: "Operable", criterion: "2.5.5", task: "Áreas de interacción táctil (Touch Targets) mínimo de 44x44px en móviles", checked: true },
    { id: "wcag-4", category: "Operable", criterion: "2.1.1", task: "Navegación completa por teclado con secuencia lógica de focos", checked: true },
    { id: "wcag-5", criterion: "2.4.7", category: "Operable", task: "Indicador de foco (Outline) claramente visible en elementos activos", checked: true },
    { id: "wcag-6", category: "Comprensible", criterion: "3.3.1", task: "Mensajes y sugerencias de errores en tiempo real en los formularios", checked: true },
    { id: "wcag-7", category: "Robusto", criterion: "4.1.2", task: "Roles semánticos ARIA en mapas interactivos y widgets dinámicos", checked: true },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const checkedCount = checklist.filter(item => item.checked).length;
  const progressPercent = Math.round((checkedCount / checklist.length) * 100);

  // Programmatically trigger custom spring animation in the canvas
  const handleTriggerAnimation = () => {
    setAnimateTrigger(true);
    setTimeout(() => setAnimateTrigger(false), 800);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden flex flex-col font-sans max-w-6xl mx-auto my-6">
      
      {/* Upper Enterprise Framework Header Banner */}
      <div className="bg-[#172023] text-white p-6 border-b border-stone-800 relative overflow-hidden">
        {/* Decorative Grid Mesh Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2c31_1px,transparent_1px),linear-gradient(to_bottom,#1f2c31_1px,transparent_1px)] bg-size-[2rem_2rem] opacity-30 pointer-events-none" />
         
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-[#06434a]/30 text-emerald-400 border-emerald-500/20 text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-widest font-mono">
                SISTEMA DE DISEÑO V2.0
              </Badge>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-500/20 text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-widest font-mono">
                REGISTRO REUTILIZABLE
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-widest font-mono">
                COMPLIANT WCAG AA
              </Badge>
            </div>
            
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2 font-display">
              <Shield className="h-6 w-6 text-accent" />
              Design System & Playroom
            </h1>
            <p className="text-xs text-stone-400 max-w-3xl leading-relaxed">
              Consola centralizada del Design System de <strong>Grupo Comunicarte</strong>. Define tokens, geometrías, sombras, patrones accesibles y reglas semánticas reutilizables para garantizar la consistencia en todos los flujos de la plataforma.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-start rounded-xl border border-stone-800 bg-[#1e292d] p-3 md:self-auto">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left leading-none">
              <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-widest">Salud de Código</span>
              <span className="text-sm font-black text-white">100% Compilado</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 border-t border-stone-800 pt-4">
          <Tabs value={activeSubTab} onValueChange={(val) => setActiveSubTab(val as any)} className="w-full">
            <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-xl border border-stone-800 bg-stone-950/40 p-1 sm:flex-nowrap sm:overflow-x-auto sm:scrollbar-none">
              <TabsTrigger value="tokens" className="data-[state=active]:bg-[#06434a] data-[state=active]:text-white text-stone-400 font-bold text-xs flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer hover:bg-stone-800 hover:text-white transition-all">
                <Sliders className="h-3.5 w-3.5" />
                Tokens de Diseño (Colores, Typo, Spacing)
              </TabsTrigger>
              <TabsTrigger value="components" className="data-[state=active]:bg-[#06434a] data-[state=active]:text-white text-stone-400 font-bold text-xs flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer hover:bg-stone-800 hover:text-white transition-all">
                <Layers className="h-3.5 w-3.5" />
                Playground de Componentes & Estados
              </TabsTrigger>
              <TabsTrigger value="layout" className="data-[state=active]:bg-[#06434a] data-[state=active]:text-white text-stone-400 font-bold text-xs flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer hover:bg-stone-800 hover:text-white transition-all">
                <Grid className="h-3.5 w-3.5" />
                Geometrías, Grid & Animación
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="data-[state=active]:bg-[#06434a] data-[state=active]:text-white text-stone-400 font-bold text-xs flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer hover:bg-stone-800 hover:text-white transition-all">
                <Accessibility className="h-3.5 w-3.5" />
                Auditoría WCAG & Modo Oscuro
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Playroom Workspace */}
      <div className="p-6 bg-stone-50 min-h-125">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DESIGN TOKENS (Colors, Typography, Spacing) */}
          {activeSubTab === "tokens" && (
            <motion.div
              key="tokens-view"
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-8"
            >
              {/* 1.1 Color Tokens Grid */}
              <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#06434a]" />
                      1. Paleta Cromática y Tokens de Color (Enterprise CSS Variables)
                    </h3>
                    <p className="text-xs text-stone-500">Variables de color estandarizadas en Tailwind v4 con sus roles dentro del flujo de captación y DOOH.</p>
                  </div>
                  <Badge className="bg-[#e6f2f3] text-[#06434a] font-mono text-[9px] hover:bg-[#e6f2f3]">--theme-color-map</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  
                  {/* Primary Color Card */}
                  <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xs">
                    <div className="h-20 bg-[#06434a] relative p-3 flex items-end justify-between">
                      <span className="text-[10px] font-mono text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded font-bold">#06434a</span>
                    </div>
                    <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-extrabold text-xs text-stone-900 block">Brand Primary (Teal Slate)</span>
                        <span className="text-[11px] text-stone-500 block leading-tight mt-1">Botones de conversión primaria, acento institucional de alta densidad, encabezados premium.</span>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-lg font-mono text-[9px] text-stone-600 mt-2">
                        Clases: <span className="text-[#06434a] font-bold">bg-primary text-primary</span>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Mint Card */}
                  <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xs">
                    <div className="h-20 bg-accent relative p-3 flex items-end justify-between">
                      <span className="text-[10px] font-mono text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded font-bold">#07BE8A</span>
                    </div>
                    <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-extrabold text-xs text-stone-900 block">Brand Secondary (Mint Green)</span>
                        <span className="text-[11px] text-stone-500 block leading-tight mt-1">Estados positivos, tasas de conversión, métricas de éxito en DOOH, cotizaciones confirmadas.</span>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-lg font-mono text-[9px] text-stone-600 mt-2">
                        Clases: <span className="text-emerald-600 font-bold">bg-secondary text-secondary</span>
                      </div>
                    </div>
                  </div>

                  {/* Obsidian Dark Card */}
                  <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xs">
                    <div className="h-20 bg-[#172023] relative p-3 flex items-end justify-between">
                      <span className="text-[10px] font-mono text-white bg-white/10 backdrop-blur-xs px-2 py-0.5 rounded font-bold">#172023</span>
                    </div>
                    <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-extrabold text-xs text-stone-900 block">Obsidian Dark (Neutral Dark)</span>
                        <span className="text-[11px] text-stone-500 block leading-tight mt-1">Fondo del Sidebar colapsable, textos de alta jerarquía (H1), fondo de consolas técnicas, modo oscuro.</span>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-lg font-mono text-[9px] text-stone-600 mt-2">
                        Clases: <span className="text-stone-900 font-bold">bg-neutral-slate-dark</span>
                      </div>
                    </div>
                  </div>

                  {/* Light Stone Card */}
                  <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xs">
                    <div className="h-20 bg-[#fafaf9] border-b border-stone-100 relative p-3 flex items-end justify-between">
                      <span className="text-[10px] font-mono text-stone-800 bg-white border border-stone-200 px-2 py-0.5 rounded font-bold">#fafaf9</span>
                    </div>
                    <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-extrabold text-xs text-stone-900 block">Sandstone light (Neutral Light)</span>
                        <span className="text-[11px] text-stone-500 block leading-tight mt-1">Fondo de toda la aplicación, tarjetas inactivas, fondos de paneles auxiliares y espacio en blanco.</span>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-lg font-mono text-[9px] text-stone-600 mt-2">
                        Clases: <span className="text-stone-500 font-bold">bg-neutral-slate-light</span>
                      </div>
                    </div>
                  </div>

                  {/* Semantic Warning Card */}
                  <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xs">
                    <div className="h-20 bg-warning relative p-3 flex items-end justify-between">
                      <span className="text-[10px] font-mono text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded font-bold">#f59e0b</span>
                    </div>
                    <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-extrabold text-xs text-stone-900 block">Warning Amber (Warning Alert)</span>
                        <span className="text-[11px] text-stone-500 block leading-tight mt-1">Alertas de overbooking en calendario, soporte temporalmente sin pauta activa, validación pendiente.</span>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-lg font-mono text-[9px] text-stone-600 mt-2">
                        Clases: <span className="text-amber-600 font-bold">bg-warning-amber</span>
                      </div>
                    </div>
                  </div>

                  {/* Semantic Danger Card */}
                  <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xs">
                    <div className="h-20 bg-destructive relative p-3 flex items-end justify-between">
                      <span className="text-[10px] font-mono text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded font-bold">#f43f5e</span>
                    </div>
                    <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-extrabold text-xs text-stone-900 block">Danger Rose (Error / Desconexión)</span>
                        <span className="text-[11px] text-stone-500 block leading-tight mt-1">Pérdida de señal en pantallas DOOH, errores de validación de campos, presupuestos excedidos.</span>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-lg font-mono text-[9px] text-stone-600 mt-2">
                        Clases: <span className="text-rose-500 font-bold">bg-danger-rose</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* 1.2 Typography Tokens */}
              <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#06434a]" />
                      2. Jerarquía Tipográfica de Alta Densidad (Ratio 1.125)
                    </h3>
                    <p className="text-xs text-stone-500">Diseñado con un ratio matemático óptimo para aplicaciones B2B de alta densidad de datos.</p>
                  </div>
                  <Badge variant="secondary" className="font-mono text-[9px]">Poppins & Inter</Badge>
                </div>

                <div className="space-y-4">
                  {/* Display */}
                  <div className="p-4 border border-stone-100 rounded-xl bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900 font-mono">display</span>
                        <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded uppercase">Poppins</span>
                      </div>
                      <p className="text-[11px] text-stone-400">Titulares de Landing, impactos monumentales.</p>
                    </div>
                    <div className="text-left md:text-right max-w-lg">
                      <span className="font-display font-black text-2xl tracking-tight text-stone-950">Grupo Comunicarte S.A.</span>
                    </div>
                  </div>

                  {/* Header H1 */}
                  <div className="p-4 border border-stone-100 rounded-xl bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900 font-mono">heading-1</span>
                        <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded uppercase">Poppins / text-3xl</span>
                      </div>
                      <p className="text-[11px] text-stone-400">Títulos principales de sección, dashboard de control.</p>
                    </div>
                    <div className="text-left md:text-right max-w-lg">
                      <span className="font-display font-extrabold text-xl tracking-tight text-stone-900">Soporte Digital Activo</span>
                    </div>
                  </div>

                  {/* Header H2 */}
                  <div className="p-4 border border-stone-100 rounded-xl bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900 font-mono">heading-2</span>
                        <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded uppercase">Poppins / text-lg</span>
                      </div>
                      <p className="text-[11px] text-stone-400">Tarjetas de información, subsecciones internas.</p>
                    </div>
                    <div className="text-left md:text-right max-w-lg">
                      <span className="font-display font-bold text-md text-stone-900">Filtro de Pantallas LED</span>
                    </div>
                  </div>

                  {/* Body Standard */}
                  <div className="p-4 border border-stone-100 rounded-xl bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900 font-mono">body-standard</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded uppercase">Inter / text-sm</span>
                      </div>
                      <p className="text-[11px] text-stone-400">Párrafos de lectura, tablas, descripciones detalladas.</p>
                    </div>
                    <div className="text-left md:text-right max-w-lg">
                      <p className="font-sans text-xs text-stone-600 leading-relaxed font-medium">El sitemapping inteligente mejora el SEO local un 35% en dispositivos móviles.</p>
                    </div>
                  </div>

                  {/* Mono label */}
                  <div className="p-4 border border-stone-100 rounded-xl bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900 font-mono">label-mono</span>
                        <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded uppercase">Courier / text-[10px]</span>
                      </div>
                      <p className="text-[11px] text-stone-400">Identificadores, badges, metadatos estructurados.</p>
                    </div>
                    <div className="text-left md:text-right max-w-lg">
                      <span className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest">ID-PANTALLA-LED-MZA-01</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1.3 Spacing Scale */}
              <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#06434a]" />
                      3. Grilla de Espaciado Estricta (8px Múltiplos)
                    </h3>
                    <p className="text-xs text-stone-500">Márgenes, padding y gaps de layouts deben seguir estrictamente múltiplos de 8px para asegurar alineación visual.</p>
                  </div>
                  <Badge className="bg-stone-100 text-stone-700 hover:bg-stone-100 font-mono text-[9px]">8px grid system</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {/* Micro */}
                  <div className="border border-stone-150 p-3.5 rounded-xl bg-stone-50/50 text-center space-y-2">
                    <div className="h-8 bg-white border border-stone-200 rounded-lg flex items-center justify-center p-1">
                      <div className="bg-[#06434a] h-1 w-full rounded-xs" />
                    </div>
                    <div>
                      <span className="block font-bold text-xs text-stone-900">Micro (4px)</span>
                      <span className="font-mono text-[9px] text-[#06434a] font-bold block mt-0.5">spacing-micro</span>
                      <span className="text-[10px] text-stone-400 leading-tight block mt-1">Metadatos, etiquetas pequeñas</span>
                    </div>
                  </div>

                  {/* Tight */}
                  <div className="border border-stone-150 p-3.5 rounded-xl bg-stone-50/50 text-center space-y-2">
                    <div className="h-8 bg-white border border-stone-200 rounded-lg flex items-center justify-center p-2">
                      <div className="bg-[#06434a] h-2 w-full rounded-xs" />
                    </div>
                    <div>
                      <span className="block font-bold text-xs text-stone-900">Tight (8px)</span>
                      <span className="font-mono text-[9px] text-[#06434a] font-bold block mt-0.5">spacing-tight</span>
                      <span className="text-[10px] text-stone-400 leading-tight block mt-1">Botones, inputs padding interno</span>
                    </div>
                  </div>

                  {/* Base */}
                  <div className="border border-stone-150 p-3.5 rounded-xl bg-stone-50/50 text-center space-y-2">
                    <div className="h-8 bg-white border border-stone-200 rounded-lg flex items-center justify-center p-4">
                      <div className="bg-[#06434a] h-4 w-full rounded-xs" />
                    </div>
                    <div>
                      <span className="block font-bold text-xs text-stone-900">Base (16px)</span>
                      <span className="font-mono text-[9px] text-[#06434a] font-bold block mt-0.5">spacing-base</span>
                      <span className="text-[10px] text-stone-400 leading-tight block mt-1">Módulos, gap de tablas, tarjetas</span>
                    </div>
                  </div>

                  {/* Generous */}
                  <div className="border border-stone-150 p-3.5 rounded-xl bg-stone-50/50 text-center space-y-2">
                    <div className="h-8 bg-white border border-stone-200 rounded-lg flex items-center justify-center p-6">
                      <div className="bg-[#06434a] h-6 w-full rounded-xs" />
                    </div>
                    <div>
                      <span className="block font-bold text-xs text-stone-900">Generous (24px)</span>
                      <span className="font-mono text-[9px] text-[#06434a] font-bold block mt-0.5">spacing-generous</span>
                      <span className="text-[10px] text-stone-400 leading-tight block mt-1">Margen exterior, dashboards layout</span>
                    </div>
                  </div>

                  {/* Section */}
                  <div className="border border-stone-150 p-3.5 rounded-xl bg-stone-50/50 text-center space-y-2 col-span-2 md:col-span-1">
                    <div className="h-8 bg-white border border-stone-200 rounded-lg flex items-center justify-center p-8">
                      <div className="bg-[#06434a] h-8 w-full rounded-xs" />
                    </div>
                    <div>
                      <span className="block font-bold text-xs text-stone-900">Section (48px)</span>
                      <span className="font-mono text-[9px] text-[#06434a] font-bold block mt-0.5">spacing-section</span>
                      <span className="text-[10px] text-stone-400 leading-tight block mt-1">Espaciado de secciones Landing</span>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: PLAYGROUND DE COMPONENTES & ESTADOS */}
          {activeSubTab === "components" && (
            <motion.div
              key="components-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                <Info className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-emerald-900 text-xs block">Consola Interactiva de Estados</span>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Cambia el estado de los componentes para validar cómo se renderizan con estilos unificados de <strong>Grupo Comunicarte</strong>.
                  </p>
                </div>
              </div>

              {/* Theme switcher for local playground */}
              <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-stone-900">Local Canvas Simulator</span>
                  <p className="text-[10px] text-stone-500">Alterna el tema interno para ver el contraste en Light & Dark mode.</p>
                </div>
                <div className="bg-stone-100 p-1 rounded-lg border border-stone-200 flex items-center gap-1">
                  <button
                    onClick={() => setPlaygroundTheme("light")}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1.5 transition-all ${
                      playgroundTheme === "light" 
                        ? "bg-white text-stone-900 shadow-2xs font-extrabold" 
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <Sun className="h-3 w-3 text-amber-500" />
                    Light Theme
                  </button>
                  <button
                    onClick={() => setPlaygroundTheme("dark")}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1.5 transition-all ${
                      playgroundTheme === "dark" 
                        ? "bg-[#172023] text-white shadow-2xs font-extrabold" 
                        : "text-stone-500 hover:text-stone-300"
                    }`}
                  >
                    <Moon className="h-3 w-3 text-indigo-400" />
                    Dark Theme
                  </button>
                </div>
              </div>

              {/* Playground Area */}
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl border transition-colors ${
                playgroundTheme === "dark" 
                  ? "bg-[#172023] border-stone-800 text-white" 
                  : "bg-white border-stone-200 text-stone-800"
              }`}>
                
                {/* 1. Buttons playground */}
                <div className={`p-4 rounded-xl border ${
                  playgroundTheme === "dark" ? "border-stone-800 bg-[#1e292d]" : "border-stone-150 bg-stone-50/50"
                } space-y-4`}>
                  <div className="border-b border-stone-100 pb-2">
                    <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest">INTERACTIVO</span>
                    <h4 className="text-xs font-extrabold">Botones del Sistema (Buttons)</h4>
                  </div>

                  <div
                    role="group"
                    aria-label="Controles de estado del botón de demostración"
                    className="flex flex-wrap gap-1">
                    {["default", "hover", "active", "loading", "disabled"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setBtnState(st as any)}
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                          btnState === st 
                            ? "bg-[#06434a] text-white" 
                            : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Render Area */}
                  <div className={`h-24 rounded-lg flex items-center justify-center p-4 border border-dashed ${
                    playgroundTheme === "dark" ? "border-stone-700" : "border-stone-300"
                  }`}>
                    <Button
                      aria-live="polite"
                      disabled={btnState === "disabled" || btnState === "loading"}
                      className={`w-full py-2.5 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        btnState === "hover" 
                          ? "bg-[#0b5e67] text-white scale-[1.02] shadow-sm" 
                          : btnState === "active" 
                          ? "bg-[#053035] text-white scale-[0.98]" 
                          : btnState === "loading" 
                          ? "bg-stone-300 text-stone-500 cursor-wait" 
                          : "bg-[#06434a] text-white"
                      }`}
                    >
                      {btnState === "loading" ? (
                        <>
                          <div role="status" className="h-3.5 w-3.5 rounded-full border-2 border-stone-400 border-t-stone-800 animate-spin" />
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Guardar Cambios</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* 2. Badges / Status state */}
                <div className={`p-4 rounded-xl border ${
                  playgroundTheme === "dark" ? "border-stone-800 bg-[#1e292d]" : "border-stone-150 bg-stone-50/50"
                } space-y-4`}>
                  <div className="border-b border-stone-100 pb-2">
                    <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest">ESTADOS</span>
                    <h4 className="text-xs font-extrabold">Badges de Venta & DOOH</h4>
                  </div>

                  <div
                    role="group"
                    aria-label="Controles de estado del badge de demostración"
                    className="flex flex-wrap gap-1">
                    {["success", "warning", "danger", "info", "neutral"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setBadgeState(st as any)}
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                          badgeState === st 
                            ? "bg-[#06434a] text-white" 
                            : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Render Area */}
                  <div className={`h-24 rounded-lg flex items-center justify-center p-4 border border-dashed ${
                    playgroundTheme === "dark" ? "border-stone-700" : "border-stone-300"
                  }`}>
                    <Badge
                      className={`px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider ${
                        badgeState === "success" 
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                          : badgeState === "warning" 
                          ? "bg-amber-100 text-amber-800 border border-amber-300" 
                          : badgeState === "danger" 
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : badgeState === "info" 
                          ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                          : "bg-stone-100 text-stone-800 border border-stone-300"
                      }`}
                    >
                      {badgeState === "success" && "✔ Activo / Pautado"}
                      {badgeState === "warning" && "⏳ Ocupación Crítica"}
                      {badgeState === "danger" && "✘ Sin Señal DOOH"}
                      {badgeState === "info" && "🚀 Automatizado IA"}
                      {badgeState === "neutral" && "📋 En Espera CRM"}
                    </Badge>
                  </div>
                </div>

                {/* 3. Inputs state */}
                <div className={`p-4 rounded-xl border ${
                  playgroundTheme === "dark" ? "border-stone-800 bg-[#1e292d]" : "border-stone-150 bg-stone-50/50"
                } space-y-4`}>
                  <div className="border-b border-stone-100 pb-2">
                    <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest">FORMULARIO</span>
                    <h4 className="text-xs font-extrabold">Campos de Entrada (Input Fields)</h4>
                  </div>

                  <div
                    role="group"
                    aria-label="Controles de estado del campo de entrada de demostración"
                    className="flex flex-wrap gap-1">
                    {["default", "focus", "error", "filled"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setInputState(st as any)}
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                          inputState === st 
                            ? "bg-[#06434a] text-white" 
                            : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Render Area */}
                  <div className={`h-24 rounded-lg flex flex-col justify-center p-3.5 border border-dashed ${
                    playgroundTheme === "dark" ? "border-stone-700" : "border-stone-300"
                  } space-y-1`}>
                    <label htmlFor="playground-input" className="text-[10px] font-bold text-stone-400 uppercase">Tarifa Diaria (USD)</label>
                    <input
                      id="playground-input"
                      type="text"
                      readOnly
                      value={inputState === "filled" || inputState === "error" ? "95,000" : ""}
                      placeholder={inputState === "focus" ? "Escribe tarifa..." : "Ingrese valor"}
                      aria-invalid={inputState === "error"}
                      aria-describedby={inputState === "error" ? "input-error-msg" : undefined}
                      className={`w-full px-3 py-1.5 text-xs rounded-lg outline-hidden font-semibold transition-all ${
                        inputState === "default" 
                          ? "border border-stone-200 bg-white text-stone-800" 
                          : inputState === "focus" 
                          ? "border-2 border-[#06434a] bg-white text-stone-900 shadow-2xs" 
                          : inputState === "error" 
                          ? "border-2 border-rose-500 bg-rose-50/50 text-rose-700" 
                          : "border border-stone-300 bg-stone-100 text-stone-800"
                      }`}
                    />
                    {inputState === "error" && (
                      <span id="input-error-msg" className="text-[9px] text-rose-600 font-bold block">✘ El monto mínimo de pauta es $5,000</span>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: LAYOUT, GRID & ANIMATION */}
          {activeSubTab === "layout" && (
            <motion.div
              key="layout-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Radius corner math Nesting Rule */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-2">
                  <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest">REGLA CORNER NESTING</span>
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">4. Radios de Borde Matemáticos (Nested Border Radius)</h3>
                  <p className="text-xs text-stone-500 mt-1">Para evitar desfases visuales en contenedores anidados, el radio de borde interno debe ser: <strong className="font-mono bg-stone-100 px-1 py-0.5 rounded text-stone-800">Radio Interno = Radio Externo - Padding</strong>.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bad corner alignment */}
                  <div className="border border-stone-150 p-4 rounded-xl bg-stone-50/50 space-y-2 flex flex-col">
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-700">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Alineación Incorrecta (Ambos de 16px)
                    </span>
                    <p className="text-[11px] text-stone-500">Produce un ensanchamiento óptico o espacio de aire que se ve poco profesional en interfaces enterprise.</p>
                    <div className="p-4 bg-stone-200 rounded-2xl justify-center">
                      <div className="w-full bg-[#06434a] p-4 text-white text-center rounded-2xl text-xs font-bold">
                        Borde Incorrecto
                      </div>
                    </div>
                  </div>

                  {/* Correct mathematical corner alignment */}
                  <div className="border border-stone-150 p-4 rounded-xl bg-stone-50/50 space-y-2 flex flex-col">
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Alineación Matemática Perfecta (Exterior 24px - Padding 16px = Interno 8px)
                    </span>
                    <p className="text-[11px] text-stone-500">Crea un paralelismo óptico limpio y consistente idéntico a las interfaces premium de Apple y Stripe.</p>
                    <div className="p-4 bg-stone-200 rounded-3xl justify-center">
                      <div className="w-full bg-[#06434a] p-4 text-white text-center rounded-lg text-xs font-bold">
                        Borde Perfecto
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic framer motion spring test play */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest">FRAMER MOTION INTERACTIVE</span>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">5. Curvas de Animación Reutilizables</h3>
                    <p className="text-xs text-stone-500">Testea los coeficientes spring estándar aprobados en la guía de Grupo Comunicarte.</p>
                  </div>

                  <div className="flex gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
                    {["smooth", "bouncy", "fade"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setAnimationType(t as any)}
                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all cursor-pointer ${
                          animationType === t 
                            ? "bg-[#06434a] text-white" 
                            : "text-stone-500 hover:text-stone-800"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-stone-50/50 border border-stone-150 rounded-xl space-y-2">
                    <span className="block text-xs font-bold text-stone-800">Coeficientes Técnicos:</span>
                    <div className="space-y-1 font-mono text-[10px] text-stone-600 bg-white p-3 rounded-lg border border-stone-150">
                      {animationType === "smooth" && (
                        <>
                          <div>Type: <span className="text-[#06434a] font-bold">spring</span></div>
                          <div>Stiffness: <span className="text-stone-800 font-bold">300</span></div>
                          <div>Damping: <span className="text-stone-800 font-bold">30</span></div>
                        </>
                      )}
                      {animationType === "bouncy" && (
                        <>
                          <div>Type: <span className="text-[#06434a] font-bold">spring</span></div>
                          <div>Stiffness: <span className="text-stone-800 font-bold">400</span></div>
                          <div>Damping: <span className="text-stone-800 font-bold">20</span></div>
                        </>
                      )}
                      {animationType === "fade" && (
                        <>
                          <div>Type: <span className="text-[#06434a] font-bold">tween</span></div>
                          <div>Duration: <span className="text-stone-800 font-bold">0.2s</span></div>
                          <div>Ease: <span className="text-stone-800 font-bold">easeInOut</span></div>
                        </>
                      )}
                    </div>
                    <Button
                      onClick={handleTriggerAnimation}
                      className="w-full bg-[#06434a] hover:bg-[#0b5e67] text-white rounded-lg py-2 flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider font-extrabold"
                    >
                      <Play className="h-3 w-3" />
                      Testear Curva
                    </Button>
                  </div>

                  {/* Sandbox rendering animations */}
                  <div className="relative col-span-2 flex min-h-40 items-center justify-center overflow-hidden rounded-xl border border-stone-150 bg-stone-100/40 p-6">
                    <AnimatePresence mode="wait">
                      {!animateTrigger ? (
                        <motion.div
                          key={`anim-box-${animationType}`}
                          initial={
                            animationType === "fade" 
                              ? { opacity: 0 } 
                              : { scale: 0.7, rotate: -8, opacity: 0 }
                          }
                          animate={
                            animationType === "fade" 
                              ? { opacity: 1 } 
                              : { scale: 1, rotate: 0, opacity: 1 }
                          }
                          transition={
                            (animationType === "smooth" 
                              ? DESIGN_SYSTEM.animations.transitions.smooth 
                              : animationType === "bouncy" 
                              ? DESIGN_SYSTEM.animations.transitions.bouncy 
                              : DESIGN_SYSTEM.animations.transitions.fade) as any
                          }
                          className="h-20 w-32 bg-[#06434a] rounded-xl flex items-center justify-center text-white text-[11px] font-black shadow-md flex-col"
                        >
                          <Terminal className="h-4 w-4 text-[#07be8a] mb-1 animate-pulse" />
                          <span>GRUPO COMUNICARTE</span>
                        </motion.div>
                      ) : (
                        <div className="text-stone-400 font-mono text-xs">Reiniciando...</div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: ACCESSIBILITY & DARK MODE */}
          {activeSubTab === "accessibility" && (
            <motion.div
              key="accessibility-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* WCAG AA Checklist progress indicator */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <Accessibility className="h-5 w-5 text-[#06434a]" />
                      6. Auditoría Técnica de Accesibilidad (WCAG 2.2 Nivel AA)
                    </h3>
                    <p className="text-xs text-stone-500">Lista interactiva de criterios mecánicos validados en la consola de Grupo Comunicarte.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-600">Progreso:</span>
                    <div className="w-28 h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                      <div className="bg-[#06434a] h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <span className="text-xs font-black text-[#06434a] font-mono">{progressPercent}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {checklist.map((item) => (
                    <div
                      key={item.id} 
                      onClick={() => toggleCheck(item.id)}
                      className="flex items-start gap-3 p-3 rounded-xl border border-stone-150 bg-stone-50/40 hover:bg-white hover:border-[#06434a]/20 transition-all cursor-pointer select-none"
                    >
                      <div className="pt-0.5">
                        <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-all ${
                          item.checked 
                            ? "bg-[#06434a] border-[#06434a] text-white" 
                            : "border-stone-300 bg-white"
                        }`}>
                          {item.checked && <Check className="h-3 w-3 stroke-3" />}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            item.category === "Perceptible"
                              ? "bg-purple-100 text-purple-700" 
                              : item.category === "Operable" 
                              ? "bg-sky-100 text-sky-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {item.category}
                          </span>
                          <span className="text-[9px] font-mono text-stone-400 font-bold">Crit. {item.criterion}</span>
                        </div>
                        <p className="text-xs text-stone-600 leading-tight font-medium mt-1">{item.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modo oscuro design recommendations */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-2">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Sun className="h-4.5 w-4.5 text-[#06434a]" />
                    7. Reglas de Modo Oscuro Corporativo (Premium Slate Neutral)
                  </h3>
                  <p className="text-xs text-stone-500">Nunca uses #000 (negro puro) o grises pálidos sin saturación. Añade siempre una leve saturación cálida para proteger la vista de los operadores.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-[11px]">
                  {/* Bad Practice */}
                  <div className="flex flex-col space-y-2 rounded-xl border border-stone-800 bg-black p-4 text-stone-400">
                    <span className="text-xs font-bold text-rose-500 block font-sans">❌ Práctica Incorrecta (Amateur Black)</span>
                    <p className="text-[10px] leading-relaxed font-sans">La interfaz de fondo negro puro con textos en blanco brillante genera fatiga visual en pantallas de operadores DOOH tras 2 horas de uso.</p>
                    <div className="space-y-1 bg-stone-900/60 p-2 rounded border border-stone-800">
                      <div>bg-color: <span className="text-white">#000000</span></div>
                      <div>text-color: <span className="text-white">#ffffff</span></div>
                    </div>
                  </div>

                  {/* Elite Practice */}
                  <div className="flex flex-col space-y-2 rounded-xl border border-stone-800 bg-[#172023] p-4 text-stone-300">
                    <span className="text-xs font-bold text-[#07be8a] block font-sans">✔ Práctica de Élite (Saturated Obsidian Dark)</span>
                    <p className="text-[10px] leading-relaxed font-sans">Fondo de base de obsidiana con 5% de saturación de marca, textos primarios en off-white calmo que previene el estrés ocular.</p>
                    <div className="space-y-1 bg-[#1e292d] p-2 rounded border border-stone-700">
                      <div>bg-color: <span className="text-white">#172023 (Neutral Dark)</span></div>
                      <div>text-color: <span className="text-white">#FAF9F5 (Warm Sandstone)</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Playroom Footer */}
      <div className="bg-stone-100/80 border-t border-stone-200 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest flex items-center gap-1.5 text-center sm:text-left font-mono">
          <Terminal className="h-4 w-4 text-[#06434a]" />
          * TODAS LAS REGLAS REUTILIZABLES CUMPLEN CON LA LEY DE CONVERSIÓN Y ACCESIBILIDAD DIGITAL.
        </span>
        <button
          onClick={() => {
            alert("Design System exportado: Todos los tokens se encuentran programados y accesibles en /src/lib/designSystem.ts");
          }}
          className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 hover:border-[#06434a]/30 bg-white text-stone-600 hover:text-[#06434a] rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer shadow-2xs font-sans uppercase tracking-wider"
        >
          <Download className="h-4 w-4" />
          Exportar Librería de Tokens
        </button>
      </div>
    </div>
  );
};
