import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { create } from "zustand";
import { LandingContent, Lead, OnboardingAnswers, SeoAuditReport, GrowthRecommendation, DoohScreen } from "../types";
import { sitemap } from "../lib/sitemap";

const SEED_SCREENS: DoohScreen[] = [
  // MENDOZA PLAZA
  {
    id: 'sc-01',
    nombre: 'Sarmiento y 9 de Julio',
    zona: 'Centro',
    tipo: 'Peatonal',
    categoria: 'Pantallas LED',
    ciudad: 'Mendoza',
    impactos: 14200,
    precio: 95000,
    status: 'Activo',
    lat: -32.8894,
    lng: -68.8458,
    nota: 'Esquina comercial neurálgica de máximo tránsito peatonal y comercial.',
    dimensiones: '3.5m x 2.0m (7.00m²)',
    brillo: '5,500 nits (Auto-Dimming)',
    refreshRate: '3,840 Hz (Flicker-Free)',
    formato: 'MP4, JPG, HTML5',
    cobertura: 'Alta densidad peatonal y turística'
  },
  {
    id: 'sc-02',
    nombre: 'Palmares Open Mall',
    zona: 'Palmares',
    tipo: 'Mixto',
    categoria: 'Pantallas LED',
    ciudad: 'Mendoza',
    impactos: 22500,
    precio: 145000,
    status: 'Activo',
    lat: -32.9121,
    lng: -68.8306,
    nota: 'Acceso principal al centro comercial. Cobertura premium vehicular y peatonal.',
    dimensiones: '5.0m x 3.0m (15.00m²)',
    brillo: '6,500 nits (High-Contrast)',
    refreshRate: '3,840 Hz',
    formato: 'MP4, JPG',
    cobertura: 'Público ABC1 de alto nivel de consumo'
  },
  {
    id: 'sc-03',
    nombre: 'Las Heras y Mitre',
    zona: 'Las Heras',
    tipo: 'Peatonal',
    categoria: 'Pantallas LED',
    ciudad: 'Mendoza',
    impactos: 8800,
    precio: 68000,
    status: 'Activo',
    lat: -32.8716,
    lng: -68.8388,
    nota: 'Zona de alto tránsito comercial local e intercomunal.',
    dimensiones: '3.0m x 2.0m (6.00m²)',
    brillo: '5,000 nits',
    refreshRate: '1,920 Hz',
    formato: 'MP4, JPG',
    cobertura: 'Comercio local y cercanía'
  },
  {
    id: 'sc-04',
    nombre: 'Av. Arístides frente al Parque',
    zona: 'Ciudad',
    tipo: 'Vehicular',
    categoria: 'Tradicionales',
    ciudad: 'Mendoza',
    impactos: 31000,
    precio: 185000,
    status: 'Activo',
    lat: -32.8908,
    lng: -68.8762,
    nota: 'Soporte monumental estático iluminado en el polo gastronómico más importante.',
    dimensiones: '7.0m x 3.0m (21.00m²)',
    brillo: 'Iluminación LED Backlight',
    refreshRate: 'N/A',
    formato: 'Lona Tensada Vinílica',
    cobertura: 'Público joven, nocturno y polo estudiantil'
  },
  {
    id: 'sc-05',
    nombre: 'Guaymallén Centro',
    zona: 'Guaymallén',
    tipo: 'Peatonal',
    categoria: 'Pantallas LED',
    ciudad: 'Mendoza',
    impactos: 11400,
    precio: 78000,
    status: 'Activo',
    lat: -32.8955,
    lng: -68.8212,
    nota: 'Pantalla LED ubicada en zona de supermercados y polo comercial de Guaymallén.',
    dimensiones: '4.0m x 2.5m (10.00m²)',
    brillo: '5,500 nits',
    refreshRate: '3,840 Hz',
    formato: 'MP4, JPG',
    cobertura: 'Gran flujo residencial diario'
  },
  {
    id: 'sc-06',
    nombre: 'Maipú Ruta 7',
    zona: 'Maipú',
    tipo: 'Vehicular',
    categoria: 'Tradicionales',
    ciudad: 'Mendoza',
    impactos: 19600,
    precio: 112000,
    status: 'Activo',
    lat: -32.9812,
    lng: -68.7757,
    nota: 'Cartel monumental estático en ruta de conexión al aeropuerto y bodegas.',
    dimensiones: '8.0m x 4.0m (32.00m²)',
    brillo: 'Luz Frontlight LED',
    refreshRate: 'N/A',
    formato: 'Lona Frontlight',
    cobertura: 'Logística, turismo y bodegas'
  },
  {
    id: 'sc-07',
    nombre: 'Villanueva Gomensoro',
    zona: 'Las Heras',
    tipo: 'Mixto',
    categoria: 'Pantallas LED',
    ciudad: 'Mendoza',
    impactos: 9300,
    precio: 72000,
    status: 'Activo',
    lat: -32.8658,
    lng: -68.8415,
    nota: 'Ubicación mixta residencial-comercial con excelente ángulo de lectura.',
    dimensiones: '3.5m x 2.0m (7.00m²)',
    brillo: '5,000 nits',
    refreshRate: '1,920 Hz',
    formato: 'MP4, JPG',
    cobertura: 'Tránsito residencial interurbano'
  },
  {
    id: 'sc-08',
    nombre: 'Godoy Cruz Belgrano',
    zona: 'Godoy Cruz',
    tipo: 'Vehicular',
    categoria: 'Tradicionales',
    ciudad: 'Mendoza',
    impactos: 25800,
    precio: 155000,
    status: 'Activo',
    lat: -32.9246,
    lng: -68.8488,
    nota: 'Monolito iluminado de gran visibilidad en el principal eje de Godoy Cruz.',
    dimensiones: '10.0m x 4.0m (40.00m²)',
    brillo: 'Foco LED Frontal',
    refreshRate: 'N/A',
    formato: 'Lona Frontlight Premium',
    cobertura: 'Tránsito automotor y comercial intenso'
  },
  {
    id: 'sc-09',
    nombre: 'Chacras de Coria Acceso',
    zona: 'Luján',
    tipo: 'Vehicular',
    categoria: 'Tradicionales',
    ciudad: 'Mendoza',
    impactos: 16700,
    precio: 125000,
    status: 'Activo',
    lat: -33.0158,
    lng: -68.8642,
    nota: 'Soporte de ingreso al polo premium residencial y turístico de Chacras.',
    dimensiones: '8.0m x 3.0m (24.00m²)',
    brillo: 'Iluminación LED Externa',
    refreshRate: 'N/A',
    formato: 'Lona Vinílica',
    cobertura: 'Público selecto, turismo y barrios privados'
  },
  {
    id: 'sc-10',
    nombre: 'Terminal de Ómnibus',
    zona: 'Centro',
    tipo: 'Peatonal',
    categoria: 'Pantallas LED',
    ciudad: 'Mendoza',
    impactos: 18400,
    precio: 118000,
    status: 'Activo',
    lat: -32.8868,
    lng: -68.8284,
    nota: 'Pantalla de gran formato con alto caudal de pasajeros las 24 horas.',
    dimensiones: '6.0m x 3.0m (18.00m²)',
    brillo: '6,000 nits (Auto-Dimming)',
    refreshRate: '3,840 Hz',
    formato: 'MP4, JPG',
    cobertura: 'Viajeros de media y larga distancia, transeúntes'
  },
  {
    id: 'sc-11',
    nombre: 'LeadMóvil Mendoza Express',
    zona: 'Metropolitana',
    tipo: 'Móvil',
    categoria: 'LED Móvil',
    ciudad: 'Mendoza',
    impactos: 38000,
    precio: 160000,
    status: 'Activo',
    lat: -32.8894,
    lng: -68.8458,
    nota: 'Exclusiva pantalla móvil de alta definición con recorrido lineal constante.',
    dimensiones: '4.0m x 2.0m Doble Cara',
    brillo: '7,500 nits (UHD Outdoor)',
    refreshRate: '3,840 Hz (Flicker-Free)',
    formato: 'MP4, JPG, Transmisión en Vivo',
    cobertura: 'Principales avenidas y ejes recreacionales',
    horarios: '10:00 a 14:00 y 17:00 a 21:00 hs',
    ruta: [
      { lat: -32.8894, lng: -68.8458, nombre: 'Plaza Independencia (Inicio)' },
      { lat: -32.8897, lng: -68.8427, nombre: 'España y Peatonal Sarmiento' },
      { lat: -32.8940, lng: -68.8398, nombre: 'Av. Colón y San Martín (Centro)' },
      { lat: -32.8908, lng: -68.8552, nombre: 'Arístides Villanueva y Belgrano' },
      { lat: -32.8904, lng: -68.8643, nombre: 'Arístides Villanueva y Paso de los Andes' },
      { lat: -32.8891, lng: -68.8690, nombre: 'Portones del Parque Gral San Martín' },
      { lat: -32.8872, lng: -68.8803, nombre: 'Fuente de los Continentes (Fin)' }
    ]
  },

  // BUENOS AIRES PLAZA
  {
    id: 'ba-01',
    nombre: 'Av. 9 de Julio y Corrientes',
    zona: 'Obelisco',
    tipo: 'Vehicular',
    categoria: 'Pantallas LED',
    ciudad: 'Buenos Aires',
    impactos: 75000,
    precio: 220000,
    status: 'Activo',
    lat: -34.6037,
    lng: -58.3816,
    nota: 'Pantalla monumental frente al Obelisco, máxima penetración nacional y visibilidad garantizada.',
    dimensiones: '12.0m x 8.0m (96.00m²)',
    brillo: '8,500 nits (Extreme UHD)',
    refreshRate: '3,840 Hz',
    formato: 'MP4, JPG, Transmisión en Vivo',
    cobertura: 'La esquina neurálgica de mayor tráfico del país'
  },
  {
    id: 'ba-02',
    nombre: 'Av. del Libertador y Av. Callao',
    zona: 'Recoleta',
    tipo: 'Mixto',
    categoria: 'Pantallas LED',
    ciudad: 'Buenos Aires',
    impactos: 42000,
    precio: 180000,
    status: 'Activo',
    lat: -34.5885,
    lng: -58.3889,
    nota: 'Corredor vial ultra premium conectando zona norte con el centro cívico y comercial.',
    dimensiones: '8.0m x 4.0m (32.00m²)',
    brillo: '7,500 nits (Flicker-Free)',
    refreshRate: '3,840 Hz',
    formato: 'MP4, JPG',
    cobertura: 'Target ABC1 ejecutivo, turístico y corporativo'
  },
  {
    id: 'ba-03',
    nombre: 'Puerto Madero Dique 3',
    zona: 'Puerto Madero',
    tipo: 'Peatonal',
    categoria: 'Pantallas LED',
    ciudad: 'Buenos Aires',
    impactos: 28000,
    precio: 150000,
    status: 'Activo',
    lat: -34.6076,
    lng: -58.3643,
    nota: 'Ubicación exclusiva en el dique financiero, residencial y de esparcimiento de lujo.',
    dimensiones: '5.0m x 3.0m (15.00m²)',
    brillo: '6,000 nits',
    refreshRate: '3,840 Hz',
    formato: 'MP4, JPG',
    cobertura: 'Ejecutivos, turistas y público de alto poder adquisitivo'
  },
  {
    id: 'ba-04',
    nombre: 'Av. Cabildo y Juramento',
    zona: 'Belgrano',
    tipo: 'Peatonal',
    categoria: 'Pantallas LED',
    ciudad: 'Buenos Aires',
    impactos: 35000,
    precio: 130000,
    status: 'Activo',
    lat: -34.5621,
    lng: -58.4566,
    nota: 'Esquina comercial de Belgrano de altísima circulación peatonal y trasbordo constante.',
    dimensiones: '6.0m x 4.0m (24.00m²)',
    brillo: '6,500 nits',
    refreshRate: '3,840 Hz',
    formato: 'MP4, JPG',
    cobertura: 'Flujo peatonal masivo constante'
  },
  {
    id: 'ba-05',
    nombre: 'Autopista Panamericana km 18',
    zona: 'Norte',
    tipo: 'Vehicular',
    categoria: 'Tradicionales',
    ciudad: 'Buenos Aires',
    impactos: 92000,
    precio: 250000,
    status: 'Activo',
    lat: -34.4988,
    lng: -58.5322,
    nota: 'Soporte estático de escala gigante en el acceso principal de mayor volumen de Zona Norte.',
    dimensiones: '15.0m x 5.0m (75.00m²)',
    brillo: 'Doble Faz Backlight Iluminado',
    refreshRate: 'N/A',
    formato: 'Lona Backlight',
    cobertura: 'Commuters diarios y logística interprovincial'
  },
  {
    id: 'ba-06',
    nombre: 'LeadMóvil Buenos Aires Express',
    zona: 'Metropolitana',
    tipo: 'Móvil',
    categoria: 'LED Móvil',
    ciudad: 'Buenos Aires',
    impactos: 55000,
    precio: 210000,
    status: 'Activo',
    lat: -34.6037,
    lng: -58.3816,
    nota: 'Unidad móvil premium recorriendo los distritos comerciales de Palermo, Recoleta y Retiro.',
    dimensiones: '5.0m x 2.5m Doble Cara',
    brillo: '8,000 nits',
    refreshRate: '3,840 Hz',
    formato: 'MP4, JPG',
    cobertura: 'Zonas de gran concentración comercial y de ocio',
    horarios: '11:00 a 15:00 y 18:00 a 22:00 hs',
    ruta: [
      { lat: -34.6037, lng: -58.3816, nombre: 'Obelisco (Inicio)' },
      { lat: -34.5885, lng: -58.3889, nombre: 'Av. Libertador y Callao' },
      { lat: -34.5711, lng: -58.4233, nombre: 'Plaza Italia (Palermo)' },
      { lat: -34.5830, lng: -58.4110, nombre: 'Palermo Soho (Honduras y Serrano)' },
      { lat: -34.5975, lng: -58.3855, nombre: 'Av. Santa Fe y 9 de Julio (Fin)' }
    ]
  }
];

