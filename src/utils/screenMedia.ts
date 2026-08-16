import { DoohScreen, ScreenMedia } from "../types";

type NormalizedMediaItem = {
  id: string;
  screenId: string;
  type: "image" | "video" | "drone";
  url: string;
  title?: string;
  sizeBytes?: number;
  isHero?: boolean;
  createdAt?: string;
  posterUrl?: string;
};

/**
 * Represents the minimal data source required to process screen media.
 * This decouples utility functions from the full DoohScreen model.
 */
type ScreenMediaSource = {
  id: string;
  video?: string | null;
  media?: ScreenMedia[] | null;
};

export const FALLBACK_STREET_PHOTOS = [
  "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
];

export const MAX_FEATURED_LOCATIONS = 6;

export function sortFeaturedScreens(screens: DoohScreen[], limit = MAX_FEATURED_LOCATIONS) {
  return [...screens]
    .sort((a, b) => {
      const aFeatured = a.isFeatured ? 1 : 0;
      const bFeatured = b.isFeatured ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;

      const aOrder = typeof a.featuredOrder === "number" ? a.featuredOrder : Number.POSITIVE_INFINITY;
      const bOrder = typeof b.featuredOrder === "number" ? b.featuredOrder : Number.POSITIVE_INFINITY;
      if (aOrder !== bOrder) return aOrder - bOrder;

      return a.nombre.localeCompare(b.nombre, "es");
    })
    .slice(0, limit);
}

export function normalizeScreenMedia(screen: ScreenMediaSource) {
  const normalized: NormalizedMediaItem[] = Array.isArray(screen.media)
    ? screen.media
        .filter(Boolean)
        .map((asset) => ({
          id: asset.id || `${screen.id}-${asset.type || "media"}-${asset.url}`,
          screenId: asset.screenId || screen.id,
          type: asset.type || "image",
          url: asset.url,
          title: asset.title || undefined,
          sizeBytes: asset.sizeBytes ?? undefined,
          isHero: Boolean(asset.isHero),
          createdAt: asset.createdAt,
          posterUrl: asset.posterUrl || undefined,
        }))
    : [];

  if (screen.video && !normalized.some((asset) => asset.type === "video" && asset.url === screen.video)) {
    normalized.unshift({
      id: `${screen.id}-legacy-video`,
      screenId: screen.id,
      type: "video",
      url: screen.video,
      title: "Video de referencia",
      isHero: true,
      sizeBytes: undefined,
      createdAt: undefined,
      posterUrl: undefined,
    });
  }

  return normalized;
}

export function getHeroMedia(screen: ScreenMediaSource) {
  const media = normalizeScreenMedia(screen);
  return media.find((asset) => asset.isHero) || media[0] || null;
}

export function getGalleryMedia(screen: ScreenMediaSource) {
  return normalizeScreenMedia(screen);
}
