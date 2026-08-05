import React, { useState, useMemo } from "react";
import { useCms } from "./CmsContext";
import { ScreenCard } from "./ScreenCard";
import { DoohScreen } from "../types";
import { Search, MapPin, Tv, ArrowUpDown, Shield, SlidersHorizontal, Eye, DollarSign } from "lucide-react";
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

  return (
    <div className="space-y-8 font-sans">
      {/* Dynamic Inventory Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-stone-100 text-stone-700 rounded-xl">
            <Tv className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-black tracking-widest block">Soportes Activos</span>
            <span className="text-2xl font-bold font-display text-stone-900">{stats.totalCount}</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">En catálogo filtrado</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-emerald-50 text-[#06434a] rounded-xl">
            <Eye className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-black tracking-widest block">Impacto Semanal</span>
            <span className="text-2xl font-bold font-display text-stone-900">
              +{stats.totalImpacts.toLocaleString("es-AR")}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Visualizaciones estimadas</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-stone-100 text-[#06434a] rounded-xl">
            <DollarSign className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-black tracking-widest block">Tarifa Promedio</span>
            <span className="text-2xl font-bold font-display text-stone-900">
              ${stats.averagePrice.toLocaleString("es-AR")}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">ARS por semana</span>
          </div>
        </div>
      </div>

      {/* Main Filter & Action Dashboard bar */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 space-y-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-[#06434a]" aria-hidden="true" />
              Filtros Avanzados de Inventario
            </h3>
            <p className="text-stone-500 text-xs font-normal">
              Segmentá por plaza, categoría técnica o tipo de flujo de audiencia para armar tu plan a medida.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" aria-hidden="true" />
            <Input
              type="text"
              id="search-soportes"
              placeholder="Buscar por esquina o zona..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs focus-visible:ring-[#06434a]"
              aria-label="Buscar soportes por esquina, zona o notas de ubicación"
            />
          </div>
        </div>

        {/* Filters Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Plaza Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block" id="label-plaza">Ciudad / Plaza</span>
            <div className="flex flex-wrap gap-1" role="group" aria-labelledby="label-plaza">
              {CITIES.map((city) => (
                <Button
                  key={city}
                  type="button"
                  variant={selectedCity === city ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCity(city)}
                  className={`h-8 text-xs font-bold ${
                    selectedCity === city ? "bg-[#06434a] hover:bg-[#0b5e67] text-white" : "border-stone-200 hover:bg-stone-50"
                  }`}
                  aria-pressed={selectedCity === city}
                >
                  {city === "Todas" ? "Todas" : city}
                </Button>
              ))}
            </div>
          </div>

          {/* Categoría Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block" id="label-formato">Formato Físico / Digital</span>
            <div className="flex flex-wrap gap-1" role="group" aria-labelledby="label-formato">
              {CATEGORIAS.map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  variant={selectedCategoria === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategoria(cat)}
                  className={`h-8 text-xs font-bold ${
                    selectedCategoria === cat ? "bg-[#06434a] hover:bg-[#0b5e67] text-white" : "border-stone-200 hover:bg-stone-50"
                  }`}
                  aria-pressed={selectedCategoria === cat}
                >
                  {cat === "Todas" ? "Todos" : cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Tránsito Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block" id="label-transito">Tipo de Tránsito</span>
            <div className="flex flex-wrap gap-1" role="group" aria-labelledby="label-transito">
              {TIPOS.map((tipo) => (
                <Button
                  key={tipo}
                  type="button"
                  variant={selectedTipo === tipo ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTipo(tipo)}
                  className={`h-8 text-xs font-bold ${
                    selectedTipo === tipo ? "bg-[#06434a] hover:bg-[#0b5e67] text-white" : "border-stone-200 hover:bg-stone-50"
                  }`}
                  aria-pressed={selectedTipo === tipo}
                >
                  {tipo}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Sorting Controller Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2 text-stone-500 font-semibold" role="toolbar" aria-label="Controles de ordenamiento">
            <span>Ordenar por:</span>
            <button
              type="button"
              onClick={() => toggleSort("impactos")}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors flex items-center gap-1 ${
                sortBy === "impactos" ? "bg-stone-100 text-[#06434a]" : "hover:text-stone-900"
              }`}
              aria-label={`Ordenar por impactos semanales, orden ${sortBy === "impactos" && sortOrder === "asc" ? "ascendente" : "descendente"}`}
              aria-current={sortBy === "impactos" ? "true" : undefined}
            >
              <span>Impactos</span>
              <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => toggleSort("precio")}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors flex items-center gap-1 ${
                sortBy === "precio" ? "bg-stone-100 text-[#06434a]" : "hover:text-stone-900"
              }`}
              aria-label={`Ordenar por tarifa semanal, orden ${sortBy === "precio" && sortOrder === "asc" ? "ascendente" : "descendente"}`}
              aria-current={sortBy === "precio" ? "true" : undefined}
            >
              <span>Tarifa</span>
              <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => toggleSort("nombre")}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors flex items-center gap-1 ${
                sortBy === "nombre" ? "bg-stone-100 text-[#06434a]" : "hover:text-stone-900"
              }`}
              aria-label={`Ordenar por nombre alfabéticamente, orden ${sortBy === "nombre" && sortOrder === "asc" ? "ascendente" : "descendente"}`}
              aria-current={sortBy === "nombre" ? "true" : undefined}
            >
              <span>Nombre</span>
              <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

          {selectedCity !== "Todas" && onNavigateToCityMap && (
            <button
              type="button"
              onClick={() => onNavigateToCityMap(selectedCity as any)}
              className="text-[#06434a] hover:text-[#0b5e67] font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Ver mapa satelital de {selectedCity}</span>
            </button>
          )}
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
          <Tv className="h-12 w-12 text-stone-300 mx-auto mb-3" aria-hidden="true" />
          <h4 className="font-extrabold text-stone-850 text-sm">No encontramos soportes que coincidan</h4>
          <p className="text-stone-500 text-xs max-w-sm mx-auto mt-1.5 leading-relaxed font-medium">
            Probá modificando los filtros de ciudad, formato o limpiando el cuadro de búsqueda para ver más opciones disponibles en nuestro catálogo.
          </p>
          <Button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCity("Todas");
              setSelectedTipo("Todos");
              setSelectedCategoria("Todas");
            }}
            variant="outline"
            className="mt-5 text-xs font-bold border-stone-200 hover:bg-stone-50"
          >
            Restablecer Filtros
          </Button>
        </div>
      )}
    </div>
  );
};