const DEFAULT_LANDING_CONTENT: LandingContent = {
  hero: {
    badge: "🚀 ACELERADOR COMERCIAL INTELIGENTE",
    title: "La plataforma que convierte tus visitas en clientes recurrentes",
    subtitle: "SmartWeb unifica captación con IA, automatizaciones y un CMS avanzado para posicionar tu negocio en la cima del mercado digital.",
    ctaPrimary: "Prueba SmartWeb Gratis",
    ctaSecondary: "Ver Demo Interactiva",
  },
  benefits: [
    {
      id: "b1",
      title: "Generación de Leads con IA",
      description: "Nuestros algoritmos inteligentes analizan el comportamiento del usuario y personalizan el funnel de ventas en tiempo real.",
      icon: "Sparkles",
    },
    {
      id: "b2",
      title: "Automatizaciones Flawless",
      description: "Envía correos personalizados, califica prospectos y distribuye tareas comerciales sin mover un solo dedo.",
      icon: "Zap",
    },
    {
      id: "b3",
      title: "Auditoría SEO Integrada",
      description: "Optimiza cada palabra de tu sitio de manera automática con nuestro motor inteligente alineado a las reglas de Google.",
      icon: "Shield",
    },
  ],
  faq: [
    {
      question: "¿Cómo funciona la sincronización instantánea?",
      answer: "Cada cambio que realizas en el Dashboard CMS se propaga inmediatamente a tu Landing Comercial mediante nuestra arquitectura de datos reactiva.",
    },
    {
      question: "¿Se integra con mis herramientas actuales de CRM?",
      answer: "Sí, SmartWeb cuenta con integraciones automáticas mediante Webhooks y APIs nativas compatibles con HubSpot, Salesforce y Notion.",
    },
    {
      question: "¿Necesito conocimientos técnicos de programación?",
      answer: "En absoluto. La plataforma está diseñada para fundadores y equipos de marketing que buscan la máxima agilidad visual y automatización sin código.",
    },
  ],
  seo: {
    metaTitle: "SmartWeb - Acelerador Comercial Inteligente B2B SaaS",
    metaDescription: "Crea, gestiona y optimiza tu presencia comercial digital con la IA integrada y el CMS interactivo más rápido del mercado.",
    keywords: "acelerador comercial, ia, saas b2b, cms inteligente, automatizacion de leads",
    ogImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200",
  },
};

