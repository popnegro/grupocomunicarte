import React, { useState, useEffect } from "react";
import { useCms } from "./CmsContext";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Sparkles,
  Users,
  Map,
  MapPin,
  X,
  ChevronUp,
  ChevronDown,
  Download,
  Sliders,
  Check,
  Plus,
  Trash2,
  ChevronRight,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Search,
  AlertTriangle,
  Zap,
  Shield,
  Briefcase,
  Tv,
  Eye,
  EyeOff,
  Edit,
  Save,
  Undo,
  Layers,
  DollarSign
} from "lucide-react";
import { LandingView } from "./LandingView";
import { InteractiveMap } from "./InteractiveMap";
import { ScreenCard } from "./ScreenCard";
import { DesignSystemAuditView } from "./DesignSystemAuditView";
import { SitemapSeoView } from "./SitemapSeoView";
import { MetricCard } from "@/src/components/cards/MetricCard";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/src/components/ui/card";

export const DashboardView: React.FC = () => {
  const {
    content,
    leads,
    onboardingAnswers,
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
    loadingAI,
    generateAIContent,
    seoReport,
    runSeoAudit,
    growthRecs,
    runGrowthRecs,
    fetchLeads,
    screens,
    setScreens,
    updateScreenStatus,
    updateScreen,
  } = useCms();

  const [localHero, setLocalHero] = useState(content.hero);
  const [localSeo, setLocalSeo] = useState(content.seo);
  
  // Local state for manually adding leads
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ name: "", email: "", company: "", value: 1500 });
  const [editingOnboarding, setEditingOnboarding] = useState({
    businessName: onboardingAnswers?.businessName || "SmartWeb Accelerator",
    industry: onboardingAnswers?.industry || "Marketing Digital B2B",
    targetAudience: onboardingAnswers?.targetAudience || "SaaS y Fundadores",
    tone: onboardingAnswers?.tone || "profesional y confiable",
    goals: onboardingAnswers?.goals || []
  });

  const [automationToggles, setAutomationToggles] = useState({
    welcomeEmail: true,
    crmSync: true,
    weeklyReport: false,
    aiFollowup: true,
  });

  // DOOH screens management state
  const [selectedMapScreenId, setSelectedMapScreenId] = useState<string | null>(null);
  const [screenSearchQuery, setScreenSearchQuery] = useState("");
  const [editingScreenId, setEditingScreenId] = useState<string | null>(null);
  const [editedScreenData, setEditedScreenData] = useState<any>({});

  // Catalog filters
  const [catalogZoneFilter, setCatalogZoneFilter] = useState("Todas");
  const [catalogMaxPrice, setCatalogMaxPrice] = useState<number>(200000);
  const [catalogTypeFilter, setCatalogTypeFilter] = useState("Todos");
  const [loadingScreens, setLoadingScreens] = useState(false);

  useEffect(() => {
    setLoadingScreens(true);
    const timer = setTimeout(() => {
      setLoadingScreens(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [catalogZoneFilter, catalogMaxPrice, catalogTypeFilter]);

  // Route editor states
  const [selectedRouteScreenId, setSelectedRouteScreenId] = useState<string | null>(null);
  const [routePoints, setRoutePoints] = useState<{ lat: number; lng: number; nombre: string }[]>([]);
  const [newStopForm, setNewStopForm] = useState({ lat: -32.8894, lng: -68.8458, nombre: "" });

  const handleAddNewScreen = () => {
    const newId = `sc-${Date.now()}`;
    const newScreen: any = {
      id: newId,
      nombre: "Nueva Pantalla / Recorrido",
      zona: "Centro",
      tipo: "LeadMóvil",
      impactos: 15000,
      precio: 85000,
      status: "Disponible",
      lat: -32.8894,
      lng: -68.8458,
      nota: "Formato publicitario premium con recorrido lineal.",
      ruta: [
        { lat: -32.8894, lng: -68.8458, nombre: "Plaza Independencia (Inicio)" }
      ]
    };
    
    setScreens(prev => [...prev, newScreen]);
    setEditingScreenId(newId);
    setEditedScreenData(newScreen);
  };

  const handleAddStop = () => {
    if (!newStopForm.nombre) return;
    setRoutePoints(prev => [...prev, { ...newStopForm }]);
    setNewStopForm({ lat: -32.8894, lng: -68.8458, nombre: "" });
  };

  const handleRemoveStop = (index: number) => {
    setRoutePoints(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveStop = (index: number, direction: "up" | "down") => {
    setRoutePoints(prev => {
      const nextList = [...prev];
      if (direction === "up" && index > 0) {
        const temp = nextList[index];
        nextList[index] = nextList[index - 1];
        nextList[index - 1] = temp;
      } else if (direction === "down" && index < nextList.length - 1) {
        const temp = nextList[index];
        nextList[index] = nextList[index + 1];
        nextList[index + 1] = temp;
      }
      return nextList;
    });
  };

  useEffect(() => {
    setLocalHero(content.hero);
  }, [content.hero]);

  useEffect(() => {
    setLocalSeo(content.seo);
  }, [content.seo]);

  const handleSaveHero = () => {
    updateHero(localHero);
  };

  const handleSaveSeo = () => {
    updateSeo(localSeo);
  };

  const handleAddManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.email) return;
    await addLead({
      name: newLeadForm.name,
      email: newLeadForm.email,
      company: newLeadForm.company,
      source: "Onboarding Quiz",
      status: "new",
      value: Number(newLeadForm.value)
    });
    setNewLeadForm({ name: "", email: "", company: "", value: 1500 });
    setShowAddLeadModal(false);
  };

  const triggerAIGenerateFromDashboard = async () => {
    await generateAIContent(editingOnboarding as any);
  };

  const totalLeadValue = leads.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const conversionRate = leads.length > 0 ? ((leads.length / 280) * 100).toFixed(2) : "5.82";

  const availableDashboardZones = ["Todas", ...Array.from(new Set(screens.map((s) => s.zona)))];
  const catalogFilteredScreens = screens.filter((screen) => {
    const matchesLocation = catalogZoneFilter === "Todas" || screen.zona === catalogZoneFilter;
    const matchesPrice = screen.precio <= catalogMaxPrice;
    const matchesType =
      catalogTypeFilter === "Todos" ||
      screen.tipo === catalogTypeFilter ||
      (catalogTypeFilter === "Móvil" && screen.tipo === "LeadMóvil");
    const isAvailable = screen.status === "Activo";
    return matchesLocation && matchesPrice && matchesType && isAvailable;
  });

  const activeRouteScreen = screens.find((s) => s.id === selectedRouteScreenId);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6 space-y-8">
          {/* Sidebar Logo */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white text-slate-950 flex items-center justify-center font-black text-lg">
              S
            </div>
            <div>
              <span className="font-bold text-white text-md block leading-none">SmartWeb</span>
              <span className="text-[10px] text-slate-400 font-mono">Consola CMS v1.0</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
              Administración
            </span>
            {[
              { id: "landing-editor", label: "Editor CMS Landing", icon: LayoutDashboard },
              { id: "ai-assistant", label: "Motor de Copy IA", icon: Sparkles },
              { id: "leads-analytics", label: "Leads y Analytics", icon: Users },
              { id: "commercial-map", label: "Mapa Comercial", icon: Map },
              { id: "brand-kit", label: "MediaKit & Assets", icon: Download },
              { id: "automations", label: "Automatizaciones", icon: Sliders },
              { id: "design-system", label: "Sistema de Diseño & Auditoría", icon: Shield },
              { id: "sitemap-seo", label: "Sitemap Multipage & SEO", icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentDashboardTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentDashboardTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-800 text-white shadow-sm"
                      : "hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2 px-2">
            <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 text-[10px] font-bold">
              GL
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-semibold text-white truncate leading-none">grasso.luis@gmail.com</span>
              <span className="text-[10px] text-slate-500">Propietario / Admin</span>
            </div>
          </div>
          <button
            onClick={() => setActiveView("landing")}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            Ver Landing Pública
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden sticky top-0 z-50 bg-slate-900 text-white px-4 py-3 flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-white text-slate-950 flex items-center justify-center font-bold text-xs">S</div>
          <span className="font-bold text-sm tracking-tight">SmartWeb</span>
        </div>
        <div className="flex items-center gap-1">
          <select
            value={currentDashboardTab}
            onChange={(e) => setCurrentDashboardTab(e.target.value)}
            className="bg-slate-800 text-xs border-none rounded px-2.5 py-1 text-slate-200 outline-none"
          >
            <option value="landing-editor">CMS Editor</option>
            <option value="ai-assistant">Copy IA</option>
            <option value="leads-analytics">Leads</option>
            <option value="commercial-map">Mapa</option>
            <option value="brand-kit">MediaKit</option>
            <option value="automations">Automatizaciones</option>
            <option value="design-system">Sistema de Diseño & Auditoría</option>
            <option value="sitemap-seo">Sitemap & SEO</option>
          </select>
          <button
            onClick={() => setActiveView("landing")}
            className="text-xs bg-slate-800 px-2 py-1 rounded font-semibold"
          >
            Salir
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 hidden md:flex">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Consola de Control SmartWeb</h1>
            <p className="text-xs text-slate-500">Administra el motor IA, contenido CMS y los clientes capturados.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetToDefault();
                setLocalHero(DEFAULT_LANDING_CONTENT.hero);
                setLocalSeo(DEFAULT_LANDING_CONTENT.seo);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Reestablecer CMS
            </button>
            <button
              onClick={() => setActiveView("landing")}
              className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Vista Previa Landing
            </button>
          </div>
        </header>

        {/* WORK AREA */}
        <div className="flex-grow overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* TAB 1: LANDING EDITOR */}
            {currentDashboardTab === "landing-editor" && (
              <motion.div
                key="tab-editor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid lg:grid-cols-12 gap-8">
                  {/* Left Side: CMS Form Fields */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* Hero copy editor */}
                    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                      <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Sliders className="h-4 w-4 text-slate-500" />
                          Sección Principal (Hero)
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md font-mono animate-pulse">
                            Auto-sync activo
                          </span>
                          <Button
                            onClick={handleSaveHero}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 h-auto rounded"
                          >
                            Forzar Guardado
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-5 space-y-3.5">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Badge Superior
                            </label>
                            <span className="text-[8px] text-slate-400 font-medium">Sincronización instantánea</span>
                          </div>
                          <input
                            type="text"
                            value={localHero.badge}
                            onChange={(e) => {
                              const updated = { ...localHero, badge: e.target.value };
                              setLocalHero(updated);
                              updateHero(updated);
                            }}
                            className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Título Principal
                            </label>
                            <span className="text-[8px] text-slate-400 font-medium">Sincronización instantánea</span>
                          </div>
                          <input
                            type="text"
                            value={localHero.title}
                            onChange={(e) => {
                              const updated = { ...localHero, title: e.target.value };
                              setLocalHero(updated);
                              updateHero(updated);
                            }}
                            className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Subtítulo / Propuesta de Valor
                            </label>
                            <span className="text-[8px] text-slate-400 font-medium">Sincronización instantánea</span>
                          </div>
                          <textarea
                            rows={3}
                            value={localHero.subtitle}
                            onChange={(e) => {
                              const updated = { ...localHero, subtitle: e.target.value };
                              setLocalHero(updated);
                              updateHero(updated);
                            }}
                            className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 resize-none bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Botón Principal
                            </label>
                            <input
                              type="text"
                              value={localHero.ctaPrimary}
                              onChange={(e) => {
                                const updated = { ...localHero, ctaPrimary: e.target.value };
                                setLocalHero(updated);
                                updateHero(updated);
                              }}
                              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Botón Secundario
                            </label>
                            <input
                              type="text"
                              value={localHero.ctaSecondary}
                              onChange={(e) => {
                                const updated = { ...localHero, ctaSecondary: e.target.value };
                                setLocalHero(updated);
                                updateHero(updated);
                              }}
                              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Benefits List Editor */}
                    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                      <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Sliders className="h-4 w-4 text-slate-500" />
                          Sección de Beneficios (CMS)
                        </CardTitle>
                        <Button
                          onClick={() => {
                            addBenefit({
                              id: `b-${Date.now()}`,
                              title: "Nuevo Beneficio",
                              description: "Añade una descripción impactante sobre este módulo.",
                              icon: "Sparkles",
                            });
                          }}
                          className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1.5 h-auto rounded"
                        >
                          <Plus className="h-3 w-3" />
                          Nuevo
                        </Button>
                      </CardHeader>

                      <CardContent className="pt-5 space-y-3.5 max-h-80 overflow-y-auto pr-1">
                        {content.benefits.map((b) => (
                          <div key={b.id} className="p-3 bg-slate-50 border border-slate-150 rounded-lg space-y-2 relative">
                            <button
                              onClick={() => deleteBenefit(b.id)}
                              className="absolute top-3 right-3 text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="grid grid-cols-12 gap-2 pr-6">
                              <div className="col-span-4">
                                <label className="block text-[8px] font-bold text-slate-500 uppercase">Icono</label>
                                <select
                                  value={b.icon}
                                  onChange={(e) => updateBenefit(b.id, { icon: e.target.value })}
                                  className="w-full mt-0.5 px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                                >
                                  <option value="Sparkles">Destello</option>
                                  <option value="Zap">Rayo</option>
                                  <option value="Shield">Escudo</option>
                                  <option value="BarChart">Gráfico</option>
                                  <option value="Target">Blanco</option>
                                  <option value="Users">Usuarios</option>
                                </select>
                              </div>
                              <div className="col-span-8">
                                <label className="block text-[8px] font-bold text-slate-500 uppercase">Título del Beneficio</label>
                                <input
                                  type="text"
                                  value={b.title}
                                  onChange={(e) => updateBenefit(b.id, { title: e.target.value })}
                                  className="w-full mt-0.5 px-2.5 py-1 text-xs border border-slate-200 rounded"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-slate-500 uppercase">Descripción Corta</label>
                              <textarea
                                rows={1.5}
                                value={b.description}
                                onChange={(e) => updateBenefit(b.id, { description: e.target.value })}
                                className="w-full mt-0.5 px-2.5 py-1 text-xs border border-slate-200 rounded resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* SEO Copy Editor */}
                    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                      <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Sliders className="h-4 w-4 text-slate-500" />
                          Indexación y Metadatos SEO
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md font-mono animate-pulse">
                            Auto-sync activo
                          </span>
                          <Button
                            onClick={handleSaveSeo}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 h-auto rounded"
                          >
                            Forzar Guardado
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-5 space-y-3.5">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Meta Title (Título del Sitio en Google)
                            </label>
                            <span className="text-[8px] text-slate-400 font-medium">Sincronización instantánea</span>
                          </div>
                          <input
                            type="text"
                            value={localSeo.metaTitle}
                            onChange={(e) => {
                              const updated = { ...localSeo, metaTitle: e.target.value };
                              setLocalSeo(updated);
                              updateSeo(updated);
                            }}
                            className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Meta Description (Resumen en Buscadores)
                            </label>
                            <span className="text-[8px] text-slate-400 font-medium">Sincronización instantánea</span>
                          </div>
                          <textarea
                            rows={2}
                            value={localSeo.metaDescription}
                            onChange={(e) => {
                              const updated = { ...localSeo, metaDescription: e.target.value };
                              setLocalSeo(updated);
                              updateSeo(updated);
                            }}
                            className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-900 resize-none bg-white"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Palabras Clave SEO (separadas por comas)
                            </label>
                            <span className="text-[8px] text-slate-400 font-medium">Sincronización instantánea</span>
                          </div>
                          <input
                            type="text"
                            value={localSeo.keywords}
                            onChange={(e) => {
                              const updated = { ...localSeo, keywords: e.target.value };
                              setLocalSeo(updated);
                              updateSeo(updated);
                            }}
                            className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Side: Real-time interactive simulation panel of Landing */}
                  <div className="lg:col-span-6 space-y-4">
                    <Card className="border border-slate-200 rounded-2xl bg-white shadow-lg overflow-hidden h-[810px] flex flex-col relative">
                      <CardHeader className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          Vista Previa en Tiempo Real
                        </CardTitle>
                        <CardDescription className="text-[10px] text-slate-400 font-mono">
                          Modo: iFrame Simulado
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
                        {/* Interactive mock browser address bar */}
                        <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                          </div>
                          <div className="flex-grow max-w-sm mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                            <span>https://smartweb.ai/demo-landing</span>
                            <RefreshCw className="h-3 w-3 text-slate-300 animate-spin-slow" />
                          </div>
                        </div>

                        {/* Mocked Landing Content viewport */}
                        <div className="flex-grow overflow-y-auto scale-[0.85] origin-top w-[117.6%] h-[117.6%] select-none pointer-events-none">
                          <LandingView />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: AI COPYWRITER ENGINE */}
            {currentDashboardTab === "ai-assistant" && (
              <motion.div
                key="tab-ai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4 border-b border-slate-100 pb-5">
                    <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
                      <Sparkles className="h-5 w-5 fill-white/10" />
                    </div>
                    <div>
                      <CardTitle className="text-md font-bold text-slate-900">Motor de Redacción Creativa Inteligente</CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-1">
                        Inyecta las directivas de tu marca y deja que la IA de Google Gemini diseñe una Landing de alta conversión.
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Nombre de la Empresa
                          </label>
                          <input
                            type="text"
                            value={editingOnboarding.businessName}
                            onChange={(e) => setEditingOnboarding({ ...editingOnboarding, businessName: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            ¿Qué hace tu negocio? (Industria y Propuesta)
                          </label>
                          <textarea
                            rows={4}
                            value={editingOnboarding.industry}
                            onChange={(e) => setEditingOnboarding({ ...editingOnboarding, industry: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none bg-white text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Público Objetivo
                            </label>
                            <input
                              type="text"
                              value={editingOnboarding.targetAudience}
                              onChange={(e) => setEditingOnboarding({ ...editingOnboarding, targetAudience: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Tono de Comunicación
                            </label>
                            <select
                              value={editingOnboarding.tone}
                              onChange={(e) => setEditingOnboarding({ ...editingOnboarding, tone: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800"
                            >
                              <option value="profesional y confiable">Profesional y Confiable</option>
                              <option value="innovador y tecnológico">Innovador y Tecnológico</option>
                              <option value="cercano y amigable">Cercano y Amigable</option>
                              <option value="enérgico y directo">Enérgico y Directo</option>
                            </select>
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button
                            type="button"
                            onClick={triggerAIGenerateFromDashboard}
                            disabled={loadingAI}
                            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-6 rounded-lg shadow-sm transition-all cursor-pointer h-auto"
                          >
                            {loadingAI ? (
                              <>
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Generando Copy con Gemini...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4.5 w-4.5 fill-white/10" />
                                <span>Generar Nuevo Contenido</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Live Output Banner */}
                {onboardingAnswers && (
                  <Card className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-5 flex items-start gap-3.5 shadow-none">
                    <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-emerald-950 text-sm">Contenido Sincronizado</h4>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        El motor IA ha completado con éxito la redacción comercial basada en tus directivas de marca. Toda la Landing ya muestra el nuevo copy (Hero, Beneficios y FAQs).
                      </p>
                    </div>
                  </Card>
                )}
              </motion.div>
            )}

            {/* TAB 3: LEADS, ANALYTICS AND SEO AUDITING */}
            {currentDashboardTab === "leads-analytics" && (
              <motion.div
                key="tab-leads"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                 {/* Visual Metrics Row */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                   <MetricCard
                     title="Visitas Totales"
                     value="14,232"
                     trend="up"
                     percentage={12.4}
                     variation="esta semana"
                     sparkline={[12200, 12500, 13100, 13400, 13900, 14232]}
                     icon={<Eye className="h-4 w-4" />}
                     tooltip="Número total de visitantes únicos que accedieron a la landing page."
                   />

                   <MetricCard
                     title="Tasa de Conversión"
                     value={`${conversionRate}%`}
                     trend="up"
                     percentage={1.1}
                     variation="esta semana"
                     sparkline={[4.8, 5.0, 5.2, 5.5, 5.7, Number(conversionRate)]}
                     icon={<Zap className="h-4 w-4" />}
                     tooltip="Porcentaje de visitantes que se convirtieron en prospectos registrados."
                   />

                   <MetricCard
                     title="Leads Totales"
                     value={leads.length}
                     trend="up"
                     percentage={18.5}
                     variation={`+${leads.filter(l => l.status === "new").length} nuevos hoy`}
                     sparkline={[8, 11, 14, 15, 17, leads.length]}
                     icon={<Users className="h-4 w-4" />}
                     tooltip="Prospectos de clientes comerciales capturados por la plataforma."
                   />

                   <MetricCard
                     title="Valor de Pipeline"
                     value={`$${totalLeadValue.toLocaleString()} USD`}
                     trend="up"
                     percentage={24.1}
                     variation="Suma total estimada"
                     sparkline={[25000, 27500, 31000, 33500, 38000, totalLeadValue]}
                     icon={<DollarSign className="h-4 w-4" />}
                     tooltip="Valor acumulado de pauta estimada para los prospectos capturados."
                   />
                 </div>

                {/* Sub-grid: Leads Table + SEO / Recommendations IA */}
                <div className="grid lg:grid-cols-12 gap-8">
                  {/* Leads captured table */}
                  <Card className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-500" />
                        Prospectos Capturados
                      </CardTitle>
                      <Button
                        onClick={() => setShowAddLeadModal(true)}
                        className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1.5 h-auto rounded cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        Registrar Prospecto
                      </Button>
                    </CardHeader>

                    <CardContent className="pt-4 overflow-x-auto flex-grow">
                      <table className="w-full text-left text-xs text-slate-500">
                        <thead>
                          <tr className="border-b border-slate-100 font-bold text-slate-700 pb-2">
                            <th className="pb-2.5">Nombre</th>
                            <th className="pb-2.5">Empresa</th>
                            <th className="pb-2.5">Origen</th>
                            <th className="pb-2.5">Estado</th>
                            <th className="pb-2.5 text-right">Valor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3">
                                <span className="block font-bold text-slate-900">{lead.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{lead.email}</span>
                              </td>
                              <td className="py-3 font-semibold text-slate-700">{lead.company}</td>
                              <td className="py-3">
                                <span className="text-[10px] font-mono bg-slate-100/70 text-slate-600 px-2 py-0.5 rounded-md inline-block">
                                  {lead.source}
                                </span>
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                    lead.status === "new"
                                      ? "bg-blue-100 text-blue-700"
                                      : lead.status === "qualified"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : lead.status === "contacted"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {lead.status === "new" ? "Nuevo" : lead.status === "qualified" ? "Calificado" : lead.status === "contacted" ? "Contactado" : "Cerrado"}
                                </span>
                              </td>
                              <td className="py-3 text-right font-mono font-bold text-slate-950">${lead.value?.toLocaleString() || "0"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>

                  {/* AI SEO & Optimization Auditor */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* SEO AUDITOR CARD */}
                    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                      <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-slate-500" />
                          Auditor de Calidad y SEO IA
                        </CardTitle>
                        <Button
                          onClick={runSeoAudit}
                          disabled={loadingAI}
                          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 h-auto rounded cursor-pointer"
                        >
                          {loadingAI ? "Analizando..." : "Auditar Sitio con IA"}
                        </Button>
                      </CardHeader>

                      <CardContent className="pt-5 space-y-4">
                        {!seoReport ? (
                          <div className="text-center py-6 space-y-2.5">
                            <Search className="h-8 w-8 text-slate-300 mx-auto" />
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-slate-700">Sin Auditoría Reciente</h4>
                              <p className="text-[10px] text-slate-400 px-6">
                                Haz clic en auditar para analizar la optimización SEO, CRO y redacción de tu Landing con Gemini.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Circle Scores */}
                            <div className="grid grid-cols-3 gap-2.5 text-center">
                              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl">
                                <span className="block text-2xl font-black text-slate-900">{seoReport.seoScore}</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">SEO</span>
                              </div>
                              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl">
                                <span className="block text-2xl font-black text-slate-900">{seoReport.readabilityScore}</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Lector</span>
                              </div>
                              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl">
                                <span className="block text-2xl font-black text-slate-900">{seoReport.croScore}</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">CRO</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnóstico</span>
                              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                                {seoReport.summary}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recomendaciones Clave</span>
                              <ul className="space-y-1.5 text-xs text-slate-600">
                                {seoReport.improvements.slice(0, 3).map((item, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* GROWTH REC CARD */}
                    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                      <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-slate-500" />
                          Estrategia de Crecimiento IA
                        </CardTitle>
                        <Button
                          onClick={() => runGrowthRecs(14232, 5.82)}
                          disabled={loadingAI}
                          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 h-auto rounded cursor-pointer"
                        >
                          {loadingAI ? "Recomendando..." : "Consultar Consultora IA"}
                        </Button>
                      </CardHeader>

                      <CardContent className="pt-5">
                        {growthRecs.length === 0 ? (
                          <p className="text-[10px] text-slate-400 text-center py-4">
                            Analiza tus leads para recibir recomendaciones de optimización estratégica por IA.
                          </p>
                        ) : (
                          <div className="space-y-3.5">
                            {growthRecs.map((rec, idx) => (
                              <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-lg space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                                  <span className="bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                                    Impacto {rec.impact}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{rec.description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: COMMERCIAL MAP (DOOH INVENTORY MANAGEMENT) */}
            {currentDashboardTab === "commercial-map" && (
              <motion.div
                key="tab-map"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Header Card */}
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="space-y-1">
                      <CardTitle className="text-md font-bold text-slate-900 flex items-center gap-2">
                        <Tv className="h-5 w-5 text-slate-800" />
                        Gestor de Inventario de Pantallas DOOH
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Administra la red de pantallas publicitarias en Mendoza. Activa, pausa o edita las tarifas e impactos semanales para actualizar el Cotizador de la Landing en tiempo real.
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-slate-500">Búsqueda:</span>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <Input
                          type="text"
                          placeholder="Buscar pantallas..."
                          value={screenSearchQuery}
                          onChange={(e) => setScreenSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 h-9 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    {/* Grid split: Interactive Map & Quick Statistics */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Map */}
                      <Card className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
                          <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Ubicaciones Georreferenciadas (Mapa En Vivo)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 h-[350px]">
                          <InteractiveMap
                            screens={screens}
                            selectedScreenId={selectedMapScreenId}
                            onSelectScreen={(id) => setSelectedMapScreenId(id)}
                          />
                        </CardContent>
                      </Card>

                      {/* Right: DOOH Network KPIs */}
                      <Card className="lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
                          <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Métricas de la Red DOOH
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="p-4 space-y-4 flex-grow">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Disponibles</span>
                              <span className="text-xl font-extrabold text-slate-950">
                                {screens.filter((s) => s.status === "Activo" || s.status === "Disponible").length}
                              </span>
                              <span className="text-[8px] text-emerald-600 font-semibold block">Disponibles</span>
                            </div>
                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">No Disponibles</span>
                              <span className="text-xl font-extrabold text-slate-950">
                                {screens.filter((s) => s.status === "Pausado" || s.status === "No disponible").length}
                              </span>
                              <span className="text-[8px] text-slate-500 font-semibold block">Pausado / Mant.</span>
                            </div>
                          </div>

                          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                              Valor de Inventario Semanal (Activo)
                            </span>
                            <span className="text-2xl font-black block text-emerald-400">
                              $
                              {screens
                                .filter((s) => s.status === "Activo" || s.status === "Disponible")
                                .reduce((sum, s) => sum + s.precio, 0)
                                .toLocaleString("es-AR")}
                            </span>
                            <span className="text-[10px] text-slate-300 block">
                              Impacto potencial acumulado:{" "}
                              <strong className="text-white">
                                {screens
                                  .filter((s) => s.status === "Activo" || s.status === "Disponible")
                                  .reduce((sum, s) => sum + s.impactos, 0)
                                  .toLocaleString("es-AR")}
                              </strong>{" "}
                              personas/semana.
                            </span>
                          </div>
                        </CardContent>

                        <CardFooter className="bg-slate-50 border-t border-slate-100 p-3.5 flex items-start gap-2 text-xs text-slate-600">
                          <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <div className="text-[10px] leading-relaxed">
                            <strong className="text-slate-800">Sincronización Automática:</strong> Cualquier modificación de tarifa o pausa se actualizará instantáneamente en el cotizador interactivo.
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Visual DOOH Screen Catalog */}
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Tv className="h-4 w-4 text-slate-800" />
                        Catálogo de Pantallas en Campaña
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-1">
                        Visualiza, filtra y añade pantallas directamente a tu plan comercial interactivo.
                      </CardDescription>
                    </div>

                    <div className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shrink-0 shadow-xs">
                      Pantallas Disponibles: <span className="text-slate-900">{catalogFilteredScreens.length}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6 space-y-6">
                    {/* Filter controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 border border-slate-200 rounded-xl p-4 shadow-xs">
                    {/* Location selector */}
                    <div className="space-y-3">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Filtrar por Zona o Ubicación
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {availableDashboardZones.map((zone) => {
                          const isSelected = catalogZoneFilter === zone;
                          return (
                            <Button
                              key={zone}
                              onClick={() => setCatalogZoneFilter(zone)}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="h-8 text-xs font-bold"
                            >
                              {zone}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Format / Type Selector */}
                    <div className="space-y-3">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Filtrar por Tipo de Formato
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {["Todos", "Peatonal", "Vehicular", "Mixto", "Móvil"].map((tipo) => {
                          const isSelected = catalogTypeFilter === tipo;
                          return (
                            <Button
                              key={tipo}
                              onClick={() => setCatalogTypeFilter(tipo)}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="h-8 text-xs font-bold"
                            >
                              {tipo}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Price Range Selector */}
                    <div className="space-y-3">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Filtrar por Rango de Precio Semanal
                      </span>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Presupuesto Máximo Semanal</span>
                          <span className="text-xs font-black text-slate-950 bg-slate-100 px-2.5 py-1 rounded">
                            ${catalogMaxPrice.toLocaleString("es-AR")} ARS
                          </span>
                        </div>
                        <input
                          type="range"
                          min="50000"
                          max="200000"
                          step="5000"
                          value={catalogMaxPrice}
                          onChange={(e) => setCatalogMaxPrice(Number(e.target.value))}
                          className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                          <span>Min: $50.000</span>
                          <span>Max: $200.000</span>
                        </div>
                      </div>

                      {/* Presets */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Preajustes:</span>
                        <button
                          onClick={() => setCatalogMaxPrice(100000)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[10px] text-slate-600 font-semibold rounded"
                        >
                          Económico (&lt;$100k)
                        </button>
                        <button
                          onClick={() => setCatalogMaxPrice(150000)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[10px] text-slate-600 font-semibold rounded"
                        >
                          Medio (&lt;$150k)
                        </button>
                        <button
                          onClick={() => setCatalogMaxPrice(200000)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[10px] text-slate-600 font-semibold rounded"
                        >
                          Cualquiera
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Responsive grid for catalog screens */}
                  {loadingScreens ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={`skeleton-${index}`}
                          className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm p-5 space-y-4"
                        >
                          {/* Image skeleton */}
                          <Skeleton className="h-44 w-full rounded-lg bg-slate-150/80" />
                          {/* Title and tags skeleton */}
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4 bg-slate-150/80" />
                            <div className="flex gap-2">
                              <Skeleton className="h-5 w-16 rounded-full bg-slate-150/80" />
                              <Skeleton className="h-5 w-24 rounded-full bg-slate-150/80" />
                            </div>
                          </div>
                          {/* Stats skeleton */}
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                            <div className="space-y-1">
                              <Skeleton className="h-3 w-1/2 bg-slate-150/80" />
                              <Skeleton className="h-4 w-2/3 bg-slate-150/80" />
                            </div>
                            <div className="space-y-1">
                              <Skeleton className="h-3 w-1/2 bg-slate-150/80" />
                              <Skeleton className="h-4 w-2/3 bg-slate-150/80" />
                            </div>
                          </div>
                          {/* Button skeleton */}
                          <div className="pt-2">
                            <Skeleton className="h-10 w-full rounded-xl bg-slate-150/80" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : catalogFilteredScreens.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catalogFilteredScreens.map((screen) => (
                        <ScreenCard
                          key={screen.id}
                          screen={screen}
                          onFocusOnMap={() => setSelectedMapScreenId(screen.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 px-6 border border-dashed border-slate-200 rounded-2xl bg-white space-y-6 max-w-lg mx-auto flex flex-col items-center justify-center shadow-xs">
                      {/* Modern Radar Scanning Illustration */}
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-slate-50 border border-slate-100 animate-pulse" />
                        <div className="absolute inset-4 rounded-full bg-slate-100 border border-slate-200/50 animate-ping [animation-duration:3s]" />
                        <div className="absolute inset-8 rounded-full bg-slate-100 border border-slate-200" />
                        {/* Subtle vector scope lines */}
                        <svg className="absolute inset-0 w-full h-full text-slate-200 animate-spin [animation-duration:12s]" viewBox="0 0 100 100" fill="none">
                          <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                          <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                          <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" strokeDasharray="2,4" />
                        </svg>
                        <Tv className="h-8 w-8 text-slate-500 relative z-10 drop-shadow-xs" />
                        <Search className="h-4.5 w-4.5 text-slate-900 absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md border border-slate-200" />
                      </div>

                      <div className="space-y-2 max-w-sm">
                        <h4 className="font-black text-slate-900 text-sm">No se encontraron pantallas</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          No hay pantallas disponibles en la zona <span className="font-bold text-slate-800">"{catalogZoneFilter}"</span> con un precio inferior o igual a <span className="font-bold text-slate-800">${catalogMaxPrice.toLocaleString("es-AR")} ARS</span>.
                        </p>
                      </div>

                      <Button
                        onClick={() => {
                          setCatalogZoneFilter("Todas");
                          setCatalogMaxPrice(200000);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer h-auto"
                      >
                        <Undo className="h-3 w-3" />
                        Reestablecer Filtros
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Inventory screens list and inline editor table */}
              <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mt-6">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 space-y-0">
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-900">
                      Inventario Físico de Pantallas
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      Mostrando {screens.length} ubicaciones
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleAddNewScreen}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 h-auto rounded flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Agregar Pantalla / Ruta
                  </Button>
                </CardHeader>

                <CardContent className="pt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-500">
                      <thead>
                        <tr className="border-b border-slate-150 font-bold text-slate-700 uppercase text-[9px] tracking-wider">
                          <th className="pb-2.5">Nombre & Zona</th>
                          <th className="pb-2.5">Tipo</th>
                          <th className="pb-2.5">Impactos Semanales</th>
                          <th className="pb-2.5">Precio Semanal (ARS)</th>
                          <th className="pb-2.5">Coordenadas (Lat, Lng)</th>
                          <th className="pb-2.5">Estado</th>
                          <th className="pb-2.5 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {screens
                          .filter((s) => {
                            const q = screenSearchQuery.toLowerCase();
                            return (
                              s.nombre.toLowerCase().includes(q) ||
                              s.zona.toLowerCase().includes(q) ||
                              s.tipo.toLowerCase().includes(q)
                            );
                          })
                          .map((screen) => {
                            const isEditing = editingScreenId === screen.id;
                            const isFocusedOnMap = selectedMapScreenId === screen.id;

                            return (
                              <tr
                                key={screen.id}
                                onClick={() => setSelectedMapScreenId(screen.id)}
                                className={`transition-colors cursor-pointer ${
                                  isFocusedOnMap ? "bg-slate-50" : "hover:bg-slate-50/50"
                                }`}
                              >
                                <td className="py-3 pr-2">
                                  {isEditing ? (
                                    <div className="space-y-1">
                                      <input
                                        type="text"
                                        value={editedScreenData.nombre || ""}
                                        onChange={(e) =>
                                          setEditedScreenData({
                                            ...editedScreenData,
                                            nombre: e.target.value,
                                          })
                                        }
                                        className="px-2 py-1 text-xs border border-slate-200 rounded w-full font-bold bg-white text-slate-900"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <input
                                        type="text"
                                        value={editedScreenData.zona || ""}
                                        onChange={(e) =>
                                          setEditedScreenData({
                                            ...editedScreenData,
                                            zona: e.target.value,
                                          })
                                        }
                                        className="px-2 py-0.5 text-[10px] border border-slate-200 rounded w-full bg-white text-slate-600"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                  ) : (
                                    <div className="space-y-0.5">
                                      <span className="block font-bold text-slate-900">
                                        {screen.nombre}
                                      </span>
                                      <span className="text-[10px] text-slate-500 font-semibold uppercase">
                                        {screen.zona}
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="py-3">
                                  {isEditing ? (
                                    <select
                                      value={editedScreenData.tipo || "Peatonal"}
                                      onChange={(e) =>
                                        setEditedScreenData({
                                          ...editedScreenData,
                                          tipo: e.target.value,
                                        })
                                      }
                                      className="px-1.5 py-1 text-xs border border-slate-200 rounded bg-white text-slate-800"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <option value="Peatonal">Peatonal</option>
                                      <option value="Vehicular">Vehicular</option>
                                      <option value="Mixto">Mixto</option>
                                      <option value="Móvil">Móvil</option>
                                      <option value="LeadMóvil">LeadMóvil</option>
                                    </select>
                                  ) : (
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                      (screen.tipo === "LeadMóvil" || screen.tipo === "Móvil")
                                        ? "bg-amber-100 text-amber-800 border border-amber-200 shadow-xs"
                                        : "bg-slate-100 text-slate-600"
                                    }`}>
                                      {screen.tipo}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={editedScreenData.impactos || 0}
                                      onChange={(e) =>
                                        setEditedScreenData({
                                          ...editedScreenData,
                                          impactos: Number(e.target.value),
                                        })
                                      }
                                      className="px-2 py-1 text-xs border border-slate-200 rounded w-28 bg-white text-slate-900"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  ) : (
                                    <span className="font-mono font-bold text-slate-800">
                                      {screen.impactos.toLocaleString("es-AR")} imp/sem
                                    </span>
                                  )}
                                </td>
                                <td className="py-3">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={editedScreenData.precio || 0}
                                      onChange={(e) =>
                                        setEditedScreenData({
                                          ...editedScreenData,
                                          precio: Number(e.target.value),
                                        })
                                      }
                                      className="px-2 py-1 text-xs border border-slate-200 rounded w-28 bg-white text-slate-900"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  ) : (
                                    <span className="font-mono font-extrabold text-slate-950">
                                      {screen.precio === 0 ? (
                                        <span className="text-blue-600 font-bold uppercase bg-blue-50 border border-blue-150 px-1.5 py-0.5 rounded text-[10px]">Consultar</span>
                                      ) : (
                                        `$${screen.precio.toLocaleString("es-AR")}`
                                      )}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 font-mono text-[10px]">
                                  {isEditing ? (
                                    <div className="flex gap-1">
                                      <input
                                        type="number"
                                        step="0.0001"
                                        value={editedScreenData.lat || 0}
                                        onChange={(e) =>
                                          setEditedScreenData({
                                            ...editedScreenData,
                                            lat: Number(e.target.value),
                                          })
                                        }
                                        className="px-1 py-0.5 text-[10px] border border-slate-200 rounded w-16 bg-white text-slate-900"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <input
                                        type="number"
                                        step="0.0001"
                                        value={editedScreenData.lng || 0}
                                        onChange={(e) =>
                                          setEditedScreenData({
                                            ...editedScreenData,
                                            lng: Number(e.target.value),
                                          })
                                        }
                                        className="px-1 py-0.5 text-[10px] border border-slate-200 rounded w-16 bg-white text-slate-900"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                  ) : (
                                    <span>
                                      {screen.lat.toFixed(4)}, {screen.lng.toFixed(4)}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() =>
                                      updateScreenStatus(
                                        screen.id,
                                        (screen.status === "Activo" || screen.status === "Disponible") ? "No disponible" : "Disponible"
                                      )
                                    }
                                    className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                      (screen.status === "Activo" || screen.status === "Disponible")
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-150 hover:bg-emerald-100"
                                        : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-150"
                                    }`}
                                  >
                                    {(screen.status === "Activo" || screen.status === "Disponible") ? "Disponible" : "No disponible"}
                                  </button>
                                </td>
                                <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                  {isEditing ? (
                                    <div className="flex justify-end gap-1">
                                      <button
                                        onClick={() => {
                                          updateScreen(screen.id, editedScreenData);
                                          setEditingScreenId(null);
                                        }}
                                        className="p-1 text-emerald-600 hover:text-emerald-800 rounded bg-emerald-50 hover:bg-emerald-100 transition-colors"
                                        title="Guardar"
                                      >
                                        <Check className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        onClick={() => setEditingScreenId(null)}
                                        className="p-1 text-slate-500 hover:text-slate-700 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                                        title="Cancelar"
                                      >
                                        <Undo className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex justify-end items-center gap-1.5">
                                      {(screen.tipo === "LeadMóvil" || screen.tipo === "Móvil") && (
                                        <button
                                          onClick={() => {
                                            setSelectedRouteScreenId(screen.id);
                                            setRoutePoints(screen.ruta || []);
                                          }}
                                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-900 border border-amber-200/50 rounded transition-colors inline-flex items-center gap-1 text-[10px] font-bold uppercase cursor-pointer"
                                        >
                                          <MapPin className="h-3 w-3" />
                                          Ruta ({screen.ruta?.length || 0})
                                        </button>
                                      )}
                                      <button
                                        onClick={() => {
                                          setEditingScreenId(screen.id);
                                          setEditedScreenData(screen);
                                        }}
                                        className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors inline-flex items-center gap-1 text-[10px] font-bold uppercase"
                                      >
                                        <Edit className="h-3 w-3" />
                                        Editar
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
            </motion.div>
          )}


            {/* TAB 5: MEDIAKIT & BRANDING */}
            {currentDashboardTab === "brand-kit" && (
              <motion.div
                key="tab-kit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto"
              >
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4 border-b border-slate-100 pb-5">
                    <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-md font-bold text-slate-900">MediaKit y Activos de Marca</CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-1">
                        Descarga directrices, logotipos y paletas corporativas generadas automáticamente para tu landing.
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-slate-50/50 border border-slate-200 rounded-xl shadow-none">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            Paleta de Colores
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded bg-slate-950 border border-slate-800" />
                              <span className="text-xs font-semibold text-slate-700">Slate Black</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">#0F172A</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded bg-emerald-500" />
                              <span className="text-xs font-semibold text-slate-700">Teal Green</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">#10B981</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded bg-slate-100 border border-slate-200" />
                              <span className="text-xs font-semibold text-slate-700">Cool Neutral</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">#F1F5F9</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-50/50 border border-slate-200 rounded-xl shadow-none">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            Descarga de Assets
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5">
                          <button className="w-full flex items-center justify-between px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white transition-all">
                            <span>Logotipo Corporativo (SVG)</span>
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="w-full flex items-center justify-between px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white transition-all">
                            <span>Guía de Identidad PDF</span>
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="w-full flex items-center justify-between px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white transition-all">
                            <span>Kit de Prensa Digital (Zip)</span>
                            <Download className="h-4 w-4" />
                          </button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* TAB 6: AUTOMATIONS */}
            {currentDashboardTab === "automations" && (
              <motion.div
                key="tab-automations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4 border-b border-slate-100 pb-5">
                    <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
                      <Sliders className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <CardTitle className="text-md font-bold text-slate-900">Configuración de Automatizaciones</CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-1">
                        Sincroniza y gatilla respuestas comerciales inmediatas a tus nuevos prospectos.
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl transition-all hover:bg-slate-100/50">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900">Email de Bienvenida Automatizado</h4>
                        <p className="text-[10px] text-slate-400">Envía un email redactado por IA a cada nuevo lead en la landing.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={automationToggles.welcomeEmail}
                          onChange={(e) => setAutomationToggles({ ...automationToggles, welcomeEmail: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl transition-all hover:bg-slate-100/50">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900">Sincronización HubSpot CRM</h4>
                        <p className="text-[10px] text-slate-400">Sincroniza prospectos automáticamente con pipelines externos.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={automationToggles.crmSync}
                          onChange={(e) => setAutomationToggles({ ...automationToggles, crmSync: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl transition-all hover:bg-slate-100/50">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900">Reporte Analítico Semanal</h4>
                        <p className="text-[10px] text-slate-400">Envía un resumen de visitas y tasa de conversión cada domingo.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={automationToggles.weeklyReport}
                          onChange={(e) => setAutomationToggles({ ...automationToggles, weeklyReport: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* TAB 7: DESIGN SYSTEM & AUDIT */}
            {currentDashboardTab === "design-system" && (
              <motion.div
                key="tab-design-system"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DesignSystemAuditView />
              </motion.div>
            )}

            {/* TAB 8: SITEMAP & MULTIPAGE SEO */}
            {currentDashboardTab === "sitemap-seo" && (
              <motion.div
                key="tab-sitemap-seo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SitemapSeoView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* MODAL: ADD MANUAL LEAD */}
      <AnimatePresence>
        {showAddLeadModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md space-y-4"
            >
              <h3 className="font-bold text-slate-900 text-md">Añadir Prospecto Manualmente</h3>
              <form onSubmit={handleAddManualLead} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Empresa</label>
                  <input
                    type="text"
                    value={newLeadForm.company}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Valor Pipeline ($ USD)</label>
                  <input
                    type="number"
                    value={newLeadForm.value}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, value: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddLeadModal(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
                  >
                    Registrar Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* SPECIALIZED ROUTE CONFIGURATION MODAL */}
        {selectedRouteScreenId && activeRouteScreen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-black rounded uppercase">
                      LeadMóvil Mendoza
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      ID: {activeRouteScreen.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight">
                    Configuración de Recorrido Lineal: {activeRouteScreen.nombre}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Define la secuencia de paradas exclusivas para este dispositivo móvil de vía pública.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRouteScreenId(null)}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto max-h-[60vh]">
                {/* Left Side: Stops List Table */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Secuencia de Paradas ({routePoints.length})
                    </span>
                    <span className="text-[10px] text-slate-500 italic">
                      Las paradas definen el trazado lineal del citybus.
                    </span>
                  </div>

                  {routePoints.length === 0 ? (
                    <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50 space-y-2">
                      <MapPin className="h-8 w-8 text-slate-300 mx-auto animate-pulse" />
                      <p className="text-xs font-bold text-slate-700">No hay paradas configuradas</p>
                      <p className="text-[10px] text-slate-500">Usa el panel de la derecha para añadir o sugerir paradas.</p>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs max-h-[350px] overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-150 font-bold text-slate-500 text-[9px] uppercase tracking-wider">
                            <th className="p-3">#</th>
                            <th className="p-3">Nombre de Parada</th>
                            <th className="p-3">Coords (Lat, Lng)</th>
                            <th className="p-3 text-right">Orden / Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {routePoints.map((stop, index) => {
                            const isFirst = index === 0;
                            const isLast = index === routePoints.length - 1;
                            return (
                              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-3 font-mono font-bold text-slate-400">
                                  {index + 1}
                                </td>
                                <td className="p-3">
                                  <input
                                    type="text"
                                    value={stop.nombre}
                                    onChange={(e) => {
                                      const updated = [...routePoints];
                                      updated[index].nombre = e.target.value;
                                      setRoutePoints(updated);
                                    }}
                                    className="px-2 py-1 text-xs border border-slate-200 rounded bg-white text-slate-800 w-full font-semibold"
                                  />
                                </td>
                                <td className="p-3 font-mono text-[10px] text-slate-600 space-y-1">
                                  <div className="flex gap-1">
                                    <input
                                      type="number"
                                      step="0.0001"
                                      value={stop.lat}
                                      onChange={(e) => {
                                        const updated = [...routePoints];
                                        updated[index].lat = Number(e.target.value);
                                        setRoutePoints(updated);
                                      }}
                                      className="px-1 py-0.5 text-[10px] border border-slate-200 rounded bg-white text-slate-800 w-16"
                                    />
                                    <input
                                      type="number"
                                      step="0.0001"
                                      value={stop.lng}
                                      onChange={(e) => {
                                        const updated = [...routePoints];
                                        updated[index].lng = Number(e.target.value);
                                        setRoutePoints(updated);
                                      }}
                                      className="px-1 py-0.5 text-[10px] border border-slate-200 rounded bg-white text-slate-800 w-16"
                                    />
                                  </div>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex justify-end gap-1">
                                    <button
                                      type="button"
                                      disabled={isFirst}
                                      onClick={() => handleMoveStop(index, "up")}
                                      className={`p-1 rounded ${
                                        isFirst ? "text-slate-300 bg-slate-50 cursor-not-allowed" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-slate-50"
                                      }`}
                                      title="Subir"
                                    >
                                      <ChevronUp className="h-3 w-3" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isLast}
                                      onClick={() => handleMoveStop(index, "down")}
                                      className={`p-1 rounded ${
                                        isLast ? "text-slate-300 bg-slate-50 cursor-not-allowed" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-slate-50"
                                      }`}
                                      title="Bajar"
                                    >
                                      <ChevronDown className="h-3 w-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveStop(index)}
                                      className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 bg-rose-50/50 rounded"
                                      title="Eliminar"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Right Side: Preset Suggestions & Add Stop Form */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Presets Card */}
                  <div className="border border-amber-100 rounded-xl p-4 bg-amber-50/20 space-y-3.5">
                    <span className="block text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      Sugerencias de Mendoza
                    </span>
                    <p className="text-[10px] text-slate-500">
                      Puntos estratégicos sugeridos para el recorrido lineal:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { nombre: "Plaza Independencia", lat: -32.8894, lng: -68.8458 },
                        { nombre: "Av. Arístides y Belgrano", lat: -32.8908, lng: -68.8552 },
                        { nombre: "Parque Gral San Martín", lat: -32.8908, lng: -68.8762 },
                        { nombre: "Terminal Mendoza", lat: -32.8868, lng: -68.8284 },
                        { nombre: "Palmares Open Mall", lat: -32.9121, lng: -68.8306 },
                        { nombre: "Parque Benegas G. Cruz", lat: -32.9246, lng: -68.8488 }
                      ].map((preset) => (
                        <button
                          key={preset.nombre}
                          type="button"
                          onClick={() => setNewStopForm(preset)}
                          className="px-2.5 py-1.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-800 rounded-lg text-left text-[10px] font-semibold transition-all truncate cursor-pointer shadow-xs"
                        >
                          📍 {preset.nombre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Form */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <span className="block text-[10px] font-black text-slate-700 uppercase tracking-wider">
                      Añadir Nueva Parada Manual
                    </span>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Nombre Parada</label>
                        <input
                          type="text"
                          placeholder="Ej. Parada Arístides 1"
                          value={newStopForm.nombre}
                          onChange={(e) => setNewStopForm({ ...newStopForm, nombre: e.target.value })}
                          className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 w-full font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Latitud</label>
                          <input
                            type="number"
                            step="0.0001"
                            value={newStopForm.lat}
                            onChange={(e) => setNewStopForm({ ...newStopForm, lat: Number(e.target.value) })}
                            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 w-full font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Longitud</label>
                          <input
                            type="number"
                            step="0.0001"
                            value={newStopForm.lng}
                            onChange={(e) => setNewStopForm({ ...newStopForm, lng: Number(e.target.value) })}
                            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 w-full font-mono"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddStop}
                        disabled={!newStopForm.nombre}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          newStopForm.nombre
                            ? "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                            : "bg-slate-100 text-slate-400 border border-slate-150 cursor-not-allowed"
                        }`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Añadir Parada al Listado
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  * Asegúrate de guardar los cambios antes de salir.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRouteScreenId(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateScreen(selectedRouteScreenId, { ruta: routePoints });
                      setSelectedRouteScreenId(null);
                    }}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    Guardar Recorrido
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DEFAULT_LANDING_CONTENT = {
  hero: {
    badge: "🚀 ACELERADOR COMERCIAL INTELIGENTE",
    title: "La plataforma que convierte tus visitas en clientes recurrentes",
    subtitle: "SmartWeb unifica captación con IA, automatizaciones y un CMS avanzado para posicionar tu negocio en la cima del mercado digital.",
    ctaPrimary: "Prueba SmartWeb Gratis",
    ctaSecondary: "Ver Demo Interactiva",
  },
  seo: {
    metaTitle: "SmartWeb - Acelerador Comercial Inteligente B2B SaaS",
    metaDescription: "Crea, gestiona y optimiza tu presencia comercial digital con la IA integrada y el CMS interactivo más rápido del mercado.",
    keywords: "acelerador comercial, ia, saas b2b, cms inteligente, automatizacion de leads",
    ogImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200",
  }
};
