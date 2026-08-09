import React from "react";
import * as LucideIcons from "lucide-react";
import { DoohScreen } from "../../types";
import { getScreenAvailability } from "../../utils/availability";
import { useCms } from "../CmsContext";

interface StitchFeaturedLocationsProps {
  screens: DoohScreen[];
  selectedCity: "Mendoza" | "Buenos Aires";
  cart: string[];
  toggleCart: (id: string) => void;
  onOpenDetail: (screen: DoohScreen) => void;
  onLocate: (screen: DoohScreen) => void;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
];

const imageById: Record<string, string> = {
  "sc-01": FALLBACK_IMAGES[0],
  "sc-02": FALLBACK_IMAGES[1],
  "sc-03": FALLBACK_IMAGES[2],
  "sc-11": FALLBACK_IMAGES[3],
  "ba-01": FALLBACK_IMAGES[0],
  "ba-02": FALLBACK_IMAGES[1],
  "ba-03": FALLBACK_IMAGES[2],
};

export const StitchFeaturedLocations: React.FC<StitchFeaturedLocationsProps> = ({
  screens,
  selectedCity,
  cart,
  toggleCart,
  onOpenDetail,
  onLocate,
}) => {
  const { occupancyMatrix } = useCms();

  const featured = screens
    .filter((screen) => screen.ciudad === selectedCity)
    .filter((screen) => screen.status === "Activo" || screen.status === "Disponible")
    .slice(0, 4);

  return (
    <section
      id="ubicaciones-destacadas"
      aria-labelledby="ubicaciones-destacadas-title"
      className="rounded-2xl border border-[#bccbb9] bg-[#f3fcef] overflow-hidden"
    >
      <div className="px-4 sm:px-5 md:px-7 pt-6 sm:pt-7 md:pt-9 pb-5 sm:pb-6">
        <h2
          id="ubicaciones-destacadas-title"
          className="text-[28px] sm:text-3xl md:text-4xl leading-tight font-bold tracking-tight text-[#006e2f]"
        >
          Ubicaciones Destacadas
        </h2>
        <p className="mt-2 text-base md:text-lg text-[#3d4a3d]">
          Nuestra selección premium de soportes de alto impacto.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 px-3 sm:px-4 md:px-6 pb-6 sm:pb-8">
        {featured.map((screen, index) => {
          const availability = getScreenAvailability(screen, occupancyMatrix);
          const available = availability.status === "available";
          const selected = cart.includes(screen.id);
          const image = imageById[screen.id] || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

          return (
            <article
              key={screen.id}
              className="overflow-hidden rounded-xl border border-[#bccbb9] bg-white shadow-sm"
            >
              <div className="relative aspect-[1.72/1] overflow-hidden bg-[#e2ebde]">
                <img
                  src={image}
                  alt={screen.nombre}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
                    available
                      ? "bg-[#22c55e] text-[#064e1d]"
                      : "bg-[#dfe7dd] text-[#596458]"
                  }`}
                >
                  {available ? "Disponible" : "En reserva"}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold leading-6 text-[#161d16]">
                  {screen.nombre}
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-[#3d4a3d]">
                  <LucideIcons.MapPin className="h-4 w-4 shrink-0" />
                  <span>
                    {screen.zona}
                    {screen.ciudad ? `, ${screen.ciudad}` : ""}
                  </span>
                </p>

                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    disabled={!available}
                    onClick={() => available && toggleCart(screen.id)}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                      selected
                        ? "border-[#006e2f] bg-[#006e2f] text-white"
                        : available
                        ? "border-[#006e2f] bg-white text-[#006e2f] hover:bg-[#edf6ea]"
                        : "cursor-not-allowed border-[#d6dfd3] bg-[#eef2ed] text-[#7a8378]"
                    }`}
                  >
                    {selected ? (
                      <LucideIcons.Check className="h-4 w-4" />
                    ) : (
                      <LucideIcons.Plus className="h-4 w-4" />
                    )}
                    {selected
                      ? "Seleccionado"
                      : available
                      ? "Seleccionar para cotizar"
                      : "No disponible"}
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenDetail(screen)}
                    className="flex w-full items-center justify-center rounded-lg bg-[#22c55e] px-3 py-2.5 text-sm font-semibold text-[#063b18] transition-colors hover:bg-[#16b84f]"
                  >
                    Ver detalle
                  </button>

                  <button
                    type="button"
                    onClick={() => onLocate(screen)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#bccbb9] bg-white px-3 py-2.5 text-sm font-semibold text-[#263126] transition-colors hover:bg-[#f1f6ef]"
                  >
                    <LucideIcons.Map className="h-4 w-4" />
                    Ubicar en el mapa
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
