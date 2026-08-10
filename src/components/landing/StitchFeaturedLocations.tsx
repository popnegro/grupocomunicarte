import React from "react";
import * as LucideIcons from "lucide-react";
import { DoohScreen } from "../../types";
import { getScreenAvailability } from "../../utils/availability";
import { useCms } from "../CmsContext";
import { FALLBACK_STREET_PHOTOS, getGalleryMedia, sortFeaturedScreens, MAX_FEATURED_LOCATIONS } from "../../utils/screenMedia";

interface StitchFeaturedLocationsProps {
  screens: DoohScreen[];
  selectedCity: "Mendoza" | "Buenos Aires";
  cart: string[];
  toggleCart: (id: string) => void;
  onOpenDetail: (screen: DoohScreen) => void;
  onLocate: (screen: DoohScreen) => void;
}

const FeaturedLocationCard: React.FC<{
  screen: DoohScreen;
  index: number;
  available: boolean;
  selected: boolean;
  onToggleCart: (id: string) => void;
  onOpenDetail: (screen: DoohScreen) => void;
  onLocate: (screen: DoohScreen) => void;
}> = ({ screen, index, available, selected, onToggleCart, onOpenDetail, onLocate }) => {
  const gallery = getGalleryMedia(screen);
  const images = gallery.filter((asset) => asset.type !== "video");
  const video = gallery.find((asset) => asset.type === "video");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [showVideo, setShowVideo] = React.useState(false);

  const currentImage = images[activeIndex] || images[0] || null;
  const fallbackImage = FALLBACK_STREET_PHOTOS[index % FALLBACK_STREET_PHOTOS.length];
  const imageSrc = currentImage?.posterUrl || currentImage?.url || fallbackImage;

  return (
    <article className="overflow-hidden rounded-xl border border-[#bccbb9] bg-white shadow-sm">
      <div className="relative aspect-[1.72/1] overflow-hidden bg-[#e2ebde]">
        {showVideo && video ? (
          <video
            src={video.url}
            poster={imageSrc}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={imageSrc}
            alt={screen.nombre}
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}

        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
            available
              ? "bg-[#22c55e] text-[#064e1d]"
              : "bg-[#dfe7dd] text-[#596458]"
          }`}
        >
          {available ? "Disponible" : "En reserva"}
        </span>

        {screen.isFeatured && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#006e2f] shadow-sm">
            ⭐ #{screen.featuredOrder ?? index + 1}
          </span>
        )}

        {video && !showVideo && (
          <button
            type="button"
            onClick={() => setShowVideo(true)}
            className="absolute inset-x-0 bottom-3 mx-auto flex w-fit items-center gap-2 rounded-full bg-black/75 px-3 py-2 text-[11px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-black"
          >
            <LucideIcons.Play className="h-3.5 w-3.5 fill-white" />
            Ver video
          </button>
        )}

        {showVideo && video && (
          <button
            type="button"
            onClick={() => setShowVideo(false)}
            className="absolute right-3 bottom-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#161d16] shadow-sm"
          >
            Ver fotos
          </button>
        )}

        {!showVideo && images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={`${screen.id}-thumb-${idx}`}
                type="button"
                aria-label={`Ver imagen ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 w-2 rounded-full transition-all ${
                  activeIndex === idx ? "w-4 bg-[#006e2f]" : "bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
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
            onClick={() => available && onToggleCart(screen.id)}
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

  const cityScreens = screens.filter((screen) => screen.ciudad === selectedCity);
  const featured = sortFeaturedScreens(
    cityScreens.filter((screen) => screen.isFeatured),
    MAX_FEATURED_LOCATIONS
  );
  const featuredCards = featured.length > 0
    ? featured
    : sortFeaturedScreens(
        cityScreens.filter((screen) => screen.status === "Activo" || screen.status === "Disponible"),
        MAX_FEATURED_LOCATIONS
      );

  return (
    <section
      id="ubicaciones-destacadas"
      aria-labelledby="ubicaciones-destacadas-title"
      className="rounded-2xl border border-[#bccbb9] bg-[#f3fcef] overflow-hidden"
    >
      <div className="px-4 sm:px-5 md:px-7 pt-6 sm:pt-7 md:pt-9 pb-5 sm:pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2
              id="ubicaciones-destacadas-title"
              className="text-[28px] sm:text-3xl md:text-4xl leading-tight font-bold tracking-tight text-[#006e2f]"
            >
              Ubicaciones Destacadas
            </h2>
            <p className="text-base md:text-lg text-[#3d4a3d]">
              Nuestra selección premium de soportes de alto impacto.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#cfe0c9] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#4d5c4b] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
            {featuredCards.length} cards
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-3 sm:grid-cols-2 sm:gap-5 sm:px-4 md:px-6 lg:gap-6 xl:grid-cols-3 pb-6 sm:pb-8">
        {featuredCards.map((screen, index) => {
          const availability = getScreenAvailability(screen, occupancyMatrix);
          const available = availability.status === "available";
          const selected = cart.includes(screen.id);

          return (
            <FeaturedLocationCard
              key={screen.id}
              screen={screen}
              index={index}
              available={available}
              selected={selected}
              onToggleCart={toggleCart}
              onOpenDetail={onOpenDetail}
              onLocate={onLocate}
            />
          );
        })}
      </div>
    </section>
  );
};
