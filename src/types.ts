/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HeroContent { badge: string; title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string; imageUrl?: string; }
export interface BenefitItem { id: string; title: string; description: string; icon: string; }
export interface FaqItem { question: string; answer: string; }
export interface SeoConfig { metaTitle: string; metaDescription: string; keywords: string; ogImage: string; }
export interface LandingContent { hero: HeroContent; benefits: BenefitItem[]; faq: FaqItem[]; seo: SeoConfig; }
export interface Lead { id: string; name: string; email: string; company: string; source: string; status: "new" | "contacted" | "qualified" | "closed"; date: string; value?: number; message?: string; }
export interface OnboardingAnswers { businessName: string; industry: string; targetAudience: string; tone: string; goals: string[]; }
export interface SeoAuditReport { seoScore: number; readabilityScore: number; croScore: number; summary: string; strengths: string[]; improvements: string[]; keywordAnalysis: string; }
export interface GrowthRecommendation { title: string; description: string; difficulty: string; impact: string; }
export interface ScreenMedia { id: string; screenId: string; type: "image" | "video" | "drone"; url: string; title?: string; sizeBytes?: number; isHero?: boolean; createdAt?: string; posterUrl?: string; }
export interface DoohScreen { id: string; nombre: string; zona: string; tipo: "Peatonal" | "Vehicular" | "Mixto" | "Móvil" | "LeadMóvil"; categoria?: "Tradicionales" | "Pantallas LED" | "LED Móvil"; ciudad?: "Mendoza" | "Buenos Aires"; impactos: number; precio: number; status: "Activo" | "Pausado" | "Disponible" | "No disponible" | "available" | "reserved" | "upcoming"; reservationEndDate?: string; lat: number; lng: number; nota?: string; video?: string; dimensiones?: string; brillo?: string; refreshRate?: string; formato?: string; cobertura?: string; horarios?: string; ruta?: { lat: number; lng: number; nombre: string }[]; isFeatured?: boolean; featuredOrder?: number | null; media?: ScreenMedia[] | null; }
export type PublicDoohScreen = Omit<DoohScreen, 'precio'>;
export interface City { id: string; name: string; slug: string; createdAt?: string; updatedAt?: string; deletedAt?: string | null; }
export interface Category { id: string; name: string; slug: string; createdAt?: string; updatedAt?: string; deletedAt?: string | null; }
export interface Location { id: string; cityId: string; name: string; address?: string | null; lat: number; lng: number; createdAt?: string; updatedAt?: string; deletedAt?: string | null; }

export type Plaza = 'mendoza' | 'buenos-aires';
export type TipoSoporte = 'tradicional' | 'led' | 'led_movil';
export type EstadoGPS = 'ready' | 'pending_geocode' | 'error';
export type Disponibilidad = 'disponible' | 'reservado';
export interface LocationRecord { canonical_id: string; name: string; ciudad: Plaza; tipo_soporte: TipoSoporte; lat: number | null; lng: number | null; address: string; description: string; characteristics: string; mapa_url: string; imageUrls?: string[]; disponibilidad?: Disponibilidad; availableFrom?: string; isFeatured?: boolean; }
export interface MobileRoute { canonical_id: string; name: string; ciudad: Plaza; tipo_soporte: TipoSoporte; description: string; characteristics: string; schedule: string; duration: string; waypoints: { name: string; lat: number | null; lng: number | null }[]; routePath: [number, number][]; imageUrls?: string[]; disponibilidad?: Disponibilidad; availableFrom?: string; isFeatured?: boolean; }
export type InventoryItem = LocationRecord | MobileRoute;
export interface MediaKitRequest { id: string; supportIds: string[]; name: string; company?: string; email: string; phone?: string; message?: string; campaignStart: string; campaignEnd: string; status: 'pending' | 'reviewed' | 'quoted' | 'confirmed' | 'rejected'; createdAt: string; }
export function isMobileRoute(item: InventoryItem): item is MobileRoute { return 'waypoints' in item; }
export function getDisponibilidad(item: InventoryItem): Disponibilidad { return item.disponibilidad ?? 'disponible'; }
