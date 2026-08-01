import React, { useState } from "react";
import { DoohScreen } from "../../types";
import { Role } from "./types";
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
  Upload,
  Image
} from "lucide-react";

interface InventoryModuleProps {
  screens: DoohScreen[];
  userRole: Role;
  onUpdateScreen: (id: string, data: Partial<DoohScreen>) => void;
  onAddScreen: (screen: DoohScreen) => void;
  onDeleteScreen: (id: string) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  screens,
  userRole,
  onUpdateScreen,
  onAddScreen,
  onDeleteScreen,
}) => {
  // Filters state
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("Todas");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);

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
    cobertura: "Zona comercial",
    video: ""
  });

  const selectedScreen = screens.find((s) => s.id === activeScreenId);

  // Filtered screens: includes soft-delete check and smart semantic search
  const filteredScreens = (() => {
    // 1. Soft-delete archive filter
    const isScreenArchived = (s: DoohScreen) => s.status === "Pausado" || s.status === "No disponible";
    let list = screens.filter((s) => (showArchived ? isScreenArchived(s) : !isScreenArchived(s)));

    // 2. If no search query, apply standard fast-filter chips
    if (!searchQuery.trim()) {
      if (selectedCityFilter !== "Todas") {
        list = list.filter((s) => s.ciudad === selectedCityFilter);
      }
      if (selectedCategoryFilter !== "Todas") {
        list = list.filter((s) => s.categoria === selectedCategoryFilter);
      }
      return list;
    }

    // 3. Intelligent/Semantic Search parsing
    const query = searchQuery.toLowerCase().trim();
    const tokens = query.split(/\s+/).filter(Boolean);

    // Parse semantic filters
    let intentCity: "Mendoza" | "Buenos Aires" | null = null;
    let intentCategory: "Pantallas LED" | "Tradicionales" | "LED Móvil" | null = null;
    let isCheap = false;
    let isPremium = false;
    let isHighImpact = false;

    tokens.forEach((token) => {
      // City aliases
      if (["mendoza", "mza", "mndz", "cuyo"].includes(token)) {
        intentCity = "Mendoza";
      } else if (["buenos", "aires", "ba", "bsas", "capital", "federal"].includes(token)) {
        intentCity = "Buenos Aires";
      }

      // Category aliases
      if (token.includes("led") || token === "digital" || token === "pantalla") {
        intentCategory = "Pantallas LED";
      } else if (token.includes("trad") || token === "estático" || token === "estatico" || token === "cartel" || token === "valla" || token === "lona") {
        intentCategory = "Tradicionales";
      } else if (token.includes("móvil") || token.includes("movil") || token === "camión" || token === "pantallamovil") {
        intentCategory = "LED Móvil";
      }

      // Numerical/Tariff intent
      if (["barato", "barata", "baratas", "economico", "económico", "accesible"].includes(token)) {
        isCheap = true;
      }
      if (["premium", "exclusivo", "exclusiva", "vip", "alto-precio", "abc1"].includes(token)) {
        isPremium = true;
      }
      if (["concurrido", "impactos", "impacto", "tráfico", "trafico", "transitada", "transitado", "popular", "alto"].includes(token)) {
        isHighImpact = true;
      }
    });

    // Run matching
    list = list.filter((screen) => {
      // Basic match
      const textFields = [
        screen.nombre,
        screen.zona,
        screen.categoria || "",
        screen.ciudad || "",
        screen.tipo || "",
        screen.nota || "",
        screen.cobertura || "",
      ].join(" ").toLowerCase();

      const matchesAllTokens = tokens.every((t) => {
        // Skip semantic tokens in pure text matching so they act as filters
        if (["barato", "barata", "baratas", "economico", "económico", "premium", "vip", "abc1", "concurrido", "impactos", "tráfico", "trafico"].includes(t)) {
          return true;
        }
        return textFields.includes(t);
      });

      // Override or confirm via semantic analysis
      let matchesSemantic = true;
      if (intentCity && screen.ciudad !== intentCity) matchesSemantic = false;
      if (intentCategory && screen.categoria !== intentCategory) matchesSemantic = false;

      return matchesAllTokens && matchesSemantic;
    });

    // Apply semantic sorting
    if (isCheap) {
      list.sort((a, b) => a.precio - b.precio);
    } else if (isPremium) {
      list.sort((a, b) => b.precio - a.precio);
    } else if (isHighImpact) {
      list.sort((a, b) => b.impactos - a.impactos);
    }

    return list;
  })();

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
      video: newScreenForm.video,
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
      cobertura: "Zona comercial",
      video: ""
    });
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

        {/* Filters bar (Refactored to eliminate unnecessary borders & redundant dropdowns) */}
        <div className="bg-stone-50 border border-stone-150 rounded-2xl p-5 flex flex-col gap-4 text-left shadow-2xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Buscador inteligente: Ej: 'mendoza led barato'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs border border-stone-200/80 rounded-xl bg-white focus:outline-none focus:border-[#06434a] font-medium text-stone-700 placeholder-stone-400"
              />
            </div>

            {/* Semantic Search Hint */}
            <div className="hidden md:block shrink-0 bg-[#06434a]/4 border border-[#06434a]/10 px-3 py-1.5 rounded-xl text-stone-600">
              <p className="text-[10px] font-bold">
                💡 <span className="text-stone-500">Prueba buscar:</span> <span className="font-mono text-[#06434a] font-extrabold">"mendoza led barato"</span> o <span className="font-mono text-[#06434a] font-extrabold">"premium concurrido"</span>
              </p>
            </div>
          </div>

          {/* Quick Filter Chips (Eliminates redundant dropdowns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 border-t border-stone-150">
            {/* Ciudad Chips */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider font-mono shrink-0">Filtrar por Ciudad:</span>
              <div className="flex flex-wrap gap-1.5">
                {(["Todas", "Mendoza", "Buenos Aires"] as const).map((city) => {
                  const isActive = selectedCityFilter === city;
                  return (
                    <button
                      key={city}
                      onClick={() => setSelectedCityFilter(city)}
                      className={`px-3 py-1 rounded-full text-[10.5px] font-bold border transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#06434a] border-[#06434a] text-white shadow-2xs"
                          : "bg-white border-stone-200 text-stone-600 hover:bg-stone-100/50"
                      }`}
                    >
                      {city}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categoría Chips */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider font-mono shrink-0">Filtrar por Categoría:</span>
              <div className="flex flex-wrap gap-1.5">
                {(["Todas", "Pantallas LED", "Tradicionales", "LED Móvil"] as const).map((cat) => {
                  const isActive = selectedCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-[10.5px] font-bold border transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#06434a] border-[#06434a] text-white shadow-2xs"
                          : "bg-white border-stone-200 text-stone-600 hover:bg-stone-100/50"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
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

              {/* CRUD triggers */}
              <div className="border-t border-stone-100 pt-3 flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
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
                      onDeleteScreen(screen.id);
                      setActiveScreenId(null);
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
      <div className={`w-80 border-l border-stone-200 bg-white shadow-xl flex flex-col justify-between shrink-0 transition-all duration-300 relative z-30 ${
        selectedScreen ? "translate-x-0" : "w-0 overflow-hidden border-l-0"
      }`}>
        {selectedScreen && (
          <div className="flex flex-col h-full overflow-y-auto">
            
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
                </div>
              )}

              {/* Tab: Location editing coordinates */}
              {activeTab === "ubicacion" && (
                <div className="space-y-4 text-xs text-stone-600">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1 flex items-center gap-2">
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
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center gap-2">
                    <Video className="h-4 w-4 text-[#06434a]" />
                    <span className="text-[10px] font-semibold text-stone-600">Material fotográfico y técnico</span>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest font-mono">
                      Cargar Archivo Local (Imagen o Video)
                    </label>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              onUpdateScreen(selectedScreen.id, { video: event.target.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="border-2 border-dashed border-stone-200 hover:border-[#06434a]/60 bg-stone-50/50 hover:bg-[#06434a]/3 rounded-2xl p-5 text-center cursor-pointer transition-all space-y-2 group relative"
                    >
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                onUpdateScreen(selectedScreen.id, { video: event.target.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="h-6 w-6 text-stone-400 group-hover:text-[#06434a] mx-auto transition-colors" />
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-stone-800 group-hover:text-[#06434a] transition-colors">
                          Arrastrá un archivo aquí o hacé clic
                        </p>
                        <p className="text-[9px] text-stone-550 leading-normal">
                          Formatos soportados: MP4, WEBM, PNG, JPG, WEBP. El contenido se guardará en memoria local.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Active Media Preview */}
                  {selectedScreen.video && (
                    <div className="space-y-1.5 p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-extrabold text-stone-500 uppercase tracking-widest">
                          Vista Previa del Archivo
                        </span>
                        <button
                          onClick={() => onUpdateScreen(selectedScreen.id, { video: "" })}
                          className="text-[9px] font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                        >
                          Quitar Archivo
                        </button>
                      </div>
                      <div className="relative aspect-[16/9] bg-stone-900 rounded-lg overflow-hidden border border-stone-200">
                        {selectedScreen.video.startsWith("data:video/") || 
                         selectedScreen.video.toLowerCase().match(/\.(mp4|webm|mov|ogg|m4v)$/) ? (
                          <video
                            src={selectedScreen.video}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={selectedScreen.video}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Dirección URL Alternativa (Video o Imagen)</label>
                    <input
                      type="text"
                      value={selectedScreen.video || ""}
                      onChange={(e) => onUpdateScreen(selectedScreen.id, { video: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-[11px] border border-stone-200 rounded-lg bg-stone-50/50 focus:outline-none font-mono text-[10px]"
                      placeholder="https://example.com/movie.mp4"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest font-mono">PDF Ficha Técnica Oficial (URL)</label>
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
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center gap-2">
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

                  <div className="p-3.5 bg-[#06434a]/5 border border-[#06434a]/10 rounded-xl text-stone-700 space-y-1">
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
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center gap-2">
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
        )}
      </div>

      {/* 3. Create screen Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-150 p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-6 text-left animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-sm font-black text-stone-950 font-display uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                <span>Agregar Nuevo Soporte</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 hover:bg-stone-50 rounded-xl text-stone-400 hover:text-stone-700 cursor-pointer"
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
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none focus:border-[#06434a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Plaza / Ciudad</label>
                  <select
                    value={newScreenForm.ciudad}
                    onChange={(e) => setNewScreenForm({ ...newScreenForm, ciudad: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 cursor-pointer"
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
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none focus:border-[#06434a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Categoría Sgto.</label>
                  <select
                    value={newScreenForm.categoria}
                    onChange={(e) => setNewScreenForm({ ...newScreenForm, categoria: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 cursor-pointer"
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
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 cursor-pointer"
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
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none focus:border-[#06434a] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Impactos Diarios</label>
                  <input
                    type="number"
                    value={newScreenForm.impactos}
                    onChange={(e) => setNewScreenForm({ ...newScreenForm, impactos: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none focus:border-[#06434a] font-mono"
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
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none focus:border-[#06434a] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Longitud</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newScreenForm.lng}
                    onChange={(e) => setNewScreenForm({ ...newScreenForm, lng: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none focus:border-[#06434a] font-mono"
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
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none focus:border-[#06434a]"
                />
              </div>

              {/* Local File Uploader */}
              <div className="space-y-1.5">
                <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest font-mono">
                  Cargar Encabezado (Imagen o Video)
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setNewScreenForm({ ...newScreenForm, video: event.target.result as string });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="border border-dashed border-stone-200 hover:border-[#06434a]/60 bg-stone-50/50 hover:bg-[#06434a]/3 rounded-xl p-4 text-center cursor-pointer transition-all space-y-1 relative group"
                >
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setNewScreenForm({ ...newScreenForm, video: event.target.result as string });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="h-5 w-5 text-stone-400 group-hover:text-[#06434a] mx-auto transition-colors" />
                  <p className="text-[10px] font-bold text-stone-800 group-hover:text-[#06434a] transition-colors">
                    {newScreenForm.video ? "¡Archivo cargado con éxito!" : "Arrastrá un archivo aquí o hacé clic"}
                  </p>
                  <p className="text-[8px] text-stone-550 leading-none">
                    Soporta MP4, WEBM, PNG, JPG, WEBP
                  </p>
                </div>

                {newScreenForm.video && (
                  <div className="relative aspect-[16/9] max-h-32 bg-stone-900 rounded-lg overflow-hidden border border-stone-200 mt-2">
                    {newScreenForm.video.startsWith("data:video/") ? (
                      <video src={newScreenForm.video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                    ) : (
                      <img src={newScreenForm.video} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => setNewScreenForm({ ...newScreenForm, video: "" })}
                      className="absolute top-2 right-2 bg-stone-900/80 text-white hover:bg-stone-950 p-1 rounded-full text-[9px] font-bold flex items-center justify-center cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-stone-100 pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 font-bold uppercase text-[10px] rounded-full hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#06434a] hover:bg-[#0b5e67] text-white font-extrabold uppercase text-[10px] rounded-full cursor-pointer shadow-sm"
                >
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
