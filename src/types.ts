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

export interface DoohScreen {
  id: string;
  nombre: string;
  zona: string;
  tipo: "Peatonal" | "Vehicular" | "Mixto" | "Móvil" | "LeadMóvil";
  categoria?: "Tradicionales" | "Pantallas LED" | "LED Móvil";
  ciudad?: "Mendoza" | "Buenos Aires";
  impactos: number;
  precio: number; // per week
  status: "Activo" | "Pausado" | "Disponible" | "No disponible";
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
}