interface CmsStoreProps {
  content: LandingContent;
  leads: Lead[];
  onboardingAnswers: OnboardingAnswers | null;
  activeView: "landing" | "dashboard";
  currentDashboardTab: string;
  activeSlug: string;
  setActiveSlug: (slug: string) => void;
  updateHero: (hero: Partial<LandingContent["hero"]>) => void;
  updateBenefit: (id: string, updated: Partial<LandingContent["benefits"][0]>) => void;
  addBenefit: (benefit: LandingContent["benefits"][0]) => void;
  deleteBenefit: (id: string) => void;
  updateFaq: (index: number, updated: Partial<LandingContent["faq"][0]>) => void;
  addFaq: (faq: LandingContent["faq"][0]) => void;
  deleteFaq: (index: number) => void;
  updateSeo: (seo: Partial<LandingContent["seo"]>) => void;
  resetToDefault: () => void;
  addLead: (lead: Omit<Lead, "id" | "date">) => Promise<Lead | null>;
  saveOnboarding: (answers: OnboardingAnswers) => void;
  setActiveView: (view: "landing" | "dashboard") => void;
  setCurrentDashboardTab: (tab: string) => void;
  screens: DoohScreen[];
  setScreens: (screens: DoohScreen[] | ((prev: DoohScreen[]) => DoohScreen[])) => void;
  cart: string[];
  toggleCart: (id: string) => void;
  clearCart: () => void;
  weeks: number;
  setWeeks: (weeks: number) => void;
  updateScreenStatus: (id: string, status: "Activo" | "Pausado" | "Disponible" | "No disponible") => void;
  updateScreen: (id: string, updated: Partial<DoohScreen>) => void;
  loadingAI: boolean;
  generateAIContent: (onboarding: OnboardingAnswers) => Promise<void>;
  seoReport: SeoAuditReport | null;
  runSeoAudit: () => Promise<void>;
  growthRecs: GrowthRecommendation[];
  runGrowthRecs: (visitors: number, convRate: number) => Promise<void>;
  fetchLeads: () => Promise<void>;
}

