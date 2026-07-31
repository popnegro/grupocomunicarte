import React, { createContext, useContext, useState, useEffect } from "react";
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

// Initial premium Spanish copy for SmartWeb B2B SaaS
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

interface CmsContextProps {
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
  // DOOH screens and cart logic
  screens: DoohScreen[];
  setScreens: React.Dispatch<React.SetStateAction<DoohScreen[]>>;
  cart: string[]; // Screen ids
  toggleCart: (id: string) => void;
  clearCart: () => void;
  weeks: number;
  setWeeks: (weeks: number) => void;
  updateScreenStatus: (id: string, status: "Activo" | "Pausado" | "Disponible" | "No disponible") => void;
  updateScreen: (id: string, updated: Partial<DoohScreen>) => void;
  // API triggers
  loadingAI: boolean;
  generateAIContent: (onboarding: OnboardingAnswers) => Promise<void>;
  seoReport: SeoAuditReport | null;
  runSeoAudit: () => Promise<void>;
  growthRecs: GrowthRecommendation[];
  runGrowthRecs: (visitors: number, convRate: number) => Promise<void>;
  fetchLeads: () => Promise<void>;
}

const CmsContext = createContext<CmsContextProps | undefined>(undefined);

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

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<LandingContent>(() => {
    const saved = localStorage.getItem("smartweb_cms_content");
    return saved ? JSON.parse(saved) : DEFAULT_LANDING_CONTENT;
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers | null>(() => {
    const saved = localStorage.getItem("smartweb_onboarding");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeView, setActiveView] = useState<"landing" | "dashboard">("landing");
  const [currentDashboardTab, setCurrentDashboardTab] = useState<string>("dashboard");
  const [activeSlug, setActiveSlug] = useState<string>("/");
  const [loadingAI, setLoadingAI] = useState(false);
  const [seoReport, setSeoReport] = useState<SeoAuditReport | null>(null);
  const [growthRecs, setGrowthRecs] = useState<GrowthRecommendation[]>([]);

  const [screens, setScreens] = useState<DoohScreen[]>(() => {
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
  });

  const [cart, setCart] = useState<string[]>(() => {
    const saved = localStorage.getItem("smartweb_dooh_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [weeks, setWeeks] = useState<number>(4);

  // Sync screens and cart to localStorage
  useEffect(() => {
    localStorage.setItem("smartweb_dooh_screens", JSON.stringify(screens));
  }, [screens]);

  useEffect(() => {
    localStorage.setItem("smartweb_dooh_cart", JSON.stringify(cart));
  }, [cart]);

  const toggleCart = (id: string) => {
    setCart((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateScreenStatus = (id: string, status: "Activo" | "Pausado" | "Disponible" | "No disponible") => {
    setScreens((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const updateScreen = (id: string, updated: Partial<DoohScreen>) => {
    setScreens((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  // Fetch leads from server
  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const resJson = await res.json();
      if (resJson.success) {
        setLeads(resJson.data);
      }
    } catch (e) {
      console.error("Error fetching leads from server", e);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Save content to localStorage on change
  useEffect(() => {
    localStorage.setItem("smartweb_cms_content", JSON.stringify(content));
  }, [content]);

  const updateHero = (updatedHero: Partial<LandingContent["hero"]>) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...updatedHero },
    }));
  };

  const updateBenefit = (id: string, updated: Partial<LandingContent["benefits"][0]>) => {
    setContent((prev) => ({
      ...prev,
      benefits: prev.benefits.map((b) => (b.id === id ? { ...b, ...updated } : b)),
    }));
  };

  const addBenefit = (newBenefit: LandingContent["benefits"][0]) => {
    setContent((prev) => ({
      ...prev,
      benefits: [...prev.benefits, newBenefit],
    }));
  };

  const deleteBenefit = (id: string) => {
    setContent((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((b) => b.id !== id),
    }));
  };

  const updateFaq = (index: number, updated: Partial<LandingContent["faq"][0]>) => {
    setContent((prev) => ({
      ...prev,
      faq: prev.faq.map((f, idx) => (idx === index ? { ...f, ...updated } : f)),
    }));
  };

  const addFaq = (newFaq: LandingContent["faq"][0]) => {
    setContent((prev) => ({
      ...prev,
      faq: [...prev.faq, newFaq],
    }));
  };

  const deleteFaq = (index: number) => {
    setContent((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, idx) => idx !== index),
    }));
  };

  const updateSeo = (updatedSeo: Partial<LandingContent["seo"]>) => {
    setContent((prev) => ({
      ...prev,
      seo: { ...prev.seo, ...updatedSeo },
    }));
  };

  const resetToDefault = () => {
    setContent(DEFAULT_LANDING_CONTENT);
    setSeoReport(null);
  };

  const addLead = async (leadData: Omit<Lead, "id" | "date">): Promise<Lead | null> => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });
      const result = await response.json();
      if (result.success) {
        setLeads((prev) => [result.data, ...prev]);
        return result.data;
      }
    } catch (err) {
      console.error("Error creating lead on server", err);
      // Fallback
      const fallbackLead: Lead = {
        ...leadData,
        id: String(leads.length + 1),
        date: new Date().toISOString(),
      };
      setLeads((prev) => [fallbackLead, ...prev]);
      return fallbackLead;
    }
    return null;
  };

  const saveOnboarding = (answers: OnboardingAnswers) => {
    setOnboardingAnswers(answers);
    localStorage.setItem("smartweb_onboarding", JSON.stringify(answers));
  };

  // AI Content Generator: Triggers backend Gemini API call
  const generateAIContent = async (answers: OnboardingAnswers) => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const result = await res.json();
      if (result.success && result.data) {
        const generated = result.data;
        setContent((prev) => ({
          ...prev,
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
        }));
      }
    } catch (e) {
      console.error("Error generating AI content", e);
    } finally {
      setLoadingAI(false);
    }
  };

  // AI SEO Auditor: Triggers backend analysis
  const runSeoAudit = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/ai/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seoKeywords: content.seo.keywords,
          heroTitle: content.hero.title,
          heroSubtitle: content.hero.subtitle,
          benefitsText: content.benefits.map((b) => `${b.title}: ${b.description}`).join("; "),
          faqText: content.faq.map((f) => `${f.question}: ${f.answer}`).join("; "),
        }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setSeoReport(result.data);
      }
    } catch (e) {
      console.error("Error running SEO Audit", e);
    } finally {
      setLoadingAI(false);
    }
  };

  // AI Growth Advisor: Triggers growth recommendations
  const runGrowthRecs = async (visitors: number, convRate: number) => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorCount: visitors,
          conversionRate: convRate,
          activeLeadsCount: leads.length,
        }),
      });
      const result = await res.json();
      if (result.success && result.data?.recommendations) {
        setGrowthRecs(result.data.recommendations);
      }
    } catch (e) {
      console.error("Error running Growth Recs", e);
    } finally {
      setLoadingAI(false);
    }
  };

  // Dynamically update SEO head tags
  useEffect(() => {
    if (activeView === "landing") {
      const item = findSitemapItem(sitemap, activeSlug);
      const baseTitle = "Grupo Comunicarte | Publicidad Exterior y DOOH";
      const title = item ? `Grupo Comunicarte | ${item.name}` : baseTitle;
      const description = item ? item.description : "Líderes en publicidad exterior (OOH) y pantallas LED de gran formato en Argentina.";
      const keywords = item ? item.keyword : "publicidad exterior, via publica, pantallas led, mendoza, buenos aires";

      // Update document title
      document.title = title;

      // Update Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      // Update Meta Keywords
      let metaKey = document.querySelector('meta[name="keywords"]');
      if (!metaKey) {
        metaKey = document.createElement('meta');
        metaKey.setAttribute('name', 'keywords');
        document.head.appendChild(metaKey);
      }
      metaKey.setAttribute('content', keywords);
    } else {
      // Dashboard SEO Title
      const tabLabel = currentDashboardTab.charAt(0).toUpperCase() + currentDashboardTab.slice(1);
      document.title = `Consola B2B | Grupo Comunicarte | ${tabLabel}`;
    }
  }, [activeView, activeSlug, currentDashboardTab]);

  // Sync state to URL hash
  useEffect(() => {
    let newHash = "";
    if (activeView === "dashboard") {
      newHash = `#/dashboard/${currentDashboardTab}`;
    } else {
      newHash = `#${activeSlug}`;
    }
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, "", newHash);
    }
  }, [activeView, activeSlug, currentDashboardTab]);

  // Listen to Hash change for deep linking and back-button support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === "#" || hash === "#/") {
        setActiveView("landing");
        setActiveSlug("/");
      } else if (hash.startsWith("#/dashboard")) {
        setActiveView("dashboard");
        const parts = hash.split("/");
        const tab = parts[2] || "dashboard";
        setCurrentDashboardTab(tab);
      } else {
        setActiveView("landing");
        const slug = hash.replace("#", "");
        setActiveSlug(slug);
      }
    };

    // Run on mount to load initial URL route!
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <CmsContext.Provider
      value={{
        content,
        leads,
        onboardingAnswers,
        activeView,
        currentDashboardTab,
        activeSlug,
        setActiveSlug,
        updateHero,
        updateBenefit,
        addBenefit,
        deleteBenefit,
        updateFaq,
        addFaq,
        deleteFaq,
        updateSeo,
        resetToDefault,
        addLead,
        saveOnboarding,
        setActiveView,
        setCurrentDashboardTab,
        screens,
        setScreens,
        cart,
        toggleCart,
        clearCart,
        weeks,
        setWeeks,
        updateScreenStatus,
        updateScreen,
        loadingAI,
        generateAIContent,
        seoReport,
        runSeoAudit,
        growthRecs,
        runGrowthRecs,
        fetchLeads,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error("useCms must be used within a CmsProvider");
  }
  return context;
};
