import React, { useState, useMemo } from "react";
import { useCms } from "./CmsContext";
import { ScreenCard } from "./ScreenCard";
import { DoohScreen } from "../types";
import { Search, MapPin, Tv, ArrowUpDown, Shield, SlidersHorizontal, Eye, DollarSign } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { useNavigate } from "react-router-dom";

interface SoportesInventoryProps {
  initialCity?: string;
}

export const SoportesInventory: React.FC<SoportesInventoryProps> = ({
  initialCity,
}) => {
  const navigate = useNavigate();
  const { screens } = useCms();

  // Local filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>(initialCity || "Todas");
  const [selectedTipo, setSelectedTipo] = useState<string>("Todos");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("Todas");
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

  const cities = ["Todas", "Mendoza", "Buenos Aires"];
  const tipos = ["Todos", "Peatonal", "Vehicular", "Mixto", "Móvil"];
  const categorias = ["Todas", "Pantallas LED", "Tradicionales", "LED Móvil"];

  return (
    <div className="space-y-8 font-sans">
      {/* Dynamic Inventory Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-stone-100 text-stone-700 rounded-xl">
            <Tv className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-black tracking-widest block">Soportes Activos</span>
            <span className="text-2xl font-bold font-display text-stone-900">{stats.totalCount}</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">En catálogo filtrado</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-emerald-50 text-[#06434a] rounded-xl">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-black tracking-widest block">Impacto Semanal</span>
            <span className="text-2xl font-bold font-display text-stone-900">
              +{stats.totalImpacts.toLocaleString("es-AR")}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Visualizaciones estimadas</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-stone-100 text-[#06434a] rounded-xl">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-black tracking-widest block">Tarifa Promedio</span>
            <span className="text-2xl font-bold font-display text-stone-900">
              ${stats.averagePrice.toLocaleString("es-AR")}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">ARS por semana</span>
          </div>
        </Card>
      </div>

      {/* Main Filter & Action Dashboard bar */}
      <Card className="p-6 space-y-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-[#06434a]" />
              Filtros Avanzados de Inventario
            </h3>
            <p className="text-stone-500 text-xs font-normal">
              Segmentá por plaza, categoría técnica o tipo de flujo de audiencia para armar tu plan a medida.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <Input
              type="text"
              placeholder="Buscar por esquina o zona..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs focus-visible:ring-[#06434a]"
            />
          </div>
        </div>

        {/* Filters Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Plaza Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Ciudad / Plaza</label>
            <div className="flex flex-wrap gap-1">
              {cities.map((city) => (
                <Button
                  key={city}
                  variant={selectedCity === city ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCity(city)}
                  className={`h-8 text-xs font-bold ${
                    selectedCity === city ? "bg-[#06434a] hover:bg-[#0b5e67] text-white" : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {city === "Todas" ? "Todas" : city}
                </Button>
              ))}
            </div>
          </div>

          {/* Categoría Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Formato Físico / Digital</label>
            <div className="flex flex-wrap gap-1">
              {categorias.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategoria === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategoria(cat)}
                  className={`h-8 text-xs font-bold ${
                    selectedCategoria === cat ? "bg-[#06434a] hover:bg-[#0b5e67] text-white" : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {cat === "Todas" ? "Todos" : cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Tránsito Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Tipo de Tránsito</label>
            <div className="flex flex-wrap gap-1">
              {tipos.map((tipo) => (
                <Button
                  key={tipo}
                  variant={selectedTipo === tipo ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTipo(tipo)}
                  className={`h-8 text-xs font-bold ${
                    selectedTipo === tipo ? "bg-[#06434a] hover:bg-[#0b5e67] text-white" : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {tipo}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Sorting Controller Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2 text-stone-500 font-semibold">
            <span>Ordenar por:</span>
            <button
              onClick={() => toggleSort("impactos")}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors flex items-center gap-1 ${
                sortBy === "impactos" ? "bg-stone-100 text-[#06434a]" : "hover:text-stone-900"
              }`}
            >
              <span>Impactos</span>
              <ArrowUpDown className="h-3 w-3" />
            </button>
            <button
              onClick={() => toggleSort("precio")}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors flex items-center gap-1 ${
                sortBy === "precio" ? "bg-stone-100 text-[#06434a]" : "hover:text-stone-900"
              }`}
            >
              <span>Tarifa</span>
              <ArrowUpDown className="h-3 w-3" />
            </button>
            <button
              onClick={() => toggleSort("nombre")}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors flex items-center gap-1 ${
                sortBy === "nombre" ? "bg-stone-100 text-[#06434a]" : "hover:text-stone-900"
              }`}
            >
              <span>Nombre</span>
              <ArrowUpDown className="h-3 w-3" />
            </button>
          </div>

          {selectedCity !== "Todas" && (
            <button
              onClick={() => navigate(`/ubicaciones/${selectedCity.toLowerCase()}`)}
              className="text-[#06434a] hover:text-[#0b5e67] font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Ver mapa satelital de {selectedCity}</span>
            </button>
          )}
        </div>
      </Card>

      {/* Grid List */}
      {filteredAndSortedScreens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAndSortedScreens.map((screen) => (
            <div key={screen.id} className="h-full">
              <ScreenCard screen={screen} />
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 border-dashed p-6">
          <Tv className="h-12 w-12 text-stone-300 mx-auto mb-3" />
          <h4 className="font-extrabold text-stone-850 text-sm">No encontramos soportes que coincidan</h4>
          <p className="text-stone-500 text-xs max-w-sm mx-auto mt-1.5 leading-relaxed font-medium">
            Probá modificando los filtros de ciudad, formato o limpiando el cuadro de búsqueda para ver más opciones disponibles en nuestro catálogo.
          </p>
          <Button
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
      </Card>
    </div>
  );
};