export const useCmsStore = create<CmsStoreProps>((set, get) => ({
  content: (() => {
    const saved = localStorage.getItem("smartweb_cms_content");
    return saved ? JSON.parse(saved) : DEFAULT_LANDING_CONTENT;
  })(),
  leads: [],
  onboardingAnswers: (() => {
    const saved = localStorage.getItem("smartweb_onboarding");
    return saved ? JSON.parse(saved) : null;
  })(),
  activeView: "landing",
  currentDashboardTab: "inventario",
  activeSlug: "/",
  loadingAI: false,
  seoReport: null,
  growthRecs: [],
  screens: (() => {
    const saved = localStorage.getItem("smartweb_dooh_screens");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0 && parsed[0].ciudad) {
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing stored screens, falling back", e);
      }
    }
    return SEED_SCREENS;
  })(),
  cart: (() => {
    const saved = localStorage.getItem("smartweb_dooh_cart");
    return saved ? JSON.parse(saved) : [];
  })(),
  weeks: 4,

  setActiveSlug: (slug) => set({ activeSlug: slug }),

  updateHero: (updatedHero) => set((state) => {
    const nextContent = {
      ...state.content,
      hero: { ...state.content.hero, ...updatedHero },
    };
    localStorage.setItem("smartweb_cms_content", JSON.stringify(nextContent));
    return { content: nextContent };
  }),

  updateBenefit: (id, updated) => set((state) => {
    const nextContent = {
      ...state.content,
      benefits: state.content.benefits.map((b) => (b.id === id ? { ...b, ...updated } : b)),
    };
    localStorage.setItem("smartweb_cms_content", JSON.stringify(nextContent));
    return { content: nextContent };
  }),

  addBenefit: (newBenefit) => set((state) => {
    const nextContent = {
      ...state.content,
      benefits: [...state.content.benefits, newBenefit],
    };
    localStorage.setItem("smartweb_cms_content", JSON.stringify(nextContent));
    return { content: nextContent };
  }),

  deleteBenefit: (id) => set((state) => {
    const nextContent = {
      ...state.content,
      benefits: state.content.benefits.filter((b) => b.id !== id),
    };
    localStorage.setItem("smartweb_cms_content", JSON.stringify(nextContent));
    return { content: nextContent };
  }),

  updateFaq: (index, updated) => set((state) => {
    const nextContent = {
      ...state.content,
      faq: state.content.faq.map((f, idx) => (idx === index ? { ...f, ...updated } : f)),
    };
    localStorage.setItem("smartweb_cms_content", JSON.stringify(nextContent));
    return { content: nextContent };
  }),

  addFaq: (newFaq) => set((state) => {
    const nextContent = {
      ...state.content,
      faq: [...state.content.faq, newFaq],
    };
    localStorage.setItem("smartweb_cms_content", JSON.stringify(nextContent));
    return { content: nextContent };
  }),

  deleteFaq: (index) => set((state) => {
    const nextContent = {
      ...state.content,
      faq: state.content.faq.filter((_, idx) => idx !== index),
    };
    localStorage.setItem("smartweb_cms_content", JSON.stringify(nextContent));
    return { content: nextContent };
  }),

  updateSeo: (updatedSeo) => set((state) => {
    const nextContent = {
      ...state.content,
      seo: { ...state.content.seo, ...updatedSeo },
    };
    localStorage.setItem("smartweb_cms_content", JSON.stringify(nextContent));
    return { content: nextContent };
  }),

  resetToDefault: () => set(() => {
    localStorage.setItem("smartweb_cms_content", JSON.stringify(DEFAULT_LANDING_CONTENT));
    return {
      content: DEFAULT_LANDING_CONTENT,
      seoReport: null,
    };
  }),

  addLead: async (leadData) => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (result.success && result.data) {
          set((state) => ({ leads: [result.data, ...state.leads] }));
          return result.data;
        }
      }
    } catch (err) {
      console.error("Error creating lead on server", err);
    }
    const fallbackLead = {
      ...leadData,
      id: String(get().leads.length + 1),
      date: new Date().toISOString(),
    };
    set((state) => ({ leads: [fallbackLead, ...state.leads] }));
    return fallbackLead;
  },

  saveOnboarding: (answers) => {
    localStorage.setItem("smartweb_onboarding", JSON.stringify(answers));
    set({ onboardingAnswers: answers });
  },

  setActiveView: (view) => set({ activeView: view }),

  setCurrentDashboardTab: (tab) => set({ currentDashboardTab: tab }),

  setScreens: (valueOrFn) => set((state) => {
    const nextScreens = typeof valueOrFn === "function" ? valueOrFn(state.screens) : valueOrFn;
    localStorage.setItem("smartweb_dooh_screens", JSON.stringify(nextScreens));
    return { screens: nextScreens };
  }),

  toggleCart: (id) => set((state) => {
    const nextCart = state.cart.includes(id)
      ? state.cart.filter((item) => item !== id)
      : [...state.cart, id];
    localStorage.setItem("smartweb_dooh_cart", JSON.stringify(nextCart));
    return { cart: nextCart };
  }),

  clearCart: () => set(() => {
    localStorage.setItem("smartweb_dooh_cart", JSON.stringify([]));
    return { cart: [] };
  }),

  setWeeks: (weeks) => set({ weeks }),

  updateScreenStatus: (id, status) => set((state) => {
    const nextScreens = state.screens.map((s) => (s.id === id ? { ...s, status } : s));
    localStorage.setItem("smartweb_dooh_screens", JSON.stringify(nextScreens));
    return { screens: nextScreens };
  }),

  updateScreen: (id, updated) => set((state) => {
    const nextScreens = state.screens.map((s) => (s.id === id ? { ...s, ...updated } : s));
    localStorage.setItem("smartweb_dooh_screens", JSON.stringify(nextScreens));
    return { screens: nextScreens };
  }),

  fetchLeads: async () => {
    try {
      const res = await fetch("/api/leads");
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const resJson = await res.json();
        if (resJson.success && Array.isArray(resJson.data)) {
          set({ leads: resJson.data });
        }
      }
    } catch (e) {
      console.error("Error fetching leads from server", e);
    }
  },

  generateAIContent: async (answers) => {
    set({ loadingAI: true });
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const result = await res.json();
        if (result.success && result.data) {
          const generated = result.data;
          const nextContent = {
            ...get().content,
            hero: {
              badge: generated.hero.badge.toUpperCase(),
              title: generated.hero.title,
              subtitle: generated.hero.subtitle,
              ctaPrimary: generated.hero.ctaPrimary,
              ctaSecondary: generated.hero.ctaSecondary,
            },
            benefits: generated.benefits.map((b: any, index: number) => ({
              id: b.id || `b-ai-${index}`,
              title: b.title,
              description: b.description,
              icon: b.icon || "Sparkles",
            })),
            faq: generated.faq,
          };
          localStorage.setItem("smartweb_cms_content", JSON.stringify(nextContent));
          set({ content: nextContent });
        }
      }
    } catch (e) {
      console.error("Error generating AI content", e);
    } finally {
      set({ loadingAI: false });
    }
  },

  runSeoAudit: async () => {
    set({ loadingAI: true });
    try {
      const res = await fetch("/api/ai/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seoKeywords: get().content.seo.keywords,
          heroTitle: get().content.hero.title,
          heroSubtitle: get().content.hero.subtitle,
          benefitsText: get().content.benefits.map((b) => `${b.title}: ${b.description}`).join("; "),
          faqText: get().content.faq.map((f) => `${f.question}: ${f.answer}`).join("; "),
        }),
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const result = await res.json();
        if (result.success && result.data) {
          set({ seoReport: result.data });
        }
      }
    } catch (e) {
      console.error("Error running SEO Audit", e);
    } finally {
      set({ loadingAI: false });
    }
  },

  runGrowthRecs: async (visitors, convRate) => {
    set({ loadingAI: true });
    try {
      const res = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorCount: visitors,
          conversionRate: convRate,
          activeLeadsCount: get().leads.length,
        }),
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const result = await res.json();
        if (result.success && result.data?.recommendations) {
          set({ growthRecs: result.data.recommendations });
        }
      }
    } catch (e) {
      console.error("Error running Growth Recs", e);
    } finally {
      set({ loadingAI: false });
    }
  },
}));

