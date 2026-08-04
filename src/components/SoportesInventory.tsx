import React, { useState, useMemo } from "react";
import { useCms } from "./CmsContext";
import { ScreenCard } from "./ScreenCard";
import { DoohScreen } from "../types";
import { Search, MapPin, Tv, ArrowUpDown, SlidersHorizontal, Eye, DollarSign, X, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SoportesInventoryProps {
  initialCity?: string;
  initialTipo?: string;
  initialCategoria?: string;
  onNavigateToCityMap?: (city: "Mendoza" | "Buenos Aires") => void;
}

// Performance Optimization: Declare static constants outside the component rendering cycle to avoid recreation overhead
const CITIES = ["Todas", "Mendoza", "Buenos Aires"] as const;
const TIPOS = ["Todos", "Peatonal", "Vehicular", "Mixto", "Móvil"] as const;
const CATEGORIAS = ["Todas", "Pantallas LED", "Tradicionales", "LED Móvil"] as const;

export const SoportesInventory: React.FC<SoportesInventoryProps> = ({
  initialCity,
  initialTipo,
  initialCategoria,
  onNavigateToCityMap,
}) => {
  const { screens } = useCms();

  // Local filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>(initialCity || "Todas");
  const [selectedTipo, setSelectedTipo] = useState<string>(initialTipo || "Todos");
  const [selectedCategoria, setSelectedCategoria] = useState<string>(initialCategoria || "Todas");
  const [sortBy, setSortBy] = useState<"impactos" | "precio" | "nombre">("impactos");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Mobile filters panel toggle state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter & sort logic
  const filteredAndSortedScreens = useMemo(() => {
    let result = [...screens];

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.nombre.toLowerCase().includes(q) ||
          s.zona.toLowerCase().includes(q) ||
          (s.nota && s.nota.toLowerCase().includes(q))
      );
    }

    // Filter by City
    if (selectedCity !== "Todas") {
      result = result.filter((s) => s.ciudad === selectedCity);
    }

    // Filter by Type
    if (selectedTipo !== "Todos") {
      result = result.filter((s) => s.tipo === selectedTipo);
    }

    // Filter by Category
    if (selectedCategoria !== "Todas") {
      result = result.filter((s) => s.categoria === selectedCategoria);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "impactos") {
        comparison = a.impactos - b.impactos;
      } else if (sortBy === "precio") {
        comparison = a.precio - b.precio;
      } else {
        comparison = a.nombre.localeCompare(b.nombre);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [screens, searchQuery, selectedCity, selectedTipo, selectedCategoria, sortBy, sortOrder]);

  // Derived metrics for the filtered inventory
  const stats = useMemo(() => {
    const totalCount = filteredAndSortedScreens.length;
    const totalImpacts = filteredAndSortedScreens.reduce((sum, s) => sum + s.impactos, 0);
    const averagePrice =
      totalCount > 0
        ? Math.round(filteredAndSortedScreens.reduce((sum, s) => sum + s.precio, 0) / totalCount)
        : 0;

    return {
      totalCount,
      totalImpacts,
      averagePrice,
    };
  }, [filteredAndSortedScreens]);

  const toggleSort = (field: "impactos" | "precio" | "nombre") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Helper to count active filters (excluding default values)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCity !== "Todas") count++;
    if (selectedTipo !== "Todos") count++;
    if (selectedCategoria !== "Todas") count++;
    if (searchQuery.trim() !== "") count++;
    return count;
  }, [selectedCity, selectedTipo, selectedCategoria, searchQuery]);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCity("Todas");
    setSelectedTipo("Todos");
    setSelectedCategoria("Todas");
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Dynamic Inventory Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-xs hover:border-[#06434a]/30 transition-all duration-300">
          <div className="p-3 bg-stone-50 text-stone-700 rounded-xl border border-stone-100">
            <Tv className="h-5 w-5 text-[#06434a]" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] text-stone-500 uppercase font-black tracking-widest block">Soportes Activos</span>
            <span className="text-2xl font-bold font-display text-stone-950">{stats.totalCount}</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">En catálogo filtrado</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-xs hover:border-[#06434a]/30 transition-all duration-300">
          <div className="p-3 bg-emerald-50 text-[#06434a] rounded-xl border border-emerald-100">
            <Eye className="h-5 w-5 text-emerald-700" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] text-stone-500 uppercase font-black tracking-widest block">Impacto Semanal</span>
            <span className="text-2xl font-bold font-display text-stone-950">
              +{stats.totalImpacts.toLocaleString("es-AR")}
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Visualizaciones estimadas</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-xs hover:border-[#06434a]/30 transition-all duration-300">
          <div className="p-3 bg-stone-50 text-[#06434a] rounded-xl border border-stone-100">
            <DollarSign className="h-5 w-5 text-[#06434a]" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] text-stone-500 uppercase font-black tracking-widest block">Tarifa Promedio</span>
            <span className="text-sm font-bold font-display text-[#06434a] block mt-1">
              Tarifa bajo cotización
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Sujeto a plan de pauta</span>
          </div>
        </div>
      </div>

      {/* Main Filter & Action Dashboard bar */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 md:p-6 space-y-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-950 flex items-center gap-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-[#06434a]" aria-hidden="true" />
              Filtros Avanzados de Inventario
            </h3>
            <p className="text-stone-600 text-xs font-normal">
              Segmentá por plaza, categoría técnica o tipo de flujo de audiencia para armar tu plan a medida.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full lg:max-w-md">
            {/* Search Input (Premium layout, height comfy for touching) */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" aria-hidden="true" />
              <Input
                type="text"
                id="search-soportes"
                placeholder="Buscar por esquina o zona..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 text-xs focus-visible:ring-[#06434a] bg-stone-50/50 border-stone-200 focus:bg-white transition-all text-stone-900 rounded-xl"
                aria-label="Buscar soportes por esquina, zona o notas de ubicación"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all min-h-[20px] min-w-[20px]"
                  title="Limpiar búsqueda"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Mobile Filters Drawer Trigger (Touch-friendly 44px pill button) */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-stone-200 bg-white text-stone-800 font-bold text-xs hover:bg-stone-50 active:scale-98 transition-all min-w-[44px] cursor-pointer"
              aria-label="Abrir panel de filtros"
              aria-expanded={showMobileFilters}
            >
              <Filter className="h-4.5 w-4.5 text-[#06434a]" />
              <span className="hidden sm:inline">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-[#06434a] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters Selectors (Desktop layout, responsive grid that collapses in mobile drawer) */}
        <div className={`${showMobileFilters ? "block" : "hidden lg:grid"} grid-cols-1 md:grid-cols-3 gap-6 pt-1 pb-2`}>
          {/* Plaza Selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest block" id="label-plaza">Ciudad / Plaza</span>
            <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="label-plaza">
              {CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`h-11 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer min-w-[44px] flex items-center justify-center border ${
                    selectedCity === city 
                      ? "bg-[#06434a] text-white border-[#06434a] shadow-xs font-extrabold" 
                      : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                  aria-pressed={selectedCity === city}
                >
                  {city === "Todas" ? "Todas" : city}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría Selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest block" id="label-formato">Formato Físico / Digital</span>
            <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="label-formato">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategoria(cat)}
                  className={`h-11 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer min-w-[44px] flex items-center justify-center border ${
                    selectedCategoria === cat 
                      ? "bg-[#06434a] text-white border-[#06434a] shadow-xs font-extrabold" 
                      : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                  aria-pressed={selectedCategoria === cat}
                >
                  {cat === "Todas" ? "Todos" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tránsito Selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest block" id="label-transito">Tipo de Tránsito</span>
            <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="label-transito">
              {TIPOS.map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setSelectedTipo(tipo)}
                  className={`h-11 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer min-w-[44px] flex items-center justify-center border ${
                    selectedTipo === tipo 
                      ? "bg-[#06434a] text-white border-[#06434a] shadow-xs font-extrabold" 
                      : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                  aria-pressed={selectedTipo === tipo}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sorting Controller Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2 text-stone-600 font-semibold" role="toolbar" aria-label="Controles de ordenamiento">
            <span>Ordenar por:</span>
            <button
              type="button"
              onClick={() => toggleSort("impactos")}
              className={`h-9 px-3.5 rounded-xl font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                sortBy === "impactos" 
                  ? "bg-[#06434a]/10 text-[#06434a] border-[#06434a]/20 font-extrabold" 
                  : "bg-stone-50/50 hover:bg-stone-100 text-stone-700 border-transparent"
              }`}
              aria-label={`Ordenar por impactos semanales, orden ${sortBy === "impactos" && sortOrder === "asc" ? "ascendente" : "descendente"}`}
              aria-current={sortBy === "impactos" ? "true" : undefined}
            >
              <span>Impactos</span>
              <ArrowUpDown className="h-3 w-3 text-stone-500" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => toggleSort("nombre")}
              className={`h-9 px-3.5 rounded-xl font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                sortBy === "nombre" 
                  ? "bg-[#06434a]/10 text-[#06434a] border-[#06434a]/20 font-extrabold" 
                  : "bg-stone-50/50 hover:bg-stone-100 text-stone-700 border-transparent"
              }`}
              aria-label={`Ordenar por nombre alfabéticamente, orden ${sortBy === "nombre" && sortOrder === "asc" ? "ascendente" : "descendente"}`}
              aria-current={sortBy === "nombre" ? "true" : undefined}
            >
              <span>Nombre</span>
              <ArrowUpDown className="h-3 w-3 text-stone-500" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[#06434a] hover:text-[#0b5e67] font-bold text-xs hover:underline cursor-pointer min-h-[36px] px-2 flex items-center justify-center transition-all"
              >
                Limpiar filtros ({activeFiltersCount})
              </button>
            )}

            {selectedCity !== "Todas" && onNavigateToCityMap && (
              <button
                type="button"
                onClick={() => onNavigateToCityMap(selectedCity as any)}
                className="text-[#06434a] hover:text-[#0b5e67] font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer bg-stone-50 hover:bg-stone-100 px-3.5 py-2 rounded-xl border border-stone-200"
              >
                <MapPin className="h-3.5 w-3.5 text-stone-500" aria-hidden="true" />
                <span>Ver mapa satelital de {selectedCity}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid List */}
      {filteredAndSortedScreens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="region" aria-label="Resultados de soportes publicitarios">
          {filteredAndSortedScreens.map((screen) => (
            <div key={screen.id} className="h-full">
              <ScreenCard screen={screen} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed border-stone-200 rounded-3xl p-6" role="alert">
          <Tv className="h-12 w-12 text-stone-400 mx-auto mb-3" aria-hidden="true" />
          <h4 className="font-extrabold text-stone-950 text-base">No encontramos soportes que coincidan</h4>
          <p className="text-stone-600 text-xs max-w-sm mx-auto mt-1.5 leading-relaxed font-medium">
            Probá modificando los filtros de ciudad, formato o limpiando el cuadro de búsqueda para ver más opciones disponibles en nuestro catálogo.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-6 inline-flex items-center justify-center h-11 px-5 rounded-xl border border-stone-200 bg-white text-stone-850 text-xs font-bold hover:bg-stone-50 active:scale-98 transition-all min-w-[44px] cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      )}
    </div>
  );
};
