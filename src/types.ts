/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  imageUrl?: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Zap, Shield, Sparkles, BarChart, Target, Users etc
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
}

export interface LandingContent {
  hero: HeroContent;
  benefits: BenefitItem[];
  faq: FaqItem[];
  seo: SeoConfig;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  source: string; // "Formulario Web" | "Quiz de Onboarding"
  status: "new" | "contacted" | "qualified" | "closed";
  date: string;
  value?: number;
  message?: string;
}

export interface OnboardingAnswers {
  businessName: string;
  industry: string;
  targetAudience: string;
  tone: string;
  goals: string[];
}

export interface SeoAuditReport {
  seoScore: number;
  readabilityScore: number;
  croScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  keywordAnalysis: string;
}

export interface GrowthRecommendation {
  title: string;
  description: string;
  difficulty: string; // "Baja" | "Media" | "Alta"
  impact: string; // "Bajo" | "Medio" | "Alto"
}

export interface ScreenMedia {
  id: string;
  screenId: string;
  type: "image" | "video" | "drone";
  url: string;
  title?: string;
  sizeBytes?: number;
  isHero?: boolean;
  createdAt?: string;
  posterUrl?: string;
}

export interface DoohScreen {
  id: string;
  nombre: string;
  zona: string;
  tipo: "Peatonal" | "Vehicular" | "Mixto" | "Móvil" | "LeadMóvil";
  categoria?: "Tradicionales" | "Pantallas LED" | "LED Móvil";
  ciudad?: "Mendoza" | "Buenos Aires";
  impactos: number;
  precio: number; // per week
  status: "Activo" | "Pausado" | "Disponible" | "No disponible" | "available" | "reserved" | "upcoming";
  reservationEndDate?: string;
  lat: number;
  lng: number;
  nota?: string;
  video?: string;
  dimensiones?: string;
  brillo?: string;
  refreshRate?: string;
  formato?: string;
  cobertura?: string;
  horarios?: string;
  ruta?: { lat: number; lng: number; nombre: string }[];
  isFeatured?: boolean;
  featuredOrder?: number | null;
  media?: ScreenMedia[] | null;
}

// A public-facing version of the screen, which must not include the price.
export type PublicDoohScreen = Omit<DoohScreen, 'precio'>;

export interface City {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface Location {
  id: string;
  cityId: string;
  name: string;
  address?: string | null;
  lat: number;
  lng: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}