function findSitemapItem(items: any[], slug: string): any | null {
  for (const item of items) {
    if (item.slug === slug) return item;
    if (item.children && item.children.length > 0) {
      const found = findSitemapItem(item.children, slug);
      if (found) return found;
    }
  }
  return null;
}

function updateSeoTagsOnly(activeView: string, activeSlug: string, currentDashboardTab: string) {
  if (activeView === "landing") {
    const item = findSitemapItem(sitemap, activeSlug);
    const baseTitle = "Grupo Comunicarte | Publicidad Exterior y DOOH";
    const title = item ? `Grupo Comunicarte | ${item.name}` : baseTitle;
    const description = item ? item.description : "Líderes en publicidad exterior (OOH) y pantallas LED de gran formato en Argentina.";
    const keywords = item ? item.keyword : "publicidad exterior, via publica, pantallas led, mendoza, buenos aires";

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    let metaKey = document.querySelector('meta[name="keywords"]');
    if (!metaKey) {
      metaKey = document.createElement('meta');
      metaKey.setAttribute('name', 'keywords');
      document.head.appendChild(metaKey);
    }
    metaKey.setAttribute('content', keywords);
  } else {
    const tabLabel = currentDashboardTab.charAt(0).toUpperCase() + currentDashboardTab.slice(1);
    document.title = `Consola B2B | Grupo Comunicarte | ${tabLabel}`;
  }
}

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setActiveView, setActiveSlug, setCurrentDashboardTab, activeView, activeSlug, currentDashboardTab, content } = useCmsStore();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Sync from Browser URL to Zustand state on mount and URL changes
  useEffect(() => {
    const path = location.pathname;
    
    // Auto-scroll instantly to top on page or view transition to mimic natural browser behavior
    window.scrollTo({ top: 0, behavior: "instant" as any });

    if (path === "/login") {
      setActiveView("landing");
      setActiveSlug("/login");
    } else if (path.startsWith("/dashboard")) {
      setActiveView("dashboard");
      const parts = path.split("/");
      const suffix = parts[2] || "home";
      
      let tab = "home";
      if (suffix === "inventory") tab = "inventario";
      else if (suffix === "clients") tab = "clientes";
      else if (suffix === "mediakits") tab = "mediakit";
      else if (suffix === "ai-planner") tab = "ai-planner";
      else if (suffix === "settings") tab = "settings";
      
      setCurrentDashboardTab(tab);
    } else {
      setActiveView("landing");
      setActiveSlug(path);
    }
  }, [location.pathname, setActiveView, setActiveSlug, setCurrentDashboardTab]);

  // 2. Sync from Zustand state changes back to Browser URL (e.g. clicking buttons)
  useEffect(() => {
    let targetPath = "/";
    if (activeView === "dashboard") {
      let suffix = "home";
      if (currentDashboardTab === "inventario") suffix = "inventory";
      else if (currentDashboardTab === "clientes") suffix = "clients";
      else if (currentDashboardTab === "mediakit") suffix = "mediakits";
      else if (currentDashboardTab === "ai-planner") suffix = "ai-planner";
      else if (currentDashboardTab === "settings") suffix = "settings";

      targetPath = suffix === "home" ? "/dashboard" : `/dashboard/${suffix}`;
    } else {
      targetPath = activeSlug;
    }

    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [activeView, activeSlug, currentDashboardTab, location.pathname, navigate]);

  // 3. Update SEO and Document Title
  useEffect(() => {
    updateSeoTagsOnly(activeView, activeSlug, currentDashboardTab);
  }, [activeView, activeSlug, currentDashboardTab, content.seo]);

  const fetchLeads = useCmsStore((state) => state.fetchLeads);
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return <>{children}</>;
};

export const useCms = () => {
  return useCmsStore();
};
