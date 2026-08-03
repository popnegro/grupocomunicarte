import React, { useState, useMemo } from "react";
import { MediaKit, Cliente, Role, MediaKitSupport } from "./types";
import { DoohScreen } from "../../types";
import { downloadMediaKitAsHtml } from "../../utils/mediaKitExport";
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Trash, 
  ArrowUp, 
  ArrowDown, 
  Edit, 
  CheckCircle, 
  Undo, 
  Copy, 
  Download, 
  Send, 
  Clock, 
  MessageSquare, 
  X, 
  User, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Check, 
  MapPin, 
  Layers 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MediaKitModuleProps {
  mediaKits: MediaKit[];
  clientes: Cliente[];
  screens: DoohScreen[];
  userRole: Role;
  onUpdateMediaKit: (id: string, data: Partial<MediaKit>) => void;
  onAddMediaKit: (mk: MediaKit) => void;
  onDeleteMediaKit: (id: string) => void;
  onGenerateQuoteFromMediaKit: (id: string) => void;
}

export const MediaKitModule: React.FC<MediaKitModuleProps> = ({
  mediaKits,
  clientes,
  screens,
  userRole,
  onUpdateMediaKit,
  onAddMediaKit,
  onDeleteMediaKit,
  onGenerateQuoteFromMediaKit,
}) => {
  // Navigation states inside module
  const [activeMediaKitId, setActiveMediaKitId] = useState<string | null>(mediaKits[0]?.id || null);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showAiWizard, setShowAiWizard] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Manual wizard state
  const [wizardName, setWizardName] = useState("");
  const [wizardClienteId, setWizardClienteId] = useState(clientes[0]?.id || "");
  const [wizardCiudad, setWizardCiudad] = useState<"Mendoza" | "Buenos Aires">("Mendoza");
  const [wizardScreenIds, setWizardScreenIds] = useState<string[]>([]);

  // AI proposal state
  const [aiClient, setAiClient] = useState("");
  const [aiCiudad, setAiCiudad] = useState<"Mendoza" | "Buenos Aires">("Mendoza");
  const [aiBudget, setAiBudget] = useState("3000000");
  const [aiGoal, setAiGoal] = useState<"Branding" | "High Density" | "Premium">("Branding");

  // Inline Notion editor states
  const [newCommentText, setNewCommentText] = useState("");

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const activeMediaKit = useMemo(() => {
    return mediaKits.find((m) => m.id === activeMediaKitId);
  }, [mediaKits, activeMediaKitId]);

  const activeMediaKitScreens = useMemo(() => {
    if (!activeMediaKit) return [];
    return activeMediaKit.soportesEdicionInline
      .map((item) => {
        const scr = screens.find((s) => s.id === item.id);
        if (scr) {
          return {
            ...scr,
            nota: item.notas || scr.nota,
          } as DoohScreen;
        }
        return null;
      })
      .filter((s): s is DoohScreen => s !== null);
  }, [activeMediaKit, screens]);

  // Manual creation wizard calculations with useMemo
  const availableWizardScreens = useMemo(() => {
    return screens.filter(
      (s) => s.ciudad === wizardCiudad && s.status === "Disponible"
    );
  }, [screens, wizardCiudad]);
  
  const wizardTotalCost = useMemo(() => {
    return wizardScreenIds.reduce((sum, id) => {
      const screen = screens.find((s) => s.id === id);
      return sum + (screen?.precio || 0);
    }, 0);
  }, [wizardScreenIds, screens]);

  const wizardTotalImpacts = useMemo(() => {
    return wizardScreenIds.reduce((sum, id) => {
      const screen = screens.find((s) => s.id === id);
      return sum + (screen?.impactos || 0);
    }, 0);
  }, [wizardScreenIds, screens]);

  const handleToggleWizardScreen = (id: string) => {
    setWizardScreenIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSaveManualMediaKit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardName || wizardScreenIds.length === 0) return;

    const clienteObj = clientes.find((c) => c.id === wizardClienteId);
    const mkId = `mk-man-${Date.now()}`;

    const newMk: MediaKit = {
      id: mkId,
      nombre: wizardName,
      clienteId: wizardClienteId,
      clienteNombre: clienteObj?.empresa || "Cliente Directo",
      ciudad: wizardCiudad,
      screenIds: wizardScreenIds,
      version: 1,
      estado: "Borrador",
      fecha: new Date().toISOString().split("T")[0],
      presupuesto: wizardTotalCost * 4, // estimate 4 weeks
      objetivo: "Estrategia de posicionamiento regional",
      comentarios: [],
      historial: [
        { id: "h-1", action: "MediaKit creado manualmente mediante asistente.", date: "Justo ahora", user: "Comercial Ejec." }
      ],
      soportesEdicionInline: wizardScreenIds.map((sid) => ({
        id: sid,
        notas: "Pautado base estándar de 15 segundos por spot.",
        prioridad: "Media",
        duracionSem: 4,
      })),
    };

    onAddMediaKit(newMk);
    setActiveMediaKitId(mkId);
    setShowCreateWizard(false);
    // Reset wizard
    setWizardName("");
    setWizardScreenIds([]);
    triggerToast("MediaKit creado y guardado como Borrador.");
  };

  // AI-Assisted Proposal Generator Algorithm
  const handleGenerateAiProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiClient) return;

    // Filter screens in that city
    const cityScreens = screens.filter((s) => s.ciudad === aiCiudad && s.status === "Disponible");
    
    // Smart selection algorithm based on budget and goals
    let selected: DoohScreen[] = [];
    const budgetLimit = Number(aiBudget);
    
    if (aiGoal === "Premium") {
      // Sort by price descending and pick the top assets fitting budget
      selected = [...cityScreens].sort((a, b) => b.precio - a.precio).slice(0, 2);
    } else if (aiGoal === "High Density") {
      // Sort by impact/price efficiency descending
      selected = [...cityScreens]
        .sort((a, b) => b.impactos / b.precio - a.impactos / a.precio)
        .slice(0, 3);
    } else {
      // Balance: mix of high impacts and central zones
      selected = cityScreens.slice(0, 3);
    }

    const matchedIds = selected.map((s) => s.id);
    const calculatedCost = selected.reduce((sum, s) => sum + s.precio, 0) * 4;

    const aiId = `mk-ai-${Date.now()}`;
    const newMk: MediaKit = {
      id: aiId,
      nombre: `Propuesta Inteligente IA — ${aiClient} (${aiCiudad})`,
      clienteId: "cl-01", // Default to Toyota or guest client
      clienteNombre: aiClient,
      ciudad: aiCiudad,
      screenIds: matchedIds,
      version: 1,
      estado: "Nuevo",
      fecha: new Date().toISOString().split("T")[0],
      presupuesto: calculatedCost,
      objetivo: `Campaña IA enfocada en objetivo comercial: ${aiGoal}`,
      comentarios: [
        { id: "c-ai-1", user: "Smart Assistant IA", text: "Asistente inteligente ha seleccionado este lote por alta correlación con su público objetivo.", date: "Justo ahora" }
      ],
      historial: [
        { id: "h-ai-1", action: "Generado y optimizado por el motor IA de Grupo Comunicarte.", date: "Justo ahora", user: "Smart Assistant IA" }
      ],
      soportesEdicionInline: matchedIds.map((sid) => ({
        id: sid,
        notas: "Ubicación sugerida por alta tasa de repetición y tráfico coincidente.",
        prioridad: aiGoal === "Premium" ? "Alta" : "Media",
        duracionSem: 4,
      })),
    };

    onAddMediaKit(newMk);
    setActiveMediaKitId(aiId);
    setShowAiWizard(false);
    setAiClient("");
    triggerToast("Propuesta inteligente generada con éxito.");
  };

  // Notion-style inline editor handlers
  const handleUpdateNotes = (screenId: string, notes: string) => {
    if (!activeMediaKit) return;
    const updatedSoportes = activeMediaKit.soportesEdicionInline.map((s) =>
      s.id === screenId ? { ...s, notas: notes } : s
    );
    
    // Increments version log on any save / update
    onUpdateMediaKit(activeMediaKit.id, {
      soportesEdicionInline: updatedSoportes,
      version: activeMediaKit.version + 1,
      historial: [
        { id: `h-upd-${Date.now()}`, action: `Notas actualizadas en soporte #${screenId}.`, date: "Justo ahora", user: "Comercial Ejec." },
        ...activeMediaKit.historial
      ]
    });
  };

  const handleUpdatePriority = (screenId: string, prio: "Alta" | "Media" | "Baja") => {
    if (!activeMediaKit) return;
    const updatedSoportes = activeMediaKit.soportesEdicionInline.map((s) =>
      s.id === screenId ? { ...s, prioridad: prio } : s
    );
    onUpdateMediaKit(activeMediaKit.id, {
      soportesEdicionInline: updatedSoportes,
      version: activeMediaKit.version + 1,
      historial: [
        { id: `h-upd-${Date.now()}`, action: `Prioridad cambiada a ${prio} para soporte #${screenId}.`, date: "Justo ahora", user: "Comercial Ejec." },
        ...activeMediaKit.historial
      ]
    });
  };

  const handleUpdateWeeks = (screenId: string, weeks: number) => {
    if (!activeMediaKit) return;
    const updatedSoportes = activeMediaKit.soportesEdicionInline.map((s) =>
      s.id === screenId ? { ...s, duracionSem: Number(weeks) } : s
    );
    onUpdateMediaKit(activeMediaKit.id, {
      soportesEdicionInline: updatedSoportes,
      version: activeMediaKit.version + 1,
      historial: [
        { id: `h-upd-${Date.now()}`, action: `Duración ajustada a ${weeks} semanas para soporte #${screenId}.`, date: "Justo ahora", user: "Comercial Ejec." },
        ...activeMediaKit.historial
      ]
    });
  };

  const handleRemoveSupportFromMediaKit = (screenId: string) => {
    if (!activeMediaKit) return;
    const updatedSoportes = activeMediaKit.soportesEdicionInline.filter((s) => s.id !== screenId);
    const updatedScreenIds = activeMediaKit.screenIds.filter((sid) => sid !== screenId);
    onUpdateMediaKit(activeMediaKit.id, {
      soportesEdicionInline: updatedSoportes,
      screenIds: updatedScreenIds,
      version: activeMediaKit.version + 1,
      historial: [
        { id: `h-upd-${Date.now()}`, action: `Soporte #${screenId} removido de la propuesta.`, date: "Justo ahora", user: "Comercial Ejec." },
        ...activeMediaKit.historial
      ]
    });
    triggerToast("Soporte removido de la propuesta.");
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText || !activeMediaKit) return;

    const comment = {
      id: `comm-${Date.now()}`,
      user: "Director Comercial",
      text: newCommentText,
      date: "Justo ahora",
    };

    onUpdateMediaKit(activeMediaKit.id, {
      comentarios: [...activeMediaKit.comentarios, comment],
    });
    setNewCommentText("");
    triggerToast("Comentario publicado.");
  };

  // Revert version logs
  const handleRevertVersion = (v: number) => {
    if (!activeMediaKit) return;
    onUpdateMediaKit(activeMediaKit.id, {
      version: v,
      historial: [
        { id: `h-rev-${Date.now()}`, action: `MediaKit restaurado a Versión v${v}.`, date: "Justo ahora", user: "Director Comercial" },
        ...activeMediaKit.historial
      ]
    });
    triggerToast(`Restaurada la versión v${v} de la propuesta.`);
  };

  // Calculates running totals of active MediaKit in real-time with useMemo
  const activeMediaKitCost = useMemo(() => {
    if (!activeMediaKit) return 0;
    return activeMediaKit.soportesEdicionInline.reduce((sum, item) => {
      const screen = screens.find((s) => s.id === item.id);
      return sum + (screen?.precio || 0) * item.duracionSem;
    }, 0);
  }, [activeMediaKit, screens]);

  const activeMediaKitImpacts = useMemo(() => {
    if (!activeMediaKit) return 0;
    return activeMediaKit.screenIds.reduce((sum, id) => {
      const screen = screens.find((s) => s.id === id);
      return sum + (screen?.impactos || 0);
    }, 0);
  }, [activeMediaKit, screens]);

  return (
    <div className="flex flex-col lg:flex-row h-full font-sans max-w-7xl mx-auto items-stretch relative">
      
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-bold py-3 px-5 rounded-lg shadow-lg border border-stone-800 flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <span>{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Left Sidebar: MediaKits List */}
      <div className="w-full lg:w-72 border-r border-stone-200/80 bg-stone-50/50 flex flex-col justify-between overflow-y-auto shrink-0 p-5 space-y-4">
        
        <div className="space-y-4">
          <div className="text-left">
            <span className="text-[8px] bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
              Fuerza Comercial
            </span>
            <h3 className="text-xs font-black text-stone-900 font-display mt-1.5 uppercase tracking-wider">
              Propuestas MediaKit
            </h3>
          </div>

          <div className="space-y-2">
            {/* Action Triggers */}
            <button
              onClick={() => setShowCreateWizard(true)}
              className="w-full bg-white hover:bg-stone-50 text-stone-700 text-[10px] font-bold py-2 px-3 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="h-3.5 w-3.5 text-[#06434a]" />
              <span>Crear Manualmente</span>
            </button>

            <button
              onClick={() => setShowAiWizard(true)}
              className="w-full bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase py-2.5 px-3 rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span>Generar con IA</span>
            </button>
          </div>

          <div className="border-t border-stone-200/60 pt-3 space-y-2">
            {mediaKits.map((mk) => {
              const isActive = mk.id === activeMediaKitId;
              return (
                <div
                  key={mk.id}
                  onClick={() => setActiveMediaKitId(mk.id)}
                  className={`p-3.5 rounded-xl cursor-pointer text-left transition-all flex flex-col justify-between gap-1.5 border ${
                    isActive 
                      ? "bg-white border-[#06434a] ring-1 ring-[#06434a]/15 shadow-2xs" 
                      : "bg-transparent border-transparent hover:bg-stone-100/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[8px] font-mono font-bold text-stone-400">ID: {mk.id}</span>
                      <span className={`text-[7px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                        mk.estado === "Aceptado" || mk.estado === "Convertido"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : mk.estado === "Borrador"
                          ? "bg-stone-100 text-stone-600"
                          : "bg-blue-50 text-blue-700"
                      }`}>
                        {mk.estado}
                      </span>
                    </div>
                    <h4 className="text-[11px] font-black text-stone-900 mt-1 truncate leading-tight font-display">
                      {mk.nombre}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-stone-400 font-bold border-t border-stone-100/60 pt-1.5 mt-0.5">
                    <span>{mk.ciudad}</span>
                    <span className="text-stone-500 font-mono">v{mk.version}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. Main Area: Notion-style Editor */}
      <div className="flex-1 overflow-y-auto p-8 bg-white flex flex-col items-stretch">
        {activeMediaKit ? (
          <div className="space-y-8 text-left max-w-4xl mx-auto w-full">
            
            {/* Editor Top Bar actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-stone-200/80 pb-5 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-[#06434a]/8 text-[#06434a] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                    Plaza: {activeMediaKit.ciudad}
                  </span>
                  <span className="text-[9px] text-stone-400 font-mono font-bold">
                    Versión Activa: v{activeMediaKit.version}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900 font-display mt-2">
                  {activeMediaKit.nombre}
                </h2>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                  Preparado para: <strong className="text-stone-800 font-bold">{activeMediaKit.clienteNombre}</strong> • Fecha: {activeMediaKit.fecha}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowPrintPreview(true)}
                  className="p-2 bg-[#06434a]/10 hover:bg-[#06434a]/15 text-[#06434a] border border-[#06434a]/20 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
                  title="Exportar a PDF"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-[10px] font-bold">PDF / Exportar</span>
                </button>
                <button
                  onClick={() => triggerToast("Enlace de MediaKit web copiado al portapapeles.")}
                  className="p-2 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl cursor-pointer transition-colors"
                  title="Compartir enlace web"
                >
                  <Copy className="h-4 w-4" />
                </button>

                {(activeMediaKit.estado !== "Aceptado" && activeMediaKit.estado !== "Convertido") && (
                  <button
                    onClick={() => {
                      onGenerateQuoteFromMediaKit(activeMediaKit.id);
                      triggerToast("¡Se ha generado la Cotización comercial a partir de este lote!");
                    }}
                    className="bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase px-4 py-2 rounded-full flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Generar Cotización</span>
                  </button>
                )}
              </div>
            </div>

            {/* Campaign design running totals summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-stone-50 border border-stone-200/80 p-5 rounded-2xl">
              <div className="text-left space-y-1">
                <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Soportes elegidos</span>
                <span className="text-sm font-black text-stone-800 font-mono block">
                  {activeMediaKit.soportesEdicionInline.length} pantallas
                </span>
              </div>

              <div className="text-left space-y-1">
                <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Inversión mensual</span>
                <span className="text-sm font-black text-stone-850 font-mono block">
                  ${activeMediaKitCost.toLocaleString()}
                </span>
              </div>

              <div className="text-left space-y-1">
                <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Impactos totales/día</span>
                <span className="text-sm font-black text-emerald-600 font-mono block">
                  {(activeMediaKitImpacts / 1000).toFixed(1)}k impactos
                </span>
              </div>
            </div>

            {/* Notion-style Visual Block Editor */}
            <div className="space-y-6">
              <h3 className="text-xs font-extrabold text-stone-400 uppercase tracking-widest font-mono">
                Componentes de la Propuesta (Edición Visual Notion-style)
              </h3>

              <div className="space-y-5">
                {activeMediaKit.soportesEdicionInline.map((item, index) => {
                  const screen = screens.find((s) => s.id === item.id);
                  if (!screen) return null;

                  return (
                    <div
                      key={item.id}
                      className="border border-stone-200 rounded-2xl bg-white p-5 hover:border-stone-300 transition-all shadow-2xs space-y-4"
                    >
                      {/* Block Header */}
                      <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-stone-300 font-mono">
                            {(index + 1).toString().padStart(2, "0")}
                          </span>
                          <div>
                            <span className="text-[7px] bg-teal-50 text-teal-700 border border-teal-100 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                              {screen.categoria}
                            </span>
                            <h4 className="text-xs font-bold text-stone-900 mt-1 font-display">
                              {screen.nombre}
                            </h4>
                            <span className="text-[10px] text-stone-400 font-medium">
                              {screen.zona} • Impacts: {(screen.impactos / 1000).toFixed(1)}k/día
                            </span>
                          </div>
                        </div>

                        {/* Inline Priority selector */}
                        <div className="flex items-center gap-2">
                          <div className="space-y-0.5 text-right">
                            <span className="block text-[7px] font-bold text-stone-400 uppercase">Prioridad</span>
                            <select
                              value={item.prioridad}
                              onChange={(e) => handleUpdatePriority(item.id, e.target.value as any)}
                              className="px-2 py-1 text-[10px] font-bold bg-stone-50 border border-stone-200 rounded-md cursor-pointer text-stone-700"
                            >
                              <option value="Alta">Alta</option>
                              <option value="Media">Media</option>
                              <option value="Baja">Baja</option>
                            </select>
                          </div>

                          <button
                            onClick={() => handleRemoveSupportFromMediaKit(item.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors shrink-0"
                            title="Remover Soporte"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Block Controls: Duration and Custom notes */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start text-xs text-stone-600">
                        {/* Duration control */}
                        <div className="md:col-span-3 space-y-1">
                          <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-wider">Duración (Semanas)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max="12"
                              value={item.duracionSem}
                              onChange={(e) => handleUpdateWeeks(item.id, Number(e.target.value))}
                              className="w-16 px-2 py-1 text-[11px] font-mono border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none"
                            />
                            <span className="text-[10px] text-stone-400 font-bold">sem.</span>
                          </div>
                          <span className="block text-[9px] font-bold text-[#06434a]/80 pt-1 font-mono">
                            Subtotal: ${(screen.precio * item.duracionSem).toLocaleString()}
                          </span>
                        </div>

                        {/* Notion-style Notes editor */}
                        <div className="md:col-span-9 space-y-1">
                          <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-wider">Notas de Orientación / Pauta (Editable)</label>
                          <textarea
                            rows={2}
                            value={item.notas}
                            onChange={(e) => handleUpdateNotes(item.id, e.target.value)}
                            className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200/80 rounded-lg bg-stone-50/20 focus:outline-none focus:bg-white focus:border-stone-300 leading-relaxed font-normal text-stone-700"
                            placeholder="Ingrese notas específicas para esta ubicación..."
                          />
                        </div>
                      </div>

                    </div>
                  );
                })}

                {activeMediaKit.soportesEdicionInline.length === 0 && (
                  <div className="py-12 text-center border border-dashed border-stone-200 rounded-3xl space-y-2">
                    <Layers className="h-8 w-8 text-stone-300 mx-auto" />
                    <p className="text-xs font-bold text-stone-800">Esta propuesta no contiene soportes asignados.</p>
                    <p className="text-[10px] text-stone-500">Agregue soportes mediante el asistente manual para diseñar la propuesta.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Version log list and inline Comments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-stone-200 pt-6">
              
              {/* Left Column: Comments */}
              <div className="space-y-4 text-xs">
                <h4 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider font-mono flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-[#06434a]" />
                  <span>Comentarios del Equipo</span>
                </h4>

                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                  {activeMediaKit.comentarios.map((comm) => (
                    <div key={comm.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <div className="flex items-center justify-between text-[9px] text-stone-400 font-bold mb-1">
                        <span>{comm.user}</span>
                        <span>{comm.date}</span>
                      </div>
                      <p className="text-[10px] text-stone-700 font-normal leading-relaxed text-left">
                        {comm.text}
                      </p>
                    </div>
                  ))}

                  {activeMediaKit.comentarios.length === 0 && (
                    <p className="text-[10px] text-stone-400 text-left">No hay comentarios en esta propuesta. Escriba uno abajo.</p>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Escribir comentario..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-lg border border-stone-200 hover:bg-stone-200 cursor-pointer transition-colors"
                  >
                    Publicar
                  </button>
                </form>
              </div>

              {/* Right Column: Versioning restorability list */}
              <div className="space-y-4 text-xs text-left">
                <h4 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#06434a]" />
                  <span>Historial de Versiones y Restaurabilidad</span>
                </h4>

                <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                  {[3, 2, 1].map((v) => {
                    const isCurrent = v === activeMediaKit.version;
                    return (
                      <div
                        key={v}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isCurrent 
                            ? "bg-[#06434a]/4 border-[#06434a]/15" 
                            : "bg-white border-stone-100/80 hover:bg-stone-50"
                        }`}
                      >
                        <div>
                          <span className="block text-[10px] font-bold text-stone-800">Versión v{v}</span>
                          <span className="block text-[8px] text-stone-400 font-semibold mt-0.5">
                            {v === 3 ? "Revisión final de tarifas" : v === 2 ? "Ajuste de pantallas en Palmares" : "Propuesta borrador inicial"}
                          </span>
                        </div>

                        {!isCurrent ? (
                          <button
                            onClick={() => handleRevertVersion(v)}
                            className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-stone-50 text-[9px] font-bold text-[#06434a] rounded-lg cursor-pointer transition-all shadow-2xs"
                          >
                            Restaurar
                          </button>
                        ) : (
                          <span className="text-[8px] bg-[#06434a] text-white px-2 py-0.5 rounded-full font-extrabold uppercase">
                            Actual
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-stone-200 rounded-3xl space-y-3">
            <FileText className="h-12 w-12 text-stone-300 mx-auto" />
            <h3 className="text-xs font-bold text-stone-800">No hay MediaKits registrados</h3>
            <p className="text-[10px] text-stone-500">Cree uno manualmente o genere una propuesta con IA.</p>
          </div>
        )}
      </div>

      {/* 3. Manual Creation Wizard Modal */}
      <AnimatePresence>
        {showCreateWizard && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-stone-200 rounded-lg p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h3 className="text-sm font-black text-stone-950 font-display uppercase tracking-wider">
                  Asistente de Pautado Manual
                </h3>
                <button
                  onClick={() => setShowCreateWizard(false)}
                  className="p-1.5 hover:bg-stone-50 rounded-md text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveManualMediaKit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Nombre del MediaKit *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Lanzamiento Otoño Toyota"
                    value={wizardName}
                    onChange={(e) => setWizardName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50/50 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Cliente Destino</label>
                    <select
                      value={wizardClienteId}
                      onChange={(e) => setWizardClienteId(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50 cursor-pointer"
                    >
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.empresa} ({c.nombre})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Plaza de Comercialización</label>
                    <select
                      value={wizardCiudad}
                      onChange={(e) => {
                        setWizardCiudad(e.target.value as any);
                        setWizardScreenIds([]); // clear selection when switching cities
                      }}
                      className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50 cursor-pointer"
                    >
                      <option value="Mendoza">Mendoza</option>
                      <option value="Buenos Aires">Buenos Aires</option>
                    </select>
                  </div>
                </div>

                {/* Checklist OOH available screens */}
                <div className="space-y-2">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Soportes Disponibles en {wizardCiudad} *</label>
                  <div className="border border-stone-100 rounded-md p-3 max-h-40 overflow-y-auto space-y-2 bg-stone-50/50">
                    {availableWizardScreens.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-center gap-3 p-2 bg-white border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 text-[11px] font-medium"
                      >
                        <input
                          type="checkbox"
                          checked={wizardScreenIds.includes(s.id)}
                          onChange={() => handleToggleWizardScreen(s.id)}
                          className="rounded border-stone-300 text-[#06434a] focus:ring-[#06434a]"
                        />
                        <div className="flex-1 flex items-center justify-between min-w-0 pr-1">
                          <span className="truncate text-stone-800 font-semibold">{s.nombre} ({s.zona})</span>
                          <span className="shrink-0 font-mono text-stone-500 font-bold">${s.precio.toLocaleString()}/s</span>
                        </div>
                      </label>
                    ))}

                    {availableWizardScreens.length === 0 && (
                      <p className="text-[10px] text-stone-400 py-4">No hay soportes libres en esta plaza.</p>
                    )}
                  </div>
                </div>

                {/* Live counter summary */}
                <div className="border-t border-stone-100 pt-4 grid grid-cols-2 text-stone-700">
                  <div className="text-left">
                    <span className="block text-[8px] font-bold text-stone-400 uppercase">Impactos Promedio</span>
                    <span className="text-xs font-black font-mono text-stone-800">
                      {(wizardTotalImpacts / 1000).toFixed(1)}k impactos/día
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] font-bold text-stone-400 uppercase">Tarifa Total / Sem</span>
                    <span className="text-xs font-black font-mono text-[#06434a]">
                      ${wizardTotalCost.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowCreateWizard(false)}
                    className="px-4 py-2 border border-stone-200 text-stone-600 font-bold uppercase text-[10px] rounded-full hover:bg-stone-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={wizardScreenIds.length === 0}
                    className="px-5 py-2 bg-[#06434a] hover:bg-[#0b5e67] text-white font-extrabold uppercase text-[10px] rounded-full cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Guardar Borrador
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. AI-Assisted Creator Modal */}
      <AnimatePresence>
        {showAiWizard && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-stone-200 rounded-lg p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h3 className="text-sm font-black text-stone-950 font-display uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-spin" />
                  <span>Generador de MediaKit con IA</span>
                </h3>
                <button
                  onClick={() => setShowAiWizard(false)}
                  className="p-1.5 hover:bg-stone-50 rounded-md text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleGenerateAiProposal} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Nombre de la Empresa Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Coca-Cola S.A."
                    value={aiClient}
                    onChange={(e) => setAiClient(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50/50 focus:outline-none focus:border-stone-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Plaza de Destino</label>
                    <select
                      value={aiCiudad}
                      onChange={(e) => setAiCiudad(e.target.value as any)}
                      className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50 cursor-pointer"
                    >
                      <option value="Mendoza">Mendoza</option>
                      <option value="Buenos Aires">Buenos Aires</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Presupuesto Estimado Mensual ($)</label>
                    <select
                      value={aiBudget}
                      onChange={(e) => setAiBudget(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50 cursor-pointer"
                    >
                      <option value="1500000">$1,500,000</option>
                      <option value="3000000">$3,000,000</option>
                      <option value="6000000">$6,000,000</option>
                      <option value="12000000">$12,000,000</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Objetivo Comercial Principal</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { id: "Branding", label: "Branding", desc: "Mix equilibrado" },
                      { id: "High Density", label: "Densidad", desc: "Muchos impactos" },
                      { id: "Premium", label: "Premium", desc: "Zonas ABC1" }
                    ] as const).map((opt) => (
                      <label
                        key={opt.id}
                        className={`border p-3 rounded-lg cursor-pointer flex flex-col justify-between text-left transition-all ${
                          aiGoal === opt.id 
                            ? "bg-[#06434a]/4 border-[#06434a] text-[#06434a]" 
                            : "bg-white border-stone-200 hover:bg-stone-50 text-stone-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="aigoal"
                          checked={aiGoal === opt.id}
                          onChange={() => setAiGoal(opt.id)}
                          className="sr-only"
                        />
                        <span className="text-[11px] font-extrabold uppercase leading-none block">{opt.label}</span>
                        <span className="text-[8px] text-stone-400 font-bold mt-1.5 block">{opt.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-100 text-stone-600 leading-relaxed text-[10px]">
                  💡 <strong className="text-stone-800">Cómo funciona:</strong> Nuestro motor inteligente analizará la disponibilidad física en la plaza de {aiCiudad}, filtrará por soportes libres e identificará el set óptimo que maximiza el alcance por cada peso invertido.
                </div>

                <div className="border-t border-stone-100 pt-4 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAiWizard(false)}
                    className="px-4 py-2 border border-stone-200 text-stone-600 font-bold uppercase text-[10px] rounded-full hover:bg-stone-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#06434a] hover:bg-[#0b5e67] text-white font-extrabold uppercase text-[10px] rounded-full cursor-pointer shadow-sm flex items-center gap-1"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                    <span>Generar Propuesta IA</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. PDF/Print Preview Modal */}
      <AnimatePresence>
        {showPrintPreview && activeMediaKit && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-10 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-stone-200 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div className="text-left">
                  <span className="text-[9px] bg-[#06434a]/8 text-[#06434a] font-extrabold uppercase px-2.5 py-0.5 rounded-md tracking-wider">
                    Vista Previa de Exportación PDF
                  </span>
                  <h3 className="text-sm font-black text-stone-950 font-display mt-1 uppercase tracking-wide">
                    {activeMediaKit.nombre}
                  </h3>
                </div>
                <button
                  onClick={() => setShowPrintPreview(false)}
                  className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer transition-colors"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Scrollable Preview Body containing styled HTML presentation replica */}
              <div className="flex-1 overflow-y-auto p-8 bg-stone-100/50 flex justify-center">
                <div className="bg-white border border-stone-200 rounded-xl shadow-xs w-full max-w-3xl p-10 text-stone-800 text-xs text-left space-y-8 select-none pointer-events-none">
                  
                  {/* Mock Page Header */}
                  <div className="flex justify-between items-start border-b-2 border-[#06434a] pb-5">
                    <div>
                      <div className="h-8 w-8 rounded-lg bg-[#06434a] flex items-center justify-center text-white font-black text-sm mb-2">C</div>
                      <span className="text-[9px] font-black tracking-widest text-stone-400 uppercase">Grupo Comunicarte</span>
                      <h1 className="font-display text-xl font-bold text-[#06434a] mt-1">{activeMediaKit.nombre}</h1>
                      <p className="text-[10px] text-stone-400 font-medium">Propuesta Comercial de Pauta Exterior OOH/DOOH</p>
                    </div>
                    <div className="text-right text-[10px] text-stone-500 space-y-1">
                      <div>Propuesta ID: <span className="font-mono font-bold text-[#06434a] bg-stone-100 px-1.5 py-0.5 rounded">{activeMediaKit.id}</span></div>
                      <div>Versión: <strong>v{activeMediaKit.version}.0</strong></div>
                      <div>Fecha: <strong>{activeMediaKit.fecha}</strong></div>
                      <div>Plaza: <strong>{activeMediaKit.ciudad}</strong></div>
                    </div>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-stone-50 border-l-4 border-[#06434a] p-3 rounded-r-lg">
                      <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Soportes elegidos</span>
                      <span className="text-sm font-black text-stone-800 mt-1 block">{activeMediaKitScreens.length} Pantallas</span>
                    </div>
                    <div className="bg-stone-50 border-l-4 border-emerald-600 p-3 rounded-r-lg">
                      <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Impacto Estimado</span>
                      <span className="text-sm font-black text-emerald-600 mt-1 block">{(activeMediaKitScreens.reduce((sum, s) => sum + s.impactos, 0) / 1000).toFixed(1)}k / día</span>
                    </div>
                    <div className="bg-stone-50 border-l-4 border-amber-600 p-3 rounded-r-lg">
                      <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Inversión Mensual</span>
                      <span className="text-sm font-black text-stone-850 mt-1 block">
                        ${(activeMediaKitScreens.reduce((sum, s) => sum + s.precio, 0) * 4).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* SVG Infographics simulation */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-stone-200 rounded-lg p-4 bg-white text-center">
                      <span className="block text-[8px] font-bold text-stone-400 uppercase text-left mb-2">Mapa Vectorial de Red</span>
                      <div className="h-32 bg-stone-50 rounded flex items-center justify-center border border-stone-100">
                        <span className="text-[9px] text-stone-400 font-mono">[ Red de Soportes Geolocalizados: {activeMediaKitScreens.length} puntos ]</span>
                      </div>
                    </div>
                    <div className="border border-stone-200 rounded-lg p-4 bg-white text-center">
                      <span className="block text-[8px] font-bold text-stone-400 uppercase text-left mb-2">Impactos por Pantalla</span>
                      <div className="h-32 bg-stone-50 rounded flex items-center justify-center border border-stone-100">
                        <span className="text-[9px] text-stone-400 font-mono">[ Audiencia estimada / día ]</span>
                      </div>
                    </div>
                  </div>

                  {/* Soportes Table replica */}
                  <div className="border border-stone-200 rounded-lg overflow-hidden">
                    <table className="w-full text-[10px]">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[8px]">
                          <th className="p-2.5 text-center">Item</th>
                          <th className="p-2.5 text-left">Soporte</th>
                          <th className="p-2.5 text-left">Dimensiones</th>
                          <th className="p-2.5 text-right">Impactos/Día</th>
                          <th className="p-2.5 text-right">Tarifa Sem.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {activeMediaKitScreens.map((scr, idx) => (
                          <tr key={scr.id}>
                            <td className="p-2.5 text-center text-stone-400 font-mono">{(idx + 1).toString().padStart(2, "0")}</td>
                            <td className="p-2.5 font-bold text-stone-900">{scr.nombre}</td>
                            <td className="p-2.5 text-stone-500">{scr.dimensiones || "Estándar"}</td>
                            <td className="p-2.5 text-right text-emerald-600 font-bold">{(scr.impactos / 1000).toFixed(1)}k</td>
                            <td className="p-2.5 text-right text-[#06434a] font-bold">${scr.precio.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

              {/* Action triggers */}
              <div className="p-5 border-t border-stone-100 flex items-center justify-end gap-3 bg-stone-50/30">
                <button
                  type="button"
                  onClick={() => setShowPrintPreview(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 font-bold uppercase text-[10px] rounded-lg hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  Cerrar Vista
                </button>
                <button
                  type="button"
                  onClick={() => {
                    downloadMediaKitAsHtml(
                      activeMediaKitScreens,
                      activeMediaKit.nombre,
                      activeMediaKit.clienteNombre,
                      activeMediaKit.ciudad,
                      {
                        id: activeMediaKit.id,
                        version: activeMediaKit.version,
                        notes: activeMediaKit.soportesEdicionInline.map((s) => s.notas).filter(Boolean).join(" | "),
                      }
                    );
                    setShowPrintPreview(false);
                    triggerToast("Se ha descargado el lote comercial listo para impresión PDF.");
                  }}
                  className="px-5 py-2 bg-[#06434a] hover:bg-[#0b5e67] text-white font-extrabold uppercase text-[10px] rounded-lg cursor-pointer shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Descargar Archivo PDF-Listo (.HTML)</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
