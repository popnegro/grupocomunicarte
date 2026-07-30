import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCms } from "../CmsContext";
import { DoohScreen } from "../../types";
import { ScreenCard } from "../ScreenCard";
import { InteractiveMap } from "../InteractiveMap";
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Trash2, 
  Send, 
  Check, 
  Plus,
  Eye, 
  Sparkles, 
  Scale, 
  Grid, 
  Map as MapIcon, 
  FileDown, 
  Cpu, 
  FileCheck,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  X
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";

interface InventoryCatalogProps {
  selectedCity: "Mendoza" | "San Juan" | "Buenos Aires";
  activeTab: "tarjetas" | "mapa" | "mediakit";
  setActiveTab: (tab: "tarjetas" | "mapa" | "mediakit") => void;
}

export const InventoryCatalog: React.FC<InventoryCatalogProps> = ({
  selectedCity,
  activeTab,
  setActiveTab,
}) => {
  const {
    screens,
    cart,
    toggleCart,
    clearCart,
    addLead,
  } = useCms();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"Todos" | "Tradicionales" | "Pantallas LED" | "LED Móvil">("Todos");
  const [selectedZone, setSelectedZone] = useState("Todas");
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);

  // Comparison State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Campaign parameters stored locally for each cart item
  const [campaignConfigs, setCampaignConfigs] = useState<Record<string, { weeks: number; notes: string; priority: "Alta" | "Media" | "Baja" }>>({});

  // Checkout form state
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filter screens by active city
  const cityScreens = useMemo(() => {
    return screens.filter((s) => s.ciudad === selectedCity && (s.status === "Activo" || s.status === "Disponible"));
  }, [screens, selectedCity]);

  // Compute dynamic category counts for the active city
  const categoryCounts = useMemo(() => {
    const counts = { Tradicionales: 0, "Pantallas LED": 0, "LED Móvil": 0 };
    cityScreens.forEach((s) => {
      if (s.categoria && s.categoria in counts) {
        counts[s.categoria as keyof typeof counts]++;
      }
    });
    return counts;
  }, [cityScreens]);

  // Filter zones dynamically for active city
  const availableZones = useMemo(() => {
    const zones = new Set(cityScreens.map((s) => s.zona));
    return ["Todas", ...Array.from(zones)];
  }, [cityScreens]);

  // Filtered dataset for display
  const filteredScreens = useMemo(() => {
    return cityScreens.filter((s) => {
      const matchesSearch =
        s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.zona.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.nota && s.nota.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "Todos" || s.categoria === selectedCategory;
      const matchesZone = selectedZone === "Todas" || s.zona === selectedZone;

      return matchesSearch && matchesCategory && matchesZone;
    });
  }, [cityScreens, searchQuery, selectedCategory, selectedZone]);

  // MediaKit screens
  const cartScreens = useMemo(() => {
    return screens.filter((s) => cart.includes(s.id));
  }, [screens, cart]);

  // Handle comparison toggle
  const handleCompareToggle = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) {
        // Limit to 3 max
        return prev;
      }
      return [...prev, id];
    });
  };

  const comparedScreens = useMemo(() => {
    return screens.filter((s) => compareIds.includes(s.id));
  }, [screens, compareIds]);

  // Handle campaign parameter changes
  const handleConfigChange = (id: string, field: "weeks" | "notes" | "priority", value: any) => {
    setCampaignConfigs((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { weeks: 4, notes: "", priority: "Media" }),
        [field]: value,
      },
    }));
  };

  // Submit proposal request
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.email || cartScreens.length === 0) return;

    setIsSubmitting(true);

    // Format MediaKit details cleanly for the lead record
    const proposalDetails = cartScreens.map((s) => {
      const config = campaignConfigs[s.id] || { weeks: 4, notes: "", priority: "Media" };
      return `[${s.nombre} (${s.zona}, ${s.ciudad}) - Duración: ${config.weeks} sem, Prioridad: ${config.priority}, Obs: ${config.notes || "Ninguna"}]`;
    }).join("\n");

    const messagePayload = `
Solicitud de Propuesta Comercial - MediaKit Inteligente (${selectedCity})
Plaza: ${selectedCity}
Ubicaciones seleccionadas (${cartScreens.length}):
${proposalDetails}

Mensaje del cliente: ${checkoutForm.message || "Sin mensaje adicional."}
    `;

    await addLead({
      name: checkoutForm.name,
      email: checkoutForm.email,
      company: checkoutForm.company || "Pyme / Independiente",
      source: `MediaKit Web Marketplace (${selectedCity})`,
      status: "qualified",
      value: 2500, // estimated lead strategic value
    });

    // Simulate database receipt
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      clearCart();
    }, 1200);
  };

  return (
    <section id="espacios" className="py-20 max-w-7xl mx-auto px-6 space-y-10 font-sans">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] bg-[#06434a]/8 border border-[#06434a]/15 text-[#06434a] font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
          Plaza Activa: {selectedCity}
        </span>
        <h2 className="text-3xl md:text-4xl tracking-tight text-stone-900 font-display font-black">
          Catálogo de Inventario DOOH
        </h2>
        <p className="text-stone-500 text-sm max-w-xl mx-auto leading-relaxed">
          Explorá los soportes de comunicación exterior de {selectedCity}. Alterná vistas de forma fluida, 
          compará sus fichas técnicas, y armá tu MediaKit personalizado.
        </p>
      </div>

      {/* VIEW SELECTOR BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 pb-4">
        {/* Switch tabs */}
        <div className="flex bg-stone-100 p-1 rounded-full border border-stone-200 shadow-inner w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("tarjetas")}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-1/3 sm:w-auto ${
              activeTab === "tarjetas"
                ? "bg-white text-stone-950 shadow-sm font-black"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <Grid className="h-4 w-4" />
            <span>Tarjetas</span>
          </button>
          <button
            onClick={() => setActiveTab("mapa")}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-1/3 sm:w-auto ${
              activeTab === "mapa"
                ? "bg-white text-stone-950 shadow-sm font-black"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <MapIcon className="h-4 w-4" />
            <span>Mapa</span>
          </button>
          <button
            onClick={() => setActiveTab("mediakit")}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-1/3 sm:w-auto relative ${
              activeTab === "mediakit"
                ? "bg-white text-stone-950 shadow-sm font-black"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <FileDown className="h-4 w-4" />
            <span>MediaKit</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white shadow-xs animate-bounce">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Action highlights */}
        <div className="text-stone-500 text-xs font-bold flex items-center gap-1.5 bg-stone-50 border border-stone-200/50 px-3 py-1.5 rounded-lg select-none">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          <span>Mostrando {filteredScreens.length} de {cityScreens.length} soportes premium</span>
        </div>
      </div>

      {/* FILTER PANEL - (Only displayed if tab is Tarjetas or Mapa) */}
      {activeTab !== "mediakit" && (
        <div className="bg-[#FAF9F5]/70 border border-stone-200/60 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400 z-10" />
              <Input
                type="text"
                placeholder="Buscar por avenida, zona o referencia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-xs h-10 bg-white border-stone-200 focus:border-[#06434a] focus:ring-[#06434a]/10"
              />
            </div>

            {/* Category Pills (Dynamic Counters) */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {(["Todos", "Tradicionales", "Pantallas LED", "LED Móvil"] as const).map((cat) => {
                const count = cat === "Todos" ? cityScreens.length : categoryCounts[cat];
                return (
                  <Button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    className={`h-9 text-[10px] uppercase font-bold tracking-wider rounded-full transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#06434a] hover:bg-[#0b5e67] text-white border-[#06434a]"
                        : "bg-white hover:bg-stone-50 text-stone-600 border-stone-200"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${selectedCategory === cat ? "bg-white/20 text-white" : "bg-stone-100 text-stone-400"}`}>
                      {count}
                    </span>
                  </Button>
                );
              })}
            </div>

            {/* Zone Filter Dropdown */}
            <div className="w-full md:w-auto md:ml-auto">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full md:w-auto px-4 py-2.5 text-xs border border-stone-200 rounded-xl bg-white text-stone-700 font-bold focus:outline-none focus:ring-4 focus:ring-[#06434a]/10 focus:border-[#06434a] cursor-pointer"
              >
                {availableZones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone === "Todas" ? "Todas las Zonas" : `Zona: ${zone}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC TAB CONTENT VIEWPORT */}
      <div className="min-h-[400px]">
        {/* VIEW 1: GRID VIEW OF CARDS */}
        {activeTab === "tarjetas" && (
          <div className="space-y-6">
            {filteredScreens.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScreens.map((screen) => (
                  <ScreenCard
                    key={screen.id}
                    screen={screen}
                    isComparing={compareIds.includes(screen.id)}
                    onCompareToggle={() => handleCompareToggle(screen.id)}
                    onFocusOnMap={() => {
                      setActiveTab("mapa");
                      setSelectedScreenId(screen.id);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-stone-200 rounded-2xl bg-white max-w-md mx-auto p-6 space-y-4">
                <div className="h-14 w-14 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center mx-auto">
                  <Search className="h-6 w-6 text-stone-400" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Sin coincidencias</h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    No encontramos soportes en {selectedCity} que coincidan con los filtros aplicados. Intentá limpiando la búsqueda.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Todos");
                    setSelectedZone("Todas");
                  }}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                >
                  Restablecer Filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: MAP VIEW */}
        {activeTab === "mapa" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Split map sidebar */}
            <div className="lg:col-span-4 max-h-[500px] overflow-y-auto border border-stone-200 rounded-xl bg-white p-4 space-y-3" style={{ scrollbarWidth: "thin" }}>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
                Listado en Mapa ({filteredScreens.length})
              </h3>
              
              <div className="space-y-2">
                {filteredScreens.map((s) => {
                  const isSelected = selectedScreenId === s.id;
                  const inCart = cart.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedScreenId(s.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-[#06434a]/5 border-[#06434a]" 
                          : "border-stone-150 hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-stone-900 block truncate">{s.nombre}</span>
                        {inCart && (
                          <span className="h-2 w-2 rounded-full bg-[#06434a]" />
                        )}
                      </div>
                      <span className="text-[10px] text-stone-500 block mt-0.5">{s.zona} • {s.categoria}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Leaflet Map */}
            <div className="lg:col-span-8 h-[500px] rounded-xl overflow-hidden shadow-xs relative border border-stone-200">
              <InteractiveMap
                screens={filteredScreens}
                selectedScreenId={selectedScreenId}
                onSelectScreen={(id) => setSelectedScreenId(id)}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: ME DIAKIT (PROPOSAL CONFIGURATION DESK) */}
        {activeTab === "mediakit" && (
          <div className="space-y-10">
            {cartScreens.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Selected Screens Planner desk */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="text-base font-bold text-stone-900 font-display">
                      Soportes Seleccionados ({cartScreens.length})
                    </h3>
                    <button
                      onClick={clearCart}
                      className="text-stone-400 hover:text-red-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Limpiar Todo</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cartScreens.map((s) => {
                      const config = campaignConfigs[s.id] || { weeks: 4, notes: "", priority: "Media" };
                      return (
                        <div
                          key={s.id}
                          className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-xs hover:border-stone-300 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-[9px] bg-stone-100 text-stone-500 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {s.categoria}
                              </span>
                              <h4 className="text-sm font-bold text-stone-900 mt-1 font-display">
                                {s.nombre}
                              </h4>
                              <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3.5 w-3.5 text-stone-400" />
                                {s.zona}, {s.ciudad}
                              </p>
                            </div>

                            <button
                              onClick={() => toggleCart(s.id)}
                              className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Configuration controls for duration, priority and observations */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-100">
                            {/* Weeks Slider / Input */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1 select-none">
                                <Calendar className="h-3 w-3 text-[#06434a]" />
                                Duración de Pauta (Semanas)
                              </label>
                              <select
                                value={config.weeks}
                                onChange={(e) => handleConfigChange(s.id, "weeks", Number(e.target.value))}
                                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-[#06434a] font-bold cursor-pointer"
                              >
                                {[1, 2, 4, 8, 12, 16, 24].map((w) => (
                                  <option key={w} value={w}>
                                    {w} {w === 1 ? "Semana (Mínimo)" : `${w} Semanas`}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Priority Selector */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1 select-none">
                                <Info className="h-3 w-3 text-[#06434a]" />
                                Prioridad Estratégica
                              </label>
                              <select
                                value={config.priority}
                                onChange={(e) => handleConfigChange(s.id, "priority", e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-[#06434a] font-bold cursor-pointer"
                              >
                                <option value="Alta">Alta (Máxima Frecuencia / Exclusividad)</option>
                                <option value="Media">Media (Distribución Estándar)</option>
                                <option value="Baja">Baja (Rotación Flexible)</option>
                              </select>
                            </div>
                          </div>

                          {/* Custom Notes */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider select-none">
                              Observaciones o Fechas de Pautado
                            </label>
                            <input
                              type="text"
                              value={config.notes}
                              placeholder="Ej: Lanzamiento 15 de Octubre, pautar spot institucional de 15 segundos..."
                              onChange={(e) => handleConfigChange(s.id, "notes", e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-[#06434a] placeholder-stone-400"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Lead Generation & Request Form Card */}
                <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[9px] bg-[#06434a]/10 text-[#06434a] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      Cotización B2B sin compromiso
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 font-display">
                      Solicitar Propuesta Comercial
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Completá el formulario para que nuestro equipo comercial dimensione económicamente tu campaña 
                      con tarifas preferenciales basadas en tus soportes seleccionados.
                    </p>
                  </div>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 space-y-4"
                    >
                      <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                        <FileCheck className="h-7 w-7" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-emerald-900 text-base font-display">Propuesta Solicitada</h4>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                          Tu MediaKit fue enviado de forma exitosa. Un asesor de Grupo Comunicarte analizará la disponibilidad física 
                          y los ciclos operativos, y te enviará una propuesta económica formal por correo.
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => setIsSubmitted(false)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                        >
                          Armar Nueva Campaña
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">
                          Nombre del Solicitante *
                        </label>
                        <Input
                          type="text"
                          required
                          placeholder="Tu nombre completo"
                          value={checkoutForm.name}
                          onChange={(e) => setCheckoutForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="text-xs bg-stone-50/50"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">
                          Email Corporativo *
                        </label>
                        <Input
                          type="email"
                          required
                          placeholder="nombre@empresa.com"
                          value={checkoutForm.email}
                          onChange={(e) => setCheckoutForm((prev) => ({ ...prev, email: e.target.value }))}
                          className="text-xs bg-stone-50/50"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">
                          Teléfono de Contacto
                        </label>
                        <Input
                          type="tel"
                          placeholder="Ej: +54 9 261 1234567"
                          value={checkoutForm.phone}
                          onChange={(e) => setCheckoutForm((prev) => ({ ...prev, phone: e.target.value }))}
                          className="text-xs bg-stone-50/50"
                        />
                      </div>

                      {/* Company */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">
                          Nombre de la Empresa / Marca
                        </label>
                        <Input
                          type="text"
                          placeholder="Ej: Bodega S.A."
                          value={checkoutForm.company}
                          onChange={(e) => setCheckoutForm((prev) => ({ ...prev, company: e.target.value }))}
                          className="text-xs bg-stone-50/50"
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">
                          Instrucciones comerciales o dudas
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Contanos más sobre tus objetivos de marca..."
                          value={checkoutForm.message}
                          onChange={(e) => setCheckoutForm((prev) => ({ ...prev, message: e.target.value }))}
                          className="w-full text-xs px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#06434a] focus:ring-4 focus:ring-[#06434a]/10 placeholder-stone-450"
                        />
                      </div>

                      {/* Submit CTA */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-[#06434a] hover:bg-[#0b5e67] disabled:bg-stone-300 text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <span>Enviando...</span>
                          ) : (
                            <>
                              <Send className="h-3.5 w-3.5" />
                              <span>Enviar Solicitud Comercial</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-center py-20 bg-stone-50 border border-dashed border-stone-200 rounded-[24px] max-w-lg mx-auto p-8 space-y-5">
                <div className="h-16 w-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400 shadow-inner">
                  <FileDown className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-stone-900 text-base font-display">Tu MediaKit está vacío</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                    Aún no seleccionaste ningún soporte publicitario. Regresá al catálogo de tarjetas o mapa para añadir espacios de Mendoza, San Juan o Buenos Aires.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setActiveTab("tarjetas")}
                    className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#06434a] hover:bg-[#0b5e67] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer"
                  >
                    <span>Ir al Catálogo</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FLOATING COMPARISON DRAWER SHELF - (Only shown if compareIds.length > 0) */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="fixed bottom-6 left-6 right-6 lg:left-auto lg:right-12 z-40 bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xl shadow-stone-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-2xl select-none"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#06434a]/10 text-[#06434a] rounded-xl">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] text-[#06434a] font-extrabold uppercase tracking-widest block">Comparador Técnico</span>
                <span className="text-xs font-bold text-stone-900 font-display block">
                  {compareIds.length === 1 
                    ? "Seleccioná al menos un soporte más" 
                    : `Comparando ${compareIds.length} de 3 soportes`}
                </span>
              </div>
            </div>

            {/* Thumbnail elements inside comparative bar */}
            <div className="flex items-center gap-2">
              {comparedScreens.map((s) => (
                <div key={s.id} className="relative group/thumb">
                  <div className="h-10 w-14 rounded-lg bg-stone-900 border border-stone-200 overflow-hidden text-center flex items-center justify-center font-bold text-[8px] text-white">
                    {s.nombre.substring(0, 3).toUpperCase()}
                  </div>
                  <button
                    onClick={() => handleCompareToggle(s.id)}
                    className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-stone-200 hover:bg-stone-300 border border-white text-stone-700 flex items-center justify-center text-[8px]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompareIds([])}
                className="px-3 py-2 text-[10px] font-bold text-stone-500 hover:text-stone-900 bg-stone-50 rounded-xl uppercase tracking-wider"
              >
                Limpiar
              </button>

              <button
                disabled={compareIds.length < 2}
                onClick={() => setIsCompareModalOpen(true)}
                className="px-5 py-2 text-[10px] font-black bg-stone-950 hover:bg-[#06434a] disabled:bg-stone-200 text-white disabled:text-stone-400 rounded-xl uppercase tracking-wider shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Comparar</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAILED SIDE-BY-SIDE COMPARATIVE MODAL */}
      <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white border border-stone-200 shadow-2xl rounded-[24px] max-h-[92vh] flex flex-col">
          <DialogTitle className="sr-only">Comparación Técnica de Soportes</DialogTitle>
          <DialogDescription className="sr-only">Tabla comparativa de dimensiones, resolución, brillo y audiencia de los soportes seleccionados</DialogDescription>

          {/* Modal Header */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#06434a]/10 text-[#06434a] rounded-xl">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 font-display">
                  Especificaciones Comparativas
                </h3>
                <p className="text-[11px] text-stone-400">
                  Contraste técnico side-by-side de tus soportes publicitarios seleccionados.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="text-stone-400 hover:text-stone-600 p-1.5 hover:bg-stone-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Comparative Table Viewport */}
          <div className="p-6 md:p-8 overflow-x-auto overflow-y-auto max-h-[60vh]">
            <div className="min-w-[600px] grid grid-cols-4 gap-6 text-xs">
              
              {/* Row: Technical labels */}
              <div className="space-y-6 pt-10 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                <div>Nombre del soporte</div>
                <div>Categoría / Ciudad</div>
                <div>Audiencia Estimada / Día</div>
                <div>Dimensiones Físicas</div>
                <div>Pico de Brillo</div>
                <div>Formatos de Loop</div>
                <div>Reseña de Cobertura</div>
                <div className="pt-6">MediaKit</div>
              </div>

              {/* Rows: Compared screen columns */}
              {comparedScreens.map((s) => {
                const inCart = cart.includes(s.id);
                return (
                  <div key={s.id} className="space-y-6 p-4 rounded-xl bg-[#FAF9F5]/40 border border-stone-150">
                    <div className="font-bold text-stone-900 text-sm font-display line-clamp-1 h-5">
                      {s.nombre}
                    </div>

                    <div className="font-semibold text-stone-800 line-clamp-1">
                      {s.categoria} • <span className="text-[#06434a]">{s.ciudad}</span>
                    </div>

                    <div className="font-bold text-stone-900 font-mono text-sm">
                      {s.impactos.toLocaleString("es-AR")} visitas
                    </div>

                    <div className="font-semibold text-stone-800">
                      {s.dimensiones || "4.0m x 2.0m"}
                    </div>

                    <div className="font-semibold text-stone-800">
                      {s.brillo || "5,500 nits"}
                    </div>

                    <div className="font-semibold text-[#06434a]">
                      {s.formato || "MP4, JPG (16:9)"}
                    </div>

                    <div className="text-stone-650 italic leading-relaxed line-clamp-3 text-[11px] h-12">
                      "{s.cobertura || "Punto de alta afluencia peatonal y vehicular de alto tránsito comercial."}"
                    </div>

                    {/* MediaKit trigger */}
                    <div className="pt-2">
                      <button
                        onClick={() => toggleCart(s.id)}
                        className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          inCart
                            ? "bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200"
                            : "bg-stone-950 hover:bg-[#06434a] text-white"
                        }`}
                      >
                        {inCart ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span>Agregado</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3" />
                            <span>MediaKit</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Fill column empty spaces if compared is less than 3 */}
              {Array.from({ length: 3 - comparedScreens.length }).map((_, idx) => (
                <div key={idx} className="border border-dashed border-stone-200 rounded-xl flex items-center justify-center text-stone-400 p-10 h-full text-center">
                  <div className="space-y-1.5">
                    <Scale className="h-6 w-6 mx-auto opacity-50" />
                    <span className="block text-[10px] font-bold uppercase tracking-wider">Añadir otro soporte</span>
                    <span className="block text-[9px] text-stone-400">Seleccioná un soporte en el catálogo para comparar</span>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-stone-100 bg-stone-50 flex justify-end gap-2">
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer"
            >
              Cerrar Tabla
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
