export interface SitemapItem {
  name: string;
  slug: string;
  keyword: string;
  intent: "Informational" | "Commercial" | "Transactional";
  wordCount: number;
  description: string;
  imageUrl?: string;
  children?: SitemapItem[];
}

export interface DoohScreen {
  id: string;
  nombre: string;
  zona: string;
  tipo: "Peatonal" | "Vehicular" | "Mixto" | "Móvil";
  categoria?: "Pantallas LED" | "Tradicionales" | "LED Móvil";
  ciudad?: "Mendoza" | "Buenos Aires";
  impactos: number;
  precio: number;
  status: "Activo" | "Pausado" | "Disponible" | "No disponible" | "Mantenimiento";
  lat: number;
  lng: number;
  nota: string;
  dimensiones?: string;
  brillo?: string;
  refreshRate?: string;
  formato?: string;
  cobertura?: string;
  horarios?: string;
  ruta?: { lat: number; lng: number; nombre: string }[];
}

export interface Lead {
  id: string;
  date: string;
  name: string;
  email: string;
  company?: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "lost";
  value: number;
}

export interface LandingContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  benefits: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
  };
}

export interface OnboardingAnswers {
  companyName: string;
  industry: string;
  targetAudience: string;
  mainGoal: string;
}

export interface SeoAuditReport {
  score: number;
  keywordDensity: { keyword: string; density: string }[];
  titleAnalysis: { check: string; status: "good" | "bad"; suggestion: string };
  contentGaps: string[];
  overallSuggestion: string;
}

export interface GrowthRecommendation {
  id: string;
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  difficulty: "Easy" | "Medium" | "Hard";
  category: "SEO" | "Conversion" | "Content";
}