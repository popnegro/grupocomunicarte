import React, { useState, useMemo } from "react";
import { useCms } from "./CmsContext";
import { DoohScreen } from "../types";
import { Search, MapPin, Tv, Eye, SlidersHorizontal, Layers, Crop, Cpu } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "../design-system";

interface SoportesInventoryProps {
  initialCity?: string;
  initialTipo?: string;
  initialCategoria?: string;
  onNavigateToCityMap?: (city: string) => void;
}

// Fixed constant filters for streamlined browsing
const CITIES = ["Todas", "Mendoza", "Buenos Aires"] as const;

// Preset typography configurations to fulfill the 3 typography options requirement
type TypographyOption = "sans" | "serif" | "mono";

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

  // Active typography preset
  const [activeTypography, setActiveTypography] = useState<TypographyOption>("sans");

  // Filter logic: keeping the system flexible but displaying only requested properties
  const filteredScreens = useMemo(() => {
    let result = [...screens];

    // Filter by City
    if (selectedCity !== "Todas") {
      result = result.filter((s) => s.ciudad === selectedCity);
    }

    // Filter by Search Query (name or zone)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.nombre.toLowerCase().includes(q) ||
          s.zona.toLowerCase().includes(q)
      );
    }

    return result;
  }, [screens, searchQuery, selectedCity]);

  // Map typography keys to specific CSS styles
  const typoStyles = useMemo(() => {
    switch (activeTypography) {
      case "serif":
        return {
          title: "font-serif font-bold text-stone-950 tracking-tight text-base sm:text-lg",
          text: "font-serif text-[12.5px] text-stone-600 leading-normal",
          label: "font-serif text-[11px] text-stone-400 font-semibold tracking-wider",
          badge: "font-serif text-[10px] uppercase font-bold",
          wrapper: "font-serif"
        };
      case "mono":
        return {
          title: "font-mono font-bold text-stone-950 tracking-tight text-xs uppercase",
          text: "font-mono text-[11px] text-stone-600 leading-normal",
          label: "font-mono text-[9px] text-stone-400 font-semibold tracking-widest uppercase",
          badge: "font-mono text-[9px] uppercase font-bold tracking-widest",
          wrapper: "font-mono"
        };
      default: // sans
        return {
          title: "font-sans font-extrabold text-stone-900 tracking-tight text-sm sm:text-base",
          text: "font-sans text-xs text-stone-500 font-medium leading-relaxed",
          label: "font-sans text-[10px] text-stone-400 font-extrabold tracking-wider uppercase",
          badge: "font-sans text-[9px] uppercase font-black tracking-wider",
          wrapper: "font-sans"
        };
    }
  }, [activeTypography]);

  // Helper mapping to get visual context photos for each screen
  const getScreenPhoto = (screen: DoohScreen) => {
    const photoMap: Record<string, string> = {
      "sc-01": "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80", // Sarmiento & 9 de Julio (Mza)
      "sc-02": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80", // Arístides (Mza)
      "sc-03": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80", // Palmares (Mza)
      "sc-11": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80", // Mobile Screen (Mza)
      "ba-01": "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80", // Corrientes (BA)
      "ba-02": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80", // Libertador (BA)
      "ba-03": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80", // Puerto Madero (BA)
      "ba-04": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80", // Cabildo (BA)
    };

    return photoMap[screen.id] || "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80";
  };

  // Helper mapping to determine Resolution based on format
  const getScreenResolution = (screen: DoohScreen) => {
    switch (screen.tipo) {
      case "Peatonal":
        return "1080 x 1920 (P2.5 Ultra-HD)";
      case "Vehicular":
        return "1920 x 1080 (P4.0 Giant LED)";
      case "Mixto":
        return "1440 x 1080 (P3.0 Professional)";
      default:
        return "1280 x 720 (P3.5 Smart Outdoor)";
    }
  };

  return (
    <div className={`space-y-6 ${typoStyles.wrapper}`}>
      
      {/* 1. COMPACT FILTER TOOLBAR & TYPOGRAPHY SELECTORS */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 space-y-4 shadow-xs text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wide">
              <SlidersHorizontal className="h-4 w-4 text-[#06434a]" />
              Filtros e Identidad Typográfica
            </h3>
            <p className="text-stone-500 text-[11px] font-medium leading-none">
              Simplifica y previsualiza el inventario premium bajo diferentes configuraciones estéticas.
            </p>
          </div>

          {/* THREE TYPOGRAPHY OPTIONS (Pristine Sans-Serif, Elegant Editorial Display, Structured Tech Monospace) */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 shadow-2xs select-none">
            <button
              type="button"
              onClick={() => setActiveTypography("sans")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                activeTypography === "sans"
                  ? "bg-white text-stone-900 shadow-2xs font-black"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Sans-Serif
            </button>
            <button
              type="button"
              onClick={() => setActiveTypography("serif")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                activeTypography === "serif"
                  ? "bg-white text-stone-900 shadow-2xs font-black"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Editorial Serif
            </button>
            <button
              type="button"
              onClick={() => setActiveTypography("mono")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                activeTypography === "mono"
                  ? "bg-white text-stone-900 shadow-2xs font-black"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Tech Mono
            </button>
          </div>
        </div>

        {/* Dynamic Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-stone-100">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <Input
              type="text"
              placeholder="Buscar por esquina o zona..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs focus-visible:ring-[#06434a] border-stone-200"
            />
          </div>

          {/* Plaza Selector */}
          <div className="flex gap-1.5">
            {CITIES.map((city) => (
              <Button
                key={city}
                type="button"
                variant={selectedCity === city ? "primary" : "secondary"}
                size="sm"
                onClick={() => setSelectedCity(city)}
                className={`flex-1 h-9 text-[10px] font-bold tracking-wider ${
                  selectedCity === city ? "bg-[#06434a] text-white" : "border-stone-200 text-stone-600 bg-white"
                }`}
              >
                {city === "Todas" ? "Todas las Plazas" : city}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SIMPLIFIED GRID LIST - SHOWING EXACTLY THE REQUESTED FIELDS */}
      {filteredScreens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredScreens.map((screen) => {
            const isAvailable = screen.status === "Disponible" || screen.status === "Activo" || screen.status === "available";
            const imageUrl = getScreenPhoto(screen);

            return (
              <div
                key={screen.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-sm hover:border-[#06434a]/30 transition-all duration-300 flex flex-col text-left"
              >
                {/* Image Section */}
                <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
                  <img
                    src={imageUrl}
                    alt={screen.nombre}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover select-none"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border shadow-xs ${
                        isAvailable
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200/50"
                          : "bg-stone-100 text-stone-500 border-stone-200"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${isAvailable ? "bg-emerald-500" : "bg-stone-400"}`} />
                      {isAvailable ? "Disponible" : "Reservado"}
                    </span>
                  </div>
                </div>

                {/* Content Section - Displaying exactly requested attributes */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    {/* Name */}
                    <h4 className={`${typoStyles.title} line-clamp-1`}>
                      {screen.nombre}
                    </h4>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                      <span className={typoStyles.text}>{screen.zona}, {screen.ciudad || "Mendoza"}</span>
                    </div>
                  </div>

                  {/* Attributes Details Row (Format, Resolution, Dimensions) */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100">
                    {/* Format */}
                    <div className="space-y-0.5">
                      <span className={typoStyles.label}>Formato</span>
                      <span className={`block font-bold text-stone-800 truncate ${typoStyles.text}`}>
                        {screen.tipo}
                      </span>
                    </div>

                    {/* Resolution */}
                    <div className="space-y-0.5 border-l border-stone-150 pl-2">
                      <span className={typoStyles.label}>Resolución</span>
                      <span className={`block font-bold text-stone-800 truncate ${typoStyles.text}`}>
                        {getScreenResolution(screen)}
                      </span>
                    </div>

                    {/* Dimensions */}
                    <div className="space-y-0.5 border-l border-stone-150 pl-2">
                      <span className={typoStyles.label}>Medidas</span>
                      <span className={`block font-bold text-stone-800 truncate ${typoStyles.text}`}>
                        {screen.dimensiones || "4.0m x 3.0m"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed border-stone-200 rounded-2xl p-6">
          <Tv className="h-12 w-12 text-stone-300 mx-auto mb-3" />
          <h4 className="font-extrabold text-stone-800 text-sm">No encontramos soportes</h4>
          <p className="text-stone-500 text-xs max-w-sm mx-auto mt-1 leading-relaxed">
            Intenta limpiar los filtros o cambiar la plaza seleccionada para encontrar soportes disponibles.
          </p>
          <Button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCity("Todas");
            }}
            variant="outline"
            className="mt-4 text-xs font-bold border-stone-200 hover:bg-stone-50"
          >
            Restablecer Filtros
          </Button>
        </div>
      )}
    </div>
  );
};
