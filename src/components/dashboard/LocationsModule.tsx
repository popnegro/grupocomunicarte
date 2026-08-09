import React, { useState, useMemo } from "react";
import { useCms } from "../CmsContext";
import { DoohScreen } from "../../types";
import { InteractiveMap } from "../InteractiveMap";
import { 
  MapPin, 
  Tv, 
  Sparkles, 
  Layers, 
  Search, 
  Filter, 
  ChevronRight,
  TrendingUp,
  MapPinOff,
  Maximize2
} from "lucide-react";
import { useToast } from "../ui/Toast";

const formatPrice = (price: number) =>
  price === 0 ? "CONSULTAR" : `$${price.toLocaleString("es-AR")}`;

export const LocationsModule: React.FC = () => {
  const { screens } = useCms();
  const { toast } = useToast();

  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("all");

  const filteredScreens = useMemo(() => {
    return screens.filter((s) => {
      const matchesSearch = s.nombre.toLowerCase().includes(search.toLowerCase()) || 
                            s.zona.toLowerCase().includes(search.toLowerCase());
      const matchesTipo = tipoFilter === "all" || s.tipo === tipoFilter;
      return matchesSearch && matchesTipo;
    });
  }, [screens, search, tipoFilter]);

  const activeScreen = useMemo(() => {
    return screens.find((s) => s.id === selectedScreenId) || null;
  }, [screens, selectedScreenId]);

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            Localización de Soportes
          </span>
          <h2 className="text-xl font-bold text-stone-950 font-display mt-2">
            Ubicaciones Comerciales & Cobertura Geográfica
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Visualiza en tiempo real el posicionamiento georreferenciado, cobertura e impactos de nuestra red DOOH.
          </p>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[550px]">
        
        {/* Left Side: interactive list and filters */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* Controls */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-3xs space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Filtrar por nombre o zona..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-full text-xs font-semibold focus:outline-none focus:border-[#06434a] bg-stone-50/50"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-full">
              <Filter className="h-3 w-3 text-stone-400" />
              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-stone-600 focus:outline-none border-none cursor-pointer w-full"
              >
                <option value="all">Todos los formatos</option>
                <option value="Vehicular">Vehicular</option>
                <option value="Peatonal">Peatonal</option>
                <option value="LeadMóvil">LeadMóvil</option>
              </select>
            </div>
          </div>

          {/* List scroll */}
          <div className="flex-1 overflow-y-auto max-h-[420px] bg-white border border-stone-200 rounded-3xl p-3 shadow-2xs space-y-1.5">
            <span className="block px-3 py-1 text-[8px] font-extrabold text-stone-400 uppercase tracking-widest font-mono border-b border-stone-50 mb-2">
              Resultados ({filteredScreens.length})
            </span>
            {filteredScreens.length === 0 ? (
              <div className="py-12 text-center text-stone-450 text-xs font-medium">
                No se encontraron soportes georreferenciados.
              </div>
            ) : (
              filteredScreens.map((s) => {
                const isActive = s.id === selectedScreenId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScreenId(s.id)}
                    className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all ${
                      isActive 
                        ? "bg-[#06434a] text-white font-bold shadow-xs" 
                        : "hover:bg-stone-50/70 text-stone-700"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <span className="block text-xs font-bold truncate leading-snug">{s.nombre}</span>
                      <span className={`block text-[9px] mt-0.5 ${isActive ? "text-stone-300" : "text-stone-400"}`}>
                        {s.zona} • {s.ciudad}
                      </span>
                    </div>
                    <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-white" : "text-stone-300"}`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Map Canvas and details */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-3 shadow-2xs flex-1 flex flex-col min-h-[400px] overflow-hidden relative">
            <div className="flex-1 rounded-2xl overflow-hidden border border-stone-100 relative z-10">
              <InteractiveMap
                screens={filteredScreens}
                selectedScreenId={selectedScreenId}
                onSelectScreen={setSelectedScreenId}
              />
            </div>
          </div>

          {/* Details Card if screen is selected */}
          {activeScreen && (
            <div className="bg-white border border-stone-250/70 rounded-3xl p-6 shadow-xs text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <span className="text-[9px] bg-[#06434a]/10 text-[#06434a] font-bold px-2 py-0.5 rounded-full uppercase">
                    {activeScreen.tipo}
                  </span>
                  <h3 className="font-bold text-stone-900 text-sm mt-1.5">{activeScreen.nombre}</h3>
                  <p className="text-[10px] text-stone-400 font-semibold">{activeScreen.zona} • {activeScreen.ciudad}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Tarifa Semanal</span>
                  <span className="text-lg font-black text-[#06434a] font-mono">
                    {formatPrice(activeScreen.precio)} {activeScreen.precio !== 0 && <span className="text-xs font-bold text-stone-400">ARS</span>}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5">
                <div>
                  <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Impactos Estimados</span>
                  <span className="text-sm font-black text-stone-900 font-mono mt-1 block">
                    {activeScreen.impactos?.toLocaleString() || "15,000"} / sem
                  </span>
                </div>

                <div>
                  <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Dimensiones</span>
                  <span className="text-sm font-black text-stone-900 font-mono mt-1 block">
                    {activeScreen.dimensiones || "4.0m x 3.0m"}
                  </span>
                </div>

                <div>
                  <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Brillo Lumínico</span>
                  <span className="text-sm font-black text-stone-900 font-mono mt-1 block">
                    {activeScreen.brillo || "6,000 nits"}
                  </span>
                </div>

                <div>
                  <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Estado de Operación</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-black mt-2 ${
                    activeScreen.status === "Disponible" ? "text-emerald-600" : "text-amber-500"
                  }`}>
                    <span className={`h-2 w-2 rounded-full ${
                      activeScreen.status === "Disponible" ? "bg-emerald-600" : "bg-amber-500"
                    }`} />
                    <span>{activeScreen.status}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
