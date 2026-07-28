import React, { createContext, useContext, useState, useEffect } from "react";
import { LandingContent, Lead, OnboardingAnswers, SeoAuditReport, GrowthRecommendation, DoohScreen } from "../types";

const SEED_SCREENS: DoohScreen[] = [
  { id: 'sc-01', nombre: 'Sarmiento y 9 de Julio', zona: 'Centro', tipo: 'Peatonal', impactos: 14200, precio: 95000, status: 'Activo', lat: -32.8894, lng: -68.8458, nota: 'Esquina comercial de máximo tránsito peatonal.' },
  { id: 'sc-02', nombre: 'Palmares Open Mall', zona: 'Palmares', tipo: 'Mixto', impactos: 22500, precio: 145000, status: 'Activo', lat: -32.9121, lng: -68.8306, nota: 'Acceso principal al shopping. Vehicular y peatonal.' },
  { id: 'sc-03', nombre: 'Las Heras y Mitre', zona: 'Las Heras', tipo: 'Peatonal', impactos: 8800, precio: 68000, status: 'Activo', lat: -32.8716, lng: -68.8388, nota: 'Zona comercial barrial. Alto tráfico local.' },
  { id: 'sc-04', nombre: 'Av. Aristides frente al Parque', zona: 'Ciudad', tipo: 'Vehicular', impactos: 31000, precio: 185000, status: 'Activo', lat: -32.8908, lng: -68.8762, nota: 'Avenida principal. Ideal autos y commuters.' },
  { id: 'sc-05', nombre: 'Guaymallén Centro', zona: 'Guaymallén', tipo: 'Peatonal', impactos: 11400, precio: 78000, status: 'Activo', lat: -32.8955, lng: -68.8212, nota: 'Centro comercial de Guaymallén.' },
  { id: 'sc-06', nombre: 'Maipú Ruta 7', zona: 'Maipú', tipo: 'Vehicular', impactos: 19600, precio: 112000, status: 'Activo', lat: -32.9812, lng: -68.7757, nota: 'Tránsito hacia bodegas y aeropuerto.' },
  { id: 'sc-07', nombre: 'Villanueva Gomensoro', zona: 'Las Heras', tipo: 'Mixto', impactos: 9300, precio: 72000, status: 'Activo', lat: -32.8658, lng: -68.8415, nota: 'Zona residencial-comercial en crecimiento.' },
  { id: 'sc-08', nombre: 'Godoy Cruz Belgrano', zona: 'Godoy Cruz', tipo: 'Vehicular', impactos: 25800, precio: 155000, status: 'Activo', lat: -32.9246, lng: -68.8488, nota: 'Corredor vehicular de alto volumen.' },
  { id: 'sc-09', nombre: 'Chacras de Coria Acceso', zona: 'Luján', tipo: 'Vehicular', impactos: 16700, precio: 125000, status: 'Activo', lat: -33.0158, lng: -68.8642, nota: 'Acceso a Chacras. Ideal turismo y bodegas.' },
  { id: 'sc-10', nombre: 'Terminal de Ómnibus', zona: 'Centro', tipo: 'Peatonal', impactos: 18400, precio: 118000, status: 'Activo', lat: -32.8868, lng: -68.8284, nota: 'Alta rotación. Público diverso 24h.' },
  {
    id: 'sc-11',
    nombre: 'LeadMóvil Mendoza Express',
    zona: 'Metropolitana',
    tipo: 'Móvil',
    impactos: 38000,
    precio: 160000,
    status: 'Activo',
    lat: -32.8894,
    lng: -68.8458,
    nota: 'Exclusivo Mendoza. Formato móvil con recorrido lineal estilo citybus por puntos estratégicos.',
    ruta: [
      { lat: -32.8894, lng: -68.8458, nombre: 'Plaza Independencia (Inicio)' },
      { lat: -32.8897, lng: -68.8427, nombre: 'España y Peatonal Sarmiento' },
      { lat: -32.8940, lng: -68.8398, nombre: 'Av. Colón y San Martín (Centro)' },
      { lat: -32.8908, lng: -68.8552, nombre: 'Arístides Villanueva y Belgrano' },
      { lat: -32.8904, lng: -68.8643, nombre: 'Arístides Villanueva y Paso de los Andes' },
      { lat: -32.8891, lng: -68.8690, nombre: 'Portones del Parque Gral San Martín' },
      { lat: -32.8872, lng: -68.8803, nombre: 'Fuente de los Continentes (Fin)' }
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
  activeView: "landing" | "dashboard" | "onboarding";
  currentDashboardTab: string;
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
  setActiveView: (view: "landing" | "dashboard" | "onboarding") => void;
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

  const [activeView, setActiveView] = useState<"landing" | "dashboard" | "onboarding">("landing");
  const [currentDashboardTab, setCurrentDashboardTab] = useState<string>("landing-editor");
  const [loadingAI, setLoadingAI] = useState(false);
  const [seoReport, setSeoReport] = useState<SeoAuditReport | null>(null);
  const [growthRecs, setGrowthRecs] = useState<GrowthRecommendation[]>([]);

  const [screens, setScreens] = useState<DoohScreen[]>(() => {
    const saved = localStorage.getItem("smartweb_dooh_screens");
    return saved ? JSON.parse(saved) : SEED_SCREENS;
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

  return (
    <CmsContext.Provider
      value={{
        content,
        leads,
        onboardingAnswers,
        activeView,
        currentDashboardTab,
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
