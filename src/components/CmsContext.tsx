import React, { useEffect } from "react";
import { create } from "zustand";
import { useLocation } from "react-router-dom";
import { LandingContent, Lead, OnboardingAnswers, SeoAuditReport, GrowthRecommendation, DoohScreen } from "../types";
import { Cliente, MediaKit } from "./dashboard/types";
import { sitemap } from "../lib/sitemap";
import { API_ROUTES } from "../lib/apiRoutes"; // New import
import { safeFetchJson, apiClient } from "../lib/apiClient"; // apiClient is already imported
import { useCartStore } from "../stores/cartStore";

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
  updateScreenStatus: (id: string, status: "Activo" | "Pausado" | "Disponible" | "No disponible") => void;
  updateScreen: (id: string, updated: Partial<DoohScreen>) => void;
  loadingAI: boolean;
  // New properties for optimistic UI and error handling
  isSavingScreen: boolean;
  savingScreenError: string | null;
  generateAIContent: (onboarding: OnboardingAnswers) => Promise<void>;
  seoReport: SeoAuditReport | null;
  runSeoAudit: () => Promise<void>;
  growthRecs: GrowthRecommendation[];
  runGrowthRecs: (visitors: number, convRate: number) => Promise<void>;
  fetchLeads: () => Promise<void>;
  // New properties for screen CRUD
  addScreen: (screen: Omit<DoohScreen, "id">) => Promise<void>;
  deleteScreen: (id: string) => Promise<void>;
  loadingScreens: boolean;
  fetchPublicScreens: () => Promise<void>;
  occupancyMatrix: Record<string, string[]>;
  updateOccupancy: (screenId: string, weekIndex: number, status: string) => void;
  // Properties for dashboard entities
  clients: Cliente[];
  mediaKits: MediaKit[];
  fetchDashboardData: () => Promise<void>;
  loadingDashboardData: boolean;

}

function safeParseStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (e) {
    console.warn(`[CmsContext] Failed to parse localStorage key "${key}", using default fallback:`, e);
    return fallback;
  }
}

