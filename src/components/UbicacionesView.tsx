import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { DoohScreen } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { InteractiveMap } from "./InteractiveMap";
import { ScreenCard } from "./ScreenCard";

interface UbicacionesViewProps {
  slug: string;
  screens: DoohScreen[];
  BUENOS_AIRES_SCREENS: DoohScreen[];
  selectedScreenId: string | null;
  setSelectedScreenId: (id: string | null) => void;
}

export const UbicacionesView: React.FC<UbicacionesViewProps> = ({
  slug,
  screens,
  BUENOS_AIRES_SCREENS,
  selectedScreenId,
  setSelectedScreenId,
}) => {
  // Mendoza / BA select logic
  const isMendoza = slug.includes("mendoza");
  const isBA = slug.includes("buenos-aires");
  const currentProvince = isBA ? "Buenos Aires" : "Mendoza";
  const provinceScreens = isBA ? BUENOS_AIRES_SCREENS : screens;
  const activeScreens = provinceScreens.filter((s) => s.status === "Activo" || s.status === "Disponible");

  // Filter Catalog states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"Todos" | "Peatonal" | "Vehicular" | "Mixto">("Todos");
  const [filterZone, setFilterZone] = useState("Todas");

  // Reset local filters on slug changes
  useEffect(() => {
    setSearchQuery("");
    setFilterType("Todos");
    setFilterZone("Todas");
    setSelectedScreenId(null);
  }, [slug, setSelectedScreenId]);

  // Filtering calculations
  const filteredScreens = activeScreens.filter((screen) => {
    const matchesSearch =
      screen.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screen.zona.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "Todos" || screen.tipo === filterType;
    const matchesZone = filterZone === "Todas" || screen.zona === filterZone;
    return matchesSearch && matchesType && matchesZone;
  });

  const availableZones = ["Todas", ...Array.from(new Set(activeScreens.map((s) => s.zona)))];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Soportes de Publicidad Exterior en {currentProvince}</h2>
            <p className="text-slate-500 text-xs">
              Filtra nuestro catálogo o selecciona un marcador en el mapa para planificar tu campaña.
            </p>
          </div>
          <span className="text-xs bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 font-extrabold text-slate-700">
            {filteredScreens.length} Pantallas Activas
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-1/3">
            <LucideIcons.Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10" />
            <Input
              type="text"
              placeholder="Buscar pantalla..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {(["Todos", "Peatonal", "Vehicular", "Mixto"] as const).map((type) => (
              <Button key={type} onClick={() => setFilterType(type)} variant={filterType === type ? "default" : "outline"} size="sm" className="h-8 text-xs font-bold">
                {type}
              </Button>
            ))}
          </div>

          <div className="w-full sm:w-auto sm:ml-auto">
            <select value={filterZone} onChange={(e) => setFilterZone(e.target.value)} className="w-full sm:w-auto px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer">
              {availableZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone === "Todas" ? "Todas las Zonas" : `Zona: ${zone}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Simulated Map */}
        <div className="h-[320px] bg-slate-50 rounded-xl border border-slate-200 shadow-inner overflow-hidden relative">
          <InteractiveMap screens={filteredScreens} selectedScreenId={selectedScreenId} onSelectScreen={(id) => setSelectedScreenId(id)} />
        </div>

        {/* Interactive list */}
        {filteredScreens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredScreens.map((screen) => (<ScreenCard key={screen.id} screen={screen} onFocusOnMap={() => setSelectedScreenId(screen.id)} />))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <LucideIcons.Tv className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-extrabold text-slate-800 text-xs">Sin resultados de búsqueda</h4>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1">
              No hay pantallas que coincidan con los filtros en {currentProvince}. Prueba limpiándolos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};