import React, { createContext, useContext, useState, useEffect } from "react";
import { LandingContent, OnboardingAnswers, SeoAuditReport, GrowthRecommendation, DoohScreen, Lead } from "../types";
import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import { api } from "../lib/api"; // Importar el cliente de API centralizado
import { sitemap } from "../lib/sitemap";

interface CmsContextProps {
  content: LandingContent;
  leads: Lead[];
  leadsLoading: boolean;
  leadsError: Error | null;
  onboardingAnswers: OnboardingAnswers | null;
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
  runGrowthRecs: (visitors: number, convRate: number) => Promise<void>; // No longer needs fetchLeads here
}

const CmsContext = createContext<CmsContextProps | undefined>(undefined);

const queryClient = new QueryClient();


export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // Fetch default content from API
  const { data: content, setData: setContent } = useQuery<LandingContent>({
    queryKey: ["landingContent"],
    queryFn: async () => {
      const result = await api.get<LandingContent>("/api/content/default");
      if (!result.success || !result.data) throw new Error("Failed to fetch default content");
      return result.data;
    },
    initialData: () => {
      const saved = localStorage.getItem("smartweb_cms_content");
      return saved ? JSON.parse(saved) : undefined;
    },
    staleTime: Infinity, // This data is static unless explicitly reset
  });

  const [loadingAI, setLoadingAI] = useState(false);
  const [seoReport, setSeoReport] = useState<SeoAuditReport | null>(null);
  const [growthRecs, setGrowthRecs] = useState<GrowthRecommendation[]>([]);

  // Fetch screens from API
  const { data: screens, setData: setScreens } = useQuery<DoohScreen[]>({
    queryKey: ["screens"],
    queryFn: async () => {
      const result = await api.get<DoohScreen[]>("/api/screens");
      if (!result.success || !result.data) throw new Error("Failed to fetch screens");
      return result.data;
    },
    initialData: () => {
      const saved = localStorage.getItem("smartweb_dooh_screens");
      try {
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Refetch every 5 minutes
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

  // Fetch leads from server using React Query for real-time polling
  const fetchLeads = async (): Promise<Lead[]> => {
    const result = await api.get<Lead[]>("/api/leads");
    if (!result.success) throw new Error(result.error || "Failed to fetch leads");
    return result.data || [];
  };

  const { data: leads = [], isLoading: leadsLoading, error: leadsError } = useQuery<Lead[], Error>({
    queryKey: ["leads"],
    queryFn: fetchLeads,
    refetchInterval: 15000, // Poll every 15 seconds
    initialData: [],
    
  });

  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers | null>(() => {
    const saved = localStorage.getItem("smartweb_onboarding");
    return saved ? JSON.parse(saved) : null;
  });


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
    setSeoReport(null);
    queryClient.invalidateQueries({ queryKey: ["landingContent"] });
  };

  const addLeadMutation = useMutation({
    mutationFn: (leadData: Omit<Lead, "id" | "date">) => api.post<Lead>("/api/leads", leadData),
    onSuccess: () => {
      // Invalidate the leads query to refetch the latest data from the server
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error) => {
      console.error("Error creating lead:", error);
    },
  });

  const addLead = async (leadData: Omit<Lead, "id" | "date">) => {
    const result = await addLeadMutation.mutateAsync(leadData);
    if (result.success) return result.data || null;
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
      const result = await api.post<any>("/api/ai/generate", answers);
      if (result.success) {
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
      const payload = {
        seoKeywords: content.seo.keywords,
        heroTitle: content.hero.title,
        heroSubtitle: content.hero.subtitle,
        benefitsText: content.benefits.map((b) => `${b.title}: ${b.description}`).join("; "),
        faqText: content.faq.map((f) => `${f.question}: ${f.answer}`).join("; "),
      };
      const result = await api.post<SeoAuditReport>("/api/ai/seo-audit", payload);
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
      const payload = {
        visitorCount: visitors,
        conversionRate: convRate,
        activeLeadsCount: leads.length,
      };
      const result = await api.post<{ recommendations: GrowthRecommendation[] }>("/api/ai/recommendations", payload);
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
        leadsLoading,
        leadsError,
        onboardingAnswers,
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
        screens,
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
        runGrowthRecs
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
