import React, { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import { DoohScreen } from "../../types";
import { InteractiveMap } from "../InteractiveMap";
import { getScreenAvailability } from "../../utils/availability";
import { useCms } from "../CmsContext";

interface StitchExplorerPanelProps {
  screens: DoohScreen[];
  selectedCity: "Mendoza" | "Buenos Aires";
  setSelectedCity: (city: "Mendoza" | "Buenos Aires") => void;
  cart: string[];
  toggleCart: (id: string) => void;
  onOpenDetail: (screen: DoohScreen) => void;
  focusScreenId?: string | null;
}

export const StitchExplorerPanel: React.FC<StitchExplorerPanelProps> = ({
  screens,
  selectedCity,
  setSelectedCity,
  cart,
  toggleCart,
  onOpenDetail,
  focusScreenId = null,
}) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const { occupancyMatrix } = useCms();

  const cityScreens = useMemo(
    () => screens.filter((screen) => screen.ciudad === selectedCity),
    [screens, selectedCity]
  );

  const filteredScreens = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return cityScreens.filter((screen) => {
      const matchesCategory = category === "Todos" || screen.categoria === category;
      const matchesQuery =
        !normalized ||
        screen.nombre.toLowerCase().includes(normalized) ||
        screen.zona.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [cityScreens, query, category]);

  const handleToggle = (screen: DoohScreen) => {
    const availability = getScreenAvailability(screen, occupancyMatrix);
    if (availability.status !== "available") return;
    toggleCart(screen.id);
  };

  return (
    <section id="catalog-explorer-section" className="rounded-2xl border border-[#bccbb9] bg-[#f3fcef] overflow-hidden">
      <div className="px-4 sm:px-5 md:px-7 pt-6 sm:pt-7 pb-4 sm:pb-5">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#3d4a3d]">
            Explorador de Soportes
          </span>
          <h2 className="text-[26px] sm:text-2xl md:text-[32px] leading-9 sm:leading-10 font-semibold text-[#161d16]">
            Encontrá el soporte ideal para tu campaña
          </h2>
          <p className="text-sm md:text-base leading-6 text-[#3d4a3d]">
            Visualizá nuestra red de soportes en tiempo real y seleccioná ubicaciones para tu Media Kit.
          </p>
        </div>

        <div className="mt-4 sm:mt-5 flex flex-col md:flex-row md:items-center gap-3">
          <div className="inline-flex w-full sm:w-auto rounded-full border border-[#bccbb9] bg-white p-1 self-start">
            {(["Mendoza", "Buenos Aires"] as const).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  selectedCity === city
                    ? "bg-[#006e2f] text-white"
                    : "text-[#3d4a3d] hover:bg-[#edf6ea]"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="relative">
              <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7b6c]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar soporte o ubicación"
                className="w-full rounded-lg border border-[#bccbb9] bg-white pl-9 pr-3 py-2.5 text-sm text-[#161d16] outline-none focus:border-[#006e2f]"
              />
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-lg border border-[#bccbb9] bg-white px-3 py-2.5 text-sm text-[#3d4a3d] outline-none focus:border-[#006e2f]"
            >
              <option value="Todos">Todos los formatos</option>
              <option value="Tradicionales">Tradicionales</option>
              <option value="Pantallas LED">Pantallas LED</option>
              <option value="LED Móvil">LED Móvil</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[230px_minmax(0,1fr)] min-h-[520px] lg:min-h-[430px] border-t border-[#bccbb9]">
        <aside className="bg-[#edf6ea] border-b lg:border-b-0 lg:border-r border-[#bccbb9] p-3 space-y-2 max-h-[420px] lg:max-h-none overflow-y-auto">
          {filteredScreens.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#bccbb9] bg-white/70 p-5 text-center">
              <p className="text-xs font-medium text-[#3d4a3d]">No encontramos soportes.</p>
            </div>
          ) : (
            filteredScreens.map((screen) => {
              const availability = getScreenAvailability(screen, occupancyMatrix);
              const isInCart = cart.includes(screen.id);
              const available = availability.status === "available";
              return (
                <article
                  key={screen.id}
                  className={`rounded-lg border bg-white p-3 transition-colors ${
                    isInCart
                      ? "border-[#006e2f] ring-1 ring-[#006e2f]/10"
                      : "border-[#bccbb9] hover:border-[#6d7b6c]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onOpenDetail(screen)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-[#161d16]">{screen.nombre}</span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${
                          available
                            ? "bg-[#e8f6eb] text-[#006e2f]"
                            : "bg-[#e2ebde] text-[#6d7b6c]"
                        }`}
                      >
                        {available ? "Disponible" : "En reserva"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#3d4a3d]">
                      {screen.zona} · {screen.tipo}
                    </p>
                  </button>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(screen)}
                      className="text-xs font-semibold text-[#006e2f] hover:underline"
                    >
                      Ver detalle
                    </button>
                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => handleToggle(screen)}
                      className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        isInCart
                          ? "bg-[#006e2f] text-white"
                          : available
                          ? "border border-[#006e2f] text-[#006e2f] hover:bg-[#006e2f] hover:text-white"
                          : "cursor-not-allowed bg-[#e2ebde] text-[#6d7b6c]"
                      }`}
                    >
                      {isInCart ? "Seleccionado" : available ? "Seleccionar" : "No disponible"}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </aside>

        <div className="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[430px] bg-[#e8f0e4]">
          <InteractiveMap
            screens={cityScreens}
            selectedScreenId={focusScreenId}
            onSelectScreen={(id) => {
              const selected = cityScreens.find((screen) => screen.id === id);
              if (selected) onOpenDetail(selected);
            }}
          />
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 rounded-lg border border-[#bccbb9] bg-white/90 px-3 py-2 backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#3d4a3d]">
              {filteredScreens.length} soportes visibles
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
