import React, { useState, useMemo } from "react";
import { DoohScreen } from "../../types";
import { Role, Cliente, MediaKit } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { downloadMediaKitAsHtml } from "../../utils/mediaKitExport";
import { 
  Plus, 
  Trash2, 
  Copy, 
  Eye, 
  Search, 
  MapPin, 
  Video, 
  Layers, 
  Sparkles, 
  Sliders, 
  ChevronRight, 
  Check, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  FileText, 
  Calendar, 
  X, 
  EyeOff, 
  Settings2,
  Archive,
  RotateCcw,
  Share2,
  MessageSquare,
  Mail,
  Link,
  Download,
  Presentation,
  Save,
  User,
  Minus,
  CheckCircle2
} from "lucide-react";
import { FileUpload } from "./FileUpload";

interface InventoryModuleProps {
  screens: DoohScreen[];
  userRole: Role;
  onUpdateScreen: (id: string, data: Partial<DoohScreen>) => void;
  onAddScreen: (screen: DoohScreen) => void;
  onDeleteScreen: (id: string) => void;
  clientes?: Cliente[];
  onAddMediaKit?: (mk: MediaKit) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  screens,
  userRole,
  onUpdateScreen,
  onAddScreen,
  onDeleteScreen,
  clientes = [],
  onAddMediaKit,
}) => {
  // Filters state
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("Todas");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("Todas");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<"Todas" | "OOH" | "DOOH">("Todas");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  // Proposal Drawer Cotizador State
  const [selectedProposalScreens, setSelectedProposalScreens] = useState<string[]>([]);
  const [screenDurations, setScreenDurations] = useState<Record<string, number>>({});
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [customClientName, setCustomClientName] = useState<string>("");
  const [validityDays, setValidityDays] = useState<number>(15);
  const [isProposalDrawerOpen, setIsProposalDrawerOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleSelectProposalScreen = (id: string) => {
    if (selectedProposalScreens.includes(id)) {
      setSelectedProposalScreens((prev) => prev.filter((sId) => sId !== id));
    } else {
      setSelectedProposalScreens((prev) => [...prev, id]);
      if (!screenDurations[id]) {
        setScreenDurations((prev) => ({ ...prev, [id]: 1 }));
      }
      setIsProposalDrawerOpen(true);
    }
  };

  // Delete confirmation state
  const [screenToDelete, setScreenToDelete] = useState<string | null>(null);

  // Inspector panel state
  const [activeScreenId, setActiveScreenId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "ubicacion" | "multimedia" | "kpis" | "historial">("general");

  // Create form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newScreenForm, setNewScreenForm] = useState({
    nombre: "",
    zona: "Centro",
    ciudad: "Mendoza" as "Mendoza" | "Buenos Aires",
    categoria: "Pantallas LED" as any,
    tipo: "Peatonal" as any,
    impactos: 15000,
    precio: 85000,
    lat: -32.8894,
    lng: -68.8458,
    nota: "",
    dimensiones: "4.0m x 2.0m",
    brillo: "6000 nits",
    refreshRate: "3840 Hz",
    formato: "MP4, JPG",
    cobertura: "Zona comercial"
  });

  const selectedScreen = useMemo(() => {
    return screens.find((s) => s.id === activeScreenId);
  }, [screens, activeScreenId]);

  // Filtered screens: includes soft-delete check by inspecting a simulated isArchived flag or Pausado status
  const filteredScreens = useMemo(() => {
    return screens.filter((screen) => {
      const matchesCity = selectedCityFilter === "Todas" || screen.ciudad === selectedCityFilter;
      const matchesCat = selectedCategoryFilter === "Todas" || screen.categoria === selectedCategoryFilter;
      const matchesSearch = screen.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            screen.zona.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by Type (OOH vs DOOH)
      let matchesType = true;
      if (selectedTypeFilter === "DOOH") {
        matchesType = screen.categoria === "Pantallas LED" || screen.categoria === "LED Móvil";
      } else if (selectedTypeFilter === "OOH") {
        matchesType = screen.categoria === "Tradicionales";
      }

      // Filter by Status (Disponible, Activo, Pausado, No disponible)
      let matchesStatus = true;
      if (selectedStatusFilter === "Disponible") {
        matchesStatus = screen.status === "Disponible";
      } else if (selectedStatusFilter === "Booked") {
        matchesStatus = screen.status === "Activo" || screen.status === "No disponible" || screen.status === "Pausado";
      } else if (selectedStatusFilter !== "Todas") {
        matchesStatus = screen.status === selectedStatusFilter;
      } else {
        // Simulate soft delete / archiving via screen.status when no status filter is selected
        const isScreenArchived = screen.status === "Pausado" || screen.status === "No disponible";
        matchesStatus = showArchived ? isScreenArchived : !isScreenArchived;
      }

      return matchesCity && matchesCat && matchesSearch && matchesType && matchesStatus;
    });
  }, [screens, selectedCityFilter, selectedCategoryFilter, searchQuery, showArchived, selectedTypeFilter, selectedStatusFilter]);

  const handleDuplicate = (screen: DoohScreen) => {
    const duplicated: DoohScreen = {
      ...screen,
      id: `sc-dup-${Date.now()}`,
      nombre: `${screen.nombre} (Copia)`,
      impactos: Math.round(screen.impactos * 0.95), // slightly alter impacts to simulate a copy
    };
    onAddScreen(duplicated);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScreenForm.nombre) return;

    const screen: DoohScreen = {
      id: `sc-new-${Date.now()}`,
      nombre: newScreenForm.nombre,
      zona: newScreenForm.zona,
      ciudad: newScreenForm.ciudad,
      categoria: newScreenForm.categoria,
      tipo: newScreenForm.tipo,
      impactos: Number(newScreenForm.impactos),
      precio: Number(newScreenForm.precio),
      status: "Disponible",
      lat: Number(newScreenForm.lat),
      lng: Number(newScreenForm.lng),
      nota: newScreenForm.nota,
      dimensiones: newScreenForm.dimensiones,
      brillo: newScreenForm.brillo,
      refreshRate: newScreenForm.refreshRate,
      formato: newScreenForm.formato,
      cobertura: newScreenForm.cobertura,
    };

    onAddScreen(screen);
    setShowCreateModal(false);
    // Reset form
    setNewScreenForm({
      nombre: "",
      zona: "Centro",
      ciudad: "Mendoza",
      categoria: "Pantallas LED",
      tipo: "Peatonal",
      impactos: 15000,
      precio: 85000,
      lat: -32.8894,
      lng: -68.8458,
      nota: "",
      dimensiones: "4.0m x 2.0m",
      brillo: "6000 nits",
      refreshRate: "3840 Hz",
      formato: "MP4, JPG",
      cobertura: "Zona comercial"
    });
  };

  // Proposal Cotizador Calculations
  const proposalSelectedObjects = useMemo(() => {
    return screens.filter((s) => selectedProposalScreens.includes(s.id));
  }, [screens, selectedProposalScreens]);

  const proposalSubtotal = useMemo(() => {
    return proposalSelectedObjects.reduce((sum, s) => {
      const w = screenDurations[s.id] || 1;
      return sum + (s.precio || 0) * w;
    }, 0);
  }, [proposalSelectedObjects, screenDurations]);

  const proposalDiscountAmount = useMemo(() => {
    return (proposalSubtotal * discountPercent) / 100;
  }, [proposalSubtotal, discountPercent]);

  const proposalFinalTotal = useMemo(() => {
    return Math.max(0, proposalSubtotal - proposalDiscountAmount);
  }, [proposalSubtotal, proposalDiscountAmount]);

  const currentClientName = useMemo(() => {
    if (selectedClientId) {
      const found = clientes.find((c) => c.id === selectedClientId);
      if (found) return found.empresa || found.nombre;
    }
    return customClientName || "Cliente Comercial";
  }, [selectedClientId, clientes, customClientName]);

  const handleExportPDF = () => {
    if (proposalSelectedObjects.length === 0) return;
    downloadMediaKitAsHtml(
      proposalSelectedObjects,
      `Propuesta Comercial - ${currentClientName}`,
      currentClientName,
      proposalSelectedObjects[0]?.ciudad || "Mendoza",
      { notes: `Cotización con ${discountPercent}% de bonificación comercial. Vigencia: ${validityDays} días.` }
    );
    triggerToast("¡Ficha Comercial descargada como HTML/PDF listo para imprimir!");
  };

  const handleShareWhatsApp = () => {
    if (proposalSelectedObjects.length === 0) return;
    const msg = encodeURIComponent(
      `*Grupo Comunicarte - Propuesta Comercial DOOH*\n\n` +
      `*Cliente:* ${currentClientName}\n` +
      `*Soportes Seleccionados:* ${proposalSelectedObjects.length} pantallas\n` +
      `*Detalle:* ${proposalSelectedObjects.map((s) => s.nombre).join(", ")}\n` +
      `*Subtotal:* $${proposalSubtotal.toLocaleString()}\n` +
      (discountPercent > 0 ? `*Descuento (${discountPercent}%):* -$${proposalDiscountAmount.toLocaleString()}\n` : "") +
      `*Inversión Final:* $${proposalFinalTotal.toLocaleString()}\n` +
      `*Vigencia:* ${validityDays} días\n\n` +
      `¿Confirmamos la reserva para el inicio de la pauta?`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
    triggerToast("Abriendo WhatsApp con propuesta formateada...");
  };

  const handleSendEmail = () => {
    if (proposalSelectedObjects.length === 0) return;
    const subject = encodeURIComponent(`Propuesta Comercial DOOH - Grupo Comunicarte (${currentClientName})`);
    const body = encodeURIComponent(
      `Estimado/a,\n\nCompartimos la propuesta comercial para ${currentClientName}:\n\n` +
      `Soportes Seleccionados:\n` +
      proposalSelectedObjects.map((s) => `- ${s.nombre} (${s.ciudad}) - Tarifa semanal: $${s.precio.toLocaleString()}`).join("\n") +
      `\n\nSubtotal: $${proposalSubtotal.toLocaleString()}\n` +
      (discountPercent > 0 ? `Descuento Aplicado (${discountPercent}%): -$${proposalDiscountAmount.toLocaleString()}\n` : "") +
      `Inversión Total: $${proposalFinalTotal.toLocaleString()}\n` +
      `Vigencia: ${validityDays} días\n\n` +
      `Atentamente,\nEquipo Comercial Grupo Comunicarte`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    triggerToast("Abriendo cliente de correo para enviar propuesta...");
  };

  const handleCopyLink = () => {
    const fakeLink = `${window.location.origin}/dashboard/mediakits?s=${selectedProposalScreens.join(",")}`;
    navigator.clipboard.writeText(fakeLink);
    triggerToast("¡Enlace de propuesta copiado al portapapeles!");
  };

  const handleSaveAsMediaKit = () => {
    if (proposalSelectedObjects.length === 0) return;
    if (onAddMediaKit) {
      const newMk: MediaKit = {
        id: `mk-${Date.now()}`,
        nombre: `Propuesta ${currentClientName} - ${new Date().toLocaleDateString("es-AR")}`,
        clienteId: selectedClientId || "client-gen",
        clienteNombre: currentClientName,
        ciudad: (proposalSelectedObjects[0]?.ciudad as any) || "Mendoza",
        screenIds: selectedProposalScreens,
        version: 1,
        estado: "Cotizando",
        comentarios: [],
        historial: [
          { id: `h-${Date.now()}`, action: "Propuesta generada desde Cotizador de Inventario", date: new Date().toISOString(), user: "Ejecutivo Comercial" }
        ],
        fecha: new Date().toISOString(),
        presupuesto: proposalFinalTotal,
        soportesEdicionInline: proposalSelectedObjects.map((s) => ({
          id: s.id,
          notas: "",
          prioridad: "Alta",
          duracionSem: screenDurations[s.id] || 1
        }))
      };
      onAddMediaKit(newMk);
      triggerToast("¡Propuesta guardada exitosamente en el CRM de MediaKits!");
    }
  };

  return (
    <div className="flex h-full font-sans max-w-7xl mx-auto items-stretch relative">
      {/* 1. Main Grid/Listing Area */}
      <div className="flex-1 p-8 space-y-6 overflow-y-auto">
        
        {/* Title and top filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
              Catálogo de Soportes
            </span>
            <h2 className="text-xl font-bold text-stone-950 font-display mt-2">
              Gestión Integral de Inventario
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                showArchived 
                  ? "bg-amber-50 text-amber-700 border-amber-200" 
                  : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
              }`}
            >
              <Archive className="h-3 w-3" />
              <span>{showArchived ? "Ver Activos" : "Ver Archivados"}</span>
            </button>

            {(userRole === "admin" || userRole === "comercial_dir") && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase px-4 py-2 rounded-full flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Agregar Soporte</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters bar */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-4 shadow-2xs">
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, zona..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200/80 rounded-xl focus:outline-none focus:border-[#06434a]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-0.5">
              <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-wider">Ciudad</label>
              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold bg-stone-50 border border-stone-200/80 rounded-xl text-stone-700 cursor-pointer"
              >
                <option value="Todas">Todas</option>
                <option value="Mendoza">Mendoza</option>
                <option value="Buenos Aires">Buenos Aires</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-wider">Categoría</label>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold bg-stone-50 border border-stone-200/80 rounded-xl text-stone-700 cursor-pointer"
              >
                <option value="Todas">Todas</option>
                <option value="Pantallas LED">Pantallas LED</option>
                <option value="Tradicionales">Tradicionales</option>
                <option value="LED Móvil">LED Móvil</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-wider">Tipo Soporte</label>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs font-semibold bg-stone-50 border border-stone-200/80 rounded-xl text-stone-700 cursor-pointer"
              >
                <option value="Todas">OOH & DOOH</option>
                <option value="DOOH">DOOH (Digitales)</option>
                <option value="OOH">OOH (Estáticos)</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-wider">Disponibilidad</label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold bg-stone-50 border border-stone-200/80 rounded-xl text-stone-700 cursor-pointer"
              >
                <option value="Todas">Todas</option>
                <option value="Disponible">Disponible (Available)</option>
                <option value="Booked">Reservado/Ocupado (Booked)</option>
                <option value="Activo">Activo (En vuelo)</option>
                <option value="Pausado">Pausado (Plaificado/Maint.)</option>
                <option value="No disponible">No disponible</option>
              </select>
            </div>
          </div>

        </div>

        {/* Grid listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredScreens.map((screen) => (
            <div
              key={screen.id}
              onClick={() => setActiveScreenId(screen.id)}
              className={`bg-white border text-left p-5 rounded-2xl cursor-pointer transition-all hover:shadow-md space-y-4 flex flex-col justify-between ${
                activeScreenId === screen.id 
                  ? "border-[#06434a] ring-1 ring-[#06434a]/30 shadow-xs" 
                  : "border-stone-200"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    screen.categoria === "Pantallas LED" 
                      ? "bg-teal-50 text-teal-700 border border-teal-100" 
                      : screen.categoria === "LED Móvil"
                      ? "bg-amber-50 text-amber-700 border border-amber-100"
                      : "bg-blue-50 text-blue-700 border border-blue-100"
                  }`}>
                    {screen.categoria}
                  </span>
                  
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    screen.status === "Activo" || screen.status === "Disponible"
                      ? "bg-emerald-100/80 text-emerald-950 border border-emerald-200"
                      : "bg-amber-100/80 text-amber-950 border border-amber-200"
                  }`}>
                    {screen.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-black text-stone-900 leading-snug font-display">
                    {screen.nombre}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-stone-500 font-medium mt-1">
                    <MapPin className="h-3 w-3 text-[#06434a]/70 shrink-0" />
                    <span>{screen.ciudad} • {screen.zona}</span>
                  </div>
                </div>
              </div>

              {/* pricing & impacts summary */}
              <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-[11px] font-bold text-stone-800">
                <div className="text-left">
                  <span className="block text-[8px] text-stone-400 font-bold uppercase tracking-wider">Impactos</span>
                  <span className="font-mono text-stone-900 mt-0.5 block">
                    {(screen.impactos / 1000).toFixed(1)}k / día
                  </span>
                </div>

                <div className="text-right">
                  <span className="block text-[8px] text-stone-400 font-bold uppercase tracking-wider">Tarifa</span>
                  <span className="font-mono text-[#06434a] mt-0.5 block">
                    ${screen.precio.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Proposal selection button */}
              <div className="border-t border-stone-100 pt-3" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => toggleSelectProposalScreen(screen.id)}
                  className={`w-full py-2 px-3 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedProposalScreens.includes(screen.id)
                      ? "bg-[#06434a] text-white shadow-xs"
                      : "bg-stone-50 border border-stone-200 text-stone-700 hover:border-[#06434a]/40 hover:bg-[#06434a]/5 hover:text-[#06434a]"
                  }`}
                >
                  {selectedProposalScreens.includes(screen.id) ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-amber-300" />
                      <span>Seleccionado para Propuesta</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5 text-[#06434a]" />
                      <span>Seleccionar para Propuesta</span>
                    </>
                  )}
                </button>
              </div>

              {/* CRUD triggers */}
              <div className="border-t border-stone-100 pt-2 flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleDuplicate(screen)}
                  title="Duplicar Soporte"
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-500 transition-colors cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>

                {screen.status !== "Pausado" && screen.status !== "No disponible" ? (
                  <button
                    onClick={() => {
                      onUpdateScreen(screen.id, { status: "Pausado" });
                      setActiveScreenId(null);
                    }}
                    title="Archivar Soporte (Soft Delete)"
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-amber-50 text-amber-600 transition-colors cursor-pointer"
                  >
                    <Archive className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onUpdateScreen(screen.id, { status: "Disponible" })}
                    title="Restaurar Soporte"
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-emerald-50 text-emerald-600 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}

                {userRole === "admin" && (
                  <button
                    onClick={() => {
                      setScreenToDelete(screen.id);
                    }}
                    title="Eliminar del Sistema"
                    className="p-1.5 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

            </div>
          ))}

          {filteredScreens.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-stone-200 rounded-3xl space-y-3">
              <EyeOff className="h-10 w-10 text-stone-300 mx-auto" />
              <p className="text-xs font-bold text-stone-800">No se encontraron soportes que coincidan con la búsqueda.</p>
              <p className="text-[10px] text-stone-500">Prueba cambiando los criterios de filtro o buscando otro término.</p>
            </div>
          )}
        </div>

      </div>

      {/* 2. Drawer Inspector Side Panel (Slides open from right) */}
      <AnimatePresence>
        {selectedScreen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 35 }}
            className="border-l border-stone-200 bg-white shadow-xl flex flex-col justify-between shrink-0 relative z-30 h-full overflow-hidden"
          >
            <div className="flex flex-col h-full overflow-y-auto w-80">
              
              {/* Inspector Header */}
              <div className="p-5 border-b border-stone-100 flex items-center justify-between text-left">
                <div>
                  <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider font-mono">
                    Soporte ID: {selectedScreen.id}
                  </span>
                  <h3 className="text-xs font-black text-stone-900 mt-1 leading-tight font-display">
                    {selectedScreen.nombre}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveScreenId(null)}
                  className="p-1 hover:bg-stone-50 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Sub-tabs Selection bar */}
              <div className="border-b border-stone-100 flex items-center px-4 bg-stone-50/50">
                {([
                  { id: "general", label: "General" },
                  { id: "ubicacion", label: "Coordenadas" },
                  { id: "multimedia", label: "Media" },
                  { id: "kpis", label: "KPIs" },
                  { id: "historial", label: "Historial" }
                ] as const).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-2.5 text-[10px] font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "border-[#06434a] text-[#06434a] font-black"
                        : "border-transparent text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Inspector Body Content depending on Active tab */}
              <div className="p-5 text-left flex-1 space-y-4">
                
                {/* Tab: General Details */}
                {activeTab === "general" && (
                  <div className="space-y-4 text-xs text-stone-600">
                    <div className="space-y-1">
                      <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Nombre Comercial</label>
                      <input
                        type="text"
                        value={selectedScreen.nombre}
                        onChange={(e) => onUpdateScreen(selectedScreen.id, { nombre: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Plaza / Ciudad</label>
                        <select
                          value={selectedScreen.ciudad}
                          onChange={(e) => onUpdateScreen(selectedScreen.id, { ciudad: e.target.value as any })}
                          className="w-full px-2 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50 cursor-pointer"
                        >
                          <option value="Mendoza">Mendoza</option>
                          <option value="Buenos Aires">Buenos Aires</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Zona / Barrio</label>
                        <input
                          type="text"
                          value={selectedScreen.zona}
                          onChange={(e) => onUpdateScreen(selectedScreen.id, { zona: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Precio por Semana</label>
                        <input
                          type="number"
                          value={selectedScreen.precio}
                          onChange={(e) => onUpdateScreen(selectedScreen.id, { precio: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Impactos Diarios</label>
                        <input
                          type="number"
                          value={selectedScreen.impactos}
                          onChange={(e) => onUpdateScreen(selectedScreen.id, { impactos: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Dimensiones</label>
                        <input
                          type="text"
                          value={selectedScreen.dimensiones || ""}
                          onChange={(e) => onUpdateScreen(selectedScreen.id, { dimensiones: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none"
                          placeholder="Ej: 4m x 3m"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Brillo LED</label>
                        <input
                          type="text"
                          value={selectedScreen.brillo || ""}
                          onChange={(e) => onUpdateScreen(selectedScreen.id, { brillo: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none"
                          placeholder="Ej: 5500 nits"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Formatos Admitidos</label>
                      <input
                        type="text"
                        value={selectedScreen.formato || ""}
                        onChange={(e) => onUpdateScreen(selectedScreen.id, { formato: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none font-semibold"
                        placeholder="Ej: MP4, JPG"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Descripción / Observación comercial</label>
                      <textarea
                        rows={3}
                        value={selectedScreen.nota || ""}
                        onChange={(e) => onUpdateScreen(selectedScreen.id, { nota: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none leading-relaxed"
                      />
                    </div>

                    {/* PDF/Print Export Action for Single Asset */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          downloadMediaKitAsHtml(
                            [selectedScreen],
                            `Ficha Comercial: ${selectedScreen.nombre}`,
                            "Cliente Potencial",
                            selectedScreen.ciudad || "Mendoza",
                            {
                              id: selectedScreen.id,
                              notes: selectedScreen.nota || "Ficha técnica oficial de soporte exterior publicitario."
                            }
                          );
                        }}
                        className="w-full py-2 bg-[#06434a]/10 hover:bg-[#06434a]/15 text-[#06434a] border border-[#06434a]/20 font-extrabold uppercase text-[9px] rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Exportar Ficha / PDF-Listo</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab: Location editing coordinates */}
                {activeTab === "ubicacion" && (
                  <div className="space-y-4 text-xs text-stone-600">
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#06434a]" />
                      <span className="text-[10px] font-semibold text-stone-600">Coordenadas del Soporte</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Latitud *</label>
                        <input
                          type="number"
                          step="0.000001"
                          value={selectedScreen.lat}
                          onChange={(e) => onUpdateScreen(selectedScreen.id, { lat: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Longitud *</label>
                        <input
                          type="number"
                          step="0.000001"
                          value={selectedScreen.lng}
                          onChange={(e) => onUpdateScreen(selectedScreen.id, { lng: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Dirección Comercial Sugerida</label>
                      <input
                        type="text"
                        value={selectedScreen.nombre}
                        onChange={(e) => onUpdateScreen(selectedScreen.id, { nombre: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Zona Comercial de Influencia</label>
                      <input
                        type="text"
                        value={selectedScreen.cobertura || ""}
                        onChange={(e) => onUpdateScreen(selectedScreen.id, { cobertura: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Tab: Multimedia details */}
                {activeTab === "multimedia" && (
                  <div className="space-y-4 text-xs text-stone-600">
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 flex items-center gap-2">
                      <Video className="h-4 w-4 text-[#06434a]" />
                      <span className="text-[10px] font-semibold text-stone-600">Material fotográfico y técnico</span>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Fotografía de Referencia (Subida Directa a Firebase Storage)</label>
                      <FileUpload
                        onUploadSuccess={(url) => {
                          onUpdateScreen(selectedScreen.id, { video: url });
                        }}
                        folderPath="soportes/fotos"
                        accept="image/*"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Video Drone (YouTube/Vimeo)</label>
                      <input
                        type="text"
                        value={selectedScreen.video || ""}
                        onChange={(e) => onUpdateScreen(selectedScreen.id, { video: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none font-mono text-[10px]"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">PDF Ficha Técnica Oficial (URL)</label>
                      <input
                        type="text"
                        className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none font-mono text-[10px]"
                        defaultValue="https://grupocomunicarte.com/mediakit/pdf-ficha.pdf"
                      />
                    </div>
                  </div>
                )}

                {/* Tab: Support KPIs */}
                {activeTab === "kpis" && (
                  <div className="space-y-4 text-xs text-stone-600">
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[#06434a]" />
                      <span className="text-[10px] font-semibold text-stone-600">Rendimiento Histórico del Soporte</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 text-center">
                        <span className="block text-[7px] font-bold text-stone-400 uppercase tracking-widest">Campañas Históricas</span>
                        <span className="text-sm font-black text-stone-800 font-mono mt-1 block">14</span>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 text-center">
                        <span className="block text-[7px] font-bold text-stone-400 uppercase tracking-widest">Ocupación Promedio</span>
                        <span className="text-sm font-black text-stone-800 font-mono mt-1 block">84%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 text-center">
                        <span className="block text-[7px] font-bold text-stone-400 uppercase tracking-widest">Ingresos Totales</span>
                        <span className="text-sm font-black text-emerald-600 font-mono mt-1 block">$3,240k</span>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 text-center">
                        <span className="block text-[7px] font-bold text-stone-400 uppercase tracking-widest">Días Ociosos/Año</span>
                        <span className="text-sm font-black text-stone-800 font-mono mt-1 block">58</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#06434a]/5 border border-[#06434a]/10 rounded-lg text-stone-700 space-y-1">
                      <span className="text-[8px] font-extrabold text-[#06434a] uppercase tracking-widest">Valor de Inventario</span>
                      <p className="text-[10px] text-[#06434a] leading-relaxed">
                        Este soporte se sitúa en el <strong className="font-bold">Top 20% de mayor rentabilidad</strong> de la compañía debido a su visibilidad de alto contraste.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab: Change logs / audit trail */}
                {activeTab === "historial" && (
                  <div className="space-y-4 text-xs text-stone-600">
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#06434a]" />
                      <span className="text-[10px] font-semibold text-stone-600">Trazabilidad de Cambios</span>
                    </div>

                    <div className="space-y-3 pl-1.5 border-l border-stone-100">
                      <div className="relative pl-4">
                        <span className="absolute left-[-21px] top-1.5 h-2 w-2 rounded-full bg-[#06434a]" />
                        <span className="block text-[8px] font-bold text-stone-400 uppercase">Hoy, 10:45 hs • Director Comercial</span>
                        <p className="text-[10px] text-stone-700 font-semibold mt-0.5">Tarifa base actualizada de $145k a $155k</p>
                      </div>

                      <div className="relative pl-4">
                        <span className="absolute left-[-21px] top-1.5 h-2 w-2 rounded-full bg-stone-300" />
                        <span className="block text-[8px] font-bold text-stone-400 uppercase">28 de Julio • Operaciones</span>
                        <p className="text-[10px] text-stone-600 mt-0.5">Calibrado automático de brillo auto-dimming completado</p>
                      </div>

                      <div className="relative pl-4">
                        <span className="absolute left-[-21px] top-1.5 h-2 w-2 rounded-full bg-stone-300" />
                        <span className="block text-[8px] font-bold text-stone-400 uppercase">14 de Junio • Administrador</span>
                        <p className="text-[10px] text-stone-600 mt-0.5">Soporte creado e integrado al catálogo de Mendoza</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Create screen Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-stone-200 rounded-xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-6 text-left relative"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h3 className="text-sm font-black text-stone-950 font-display uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                  <span>Agregar Nuevo Soporte</span>
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 hover:bg-stone-50 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCreate} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: San Martín y Garibaldi"
                    value={newScreenForm.nombre}
                    onChange={(e) => setNewScreenForm({ ...newScreenForm, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none focus:border-[#06434a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Plaza / Ciudad</label>
                    <select
                      value={newScreenForm.ciudad}
                      onChange={(e) => setNewScreenForm({ ...newScreenForm, ciudad: e.target.value as any })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50 cursor-pointer"
                    >
                      <option value="Mendoza">Mendoza</option>
                      <option value="Buenos Aires">Buenos Aires</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Zona / Barrio</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Centro"
                      value={newScreenForm.zona}
                      onChange={(e) => setNewScreenForm({ ...newScreenForm, zona: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none focus:border-[#06434a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Categoría Sgto.</label>
                    <select
                      value={newScreenForm.categoria}
                      onChange={(e) => setNewScreenForm({ ...newScreenForm, categoria: e.target.value as any })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50 cursor-pointer"
                    >
                      <option value="Pantallas LED">Pantallas LED</option>
                      <option value="Tradicionales">Tradicionales</option>
                      <option value="LED Móvil">LED Móvil</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Tipo de Flujo</label>
                    <select
                      value={newScreenForm.tipo}
                      onChange={(e) => setNewScreenForm({ ...newScreenForm, tipo: e.target.value as any })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50 cursor-pointer"
                    >
                      <option value="Peatonal">Peatonal</option>
                      <option value="Vehicular">Vehicular</option>
                      <option value="Mixto">Mixto</option>
                      <option value="Móvil">Móvil</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Tarifa Semanal ($)</label>
                    <input
                      type="number"
                      value={newScreenForm.precio}
                      onChange={(e) => setNewScreenForm({ ...newScreenForm, precio: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none focus:border-[#06434a] font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Impactos Diarios</label>
                    <input
                      type="number"
                      value={newScreenForm.impactos}
                      onChange={(e) => setNewScreenForm({ ...newScreenForm, impactos: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none focus:border-[#06434a] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Latitud</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={newScreenForm.lat}
                      onChange={(e) => setNewScreenForm({ ...newScreenForm, lat: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none focus:border-[#06434a] font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Longitud</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={newScreenForm.lng}
                      onChange={(e) => setNewScreenForm({ ...newScreenForm, lng: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none focus:border-[#06434a] font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Descripción Interna</label>
                  <textarea
                    rows={2}
                    placeholder="Escriba notas de orientación o visibilidad..."
                    value={newScreenForm.nota}
                    onChange={(e) => setNewScreenForm({ ...newScreenForm, nota: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none focus:border-[#06434a]"
                  />
                </div>

                <div className="border-t border-stone-100 pt-4 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-stone-200 text-stone-600 font-bold uppercase text-[10px] rounded-lg hover:bg-stone-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#06434a] hover:bg-[#0b5e67] text-white font-extrabold uppercase text-[10px] rounded-lg cursor-pointer shadow-sm"
                  >
                    Guardar en Catálogo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {screenToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-stone-200 shadow-2xl rounded-2xl max-w-md w-full overflow-hidden p-6 text-left space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-base font-bold text-stone-900 font-display">
                  ¿Confirmar Eliminación del Soporte?
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Esta operación es destructiva y permanente. Se eliminarán todas las especificaciones y datos técnicos del soporte del catálogo oficial de la plataforma.
                </p>
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[11px] text-red-700 leading-normal font-semibold">
                  ADVERTENCIA: Esta acción no se puede deshacer y removerá la pantalla de cualquier MediaKit o circuito activo.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setScreenToDelete(null)}
                  className="px-4 py-2 border border-stone-250 text-stone-600 font-bold uppercase text-[10px] rounded-lg hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteScreen(screenToDelete);
                    setScreenToDelete(null);
                    setActiveScreenId(null);
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase text-[10px] rounded-lg cursor-pointer shadow-sm transition-colors"
                >
                  Eliminar Soporte
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action Pill for Cotizador Drawer */}
      {selectedProposalScreens.length > 0 && !isProposalDrawerOpen && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsProposalDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#06434a] hover:bg-[#08555e] text-white px-5 py-3.5 rounded-full shadow-2xl border border-teal-300/30 flex items-center gap-3 cursor-pointer group"
        >
          <div className="h-6 w-6 rounded-full bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center">
            {selectedProposalScreens.length}
          </div>
          <div className="text-left leading-tight">
            <span className="block text-xs font-black tracking-tight">Ver Cotización & Propuesta</span>
            <span className="block text-[9px] text-teal-200 font-medium">Total: ${proposalFinalTotal.toLocaleString()}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
        </motion.button>
      )}

      {/* Panel Lateral: Cotizador & Propuesta Comercial Drawer */}
      <AnimatePresence>
        {isProposalDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full shadow-2xl border-l border-stone-200 flex flex-col justify-between overflow-hidden text-left"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-stone-100 bg-[#06434a] text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/10 text-amber-300">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black font-display tracking-tight text-white">Cotizador Comercial DOOH</h3>
                    <p className="text-[10px] text-teal-200 font-medium">Crea y comparte la propuesta en menos de 1 minuto</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsProposalDrawerOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-teal-200 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="p-5 flex-1 overflow-y-auto space-y-6 bg-[#FAF9F5]">
                
                {/* 1. Cliente & Vigencia */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#06434a] flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>Cliente & Destinatario</span>
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase mb-1">Seleccionar Cliente CRM</label>
                      <select
                        value={selectedClientId}
                        onChange={(e) => {
                          setSelectedClientId(e.target.value);
                          if (e.target.value) setCustomClientName("");
                        }}
                        className="w-full text-xs font-semibold px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#06434a]"
                      >
                        <option value="">-- Ingresar Nombre Manualmente --</option>
                        {clientes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.empresa} ({c.nombre})
                          </option>
                        ))}
                      </select>
                    </div>

                    {!selectedClientId && (
                      <div>
                        <label className="block text-[9px] font-bold text-stone-400 uppercase mb-1">Nombre o Razón Social</label>
                        <input
                          type="text"
                          placeholder="Ej. Mercado Libre / Agencia Havas"
                          value={customClientName}
                          onChange={(e) => setCustomClientName(e.target.value)}
                          className="w-full text-xs font-semibold px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#06434a]"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[9px] font-bold text-stone-400 uppercase mb-1">Vigencia (Días)</label>
                        <select
                          value={validityDays}
                          onChange={(e) => setValidityDays(Number(e.target.value))}
                          className="w-full text-xs font-semibold px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl"
                        >
                          <option value={7}>7 días</option>
                          <option value={15}>15 días</option>
                          <option value={30}>30 días</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-stone-400 uppercase mb-1">Descuento Bonificado</label>
                        <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-xl px-2 py-1">
                          <input
                            type="number"
                            min={0}
                            max={50}
                            value={discountPercent}
                            onChange={(e) => setDiscountPercent(Math.min(50, Math.max(0, Number(e.target.value))))}
                            className="w-full text-xs font-bold font-mono text-[#06434a] bg-transparent focus:outline-none"
                          />
                          <span className="text-xs font-bold text-stone-400">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Soportes Seleccionados List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                      Soportes en la Cotización ({proposalSelectedObjects.length})
                    </span>
                    {selectedProposalScreens.length > 0 && (
                      <button
                        onClick={() => setSelectedProposalScreens([])}
                        className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                      >
                        Vaciar Selección
                      </button>
                    )}
                  </div>

                  {proposalSelectedObjects.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-stone-300 space-y-2">
                      <Sparkles className="h-6 w-6 text-stone-300 mx-auto" />
                      <p className="text-xs font-bold text-stone-600">No hay soportes seleccionados</p>
                      <p className="text-[10px] text-stone-400">Haz clic en "Seleccionar para Propuesta" en cualquier pantalla del catálogo.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {proposalSelectedObjects.map((s) => {
                        const weeks = screenDurations[s.id] || 1;
                        const itemTotal = (s.precio || 0) * weeks;
                        return (
                          <div key={s.id} className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-2.5 shadow-2xs">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="text-xs font-bold text-stone-900 leading-snug">{s.nombre}</h5>
                                <p className="text-[10px] text-stone-500">{s.ciudad} • {s.zona}</p>
                              </div>
                              <button
                                onClick={() => toggleSelectProposalScreen(s.id)}
                                className="text-stone-400 hover:text-red-500 p-1 cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between border-t border-stone-100 pt-2 text-[11px]">
                              {/* Duration controls */}
                              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
                                <button
                                  onClick={() =>
                                    setScreenDurations((prev) => ({
                                      ...prev,
                                      [s.id]: Math.max(1, (prev[s.id] || 1) - 1)
                                    }))
                                  }
                                  className="h-5 w-5 rounded-lg bg-white shadow-2xs flex items-center justify-center text-stone-700 hover:bg-stone-200 cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-[10px] font-extrabold px-1 text-stone-800">
                                  {weeks} sem.
                                </span>
                                <button
                                  onClick={() =>
                                    setScreenDurations((prev) => ({
                                      ...prev,
                                      [s.id]: (prev[s.id] || 1) + 1
                                    }))
                                  }
                                  className="h-5 w-5 rounded-lg bg-white shadow-2xs flex items-center justify-center text-stone-700 hover:bg-stone-200 cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <div className="text-right">
                                <span className="font-mono text-xs font-black text-[#06434a]">
                                  ${itemTotal.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Desglose Económico Total */}
                {proposalSelectedObjects.length > 0 && (
                  <div className="bg-[#06434a]/5 p-4 rounded-2xl border border-[#06434a]/15 space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
                      <span>Subtotal ({proposalSelectedObjects.length} soportes)</span>
                      <span className="font-mono font-bold">${proposalSubtotal.toLocaleString()}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
                        <span>Bonificación Comercial ({discountPercent}%)</span>
                        <span className="font-mono">-${proposalDiscountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="border-t border-[#06434a]/20 pt-2 flex items-center justify-between text-sm font-black text-[#06434a]">
                      <span>Inversión Final Estimada</span>
                      <span className="font-mono text-base text-[#06434a]">
                        ${proposalFinalTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* Drawer Footer 1-Click Action Buttons */}
              {proposalSelectedObjects.length > 0 && (
                <div className="p-4 border-t border-stone-200 bg-white space-y-2.5 shrink-0">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleExportPDF}
                      className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Download className="h-3.5 w-3.5 text-amber-300" />
                      <span>Descargar PDF</span>
                    </button>

                    <button
                      onClick={handleShareWhatsApp}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-white" />
                      <span>Enviar WhatsApp</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={handleSendEmail}
                      className="py-2 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-[9px] font-bold uppercase flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Mail className="h-3 w-3 text-[#06434a]" />
                      <span>Correo</span>
                    </button>

                    <button
                      onClick={handleCopyLink}
                      className="py-2 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-[9px] font-bold uppercase flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Link className="h-3 w-3 text-[#06434a]" />
                      <span>Copiar Link</span>
                    </button>

                    <button
                      onClick={handleSaveAsMediaKit}
                      className="py-2 px-2 bg-[#06434a] hover:bg-[#08555e] text-white rounded-xl text-[9px] font-bold uppercase flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Save className="h-3 w-3 text-amber-300" />
                      <span>Guardar</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
