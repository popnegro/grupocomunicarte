/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";

// Import central Design System tokens
import { DESIGN_SYSTEM } from "../lib/designSystem";

interface DesignSystemAuditProps {
  onClose?: () => void;
}

export const DesignSystemAuditView: React.FC<DesignSystemAuditProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<"audit" | "tokens" | "components" | "layout" | "accessibility" | "create">("tokens");
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
  const [showExportToast, setShowExportToast] = useState(false);

  // States for Interactive Design System Component Builder (create tab)
  const [builderArchetype, setBuilderArchetype] = useState<"button" | "card" | "badge" | "input">("button");
  const [builderColor, setBuilderColor] = useState<"primary" | "secondary" | "warning" | "danger" | "stone">("primary");
  const [builderSize, setBuilderSize] = useState<"sm" | "base" | "lg">("base");
  const [builderRadius, setBuilderRadius] = useState<"none" | "md" | "lg" | "xl" | "full">("lg");
  const [builderBorder, setBuilderBorder] = useState<"none" | "solid-1" | "solid-2" | "dashed">("none");
  const [builderShadow, setBuilderShadow] = useState<"none" | "shadow-2xs" | "shadow-sm" | "shadow-md">("shadow-sm");
  const [builderPadding, setBuilderPadding] = useState<"compact" | "balanced" | "spacious">("balanced");
  const [builderLabelText, setBuilderLabelText] = useState("Ejecutar Campaña");
  const [builderToastMessage, setBuilderToastMessage] = useState("");
  const [createdComponents, setCreatedComponents] = useState<Array<{
    id: string;
    name: string;
    archetype: string;
    classes: string;
    config: any;
  }>>([
    {
      id: "comp-pre-1",
      name: "Botón Call to Action",
      archetype: "button",
      classes: "bg-[#06434a] text-white text-xs font-black px-4 py-2 rounded-xl shadow-sm hover:scale-[1.01] transition-transform",
      config: { color: "primary", size: "base", radius: "xl", border: "none", shadow: "shadow-sm" }
    },
    {
      id: "comp-pre-2",
      name: "Indicador Ocupado",
      archetype: "badge",
      classes: "bg-rose-100 text-rose-800 text-[10px] font-extrabold px-3 py-1 border border-rose-200 rounded-full",
      config: { color: "danger", size: "sm", radius: "full", border: "solid-1", shadow: "none" }
    }
  ]);

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
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2c31_1px,transparent_1px),linear-gradient(to_bottom,#1f2c31_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30 pointer-events-none" />
        
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
            
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#07be8a]" />
              Design System & Playroom
            </h1>
            <p className="text-xs text-stone-400 max-w-3xl leading-relaxed">
              Consola centralizada del Design System de <strong>Grupo Comunicarte</strong>. Define tokens, geometrías, sombras, patrones accesibles y reglas semánticas reutilizables para garantizar la consistencia en todos los flujos de la plataforma.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#1e292d] border border-stone-800 p-3 rounded-xl self-start md:self-auto shrink-0">
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
            <TabsList className="bg-stone-950/40 border border-stone-800 p-1 flex h-auto overflow-x-auto justify-start scrollbar-none gap-1 rounded-xl">
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
              <TabsTrigger value="create" className="data-[state=active]:bg-[#06434a] data-[state=active]:text-white text-stone-400 font-bold text-xs flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer hover:bg-stone-800 hover:text-white transition-all">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Crear Componentes (Design Builder)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Playroom Workspace */}
      <div className="p-6 bg-stone-50 min-h-[500px]">
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
                  <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs flex flex-col">
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
                  <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs flex flex-col">
                    <div className="h-20 bg-[#07be8a] relative p-3 flex items-end justify-between">
                      <span className="text-[10px] font-mono text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded font-bold">#07be8a</span>
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
                  <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs flex flex-col">
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
                  <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs flex flex-col">
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
                  <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs flex flex-col">
                    <div className="h-20 bg-[#f59e0b] relative p-3 flex items-end justify-between">
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
                  <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs flex flex-col">
                    <div className="h-20 bg-[#f43f5e] relative p-3 flex items-end justify-between">
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
                      <span className="font-display font-black text-2xl tracking-tight leading-none text-stone-950 block">Grupo Comunicarte S.A.</span>
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
                      <span className="font-display font-extrabold text-xl tracking-tight text-stone-900 block">Soporte Digital Activo</span>
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
                      <span className="font-display font-bold text-md text-stone-900 block">Filtro de Pantallas LED</span>
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
                      <span className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest block">ID-PANTALLA-LED-MZA-01</span>
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

                  <div className="flex flex-wrap gap-1">
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
                          <div className="h-3.5 w-3.5 rounded-full border-2 border-stone-400 border-t-stone-800 animate-spin" />
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

                  <div className="flex flex-wrap gap-1">
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

                  <div className="flex flex-wrap gap-1">
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
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Tarifa Diaria (USD)</label>
                    <input
                      type="text"
                      readOnly
                      value={inputState === "filled" || inputState === "error" ? "95,000" : ""}
                      placeholder={inputState === "focus" ? "Escribe tarifa..." : "Ingrese valor"}
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
                      <span className="text-[9px] text-rose-600 font-bold block">✘ El monto mínimo de pauta es $5,000</span>
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
                  <div className="border border-stone-150 p-4 rounded-xl bg-stone-50/50 space-y-2">
                    <span className="block text-xs font-bold text-rose-700 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Alineación Incorrecta (Ambos de 16px)
                    </span>
                    <p className="text-[11px] text-stone-500">Produce un ensanchamiento óptico o espacio de aire que se ve poco profesional en interfaces enterprise.</p>
                    <div className="p-4 bg-stone-200 rounded-[16px] flex justify-center">
                      <div className="w-full bg-[#06434a] p-4 text-white text-center rounded-[16px] text-xs font-bold">
                        Borde Incorrecto
                      </div>
                    </div>
                  </div>

                  {/* Correct mathematical corner alignment */}
                  <div className="border border-stone-150 p-4 rounded-xl bg-stone-50/50 space-y-2">
                    <span className="block text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Alineación Matemática Perfecta (Exterior 24px - Padding 16px = Interno 8px)
                    </span>
                    <p className="text-[11px] text-stone-500">Crea un paralelismo óptico limpio y consistente idéntico a las interfaces premium de Apple y Stripe.</p>
                    <div className="p-4 bg-stone-200 rounded-[24px] flex justify-center">
                      <div className="w-full bg-[#06434a] p-4 text-white text-center rounded-[8px] text-xs font-bold">
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
                  <div className="col-span-2 border border-stone-150 bg-stone-100/40 rounded-xl flex items-center justify-center p-6 min-h-[160px] overflow-hidden relative">
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
                          {item.checked && <Check className="h-3 w-3 stroke-[3]" />}
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
                  <div className="p-4 bg-black border border-stone-800 rounded-xl space-y-2 text-stone-400">
                    <span className="text-xs font-bold text-rose-500 block font-sans">❌ Práctica Incorrecta (Amateur Black)</span>
                    <p className="text-[10px] leading-relaxed font-sans">La interfaz de fondo negro puro con textos en blanco brillante genera fatiga visual en pantallas de operadores DOOH tras 2 horas de uso.</p>
                    <div className="space-y-1 bg-stone-900/60 p-2 rounded border border-stone-800">
                      <div>bg-color: <span className="text-white">#000000</span></div>
                      <div>text-color: <span className="text-white">#ffffff</span></div>
                    </div>
                  </div>

                  {/* Elite Practice */}
                  <div className="p-4 bg-[#172023] border border-stone-800 rounded-xl space-y-2 text-stone-300">
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

          {/* TAB 5: COMPONENT BUILDER / DESIGN CREATOR */}
          {activeSubTab === "create" && (
            <motion.div
              key="create-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Informative Header card */}
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <span className="font-bold text-emerald-900 text-xs block">Creador y Generador de Componentes del Sistema</span>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Usa esta herramienta interactiva para construir componentes unificados basados en los tokens del sistema. Ajusta los parámetros visuales, copia el código React/Tailwind listo para producción o agrégalos a tu catálogo de componentes personalizados.
                  </p>
                </div>
              </div>

              {/* Toast Message inside the tab */}
              <AnimatePresence>
                {builderToastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-stone-900 text-stone-100 text-xs font-bold rounded-xl shadow-md border border-stone-800 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      {builderToastMessage}
                    </span>
                    <button onClick={() => setBuilderToastMessage("")} className="text-stone-400 hover:text-white cursor-pointer">
                      ✕
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Builder Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: Parameters Panel (Span 5) */}
                <div className="lg:col-span-5 bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-5 text-left">
                  <div className="border-b border-stone-100 pb-2.5">
                    <span className="block text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest">PASO 1</span>
                    <h3 className="text-sm font-bold text-stone-900">Configuración Visual</h3>
                  </div>

                  {/* Archetype selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Arquetipo base</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "button", label: "Botón / Button" },
                        { id: "badge", label: "Insignia / Badge" },
                        { id: "card", label: "Tarjeta / Card" },
                        { id: "input", label: "Campo / Input" },
                      ].map((arch) => (
                        <button
                          key={arch.id}
                          onClick={() => {
                            setBuilderArchetype(arch.id as any);
                            if (arch.id === "button") setBuilderLabelText("Ejecutar Campaña");
                            else if (arch.id === "badge") setBuilderLabelText("En Vuelo");
                            else if (arch.id === "card") setBuilderLabelText("Detalles de Soporte");
                            else if (arch.id === "input") setBuilderLabelText("Mendoza Express DOOH");
                          }}
                          className={`px-3 py-2 text-[10.5px] font-bold rounded-lg border transition-all text-center cursor-pointer ${
                            builderArchetype === arch.id
                              ? "bg-[#06434a] border-[#06434a] text-white shadow-2xs font-black"
                              : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                          }`}
                        >
                          {arch.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Component Label Text input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Texto / Etiqueta del Componente</label>
                    <input
                      type="text"
                      value={builderLabelText}
                      onChange={(e) => setBuilderLabelText(e.target.value)}
                      placeholder="Escribe el texto..."
                      className="w-full px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-lg text-stone-800 outline-hidden focus:border-[#06434a] transition-all"
                    />
                  </div>

                  {/* Colors selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Token de Color</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "primary", colorHex: "#06434a", label: "Teal Primary" },
                        { id: "secondary", colorHex: "#07be8a", label: "Mint Success" },
                        { id: "warning", colorHex: "#f59e0b", label: "Amber Warning" },
                        { id: "danger", colorHex: "#f43f5e", label: "Rose Danger" },
                        { id: "stone", colorHex: "#78716c", label: "Slate Neutral" },
                      ].map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setBuilderColor(c.id as any)}
                          className={`px-2 py-1 text-[10px] font-bold rounded-md border flex items-center gap-1.5 cursor-pointer transition-all ${
                            builderColor === c.id
                              ? "bg-stone-900 border-stone-900 text-white"
                              : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.colorHex }} />
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Padding & Spacing selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Relleno y Padding</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "compact", label: "Compacto" },
                        { id: "balanced", label: "Equilibrado" },
                        { id: "spacious", label: "Generoso" },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setBuilderPadding(p.id as any)}
                          className={`px-2 py-1.5 text-[10px] font-bold rounded-md border text-center transition-all cursor-pointer ${
                            builderPadding === p.id
                              ? "bg-stone-900 border-stone-900 text-white font-black"
                              : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Radius Corner selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Radio de Borde (Corner Radius)</label>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        { id: "none", label: "None" },
                        { id: "md", label: "MD (6px)" },
                        { id: "lg", label: "LG (8px)" },
                        { id: "xl", label: "XL (12px)" },
                        { id: "full", label: "Full" },
                      ].map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setBuilderRadius(r.id as any)}
                          className={`py-1 text-[9px] font-bold rounded border text-center transition-all cursor-pointer ${
                            builderRadius === r.id
                              ? "bg-stone-900 border-stone-900 text-white font-black"
                              : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shadow selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Elevación (Shadow)</label>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { id: "none", label: "None" },
                        { id: "shadow-2xs", label: "2XS" },
                        { id: "shadow-sm", label: "SM" },
                        { id: "shadow-md", label: "MD" },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setBuilderShadow(s.id as any)}
                          className={`py-1 text-[9px] font-bold rounded border text-center transition-all cursor-pointer ${
                            builderShadow === s.id
                              ? "bg-stone-900 border-stone-900 text-white font-black"
                              : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Estilo de Borde (Borders)</label>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { id: "none", label: "Ninguno" },
                        { id: "solid-1", label: "Sólido 1px" },
                        { id: "solid-2", label: "Sólido 2px" },
                        { id: "dashed", label: "Dashed" },
                      ].map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setBuilderBorder(b.id as any)}
                          className={`py-1 text-[9px] font-bold rounded border text-center transition-all cursor-pointer ${
                            builderBorder === b.id
                              ? "bg-stone-900 border-stone-900 text-white font-black"
                              : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Side: Preview & Code blocks (Span 7) */}
                <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                  
                  {/* Dynamic Preview Sandbox */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-[250px]">
                    <div className="border-b border-stone-100 pb-2 flex items-center justify-between">
                      <div>
                        <span className="block text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest">PASO 2</span>
                        <h3 className="text-xs font-bold text-stone-900">Vista Previa Sandbox (Local Canvas)</h3>
                      </div>
                      <div className="bg-stone-100 p-0.5 rounded-lg border border-stone-200 flex gap-1">
                        <button
                          onClick={() => setPlaygroundTheme("light")}
                          className={`px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition-all ${
                            playgroundTheme === "light" ? "bg-white text-stone-900 shadow-2xs font-extrabold" : "text-stone-500 hover:text-stone-800"
                          }`}
                        >
                          Light
                        </button>
                        <button
                          onClick={() => setPlaygroundTheme("dark")}
                          className={`px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition-all ${
                            playgroundTheme === "dark" ? "bg-[#172023] text-white shadow-2xs font-extrabold" : "text-stone-500 hover:text-stone-300"
                          }`}
                        >
                          Dark
                        </button>
                      </div>
                    </div>

                    {/* Rendering Container */}
                    <div className={`flex-1 rounded-xl flex items-center justify-center p-8 my-4 border border-dashed transition-all ${
                      playgroundTheme === "dark" ? "bg-[#172023] border-stone-800" : "bg-stone-50/50 border-stone-250"
                    }`}>
                      
                      {/* Render base button */}
                      {builderArchetype === "button" && (
                        <button
                          className={((): string => {
                            let bgCol = "bg-[#06434a] text-white";
                            if (builderColor === "primary") bgCol = "bg-[#06434a] text-white";
                            else if (builderColor === "secondary") bgCol = "bg-[#07be8a] text-stone-950";
                            else if (builderColor === "warning") bgCol = "bg-[#f59e0b] text-stone-950";
                            else if (builderColor === "danger") bgCol = "bg-[#f43f5e] text-white";
                            else if (builderColor === "stone") bgCol = "bg-stone-100 text-stone-800 border border-stone-300";

                            let classes = `${bgCol} `;
                            if (builderRadius === "none") classes += "rounded-none ";
                            else if (builderRadius === "md") classes += "rounded-md ";
                            else if (builderRadius === "lg") classes += "rounded-lg ";
                            else if (builderRadius === "xl") classes += "rounded-xl ";
                            else if (builderRadius === "full") classes += "rounded-full ";
                            
                            if (builderShadow !== "none") classes += `${builderShadow} `;
                            
                            if (builderPadding === "compact") classes += "px-3 py-1.5 ";
                            else if (builderPadding === "balanced") classes += "px-5 py-2.5 ";
                            else if (builderPadding === "spacious") classes += "px-7 py-3.5 ";
                            
                            if (builderSize === "sm") classes += "text-[10px] font-bold uppercase tracking-wider ";
                            else if (builderSize === "base") classes += "text-xs font-black uppercase tracking-widest ";
                            else if (builderSize === "lg") classes += "text-sm font-black uppercase tracking-widest ";
                            
                            if (builderBorder === "solid-1") classes += "border border-black/10 ";
                            else if (builderBorder === "solid-2") classes += "border-2 border-black/10 ";
                            else if (builderBorder === "dashed") classes += "border border-dashed border-black/20 ";

                            return classes + " hover:scale-[1.02] hover:shadow-md transition-all active:scale-[0.98] cursor-pointer";
                          })()}
                        >
                          <Sparkles className="h-3.5 w-3.5 inline-block mr-1.5 text-amber-350 shrink-0" />
                          <span>{builderLabelText}</span>
                        </button>
                      )}

                      {/* Render Badge */}
                      {builderArchetype === "badge" && (
                        <span
                          className={((): string => {
                            let badgeBg = "bg-[#06434a]/10 text-[#06434a]";
                            if (builderColor === "primary") badgeBg = "bg-[#06434a]/10 text-[#06434a]";
                            else if (builderColor === "secondary") badgeBg = "bg-[#07be8a]/15 text-[#05845f]";
                            else if (builderColor === "warning") badgeBg = "bg-[#f59e0b]/15 text-[#9a3412]";
                            else if (builderColor === "danger") badgeBg = "bg-[#f43f5e]/10 text-[#e11d48]";
                            else if (builderColor === "stone") badgeBg = "bg-stone-100 text-stone-700";

                            let classes = `${badgeBg} `;
                            if (builderRadius === "none") classes += "rounded-none ";
                            else if (builderRadius === "md") classes += "rounded-md ";
                            else if (builderRadius === "lg") classes += "rounded-lg ";
                            else if (builderRadius === "xl") classes += "rounded-xl ";
                            else if (builderRadius === "full") classes += "rounded-full ";

                            if (builderPadding === "compact") classes += "px-2 py-0.5 ";
                            else if (builderPadding === "balanced") classes += "px-3 py-1 ";
                            else if (builderPadding === "spacious") classes += "px-4.5 py-1.5 ";

                            if (builderSize === "sm") classes += "text-[8px] font-black uppercase tracking-widest ";
                            else if (builderSize === "base") classes += "text-[10px] font-extrabold uppercase tracking-widest ";
                            else if (builderSize === "lg") classes += "text-xs font-extrabold uppercase tracking-widest ";

                            if (builderBorder === "solid-1") classes += "border border-black/10 ";
                            else if (builderBorder === "solid-2") classes += "border-2 border-black/10 ";
                            else if (builderBorder === "dashed") classes += "border border-dashed border-black/10 ";

                            return classes;
                          })()}
                        >
                          <Check className="h-3 w-3 inline-block mr-1 shrink-0 stroke-[3]" />
                          <span>{builderLabelText}</span>
                        </span>
                      )}

                      {/* Render Card */}
                      {builderArchetype === "card" && (
                        <div
                          className={((): string => {
                            let classes = "bg-white text-stone-800 border ";
                            if (builderBorder === "none") classes += "border-stone-100 ";
                            else if (builderBorder === "solid-1") classes += "border-stone-200 ";
                            else if (builderBorder === "solid-2") classes += "border-2 border-stone-300 ";
                            else if (builderBorder === "dashed") classes += "border border-dashed border-stone-300 ";

                            if (builderRadius === "none") classes += "rounded-none ";
                            else if (builderRadius === "md") classes += "rounded-md ";
                            else if (builderRadius === "lg") classes += "rounded-lg ";
                            else if (builderRadius === "xl") classes += "rounded-xl ";
                            else if (builderRadius === "full") classes += "rounded-3xl ";

                            if (builderShadow !== "none") classes += `${builderShadow} `;

                            if (builderPadding === "compact") classes += "p-4 ";
                            else if (builderPadding === "balanced") classes += "p-6 ";
                            else if (builderPadding === "spacious") classes += "p-8 ";

                            return classes;
                          })()}
                        >
                          <div className="flex items-center gap-2 border-b border-stone-100 pb-2 mb-2">
                            <Info className="h-4 w-4 text-[#06434a] shrink-0" />
                            <span className="font-extrabold text-xs text-stone-900">{builderLabelText}</span>
                          </div>
                          <p className="text-[10.5px] text-stone-500 font-medium leading-relaxed">
                            Módulo de visualización estandarizado con grid de tokens corporativos.
                          </p>
                        </div>
                      )}

                      {/* Render Input */}
                      {builderArchetype === "input" && (
                        <div className="w-full max-w-xs space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Ingresar Nombre de Soporte</label>
                          <input
                            type="text"
                            placeholder={builderLabelText}
                            className={((): string => {
                              let classes = "bg-white text-stone-800 border w-full ";
                              if (builderBorder === "none" || builderBorder === "solid-1") classes += "border-stone-200 focus:border-[#06434a]/80 ";
                              else if (builderBorder === "solid-2") classes += "border-2 border-stone-300 focus:border-[#06434a] ";
                              else if (builderBorder === "dashed") classes += "border border-dashed border-stone-300 focus:border-dashed focus:border-[#06434a] ";

                              if (builderRadius === "none") classes += "rounded-none ";
                              else if (builderRadius === "md") classes += "rounded-md ";
                              else if (builderRadius === "lg") classes += "rounded-lg ";
                              else if (builderRadius === "xl") classes += "rounded-xl ";
                              else if (builderRadius === "full") classes += "rounded-full ";

                              if (builderShadow !== "none") classes += `${builderShadow} `;

                              if (builderPadding === "compact") classes += "px-3 py-1.5 ";
                              else if (builderPadding === "balanced") classes += "px-4 py-2.5 ";
                              else if (builderPadding === "spacious") classes += "px-5 py-3.5 ";

                              if (builderSize === "sm") classes += "text-[11px] font-semibold ";
                              else if (builderSize === "base") classes += "text-xs font-semibold ";
                              else if (builderSize === "lg") classes += "text-sm font-semibold ";

                              return classes + "outline-hidden transition-all";
                            })()}
                          />
                        </div>
                      )}

                    </div>

                    {/* Bottom stats/debug info */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 font-bold">
                      <span>Archetype: <span className="text-[#06434a] font-bold uppercase">{builderArchetype}</span></span>
                      <span>Padding Math: <span className="text-stone-700 font-bold">{builderPadding} (Proportional)</span></span>
                    </div>
                  </div>

                  {/* Generated Code blocks */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex-1 flex flex-col justify-between">
                    <div className="border-b border-stone-100 pb-2 flex items-center justify-between">
                      <div>
                        <span className="block text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest">PASO 3</span>
                        <h3 className="text-xs font-bold text-stone-900">Código React + Tailwind CSS Generado</h3>
                      </div>
                      <button
                        onClick={() => {
                          let bgCol = "bg-[#06434a] text-white";
                          if (builderColor === "primary") bgCol = "bg-[#06434a] text-white";
                          else if (builderColor === "secondary") bgCol = "bg-[#07be8a] text-stone-950";
                          else if (builderColor === "warning") bgCol = "bg-[#f59e0b] text-stone-950";
                          else if (builderColor === "danger") bgCol = "bg-[#f43f5e] text-white";
                          else if (builderColor === "stone") bgCol = "bg-stone-100 text-stone-800 border border-stone-300";

                          let classes = "";
                          if (builderArchetype === "button") {
                            classes += `${bgCol} `;
                            if (builderRadius === "none") classes += "rounded-none ";
                            else if (builderRadius === "md") classes += "rounded-md ";
                            else if (builderRadius === "lg") classes += "rounded-lg ";
                            else if (builderRadius === "xl") classes += "rounded-xl ";
                            else if (builderRadius === "full") classes += "rounded-full ";
                            if (builderShadow !== "none") classes += `${builderShadow} `;
                            if (builderPadding === "compact") classes += "px-3 py-1.5 ";
                            else if (builderPadding === "balanced") classes += "px-5 py-2.5 ";
                            else if (builderPadding === "spacious") classes += "px-7 py-3.5 ";
                            if (builderSize === "sm") classes += "text-[10px] font-bold uppercase tracking-wider ";
                            else if (builderSize === "base") classes += "text-xs font-black uppercase tracking-widest ";
                            else if (builderSize === "lg") classes += "text-sm font-black uppercase tracking-widest ";
                            if (builderBorder === "solid-1") classes += "border border-black/10 ";
                            else if (builderBorder === "solid-2") classes += "border-2 border-black/10 ";
                            else if (builderBorder === "dashed") classes += "border border-dashed border-black/20 ";
                            classes += "hover:scale-[1.02] hover:shadow-md transition-all active:scale-[0.98] cursor-pointer";
                          } else if (builderArchetype === "badge") {
                            let badgeBg = "bg-[#06434a]/10 text-[#06434a]";
                            if (builderColor === "primary") badgeBg = "bg-[#06434a]/10 text-[#06434a]";
                            else if (builderColor === "secondary") badgeBg = "bg-[#07be8a]/15 text-[#05845f]";
                            else if (builderColor === "warning") badgeBg = "bg-[#f59e0b]/15 text-[#9a3412]";
                            else if (builderColor === "danger") badgeBg = "bg-[#f43f5e]/10 text-[#e11d48]";
                            else if (builderColor === "stone") badgeBg = "bg-stone-100 text-stone-700";
                            classes += `${badgeBg} `;
                            if (builderRadius === "none") classes += "rounded-none ";
                            else if (builderRadius === "md") classes += "rounded-md ";
                            else if (builderRadius === "lg") classes += "rounded-lg ";
                            else if (builderRadius === "xl") classes += "rounded-xl ";
                            else if (builderRadius === "full") classes += "rounded-full ";
                            if (builderPadding === "compact") classes += "px-2 py-0.5 ";
                            else if (builderPadding === "balanced") classes += "px-3 py-1 ";
                            else if (builderPadding === "spacious") classes += "px-4.5 py-1.5 ";
                            if (builderSize === "sm") classes += "text-[8px] font-black uppercase tracking-widest ";
                            else if (builderSize === "base") classes += "text-[10px] font-extrabold uppercase tracking-widest ";
                            else if (builderSize === "lg") classes += "text-xs font-extrabold uppercase tracking-widest ";
                            if (builderBorder === "solid-1") classes += "border border-black/10 ";
                            else if (builderBorder === "solid-2") classes += "border-2 border-black/10 ";
                            else if (builderBorder === "dashed") classes += "border border-dashed border-black/10 ";
                          } else if (builderArchetype === "card") {
                            classes += "bg-white text-stone-800 border ";
                            if (builderBorder === "none") classes += "border-stone-100 ";
                            else if (builderBorder === "solid-1") classes += "border-stone-200 ";
                            else if (builderBorder === "solid-2") classes += "border-2 border-stone-300 ";
                            else if (builderBorder === "dashed") classes += "border border-dashed border-stone-300 ";
                            if (builderRadius === "none") classes += "rounded-none ";
                            else if (builderRadius === "md") classes += "rounded-md ";
                            else if (builderRadius === "lg") classes += "rounded-lg ";
                            else if (builderRadius === "xl") classes += "rounded-xl ";
                            else if (builderRadius === "full") classes += "rounded-3xl ";
                            if (builderShadow !== "none") classes += `${builderShadow} `;
                            if (builderPadding === "compact") classes += "p-4 ";
                            else if (builderPadding === "balanced") classes += "p-6 ";
                            else if (builderPadding === "spacious") classes += "p-8 ";
                          } else if (builderArchetype === "input") {
                            classes += "bg-white text-stone-800 border w-full ";
                            if (builderBorder === "none" || builderBorder === "solid-1") classes += "border-stone-200 focus:border-[#06434a]/80 ";
                            else if (builderBorder === "solid-2") classes += "border-2 border-stone-300 focus:border-[#06434a] ";
                            else if (builderBorder === "dashed") classes += "border border-dashed border-stone-300 focus:border-dashed focus:border-[#06434a] ";
                            if (builderRadius === "none") classes += "rounded-none ";
                            else if (builderRadius === "md") classes += "rounded-md ";
                            else if (builderRadius === "lg") classes += "rounded-lg ";
                            else if (builderRadius === "xl") classes += "rounded-xl ";
                            else if (builderRadius === "full") classes += "rounded-full ";
                            if (builderShadow !== "none") classes += `${builderShadow} `;
                            if (builderPadding === "compact") classes += "px-3 py-1.5 ";
                            else if (builderPadding === "balanced") classes += "px-4 py-2.5 ";
                            else if (builderPadding === "spacious") classes += "px-5 py-3.5 ";
                            if (builderSize === "sm") classes += "text-[11px] font-semibold ";
                            else if (builderSize === "base") classes += "text-xs font-semibold ";
                            else if (builderSize === "lg") classes += "text-sm font-semibold ";
                            classes += "outline-hidden transition-all";
                          }
                          navigator.clipboard.writeText(classes.trim());
                          setBuilderToastMessage("¡Clases de Tailwind copiadas al portapapeles con éxito!");
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-[10px] font-extrabold text-stone-600 hover:text-stone-900 cursor-pointer transition-all uppercase tracking-wider"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Copiar Clases
                      </button>
                    </div>

                    <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 text-[10.5px] font-mono text-emerald-400 overflow-x-auto text-left leading-relaxed mt-3 flex-1 select-all">
                      <p className="text-stone-500 font-bold">// Código de producción listo para usar</p>
                      {builderArchetype === "button" && (
                        <p>
                          &lt;<span className="text-sky-400">button</span> className=<span className="text-amber-300">"{((): string => {
                            let bgCol = "bg-[#06434a] text-white";
                            if (builderColor === "primary") bgCol = "bg-[#06434a] text-white";
                            else if (builderColor === "secondary") bgCol = "bg-[#07be8a] text-stone-950";
                            else if (builderColor === "warning") bgCol = "bg-[#f59e0b] text-stone-950";
                            else if (builderColor === "danger") bgCol = "bg-[#f43f5e] text-white";
                            else if (builderColor === "stone") bgCol = "bg-stone-100 text-stone-800 border border-stone-300";

                            let classes = `${bgCol} `;
                            if (builderRadius === "none") classes += "rounded-none ";
                            else if (builderRadius === "md") classes += "rounded-md ";
                            else if (builderRadius === "lg") classes += "rounded-lg ";
                            else if (builderRadius === "xl") classes += "rounded-xl ";
                            else if (builderRadius === "full") classes += "rounded-full ";
                            if (builderShadow !== "none") classes += `${builderShadow} `;
                            if (builderPadding === "compact") classes += "px-3 py-1.5 ";
                            else if (builderPadding === "balanced") classes += "px-5 py-2.5 ";
                            else if (builderPadding === "spacious") classes += "px-7 py-3.5 ";
                            if (builderSize === "sm") classes += "text-[10px] font-bold uppercase tracking-wider ";
                            else if (builderSize === "base") classes += "text-xs font-black uppercase tracking-widest ";
                            else if (builderSize === "lg") classes += "text-sm font-black uppercase tracking-widest ";
                            if (builderBorder === "solid-1") classes += "border border-black/10 ";
                            else if (builderBorder === "solid-2") classes += "border-2 border-black/10 ";
                            else if (builderBorder === "dashed") classes += "border border-dashed border-black/20 ";
                            return (classes + "hover:scale-[1.02] hover:shadow-md transition-all active:scale-[0.98] cursor-pointer").trim();
                          })()}"</span>&gt;
                          <br />
                          &nbsp;&nbsp;&lt;<span className="text-purple-400">Sparkles</span> className="h-4 w-4 mr-1.5" /&gt;
                          <br />
                          &nbsp;&nbsp;&lt;<span className="text-purple-400">span</span>&gt;{builderLabelText}&lt;/<span className="text-purple-400">span</span>&gt;
                          <br />
                          &lt;/<span className="text-sky-400">button</span>&gt;
                        </p>
                      )}
                      {builderArchetype === "badge" && (
                        <p>
                          &lt;<span className="text-sky-400">span</span> className=<span className="text-amber-300">"{((): string => {
                            let badgeBg = "bg-[#06434a]/10 text-[#06434a]";
                            if (builderColor === "primary") badgeBg = "bg-[#06434a]/10 text-[#06434a]";
                            else if (builderColor === "secondary") badgeBg = "bg-[#07be8a]/15 text-[#05845f]";
                            else if (builderColor === "warning") badgeBg = "bg-[#f59e0b]/15 text-[#9a3412]";
                            else if (builderColor === "danger") badgeBg = "bg-[#f43f5e]/10 text-[#e11d48]";
                            else if (builderColor === "stone") badgeBg = "bg-stone-100 text-stone-700";

                            let classes = `${badgeBg} `;
                            if (builderRadius === "none") classes += "rounded-none ";
                            else if (builderRadius === "md") classes += "rounded-md ";
                            else if (builderRadius === "lg") classes += "rounded-lg ";
                            else if (builderRadius === "xl") classes += "rounded-xl ";
                            else if (builderRadius === "full") classes += "rounded-full ";
                            if (builderPadding === "compact") classes += "px-2 py-0.5 ";
                            else if (builderPadding === "balanced") classes += "px-3 py-1 ";
                            else if (builderPadding === "spacious") classes += "px-4.5 py-1.5 ";
                            if (builderSize === "sm") classes += "text-[8px] font-black uppercase tracking-widest ";
                            else if (builderSize === "base") classes += "text-[10px] font-extrabold uppercase tracking-widest ";
                            else if (builderSize === "lg") classes += "text-xs font-extrabold uppercase tracking-widest ";
                            if (builderBorder === "solid-1") classes += "border border-black/10 ";
                            else if (builderBorder === "solid-2") classes += "border-2 border-black/10 ";
                            else if (builderBorder === "dashed") classes += "border border-dashed border-black/10 ";
                            return classes.trim();
                          })()}"</span>&gt;
                          <br />
                          &nbsp;&nbsp;&lt;<span className="text-purple-400">Check</span> className="h-3 w-3 mr-1" /&gt;
                          <br />
                          &nbsp;&nbsp;{builderLabelText}
                          <br />
                          &lt;/<span className="text-sky-400">span</span>&gt;
                        </p>
                      )}
                      {builderArchetype === "card" && (
                        <p>
                          &lt;<span className="text-sky-400">div</span> className=<span className="text-amber-300">"{((): string => {
                            let classes = "bg-white text-stone-800 border ";
                            if (builderBorder === "none") classes += "border-stone-100 ";
                            else if (builderBorder === "solid-1") classes += "border-stone-200 ";
                            else if (builderBorder === "solid-2") classes += "border-2 border-stone-300 ";
                            else if (builderBorder === "dashed") classes += "border border-dashed border-stone-300 ";

                            if (builderRadius === "none") classes += "rounded-none ";
                            else if (builderRadius === "md") classes += "rounded-md ";
                            else if (builderRadius === "lg") classes += "rounded-lg ";
                            else if (builderRadius === "xl") classes += "rounded-xl ";
                            else if (builderRadius === "full") classes += "rounded-3xl ";
                            if (builderShadow !== "none") classes += `${builderShadow} `;
                            if (builderPadding === "compact") classes += "p-4 ";
                            else if (builderPadding === "balanced") classes += "p-6 ";
                            else if (builderPadding === "spacious") classes += "p-8 ";
                            return classes.trim();
                          })()}"</span>&gt;
                          <br />
                          &nbsp;&nbsp;&lt;<span className="text-sky-400">h4</span> className="font-extrabold text-sm mb-2 border-b pb-1 border-stone-100"&gt;{builderLabelText}&lt;/<span className="text-sky-400">h4</span>&gt;
                          <br />
                          &nbsp;&nbsp;&lt;<span className="text-sky-400">p</span> className="text-xs text-stone-500 font-medium leading-relaxed"&gt;Módulo de visualización estandarizado con grid de tokens corporativos.&lt;/<span className="text-sky-400">p</span>&gt;
                          <br />
                          &lt;/<span className="text-sky-400">div</span>&gt;
                        </p>
                      )}
                      {builderArchetype === "input" && (
                        <p>
                          &lt;<span className="text-sky-400">div</span> className="space-y-1"&gt;
                          <br />
                          &nbsp;&nbsp;&lt;<span className="text-sky-400">label</span> className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block"&gt;Ingresar Nombre de Soporte&lt;/<span className="text-sky-400">label</span>&gt;
                          <br />
                          &nbsp;&nbsp;&lt;<span className="text-sky-400">input</span> type="text" placeholder="{builderLabelText}" className=<span className="text-amber-300">"{((): string => {
                            let classes = "bg-white text-stone-800 border w-full ";
                            if (builderBorder === "none" || builderBorder === "solid-1") classes += "border-stone-200 focus:border-[#06434a]/80 ";
                            else if (builderBorder === "solid-2") classes += "border-2 border-stone-300 focus:border-[#06434a] ";
                            else if (builderBorder === "dashed") classes += "border border-dashed border-stone-300 focus:border-dashed focus:border-[#06434a] ";

                            if (builderRadius === "none") classes += "rounded-none ";
                            else if (builderRadius === "md") classes += "rounded-md ";
                            else if (builderRadius === "lg") classes += "rounded-lg ";
                            else if (builderRadius === "xl") classes += "rounded-xl ";
                            else if (builderRadius === "full") classes += "rounded-full ";
                            if (builderShadow !== "none") classes += `${builderShadow} `;
                            if (builderPadding === "compact") classes += "px-3 py-1.5 ";
                            else if (builderPadding === "balanced") classes += "px-4 py-2.5 ";
                            else if (builderPadding === "spacious") classes += "px-5 py-3.5 ";
                            if (builderSize === "sm") classes += "text-[11px] font-semibold ";
                            else if (builderSize === "base") classes += "text-xs font-semibold ";
                            else if (builderSize === "lg") classes += "text-sm font-semibold ";
                            return classes.trim();
                          })()}"</span> /&gt;
                          <br />
                          &lt;/<span className="text-sky-400">div</span>&gt;
                        </p>
                      )}
                    </div>

                    {/* Button to register/save element */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4 mt-4">
                      <div className="text-left">
                        <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-wider">REGISTRO LOCAL</span>
                        <span className="text-[10.5px] font-black text-stone-800">Catálogo de Componentes</span>
                      </div>
                      <button
                        onClick={() => {
                          let bgCol = "bg-[#06434a] text-white";
                          if (builderColor === "primary") bgCol = "bg-[#06434a] text-white";
                          else if (builderColor === "secondary") bgCol = "bg-[#07be8a] text-stone-950";
                          else if (builderColor === "warning") bgCol = "bg-[#f59e0b] text-stone-950";
                          else if (builderColor === "danger") bgCol = "bg-[#f43f5e] text-white";
                          else if (builderColor === "stone") bgCol = "bg-stone-100 text-stone-800 border border-stone-300";

                          let classesStr = "";
                          if (builderArchetype === "button") {
                            classesStr += `${bgCol} `;
                            if (builderRadius === "none") classesStr += "rounded-none ";
                            else if (builderRadius === "md") classesStr += "rounded-md ";
                            else if (builderRadius === "lg") classesStr += "rounded-lg ";
                            else if (builderRadius === "xl") classesStr += "rounded-xl ";
                            else if (builderRadius === "full") classesStr += "rounded-full ";
                            if (builderShadow !== "none") classesStr += `${builderShadow} `;
                            if (builderPadding === "compact") classesStr += "px-3 py-1.5 ";
                            else if (builderPadding === "balanced") classesStr += "px-5 py-2.5 ";
                            else if (builderPadding === "spacious") classesStr += "px-7 py-3.5 ";
                            if (builderSize === "sm") classesStr += "text-[10px] font-bold uppercase tracking-wider ";
                            else if (builderSize === "base") classesStr += "text-xs font-black uppercase tracking-widest ";
                            else if (builderSize === "lg") classesStr += "text-sm font-black uppercase tracking-widest ";
                            if (builderBorder === "solid-1") classesStr += "border border-black/10 ";
                            else if (builderBorder === "solid-2") classesStr += "border-2 border-black/10 ";
                            else if (builderBorder === "dashed") classesStr += "border border-dashed border-black/20 ";
                            classesStr += "hover:scale-[1.02] hover:shadow-md transition-all active:scale-[0.98] cursor-pointer";
                          } else if (builderArchetype === "badge") {
                            let badgeBg = "bg-[#06434a]/10 text-[#06434a]";
                            if (builderColor === "primary") badgeBg = "bg-[#06434a]/10 text-[#06434a]";
                            else if (builderColor === "secondary") badgeBg = "bg-[#07be8a]/15 text-[#05845f]";
                            else if (builderColor === "warning") badgeBg = "bg-[#f59e0b]/15 text-[#9a3412]";
                            else if (builderColor === "danger") badgeBg = "bg-[#f43f5e]/10 text-[#e11d48]";
                            else if (builderColor === "stone") badgeBg = "bg-stone-100 text-stone-700";
                            classesStr += `${badgeBg} `;
                            if (builderRadius === "none") classesStr += "rounded-none ";
                            else if (builderRadius === "md") classesStr += "rounded-md ";
                            else if (builderRadius === "lg") classesStr += "rounded-lg ";
                            else if (builderRadius === "xl") classesStr += "rounded-xl ";
                            else if (builderRadius === "full") classesStr += "rounded-full ";
                            if (builderPadding === "compact") classesStr += "px-2 py-0.5 ";
                            else if (builderPadding === "balanced") classesStr += "px-3 py-1 ";
                            else if (builderPadding === "spacious") classesStr += "px-4.5 py-1.5 ";
                            if (builderSize === "sm") classesStr += "text-[8px] font-black uppercase tracking-widest ";
                            else if (builderSize === "base") classesStr += "text-[10px] font-extrabold uppercase tracking-widest ";
                            else if (builderSize === "lg") classesStr += "text-xs font-extrabold uppercase tracking-widest ";
                            if (builderBorder === "solid-1") classesStr += "border border-black/10 ";
                            else if (builderBorder === "solid-2") classesStr += "border-2 border-black/10 ";
                            else if (builderBorder === "dashed") classesStr += "border border-dashed border-black/10 ";
                          } else if (builderArchetype === "card") {
                            classesStr += "bg-white text-stone-800 border ";
                            if (builderBorder === "none") classesStr += "border-stone-100 ";
                            else if (builderBorder === "solid-1") classesStr += "border-stone-200 ";
                            else if (builderBorder === "solid-2") classesStr += "border-2 border-stone-300 ";
                            else if (builderBorder === "dashed") classesStr += "border border-dashed border-stone-300 ";
                            if (builderRadius === "none") classesStr += "rounded-none ";
                            else if (builderRadius === "md") classesStr += "rounded-md ";
                            else if (builderRadius === "lg") classesStr += "rounded-lg ";
                            else if (builderRadius === "xl") classesStr += "rounded-xl ";
                            else if (builderRadius === "full") classesStr += "rounded-3xl ";
                            if (builderShadow !== "none") classesStr += `${builderShadow} `;
                            if (builderPadding === "compact") classesStr += "p-4 ";
                            else if (builderPadding === "balanced") classesStr += "p-6 ";
                            else if (builderPadding === "spacious") classesStr += "p-8 ";
                          } else if (builderArchetype === "input") {
                            classesStr += "bg-white text-stone-800 border w-full ";
                            if (builderBorder === "none" || builderBorder === "solid-1") classesStr += "border-stone-200 focus:border-[#06434a]/80 ";
                            else if (builderBorder === "solid-2") classesStr += "border-2 border-stone-300 focus:border-[#06434a] ";
                            else if (builderBorder === "dashed") classesStr += "border border-dashed border-stone-300 focus:border-dashed focus:border-[#06434a] ";
                            if (builderRadius === "none") classesStr += "rounded-none ";
                            else if (builderRadius === "md") classesStr += "rounded-md ";
                            else if (builderRadius === "lg") classesStr += "rounded-lg ";
                            else if (builderRadius === "xl") classesStr += "rounded-xl ";
                            else if (builderRadius === "full") classesStr += "rounded-full ";
                            if (builderShadow !== "none") classesStr += `${builderShadow} `;
                            if (builderPadding === "compact") classesStr += "px-3 py-1.5 ";
                            else if (builderPadding === "balanced") classesStr += "px-4 py-2.5 ";
                            else if (builderPadding === "spacious") classesStr += "px-5 py-3.5 ";
                            if (builderSize === "sm") classesStr += "text-[11px] font-semibold ";
                            else if (builderSize === "base") classesStr += "text-xs font-semibold ";
                            else if (builderSize === "lg") classesStr += "text-sm font-semibold ";
                            classesStr += "outline-hidden transition-all";
                          }

                          const newComp = {
                            id: `comp-gen-${Date.now()}`,
                            name: `Custom ${builderArchetype.charAt(0).toUpperCase() + builderArchetype.slice(1)} - ${builderLabelText}`,
                            archetype: builderArchetype,
                            classes: classesStr,
                            config: {
                              color: builderColor,
                              size: builderSize,
                              radius: builderRadius,
                              border: builderBorder,
                              shadow: builderShadow,
                              padding: builderPadding
                            }
                          };
                          setCreatedComponents((prev) => [...prev, newComp]);
                          setBuilderToastMessage(`¡Componente "${newComp.name}" registrado en el catálogo local con éxito!`);
                        }}
                        className="px-4 py-2.5 bg-[#06434a] hover:bg-[#0b5e67] text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102"
                      >
                        <Sparkles className="h-4 w-4 text-emerald-300" />
                        Registrar Componente
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Registered Custom Components List */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4 text-left">
                <div className="border-b border-stone-100 pb-2.5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      Catálogo de Componentes Registrados ({createdComponents.length})
                    </h3>
                    <p className="text-xs text-stone-500">Componentes reutilizables diseñados en esta sesión y listos para inyección en UI.</p>
                  </div>
                  <Badge variant="secondary" className="bg-[#e6f2f3] text-[#06434a] font-mono text-[9px]">Local Sandbox Storage</Badge>
                </div>

                {createdComponents.length === 0 ? (
                  <div className="py-8 text-center bg-stone-50/50 rounded-xl border border-dashed border-stone-200">
                    <p className="text-xs font-bold text-stone-500">No hay componentes registrados aún</p>
                    <p className="text-[10px] text-stone-400 mt-1">Configura parámetros visuales arriba y haz clic en "Registrar Componente".</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {createdComponents.map((item) => (
                      <div key={item.id} className="p-4 border border-stone-200 rounded-xl bg-stone-50/30 flex flex-col justify-between gap-3 relative group">
                        
                        {/* Name and config specs */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-stone-900 block">{item.name}</span>
                            <span className="text-[8px] font-mono font-black bg-stone-200/60 text-stone-700 px-2 py-0.5 rounded uppercase">
                              {item.archetype}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 text-[8.5px] font-mono text-stone-400">
                            <span>Color: {item.config?.color}</span>·
                            <span>Size: {item.config?.size}</span>·
                            <span>Radius: {item.config?.radius}</span>·
                            <span>Border: {item.config?.border}</span>·
                            <span>Shadow: {item.config?.shadow}</span>
                          </div>
                        </div>

                        {/* Visual render in smaller scale */}
                        <div className="bg-white border border-stone-150 rounded-lg p-4 flex items-center justify-center min-h-[70px]">
                          {item.archetype === "button" && (
                            <button className={item.classes}>
                              <Sparkles className="h-3 w-3 inline-block mr-1 text-amber-300" />
                              <span>{item.name.replace(/^Custom Button - /, "").replace(/^Custom Button -/, "")}</span>
                            </button>
                          )}
                          {item.archetype === "badge" && (
                            <span className={item.classes}>
                              <Check className="h-2.5 w-2.5 inline-block mr-1 stroke-[3]" />
                              <span>{item.name.replace(/^Custom Badge - /, "").replace(/^Custom Badge -/, "")}</span>
                            </span>
                          )}
                          {item.archetype === "card" && (
                            <div className={item.classes}>
                              <span className="font-black text-[10px] block mb-1">{item.name.replace(/^Custom Card - /, "").replace(/^Custom Card -/, "")}</span>
                              <p className="text-[9px] text-stone-500 leading-tight">Configuración de pauta optimizada.</p>
                            </div>
                          )}
                          {item.archetype === "input" && (
                            <input
                              type="text"
                              readOnly
                              placeholder={item.name.replace(/^Custom Input - /, "").replace(/^Custom Input -/, "")}
                              className={item.classes}
                            />
                          )}
                        </div>

                        {/* Copy Classes and Delete buttons */}
                        <div className="flex items-center justify-between border-t border-stone-100 pt-2 text-[9px] font-bold">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.classes);
                              setBuilderToastMessage(`¡Clases para "${item.name}" copiadas con éxito!`);
                            }}
                            className="text-[#06434a] hover:underline cursor-pointer flex items-center gap-1 uppercase tracking-wider"
                          >
                            <Download className="h-3 w-3" />
                            Copiar Clases
                          </button>
                          
                          <button
                            onClick={() => {
                              setCreatedComponents((prev) => prev.filter((c) => c.id !== item.id));
                              setBuilderToastMessage(`¡Componente "${item.name}" eliminado del catálogo!`);
                            }}
                            className="text-rose-500 hover:text-rose-700 cursor-pointer uppercase tracking-wider"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      {/* Playroom Footer with Custom Toast Feedback */}
      <div className="bg-stone-100/80 border-t border-stone-200 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
        <AnimatePresence>
          {showExportToast && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute -top-16 right-6 left-6 sm:left-auto bg-stone-900 text-stone-100 text-[11px] font-sans font-bold px-4 py-3 rounded-lg shadow-lg border border-stone-800 flex items-center gap-2 z-50"
            >
              <CheckCircle2 className="h-4 w-4 text-[#07be8a] shrink-0" />
              <span>Design System exportado: Todos los tokens se encuentran programados y accesibles en <code className="bg-stone-800 px-1 py-0.5 rounded text-stone-300 font-mono">/src/lib/designSystem.ts</code></span>
            </motion.div>
          )}
        </AnimatePresence>

        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest flex items-center gap-1.5 text-center sm:text-left font-mono">
          <Terminal className="h-4 w-4 text-[#06434a]" />
          * TODAS LAS REGLAS REUTILIZABLES CUMPLEN CON LA LEY DE CONVERSIÓN Y ACCESIBILIDAD DIGITAL.
        </span>
        <button
          onClick={() => {
            setShowExportToast(true);
            setTimeout(() => {
              setShowExportToast(false);
            }, 3500);
          }}
          className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 hover:border-[#06434a]/30 bg-white text-stone-600 hover:text-[#06434a] rounded-lg text-xs font-extrabold transition-all shrink-0 cursor-pointer shadow-2xs font-sans uppercase tracking-wider"
        >
          <Download className="h-4 w-4" />
          Exportar Librería de Tokens
        </button>
      </div>
    </div>
  );
};