export const useCmsStore = create<CmsStoreProps>((set, get) => ({
  content: (() => {
    const parsed = safeParseStorage<LandingContent | null>("smartweb_cms_content", null);
    if (!parsed) return DEFAULT_LANDING_CONTENT;
    return {
      hero: { ...DEFAULT_LANDING_CONTENT.hero, ...(parsed.hero || {}) },
      benefits: Array.isArray(parsed.benefits) && parsed.benefits.length > 0 ? parsed.benefits : DEFAULT_LANDING_CONTENT.benefits,
      faq: Array.isArray(parsed.faq) && parsed.faq.length > 0 ? parsed.faq : DEFAULT_LANDING_CONTENT.faq,
      seo: { ...DEFAULT_LANDING_CONTENT.seo, ...(parsed.seo || {}) },
    };
  })(),
  leads: [],
  onboardingAnswers: (() => {
    return safeParseStorage("smartweb_onboarding", null);
  })(),
  activeView: "landing",
  currentDashboardTab: "inventario",
  activeSlug: "/",
  loadingAI: false,
  isSavingScreen: false,
  savingScreenError: null,
  seoReport: null,
  growthRecs: [],
  screens: (() => {
    return [];
  })(),
  clients: [],
  mediaKits: [],
  loadingScreens: false,
  occupancyMatrix: (() => {
    return safeParseStorage("smartweb_dooh_occupancy_matrix", {
      "sc-01": ["campaign", "campaign", "reserved", "available"],
      "sc-02": ["reserved", "available", "available", "campaign"],
      "sc-03": ["maintenance", "available", "available", "available"],
      "sc-04": ["campaign", "available", "reserved", "available"],
      "sj-01": ["campaign", "campaign", "campaign", "reserved"],
      "ba-01": ["reserved", "campaign", "campaign", "available"],
      "ba-02": ["available", "reserved", "available", "campaign"],
      "ba-03": ["campaign", "available", "campaign", "available"]
    });
  })(),
  loadingDashboardData: false,

  updateOccupancy: (screenId, weekIndex, status) => set((state) => {
    const currentList = state.occupancyMatrix[screenId] || ["available", "available", "available", "available"];
    const nextList = [...currentList];
    nextList[weekIndex] = status;
    const nextMatrix = {
      ...state.occupancyMatrix,
      [screenId]: nextList
    };
    localStorage.setItem("smartweb_dooh_occupancy_matrix", JSON.stringify(nextMatrix));
    return { occupancyMatrix: nextMatrix };
  }),

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
    const res = await safeFetchJson<{ success: boolean; data?: Lead; error?: { code?: string; message?: string } }>(API_ROUTES.leads, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData),
    });

    if (res.ok && res.data?.success && res.data.data) {
      const added = res.data.data;
      set((state) => ({ leads: [added, ...state.leads] }));
      return added;
    }

    const message = res.errorDetail?.message || res.error || "No se pudo registrar el lead.";
    console.error("[addLead] Lead submission failed:", message);
    throw new Error(message);
  },

  saveOnboarding: (answers) => {
    localStorage.setItem("smartweb_onboarding", JSON.stringify(answers));
    set({ onboardingAnswers: answers });
  },

  setActiveView: (view) => set({ activeView: view }),

  setCurrentDashboardTab: (tab) => set({ currentDashboardTab: tab }),

  setScreens: (valueOrFn) => set((state) => {
    const nextScreens = typeof valueOrFn === "function" ? valueOrFn(state.screens) : valueOrFn;
    return { screens: nextScreens };
  }),


  updateScreenStatus: (id, status) => set((state) => {
    const nextScreens = state.screens.map((s) => (s.id === id ? { ...s, status } : s));
    return { screens: nextScreens };
  }),

  updateScreen: async (id, updated): Promise<DoohScreen> => {
    set({ isSavingScreen: true, savingScreenError: null });
    const originalScreens = get().screens;

    // Optimistic update
    set((state) => ({
      screens: state.screens.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }));

    try {
      const res = await apiClient.put<{ success: boolean; data: DoohScreen; error?: any }>(`/api/screens/${id}`, updated);

      if (res.ok && res.data?.success && res.data.data) {
        const updatedScreen = res.data.data;
        // On success, confirm the update with server data
        set((state) => ({
          screens: state.screens.map((s) => (s.id === id ? updatedScreen : s)),
          isSavingScreen: false,
        }));
        return updatedScreen;
      } else {
        // On failure, revert optimistic update and set error
        const errorMessage = res.data?.error?.message || res.error || "Error al guardar el soporte.";
        set({ screens: originalScreens, savingScreenError: errorMessage });
        throw new Error(errorMessage);
      }
    } catch (e: any) {
      // On network/unexpected error, revert and set error
      set({ screens: originalScreens, isSavingScreen: false, savingScreenError: e.message || "Error de red al guardar." });
      throw e;
    } finally {
      set({ isSavingScreen: false });
    }
  },

  addScreen: async (newScreenData) => {
    const res = await apiClient.post<{ success: boolean; data: DoohScreen }>('/api/screens', newScreenData);
    if (res.ok && res.data?.success && res.data.data) {
      set(state => ({ screens: [res.data!.data, ...state.screens] }));
    } else {
      throw new Error(res.error || 'Failed to add screen');
    }
  },

  deleteScreen: async (id) => {
    const res = await apiClient.delete(`/api/screens/${id}`);
    if (res.ok) {
      set(state => ({ screens: state.screens.filter(s => s.id !== id) }));
    } else {
      throw new Error(res.error || 'Failed to delete screen');
    }
  },

  fetchLeads: async () => {
    try {
      const { collection, getDocs, query, limit } = await import("firebase/firestore");
      const { db } = await import("../lib/firebase-firestore");
      const leadsCol = collection(db, "leads");
      // query the top 100 leads
      const q = query(leadsCol, limit(100));
      const snapshot = await getDocs(q);
      const fsLeads: Lead[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fsLeads.push({
          id: docSnap.id,
          name: data.name || "",
          email: data.email || "",
          company: data.company || "",
          source: data.source || "Formulario Web",
          status: data.status || "new",
          date: data.date || new Date().toISOString(),
          value: Number(data.value) || 0,
        });
      });
      if (fsLeads.length > 0) {
        set({ leads: fsLeads });
        return;
      }
    } catch (fsErr) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Firestore leads fetch failed, using PG API:", fsErr);
      }
    }

    try {
      const res = await apiClient.get<{ success: boolean; data: any[] }>(API_ROUTES.leads);
      if (res.ok && res.data?.success && Array.isArray(res.data.data)) {
        set({ leads: res.data.data });
      } else if (!res.ok) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[fetchLeads] Failed to fetch leads:", res.error, res.errorType);
        }
      }
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[fetchLeads] Unexpected error fetching leads:", e);
      }
    }
  },

  fetchPublicScreens: async () => {
    set({ loadingScreens: true });
    try {
      const res = await apiClient.get<{ success: boolean; data: any[] }>(API_ROUTES.publicScreens);
      if (res.ok && res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        set({ screens: res.data.data });
      } else if (!res.ok) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[fetchPublicScreens] Failed to fetch public screens:", res.error, res.errorType);
        }
      }
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[fetchPublicScreens] Unexpected error fetching public screens:", e);
      }
    } finally {
      set({ loadingScreens: false });
    }
  },

  fetchDashboardData: async () => {
    set({ loadingDashboardData: true });
    try {
      const [clientsRes, mediaKitsRes] = await Promise.all([
        apiClient.get<{ success: boolean; data: Cliente[] }>('/api/clients'),
        apiClient.get<{ success: boolean; data: MediaKit[] }>('/api/mediakits'),
      ]);

      if (clientsRes.ok && clientsRes.data?.success) {
        set({ clients: clientsRes.data.data });
      }

      if (mediaKitsRes.ok && mediaKitsRes.data?.success) {
        set({ mediaKits: mediaKitsRes.data.data });
      }

    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[fetchDashboardData] Unexpected error fetching dashboard data:", e);
      }
    } finally {
      set({ loadingDashboardData: false });
    }
  },

  generateAIContent: async (answers) => {
    set({ loadingAI: true });
    try {
      const res = await safeFetchJson<{ success: boolean; data: any }>(API_ROUTES.ai.generate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (res.data?.success && res.data.data) {
        const generated = res.data.data;
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
    } catch (e) {
      // Ignored
    } finally {
      set({ loadingAI: false });
    }
  },

  runSeoAudit: async () => {
    set({ loadingAI: true });
    try {
      const res = await safeFetchJson<{ success: boolean; data: SeoAuditReport }>(API_ROUTES.ai.seoAudit, {
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
      if (res.data?.success && res.data.data) {
        set({ seoReport: res.data.data });
      }
    } catch (e) {
      // Ignored
    } finally {
      set({ loadingAI: false });
    }
  },

  runGrowthRecs: async (visitors, convRate) => {
    set({ loadingAI: true });
    try {
      const res = await safeFetchJson<{ success: boolean; data: { recommendations: GrowthRecommendation[] } }>(API_ROUTES.ai.recommendations, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorCount: visitors,
          conversionRate: convRate,
          activeLeadsCount: get().leads.length,
        }),
      });
      if (res.data?.success && res.data.data?.recommendations) {
        set({ growthRecs: res.data.data.recommendations });
      }
    } catch (e) {
      // Ignored
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

function updateSeoTags(activeView: string, activeSlug: string, currentDashboardTab: string) {
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

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) {
      setActiveView("dashboard");
      
      const parts = path.split("/").filter(Boolean);
      const tab = parts[1] || "home";
      
      let tabId = tab;
      if (tab === "inventory") tabId = "inventario";
      else if (tab === "clients") tabId = "clientes";
      else if (tab === "mediakits") tabId = "mediakit";
      else if (tab === "sync") tabId = "slides-sync";
      
      setCurrentDashboardTab(tabId);
    } else {
      setActiveView("landing");
      setActiveSlug(path);
    }
  }, [location.pathname, setActiveView, setActiveSlug, setCurrentDashboardTab]);

  useEffect(() => {
    updateSeoTags(activeView, activeSlug, currentDashboardTab);
  }, [activeView, activeSlug, currentDashboardTab, content.seo]);

  const fetchLeads = useCmsStore((state) => state.fetchLeads);
  const fetchPublicScreens = useCmsStore((state) => state.fetchPublicScreens);
  const fetchDashboardData = useCmsStore((state) => state.fetchDashboardData);
  
  useEffect(() => {
    fetchLeads();
    fetchPublicScreens();
    fetchDashboardData();
  }, [fetchLeads, fetchPublicScreens, fetchDashboardData]);

  return <>{children}</>;
};

export const useCms = () => {
  const cms = useCmsStore();
  const cart = useCartStore();

  return {
    ...cms,
    cart: cart.cart,
    toggleCart: cart.toggleCart,
    clearCart: cart.clearCart,
    weeks: cart.weeks,
    setWeeks: cart.setWeeks,
  };
};
