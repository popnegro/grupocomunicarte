import React, { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Code, Target, X, ChevronRight, AlertCircle, Tv, Calculator, Trash2, PlusCircle, Home, ArrowRight, CheckCircle, FileDown, RefreshCw, Monitor, Layers, Search, LayoutGrid, BookOpen, Clock, Users, Eye } from "lucide-react";
import { findSitemapItemBySlug, getBreadcrumbsForSlug, sitemap, SitemapItem } from "../lib/sitemap";
import { ScreenCard } from "./ScreenCard";
import { DoohScreen } from "@/src/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SoportesInventory } from "./SoportesInventory";
import { optimizeImageUrl } from "@/src/lib/imageUtils";
import { useCartStore } from "@/cartStore";
import { useCmsStore } from "@/cmsStore";

const InteractiveMap = lazy(() => import("./InteractiveMap").then(module => ({ default: module.InteractiveMap })));
// Shared Premium Buenos Aires Screens
const BUENOS_AIRES_SCREENS: DoohScreen[] = [
  {
    id: "ba-01",
    nombre: "Av. 9 de Julio y Corrientes",
    zona: "Obelisco",
    tipo: "Vehicular",
    impactos: 75000,
    precio: 220000,
    status: "Activo",
    lat: -34.6037,
    lng: -58.3816,
    nota: "Pantalla monumental frente al Obelisco, máxima visibilidad y penetración nacional.",
  },
  {
    id: "ba-02",
    nombre: "Av. del Libertador y Av. Callao",
    zona: "Recoleta",
    tipo: "Mixto",
    impactos: 42000,
    precio: 180000,
    status: "Activo",
    lat: -34.5885,
    lng: -58.3889,
    nota: "Corredor vial premium en Recoleta, conectando con audiencias de alto nivel corporativo y adquisitivo.",
  },
  {
    id: "ba-03",
    nombre: "Puerto Madero Dique 3",
    zona: "Puerto Madero",
    tipo: "Peatonal",
    impactos: 28000,
    precio: 150000,
    status: "Activo",
    lat: -34.6076,
    lng: -58.3643,
    nota: "Ubicación peatonal exclusiva en el corazón financiero, polo gastronómico y residencial de lujo.",
  },
  {
    id: "ba-04",
    nombre: "Av. Cabildo y Juramento",
    zona: "Belgrano",
    tipo: "Peatonal",
    impactos: 35000,
    precio: 130000,
    status: "Activo",
    lat: -34.5621,
    lng: -58.4566,
    nota: "Esquina neurálgica en Belgrano de altísima circulación peatonal constante y trasbordo de transporte.",
  },
];

interface SubpageLayoutProps {
  slug: string;
  handleNavigate: (slug: string) => void;
}

export const SubpageLayout: React.FC<SubpageLayoutProps> = ({
  slug,
  handleNavigate,
}) => {
  // Consumir estado y acciones desde los stores de Zustand
  const { screens, addLead, fetchPublicScreens } = useCmsStore();
  const { cart, toggleCart, clearCart, weeks, setWeeks } = useCartStore();

  const item = findSitemapItemBySlug(slug);
  const breadcrumbs = getBreadcrumbsForSlug(slug);

  // Dynamic Browser Simulation Tooltip copy
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showJsonLd, setShowJsonLd] = useState(false);

  // Mendoza / BA select logic
  const isMendoza = slug.includes("mendoza");
  const isBA = slug.includes("buenos-aires");
  const currentProvince = isBA ? "Buenos Aires" : "Mendoza";
  const provinceScreens = isBA ? BUENOS_AIRES_SCREENS : screens;
  const activeScreens = provinceScreens.filter((s) => s.status === "Activo" || s.status === "Disponible");

  // Filter Catalog states (Local to subpage layout to prevent inter-view pollution)
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"Todos" | "Peatonal" | "Vehicular" | "Mixto">("Todos");
  const [filterZone, setFilterZone] = useState("Todas");
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);

  // Soportes interactive states (for SEO formats explorer)
  const [activeFormat, setActiveFormat] = useState<"peatonal" | "vehicular" | "mixto" | "monoposte" | "mobiliario">("peatonal");

  // Reset local filters on slug changes
  useEffect(() => {
    setSearchQuery("");
    setFilterType("Todos");
    setFilterZone("Todas");
    setSelectedScreenId(null);
  }, [slug]);

  useEffect(() => {
    // Fetch screens if they are not already loaded
    if (screens.length === 0) fetchPublicScreens();
  }, [slug]);

  // Filtering calculations
  const filteredScreens = useMemo(() => activeScreens.filter((screen) => {
      const matchesSearch =
        screen.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screen.zona.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type checking based on path
      let matchesType = filterType === "Todos" || screen.tipo === filterType;
      if (slug.includes("/pantallas-led") || slug.includes("/publicidad-digital")) {
        // Prefer LED models
        matchesType = true; 
      }
      const matchesZone = filterZone === "Todas" || screen.zona === filterZone;
      return matchesSearch && matchesType && matchesZone;
    }), [activeScreens, searchQuery, filterType, filterZone, slug]);

  const availableZones = ["Todas", ...Array.from(new Set(activeScreens.map((s) => s.zona)))];

  const allKnownScreens = useMemo(() => [...screens, ...BUENOS_AIRES_SCREENS], [screens]);

  // Cart calculation helpers
  const { cartScreens, cartSubtotal, cartTotalImpacts, cartTotalInvestment } = useMemo(() => {
    const cartItems = allKnownScreens.filter((s) => cart.includes(s.id));
    const subtotal = cartItems.reduce((sum, s) => sum + s.precio, 0);
    const totalImpacts = cartItems.reduce((sum, s) => sum + s.impactos, 0) * 7 * weeks;
    const totalInvestment = subtotal * weeks;
    return { cartScreens: cartItems, cartSubtotal: subtotal, cartTotalImpacts: totalImpacts, cartTotalInvestment: totalInvestment };
  }, [cart, screens, weeks]);

  // Contact Form inside simulated pages (like /contacto)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    spacePreference: isBA ? "Buenos Aires" : "Mendoza",
    message: "",
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Proposal Submission inside subpages
  const [proposalClient, setProposalClient] = useState({ name: "", email: "", company: "" });
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;

    setIsSubmittingContact(true);
    await addLead({
      name: contactForm.name,
      email: contactForm.email,
      company: contactForm.company || "Subpage Contact",
      source: `Contacto SEO - Ruta: ${slug}`,
      status: "new",
      value: 1200,
    });
    setIsSubmittingContact(false);
    setContactSubmitted(true);
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalClient.name || !proposalClient.email || cartScreens.length === 0) return;

    setIsSubmittingProposal(true);
    await addLead({
      name: proposalClient.name,
      email: proposalClient.email,
      company: proposalClient.company,
      source: `Cotizador SEO - Ruta: ${slug}`,
      status: "qualified",
      value: cartTotalInvestment,
    });
    setIsSubmittingProposal(false);
    setProposalSubmitted(true);
  };

  // Media kit state
  const [mediaKitDownloading, setMediaKitDownloading] = useState(false);
  const [mediaKitSuccess, setMediaKitSuccess] = useState(false);

  const handleDownloadMediaKit = () => {
    setMediaKitDownloading(true);
    setTimeout(() => {
      setMediaKitDownloading(false);
      setMediaKitSuccess(true);
      setTimeout(() => setMediaKitSuccess(false), 5000);
    }, 1500);
  };

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center space-y-6">
        <AlertCircle className="h-16 w-16 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-black text-slate-900">Ruta no encontrada</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          La ruta simulada no está definida en el mapa del sitio SEO principal. Comprueba el sitemap.
        </p>
        <button
          onClick={() => handleNavigate("/")}
          className="px-6 py-2.5 bg-slate-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  // Get children links or sibling links for better SEO deep linking
  const parentSegment = slug.split("/").slice(0, -1).join("/") || "/";
  const parentItem = parentSegment === "/" ? { name: "Inicio", children: sitemap } : findSitemapItemBySlug(parentSegment);
  const siblingPages = parentItem?.children?.filter((c) => c.slug !== slug) || [];
  const childPages = item.children || [];

  // Generate simulated dynamic JSON-LD BreadcrumbList schema
  const jsonLdSchema = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": crumb.name,
        "item": `https://grupocomunicarte.com.ar${crumb.slug}`
      }))
    },
    null,
    2
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* 1. SIMULATED BROWSER ADDRESS BAR & SEO INSIGHT */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
        <div className="bg-slate-850 px-4 py-2 flex items-center gap-3 border-b border-slate-850/80">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          
          {/* Simulated address bar */}
          <div className="flex-1 max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-lg py-1 px-3 flex items-center justify-between text-slate-400 text-xs font-mono">
            <div className="flex items-center gap-2 truncate">
              <Lock className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> 
              <span className="text-emerald-400 select-all truncate">
                https://grupocomunicarte.com.ar{item.slug}
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://grupocomunicarte.com.ar${item.slug}`);
                setCopiedUrl(true);
                setTimeout(() => setCopiedUrl(false), 2000);
              }}
              className="text-[10px] text-slate-500 hover:text-white font-bold transition-colors cursor-pointer"
            >
              {copiedUrl ? "¡Copiado!" : "Copiar"}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setShowJsonLd(!showJsonLd)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-white text-[10px] font-bold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Code className="h-3.5 w-3.5" />
              <span>Ver Schema JSON-LD</span>
            </button>
          </div>
        </div>

        {/* SEO Metadata and Stats bar */}
        <div className="p-4 bg-slate-900/40 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-medium border-t border-slate-850/40">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Palabra Clave Objetivo (SEO)</span>
            <span className="font-bold font-mono text-slate-200 flex items-center gap-1.5"> 
              <Target className="h-3.5 w-3.5 text-sky-400" />
              "{item.keyword}"
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Intención de Búsqueda</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              item.intent === "Transactional" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
              item.intent === "Commercial" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" :
              "bg-slate-700/20 text-slate-400 border border-slate-700/30"
            }`}>
              {item.intent}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Auditoría de Contenido</span>
            <span className="text-slate-300 font-bold">
              ~{item.wordCount} palabras sugeridas
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Estado de Indexación</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Indexada (Prueba en vivo)
            </span>
          </div>
        </div>

        {/* JSON-LD Schema Drawer */}
        <AnimatePresence>
          {showJsonLd && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-950 border-t border-slate-800 p-4 font-mono text-xs text-sky-400 overflow-x-auto"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-850">
                <span className="text-[10px] uppercase font-bold text-slate-500">JSON-LD Structuring (Google Rich Snippets ready)</span>
                <button
                  onClick={() => setShowJsonLd(false)}
                  className="text-slate-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <pre className="text-[11px] leading-relaxed select-all">{jsonLdSchema}</pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. SEO BREADCRUMBS */}
      <nav className="flex items-center flex-wrap gap-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <React.Fragment key={crumb.slug}>
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-350" />}
              {isLast ? (
                <span className="text-slate-900 font-extrabold">{crumb.name}</span>
              ) : (
                <button
                  onClick={() => handleNavigate(crumb.slug)}
                  className="hover:text-slate-950 transition-colors cursor-pointer text-slate-500"
                >
                  {crumb.name}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* 3. HERO SUB-BANNER */}
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-8 md:p-10 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-stone-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 opacity-80" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Title and Description */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <span className="inline-block text-[10px] bg-[#06434a]/10 border border-[#06434a]/20 text-[#06434a] font-extrabold tracking-widest uppercase px-3.5 py-1 rounded-full">
              {item.keyword || "Publicidad Exterior"}
            </span>
            <h1 className="text-3xl md:text-4.5xl font-bold font-display text-stone-900 tracking-tight leading-tight">
              {item.name}
            </h1>
            <p className="text-stone-500 text-sm md:text-base leading-relaxed font-normal font-sans max-w-xl">
              {item.description}
            </p>
          </div>

          {/* Right Column: Dynamic Image with Custom Fallback */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-xs aspect-video sm:aspect-4/3 bg-[#172023] border border-[#e7e5e4] shadow-[0_12px_32px_-8px_rgba(6,67,74,0.08)] rounded-xl overflow-hidden relative group">
              {item.imageUrl ? (
                <img
                  src={optimizeImageUrl(item.imageUrl)}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                /* Dynamic content-aware vector illustration */
                <div className="w-full h-full p-5 flex flex-col justify-between relative overflow-hidden select-none">
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(var(--color-secondary)_1.5px,transparent_1.5px)] bg-size-[10px_10px]" />
                  <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-primary/20 rounded-full blur-2xl" />
                  
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[8px] bg-secondary/20 text-secondary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.intent}
                    </span>
                    <Tv className="h-4 w-4 text-stone-400" />
                  </div>

                  <div className="space-y-1.5 z-10">
                    <span className="text-[8px] uppercase text-stone-400 font-bold tracking-widest block ">Soporte Inteligente</span>
                    <div className="text-sm font-display font-black text-white leading-snug truncate">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      <span className="text-[9px] font-mono font-medium text-stone-300 truncate">Keyword: "{item.keyword}"</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3 z-10 text-[9px] font-sans font-medium text-stone-400">
                    <span>Indexado Google</span>
                    <span className="text-secondary font-bold">100% Optimizado</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. MULTIPAGE ROUTE CONTENT SPECIFIC RENDERING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main interactive section */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* CITY-SPECIFIC DOOH AND MAP (For /ubicaciones/mendoza and /ubicaciones/buenos-aires) */}
          {(isMendoza || isBA) && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Soportes de Publicidad Exterior en {currentProvince} 
                    </h2>
                    <p className="text-slate-500 text-xs">
                      Filtra nuestro catálogo o selecciona un marcador en el mapa para planificar tu campaña.
                    </p>
                  </div>
                  <span className="text-xs bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 font-extrabold text-slate-700">
                    {filteredScreens.length} Pantallas Activas
                  </span> 
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full sm:w-1/3">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10" />
                    <Input
                      type="text"
                      placeholder="Buscar pantalla..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      className="pl-9 text-xs h-9"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                    {(["Todos", "Peatonal", "Vehicular", "Mixto"] as const).map((type) => (
                      <Button
                        key={type}
                        onClick={() => setFilterType(type)}
                        variant={filterType === type ? "default" : "outline"}
                        size="sm" 
                        className="h-8 text-xs font-bold"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>

                  <div className="w-full sm:w-auto sm:ml-auto">
                    <select
                      value={filterZone}
                      onChange={(e) => setFilterZone(e.target.value)} 
                      className="w-full sm:w-auto px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer"
                    >
                      {availableZones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone === "Todas" ? "Todas las Zonas" : `Zona: ${zone}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
 
                {/* Simulated Map */}
                <div className="h-80 bg-slate-50 rounded-xl border border-slate-200 shadow-inner overflow-hidden relative">
                  <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xs text-slate-400">Cargando mapa...</div>}>
                    <InteractiveMap
                      screens={filteredScreens}
                      selectedScreenId={selectedScreenId}
                      onSelectScreen={(id) => setSelectedScreenId(id)}
                    />
                  </Suspense>
                </div>

                {/* Interactive list */}
                {filteredScreens.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {filteredScreens.map((screen) => (
                      <ScreenCard
                        key={screen.id}
                        screen={screen}
                        onFocusOnMap={() => setSelectedScreenId(screen.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <Tv className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="font-extrabold text-slate-800 text-xs">Sin resultados de búsqueda</h4>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1">
                      No hay pantallas que coincidan con los filtros en {currentProvince}. Prueba limpiándolos.
                    </p> 
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CONTACT & QUOTATION FORM VIEW (For /contacto or /contacto/cotizacion) */}
          {slug.startsWith("/contacto") && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-150 pb-4">
                <h2 className="text-xl font-black text-slate-900">Formulario Comercial de Cotización B2B</h2>
                <p className="text-slate-500 text-xs mt-1">
                  Ingresa tus datos y alcance de campaña para recibir una propuesta OOH personalizada.
                </p>
              </div>

              {!contactSubmitted ? (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} 
                        placeholder="Ana de la Cruz"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Empresa
                      </label>
                      <input
                        type="text"
                        value={contactForm.company} 
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                        placeholder="Acme Corp"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Correo Corporativo
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} 
                        placeholder="ana@empresa.com"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={contactForm.phone} 
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+54 9 261 555-5555"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Territorio de Campaña de Interés
                    </label>
                    <select
                      value={contactForm.spacePreference}
                      onChange={(e) => setContactForm({ ...contactForm, spacePreference: e.target.value })} 
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer"
                    >
                      <option value="Mendoza">Mendoza</option>
                      <option value="Buenos Aires">Buenos Aires</option>
                      <option value="Ambos">Ambos Territorios</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Comentarios o Detalles Especiales
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Contanos sobre las marcas y tiempos de tu campaña..."
                      rows={4}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    {isSubmittingContact ? "Procesando..." : "Enviar Solicitud SEO"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 space-y-4">
                  <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-7 w-7" />
                  </div>
                  <div className="space-y-1.5 max-w-sm mx-auto">
                    <h4 className="font-extrabold text-slate-900 text-sm">¡Solicitud Registrada con Éxito!</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      La consulta generó de forma automática un nuevo Lead calificado en el CMS. Podés confirmarlo accediendo a la pestaña de Leads del dashboard principal.
                    </p>
                  </div>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 underline underline-offset-4 cursor-pointer"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MEDIAKIT & DOWNLOADS CENTER (For /mediakit or /mediakit/descargas) */}
          {slug.startsWith("/mediakit") && (
            <div className="space-y-6">
              <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-8 space-y-4 relative overflow-hidden ">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-slate-800)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-800)_1px,transparent_1px)] bg-size-[3rem_3rem] opacity-20" />
                <div className="relative z-10 space-y-3">
                  <span className="text-[10px] bg-white/10 text-white border border-white/20 font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Centro de Descargas Oficial
                  </span>
                  <h2 className="text-2xl font-black text-white">MediaKit Comercial 2026 PDF</h2>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
                    Consigue las tarifas actualizadas, los perfiles socioeconómicos de las audiencias auditadas, regulaciones municipales vigentes, y especificaciones técnicas para diseñadores en un solo documento.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-4">
                    <button
                      onClick={handleDownloadMediaKit}
                      disabled={mediaKitDownloading}
                      className="px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                    >
                      {mediaKitDownloading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Preparando descarga...</span>
                        </>
                      ) : (
                        <>
                          <FileDown className="h-4 w-4 text-slate-950" />
                          <span>Descargar MediaKit Completo (PDF)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {mediaKitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-emerald-400 font-bold flex items-center gap-2 pt-2"
                    >
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span>¡Descarga simulada iniciada con éxito! Archivo procesado correctamente.</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Technical specifications checklist */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
                <div className="border-b border-slate-150 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-sm">Especificaciones Técnicas para Creativos</h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">Asegura la mejor fidelidad en nuestras pantallas LED gigantes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="border border-slate-150 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Monitor className="h-4.5 w-4.5 text-slate-600" />
                      <span>Pantallas LED Digitales (DOOH)</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-500 font-medium">
                      <li>• Formato recomendado: MP4 (H.264), JPG</li>
                      <li>• Aspect Ratio nativo: 16:9 y 4:3</li>
                      <li>• Resolución: 1920x1080px (mínimo)</li>
                      <li>• Duración estándar del Spot: 5 a 10 segundos</li>
                    </ul>
                  </div>

                  <div className="border border-slate-150 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Layers className="h-4.5 w-4.5 text-slate-600" />
                      <span>Soportes Físicos (Vallas / Monopostes)</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-500 font-medium">
                      <li>• Formato requerido: PDF editable, TIFF</li>
                      <li>• Espacio de Color: CMYK únicamente</li>
                      <li>• Escala recomendada de diseño: 1:10</li>
                      <li>• Sangría de corte: 5cm perimetrales</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CATALOG BY TYPE (For /espacios-publicitarios and sub-routes) */}
          {slug.startsWith("/espacios-publicitarios") && !slug.includes("mendoza") && !slug.includes("buenos-aires") && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Soportes Publicitarios en Catálogo
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Formatos OOH y DOOH optimizados para alcance demográfico amplio.
                  </p>
                </div>
              </div>

              {/* Show complete screen collection with interactive simulation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allKnownScreens.map((screen) => (
                  <ScreenCard
                    key={screen.id}
                    screen={screen}
                    onFocusOnMap={() => setSelectedScreenId(screen.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* HISTORICAL & GENERAL COMPANY VIEWS (For /nosotros and children) */}
          {slug.startsWith("/nosotros") && (
            <div className="space-y-6">
              {/* Core Corporate Values */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
                <h3 className="text-xl font-black text-slate-900">Nuestra Trayectoria en Vía Pública</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  Grupo Comunicarte nació hace más de 20 años como un proyecto familiar de cartelería urbana en Mendoza. Hoy, gracias a la confianza de nuestros anunciantes y la digitalización tecnológica de nuestros soportes, nos consolidamos como la referencia multipantalla en el oeste argentino y la autopista metropolitana bonaerense.
                </p>
 
                <div className="relative border-l border-slate-200 pl-4 space-y-6 text-xs pt-2">
                  <div className="relative">
                    <span className="absolute -left-5.25 top-0.5 h-3.5 w-3.5 rounded-full bg-slate-950 border-4 border-white" />
                    <span className="font-extrabold text-slate-900 block text-xs">Año 2004 - Fundación</span>
                    <p className="text-slate-500 mt-1">Colocación de la primera valla estática en el microcentro de Mendoza.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-5.25 top-0.5 h-3.5 w-3.5 rounded-full bg-slate-400 border-4 border-white" />
                    <span className="font-extrabold text-slate-900 block text-xs">Año 2012 - Cobertura Provincial</span>
                    <p className="text-slate-500 mt-1">Llegamos a San Rafael, Maipú y Luján de Cuyo con más de 250 caras estáticas.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-5.25 top-0.5 h-3.5 w-3.5 rounded-full bg-slate-400 border-4 border-white" />
                    <span className="font-extrabold text-slate-900 block text-xs">Año 2018 - El Salto Digital (DOOH)</span>
                    <p className="text-slate-500 mt-1">Inauguración de la primera pantalla LED de alta frecuencia en Sarmiento y 9 de Julio.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-5.25 top-0.5 h-3.5 w-3.5 rounded-full bg-slate-900 animate-pulse border-4 border-white" />
                    <span className="font-extrabold text-slate-900 block text-xs">Presente - Expansión Metropolitana y SmartWeb</span>
                    <p className="text-slate-500 mt-1">Lanzamiento del portal interactivo B2B y alianza estratégica en Buenos Aires.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GENERAL SERVICES INFORMATION VIEWS (For /servicios and children) */}
          {slug.startsWith("/servicios") && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
                  <div className="p-2.5 bg-sky-50 text-sky-600 rounded-lg inline-block">
                    <Tv className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">Soportes Digitales Inteligentes (DOOH)</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Nuestras pantallas LED disponen de conexión inalámbrica, permitiendo cambiar creatividades según el horario del día o clima imperante para maximizar la conversión.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg inline-block">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">Cartelería Física de Gran Altura (OOH)</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Estructuras monumentales diseñadas para presencia institucional ininterrumpida las 24 horas del día. Máxima cobertura de recordación acumulada.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* B2B OUT-OF-HOME MARKETING BLOG (For /blog and children) */}
          {slug.startsWith("/blog") && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
                <h3 className="text-lg font-black text-slate-900">Últimos Artículos de Análisis Industrial</h3>
                
                <div className="space-y-4">
                  <div className="border border-slate-150 rounded-xl p-4 space-y-2 hover:border-slate-300 transition-colors cursor-pointer">
                    <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider">TENDENCIAS DOOH</span>
                    <h4 className="font-extrabold text-sm text-slate-900 hover:underline">Cómo medir el OTS (Opportunity to See) con precisión móvil en vía pública</h4>
                    <p className="text-slate-500 text-xs">Descubre cómo los datos de geolocalización celular permiten validar de forma estadística el flujo real frente a los monopostes...</p>
                  </div>

                  <div className="border border-slate-150 rounded-xl p-4 space-y-2 hover:border-slate-300 transition-colors cursor-pointer">
                    <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider">TECNOLOGÍA</span>
                    <h4 className="font-extrabold text-sm text-slate-900 hover:underline">Pantallas 3D anamórficas: El futuro del impacto visual urbano</h4>
                    <p className="text-slate-500 text-xs">Un análisis técnico de cómo los gabinetes cóncavos engañan el ojo del observador peatonal para generar sensación de tridimensionalidad...</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SOPORTES INVENTORY PAGE AND CHILDREN */}
          {slug.startsWith("/soportes") && (() => {
            const FORMATOS_DATA = [
              {
                id: "peatonal",
                title: "LED Peatonal UHD",
                subtitle: "Smart Totems de Ultra Alta Definición",
                icon: <Users className="h-4 w-4" />,
                tag: "Tránsito Peatonal y Comercial",
                description: "Módulos de pantallas LED digitales UHD adaptados a nivel de vista peatonal, ideales para zonas comerciales de alto tránsito, paseos y corredores urbanos en Mendoza y Buenos Aires. Su resolución ultra fina permite captar detalles con máxima nitidez.",
                specs: [
                  { label: "Pixel Pitch", value: "P2.5 / P3.0 Outdoor UHD" },
                  { label: "Medida Estándar", value: "1.20m x 1.80m" },
                  { label: "Aspect Ratio", value: "9:16 Vertical" },
                  { label: "Tiempo de Exposición", value: "Alto (Permanencia de 15-45 seg)" },
                  { label: "Frecuencia de Ciclo", value: "Spots de 5s o 10s en Loops de 60s" }
                ],
                plazas: "Microcentro Mendoza, Calle Arístides, Recoleta, Puerto Madero.",
                seo_anchor: "pantallas-led-peatonales",
                mock_image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80"
              },
              {
                id: "vehicular",
                title: "Monolito Vehicular Gigante",
                subtitle: "Pantallas Monumentales en Accesos Rápidos",
                icon: <Tv className="h-4 w-4" />,
                tag: "Corredores Viales y Autopistas",
                description: "Estructuras de escala monumental posicionadas estratégicamente a gran altura en las autopistas, accesos metropolitanos y avenidas rápidas de mayor volumen diario. Diseñadas para un impacto masivo inmediato.",
                specs: [
                  { label: "Pixel Pitch", value: "P4.0 / P5.0 High Brightness" },
                  { label: "Medida Estándar", value: "6.00m x 4.00m / 8.00m x 4.00m" },
                  { label: "Aspect Ratio", value: "16:9 Horizontal" },
                  { label: "Tiempo de Exposición", value: "Inmediato (Lectura veloz a gran distancia)" },
                  { label: "Luminosidad", value: "6500+ nits (Legibilidad solar directa)" }
                ],
                plazas: "Acceso Este Mendoza, Corredor del Oeste, Av. 9 de Julio Buenos Aires.",
                seo_anchor: "pantallas-led-vehiculares",
                mock_image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
              },
              {
                id: "mixto",
                title: "Pantalla Mixta Dinámica",
                subtitle: "Impacto Semafórico Estratégico",
                icon: <Eye className="h-4 w-4" />,
                tag: "Intersecciones Neurálgicas",
                description: "Ubicadas en esquinas críticas con detención semafórica. Logra una cobertura combinada insuperable: impacta al conductor que espera la luz verde y al peatón que cruza la calle. Ofrece los mayores tiempos de exposición (Dwell Time) del mercado.",
                specs: [
                  { label: "Pixel Pitch", value: "P3.0 / P4.0 Professional" },
                  { label: "Medida Estándar", value: "4.00m x 3.00m" },
                  { label: "Aspect Ratio", value: "4:3 / Escala Optimizada" },
                  { label: "Tiempo de Exposición", value: "Extremo (Espera semafórica de hasta 60 seg)" },
                  { label: "Frecuencia de Ciclo", value: "Sincronizado con fase de tránsito" }
                ],
                plazas: "Principales intersecciones del microcentro de Mendoza y GBA.",
                seo_anchor: "pantallas-led-mixtas",
                mock_image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
              },
              {
                id: "monoposte",
                title: "Monoposte Monumental (OOH)",
                subtitle: "Presencia Corporativa Ininterrumpida",
                icon: <Layers className="h-4 w-4" />,
                tag: "Cartelería Tradicional de Altura",
                description: "Estructuras físicas de envergadura arquitectónica. Al no poseer rotación de pantalla, garantizan el 100% de exclusividad para la marca las 24 horas del día. Equipadas con proyectores LED inteligentes de bajo consumo con encendido crepuscular.",
                specs: [
                  { label: "Tecnología", value: "Soporte Físico Estático (Iluminado)" },
                  { label: "Medida Estándar", value: "12.00m x 4.00m / 15.00m x 5.00m" },
                  { label: "Espacio de Color", value: "CMYK de alta fidelidad cromática" },
                  { label: "Exclusividad", value: "100% Única marca sin rotación" },
                  { label: "Sustentabilidad", value: "Iluminación inteligente auto-ajustable" }
                ],
                plazas: "Accesos principales, autopistas de Mendoza, autopistas nacionales GBA.",
                seo_anchor: "monopostes-gigantes",
                mock_image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
              },
              {
                id: "mobiliario",
                title: "Mobiliario Urbano Inteligente",
                subtitle: "Frecuencia Hiperlocal de Cercanía",
                icon: <Home className="h-4 w-4" />,
                tag: "Refugios y Paradas de Colectivos",
                description: "Publicidad integrada en paradas de autobuses, refugios peatonales y tótems informativos. Proporciona una alta frecuencia de visualización diaria, integrando de manera orgánica las campañas en la rutina diaria del ciudadano.",
                specs: [
                  { label: "Tecnología", value: "Poster de alta resolución retroiluminado" },
                  { label: "Medida Estándar", value: "1.15m x 1.75m" },
                  { label: "Aspect Ratio", value: "2:3 Vertical" },
                  { label: "Segmentación", value: "Hiperlocal por corredor urbano o zona comercial" },
                  { label: "Alcance", value: "Alta frecuencia acumulada por proximidad" }
                ],
                plazas: "Circuitos de refugios en zonas comerciales clave de Mendoza.",
                seo_anchor: "mobiliario-urbano",
                mock_image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
              }
            ];

            const isMainPage = slug === "/soportes";
            const isPeatonalSub = slug === "/soportes/led-peatonal";
            const isVehicularSub = slug === "/soportes/monolito-vehicular";
            const isMixtoSub = slug === "/soportes/pantalla-mixta";

            return (
              <div className="space-y-10">
                {/* 1. EDUCATIONAL SEO COPY SECTION */}
                {isMainPage && (
                  <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-8 shadow-xs text-left font-sans">
                    <div className="border-b border-stone-150 pb-5 space-y-2">
                      <span className="text-[10px] bg-[#06434a]/10 text-[#06434a] border border-[#06434a]/20 font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block">
                        Guía de Formatos de Comunicación Urbana
                      </span>
                      <h2 className="text-2xl md:text-3xl font-display font-black text-stone-900 tracking-tight leading-tight">
                        Formatos de Pauta Publicitaria Exterior (OOH & DOOH)
                      </h2>
                      <p className="text-stone-500 text-xs md:text-sm leading-relaxed max-w-3xl font-medium">
                        Para maximizar el impacto y retorno de inversión de tu campaña B2B, es fundamental entender las características técnicas y demográficas de cada soporte de vía pública. Explora nuestra guía de formatos pensada para planificadores de medios y creativos.
                      </p>
                    </div>

                    {/* Interactive Selector Tabs */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider">Explorador de Soportes</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {FORMATOS_DATA.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => setActiveFormat(f.id as any)}
                              className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer border ${
                                activeFormat === f.id
                                  ? "bg-[#06434a] text-white border-[#06434a] shadow-xs"
                                  : "bg-stone-50 text-stone-600 hover:bg-stone-100 border-stone-200/60"
                              }`}
                            >
                              {f.icon}
                              <span>{f.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Display Selected Format Detail */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                        <div className="lg:col-span-7 space-y-4">
                          {FORMATOS_DATA.filter((f) => f.id === activeFormat).map((f) => (
                            <div key={f.id} className="space-y-4">
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                                {f.tag}
                              </span>
                              <h4 className="text-lg font-black text-stone-900 font-display">{f.title}</h4>
                              <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-sans font-medium">
                                {f.description}
                              </p>

                              {/* Spec table */}
                              <div className="bg-stone-50 border border-stone-200/60 rounded-xl overflow-hidden shadow-xs">
                                <div className="divide-y divide-stone-150 text-xs">
                                  {f.specs.map((spec, i) => (
                                    <div key={i} className="px-4 py-2.5 flex justify-between items-center bg-white/50">
                                      <span className="font-bold text-stone-500">{spec.label}</span>
                                      <span className="font-extrabold text-stone-800">{spec.value}</span>
                                    </div>
                                  ))}
                                  <div className="px-4 py-2.5 flex justify-between items-center bg-white/50">
                                    <span className="font-bold text-stone-500">Ubicaciones Recomendadas</span>
                                    <span className="font-extrabold text-[#06434a] text-right max-w-xs">{f.plazas}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Button to quickly trigger filter and jump to catalogue */}
                              <button
                                onClick={() => {
                                  if (f.id === "peatonal") {
                                    setSearchQuery("");
                                    setFilterType("Peatonal");
                                  } else if (f.id === "vehicular") {
                                    setSearchQuery("");
                                    setFilterType("Vehicular");
                                  } else if (f.id === "mixto") {
                                    setSearchQuery("");
                                    setFilterType("Mixto");
                                  } else {
                                    setSearchQuery(f.title);
                                    setFilterType("Todos");
                                  }
                                  const el = document.getElementById("catalog-explorer-section");
                                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                                }}
                                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wide rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                              >
                                <Search className="h-4 w-4 text-white" />
                                <span>Filtrar este formato en catálogo</span>
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Visual Frame mock representation */}
                        <div className="lg:col-span-5">
                          {FORMATOS_DATA.filter((f) => f.id === activeFormat).map((f) => (
                            <div key={f.id} className="w-full aspect-video sm:aspect-4/3 bg-slate-950 rounded-2xl border border-stone-200/60 shadow-md relative overflow-hidden p-5 flex flex-col justify-end group">
                              <div className="absolute inset-0 z-0">
                                <img
                                  src={f.mock_image}
                                  alt={f.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover opacity-40 filter grayscale contrast-125 animate-fadeIn"
                                  loading="lazy" 
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent" />
                              </div>
                              <div className="relative z-10 space-y-1">
                                <span className="text-[8px] font-mono text-emerald-400 font-extrabold tracking-widest block uppercase">Visualización Certificada</span>
                                <h5 className="text-sm font-bold text-white font-display leading-tight">{f.title}</h5>
                                <p className="text-[10px] text-stone-300">Formato disponible en Mendoza y Buenos Aires.</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Compare Matrix Table */}
                    <div className="space-y-3 pt-6 border-t border-stone-100">
                      <h3 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                        <LayoutGrid className="h-4 w-4 text-primary" />
                        Matriz Comparativa de Soportes
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">
                        La siguiente tabla interactiva detalla el rendimiento y alcance sugerido para facilitar la planificación estratégica de agencias de publicidad.
                      </p>
                      <div className="overflow-x-auto border border-stone-200 rounded-xl shadow-xs">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-extrabold uppercase text-[9px] tracking-wider select-none">
                              <th className="px-4 py-3">Formato / Soporte</th>
                              <th className="px-4 py-3">Tipo de Flujo</th>
                              <th className="px-4 py-3">Especificación Técnica</th>
                              <th className="px-4 py-3">Permanencia Promedio</th>
                              <th className="px-4 py-3">Plazas Disponibles</th>
                              <th className="px-4 py-3 text-right">Métrica Semanal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-150 font-medium text-stone-700">
                            <tr className="hover:bg-stone-50/50 transition-colors">
                              <td className="px-4 py-3 font-bold text-stone-900">LED Peatonal UHD</td>
                              <td className="px-4 py-3">Peatonal</td>
                              <td className="px-4 py-3 font-mono">P2.5 / P3.0 UHD (9:16)</td>
                              <td className="px-4 py-3 ">15 - 45 segundos</td>
                              <td className="px-4 py-3 text-stone-500">Mendoza & Baires</td>
                              <td className="px-4 py-3 text-right text-primary font-black">+30.000 OTS</td>
                            </tr>
                            <tr className="hover:bg-stone-50/50 transition-colors">
                              <td className="px-4 py-3 font-bold text-stone-900">Monolito Vehicular</td>
                              <td className="px-4 py-3">Vehicular</td>
                              <td className="px-4 py-3 font-mono">P4.0 / P5.0 Giant (16:9)</td>
                              <td className="px-4 py-3 ">3 - 5 segundos</td>
                              <td className="px-4 py-3 text-stone-500">Mendoza & Autopistas</td>
                              <td className="px-4 py-3 text-right text-primary font-black">+75.000 OTS</td>
                            </tr>
                            <tr className="hover:bg-stone-50/50 transition-colors">
                              <td className="px-4 py-3 font-bold text-stone-900">Pantalla Mixta Esquinas</td>
                              <td className="px-4 py-3">Vehicular & Peatonal</td>
                              <td className="px-4 py-3 font-mono">P3.0 Sync Semáforo (4:3)</td>
                              <td className="px-4 py-3 ">30 - 60 segundos</td>
                              <td className="px-4 py-3 text-stone-500">Microcentros Clave</td>
                              <td className="px-4 py-3 text-right text-primary font-black">+50.000 OTS</td>
                            </tr>
                            <tr className="hover:bg-stone-50/50 transition-colors">
                              <td className="px-4 py-3 font-bold text-stone-900">Monoposte Gigante</td>
                              <td className="px-4 py-3">Flujo Rápido / Ruta</td>
                              <td className="px-4 py-3 font-mono">CMYK Lona Estática</td>
                              <td className="px-4 py-3 ">Permanente 24hs</td>
                              <td className="px-4 py-3 text-stone-500">Principales Accesos</td>
                              <td className="px-4 py-3 text-right text-primary font-black">+120.000 OTS</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Creative Designing Guidelines (Strong SEO optimization) */}
                    <div className="space-y-3 pt-6 border-t border-stone-100">
                      <h3 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Diseño para Vía Pública: Claves del Éxito
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">
                        Debido a las dinámicas de circulación en entornos urbanos abiertos, los contenidos deben optimizarse con reglas de diseño exterior específicas:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                        <div className="p-4 bg-stone-50 border border-stone-200/50 rounded-xl space-y-2">
                          <h4 className="font-extrabold text-stone-900 flex items-center gap-1.5">
                            <Tv className="h-4 w-4 text-primary" />
                            Contraste de Fondo
                          </h4>
                          <p className="text-stone-500 leading-relaxed font-medium">
                            Los fondos oscuros aumentan la legibilidad bajo la luz solar y reducen el destello nocturno, protegiendo la fatiga visual de los conductores viales.
                          </p>
                        </div>
                        <div className="p-4 bg-stone-50 border border-stone-200/50 rounded-xl space-y-2">
                          <h4 className="font-extrabold text-stone-900 flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-primary" />
                            La Regla de los 3s
                          </h4>
                          <p className="text-stone-500 leading-relaxed font-medium">
                            Un spot exitoso debe asimilarse en 3 segundos. Limita el texto a 1 título impactante, un isotipo grande y 1 llamado a la acción concreto.
                          </p>
                        </div>
                        <div className="p-4 bg-stone-50 border border-stone-200/50 rounded-xl space-y-2">
                          <h4 className="font-extrabold text-stone-900 flex items-center gap-1.5">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            Tipografía de Gran Peso
                          </h4>
                          <p className="text-stone-500 leading-relaxed font-medium">
                            Usa fuentes Sans-Serif audaces (Bold, Black) con suficiente interlineado. Evita tipografías Serif muy delgadas o cursivas, difíciles de leer a la distancia.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CHILDS SPECIFIC SEO CONTENT */}
                {isPeatonalSub && (
                  <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 text-left font-sans">
                    <div className="border-b border-stone-150 pb-4 space-y-2">
                      <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-100 font-extrabold uppercase px-3.5 py-1 rounded-full inline-block">
                        Formato Especializado DOOH
                      </span>
                      <h2 className="text-2xl font-black text-stone-900 font-display">Pantallas LED Peatonales UHD (Smart Totems)</h2>
                      <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-medium">
                        Las pantallas LED peatonales de ultra alta definición (UHD) son el soporte óptimo para captar la atención de audiencias en reposo o circulación peatonal continua. Ubicadas estratégicamente a nivel de los ojos en los principales paseos comerciales y distritos de negocios de Mendoza y Buenos Aires, ofrecen un prolongado tiempo de exposición para tu logo o piezas publicitarias dinámicas.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
                      <div className="space-y-4">
                        <h3 className="font-extrabold text-stone-800 text-sm">Ventajas de la Pauta Peatonal</h3>
                        <ul className="space-y-2.5 text-stone-500 leading-relaxed list-disc pl-5">
                          <li><strong>Contacto Visual Directo:</strong> Posicionamiento perpendicular a la visual a 1.60m de altura, eliminando distracciones visuales elevadas.</li>
                          <li><strong>Mayor Tiempo de Lectura:</strong> Al circular a pie, el transeúnte dispone de un promedio de 15 a 45 segundos para asimilar detalles finos, códigos QR de interacción o promociones de cercanía.</li>
                          <li><strong>Audiencia Cualificada:</strong> Ubicación precisa en polos gastronómicos y paseos de compras de alto poder adquisitivo (Maipú, Calle Arístides, Recoleta).</li>
                        </ul>
                      </div>
                      <div className="bg-stone-50 border border-stone-200/60 p-5 rounded-xl space-y-3">
                        <h3 className="font-extrabold text-stone-850 text-sm">Ficha Técnica Recomendada</h3>
                        <div className="space-y-2 divide-y divide-stone-150 text-stone-600">
                          <div className="flex justify-between py-1.5"><span className="font-bold">Pixel Pitch</span><span className="font-extrabold text-stone-850">P2.5 / P3.0 Premium</span></div>
                          <div className="flex justify-between py-1.5"><span className="font-bold">Aspect Ratio</span><span className="font-extrabold text-stone-850">9:16 Vertical</span></div>
                          <div className="flex justify-between py-1.5"><span className="font-bold">Resolución Óptima</span><span className="font-extrabold text-stone-850">1080 x 1920 píxeles</span></div>
                          <div className="flex justify-between py-1.5"><span className="font-bold">Ciclo del Spot</span><span className="font-extrabold text-stone-850">5s o 10s en Loop de 1min</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isVehicularSub && (
                  <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 text-left font-sans">
                    <div className="border-b border-stone-150 pb-4 space-y-2">
                      <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 font-extrabold uppercase px-3.5 py-1 rounded-full inline-block">
                        Formato Especializado DOOH
                      </span>
                      <h2 className="text-2xl font-black text-stone-900 font-display">Monolitos LED Vehiculares Gigantes</h2>
                      <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-medium">
                        El formato monolito vehicular gigante de alta luminosidad es el referente absoluto para campañas de cobertura masiva e instalación de marca en el Top of Mind colectivo. Ubicados en los accesos viales metropolitanos y autopistas rápidas con más de 100.000 visualizaciones diarias, estos dispositivos garantizan un impacto visual ineludible gracias a su luminosidad inteligente que se regula automáticamente.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
                      <div className="space-y-4">
                        <h3 className="font-extrabold text-stone-800 text-sm">Estrategia de Pauta en Autopistas</h3>
                        <ul className="space-y-2.5 text-stone-500 leading-relaxed list-disc pl-5">
                          <li><strong>Cobertura Masiva Inmediata:</strong> Ideal para lanzamientos nacionales o corporativos masivos de gran escala.</li>
                          <li><strong>Visibilidad a Gran Distancia:</strong> Los gabinetes de alta escala de hasta 32 metros cuadrados garantizan lectura clara a más de 150 metros.</li>
                          <li><strong>Legibilidad Solar Extrema:</strong> Los chips LED de alta potencia emiten más de 6500 nits, evitando el lavado de imagen con sol de frente.</li>
                        </ul>
                      </div>
                      <div className="bg-stone-50 border border-stone-200/60 p-5 rounded-xl space-y-3">
                        <h3 className="font-extrabold text-stone-850 text-sm">Ficha Técnica de Altura</h3>
                        <div className="space-y-2 divide-y divide-stone-150 text-stone-600">
                          <div className="flex justify-between py-1.5"><span className="font-bold">Pixel Pitch</span><span className="font-extrabold text-stone-850">P4.0 / P5.0 Outdoor</span></div>
                          <div className="flex justify-between py-1.5"><span className="font-bold">Aspect Ratio</span><span className="font-extrabold text-stone-850">16:9 Horizontal</span></div>
                          <div className="flex justify-between py-1.5"><span className="font-bold">Medida Estándar</span><span className="font-extrabold text-stone-850">6.00m x 4.00m</span></div>
                          <div className="flex justify-between py-1.5"><span className="font-bold">Luminosidad</span><span className="font-extrabold text-stone-850">6500+ nits</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isMixtoSub && (
                  <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 text-left font-sans">
                    <div className="border-b border-stone-150 pb-4 space-y-2">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold uppercase px-3.5 py-1 rounded-full inline-block">
                        Formato Especializado DOOH
                      </span>
                      <h2 className="text-2xl font-black text-stone-900 font-display">Pantallas Mixtas Semafóricas Dinámicas</h2>
                      <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-medium">
                        El formato mixto semafórico representa el equilibrio perfecto en rendimiento publicitario. Ubicadas en las esquinas más transitadas con detención de semáforo obligatoria, estas pantallas capturan la atención prolongada del conductor detenido (hasta 60 segundos de Dwell Time) e impactan en paralelo al flujo constante de peatones.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
                      <div className="space-y-4">
                        <h3 className="font-extrabold text-stone-800 text-sm">Ventajas del Impacto Semafórico</h3>
                        <ul className="space-y-2.5 text-stone-500 leading-relaxed list-disc pl-5">
                          <li><strong>Tiempo de Exposición Sobresaliente:</strong> Ofrece la mayor retención de mensaje del mercado publicitario OOH gracias a la detención del tránsito.</li>
                          <li><strong>Impacto Multipantalla:</strong> Logra un alcance sinérgico vehicular y peatonal combinado.</li>
                          <li><strong>Tasa de Recordación Elevada:</strong> La baja velocidad de circulación en cruces neurálgicos propicia una asimilación del 100% de la creatividad.</li>
                        </ul>
                      </div>
                      <div className="bg-stone-50 border border-stone-200/60 p-5 rounded-xl space-y-3">
                        <h3 className="font-extrabold text-stone-850 text-sm">Ficha Técnica Semáforo</h3>
                        <div className="space-y-2 divide-y divide-stone-150 text-stone-600">
                          <div className="flex justify-between py-1.5"><span className="font-bold">Pixel Pitch</span><span className="font-extrabold text-stone-850">P3.0 Professional Outdoor</span></div>
                          <div className="flex justify-between py-1.5"><span className="font-bold">Aspect Ratio</span><span className="font-extrabold text-stone-850">4:3 / Escala Optimizada</span></div>
                          <div className="flex justify-between py-1.5"><span className="font-bold">Medida Estándar</span><span className="font-extrabold text-stone-850">4.00m x 3.00m</span></div>
                          <div className="flex justify-between py-1.5"><span className="font-bold">Dwell Time</span><span className="font-extrabold text-stone-850">30 - 60 seg</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CATALOG SEARCH TOOL COMPONENT */}
                <div id="catalog-explorer-section" className="space-y-6 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs">
                  <div className="border-b border-slate-150 pb-4 text-left font-sans">
                    <h2 className="text-xl font-black text-slate-900">
                      {isPeatonalSub ? "Pantallas Peatonal UHD en Catálogo" : isVehicularSub ? "Monolitos Vehiculares en Catálogo" : isMixtoSub ? "Pantallas Mixtas en Catálogo" : "Buscador de Soportes en Catálogo Comercial"}
                    </h2>
                    <p className="text-slate-500 text-xs mt-1">
                      {isPeatonalSub ? "Listado filtrado de pantallas peatonales. Agrega las deseadas al estimador lateral." : isVehicularSub ? "Listado de pantallas vehiculares gigantes en accesos rápidos." : isMixtoSub ? "Soportes ubicados en cruces semafóricos estratégicos de alta retención." : "Filtra nuestro catálogo interactivo de Mendoza y Buenos Aires para estimar presupuestos."}
                    </p>
                  </div>
                  <SoportesInventory
                    initialTipo={isPeatonalSub ? "Peatonal" : isVehicularSub ? "Vehicular" : isMixtoSub ? "Mixto" : undefined}
                    initialCategoria={isMainPage ? undefined : "Pantallas LED"}
                    onNavigateToCityMap={(city) => {
                      if (city === "Buenos Aires") handleNavigate("/ubicaciones/buenos-aires");
                      else if (city === "Mendoza") handleNavigate("/ubicaciones/mendoza");
                    }}
                  />
                </div>
              </div>
            );
          })()}

          {/* DEFAULT / OTHERS STATS */}
          {!slug.startsWith("/contacto") && !slug.startsWith("/mediakit") && !slug.startsWith("/nosotros") && !slug.startsWith("/servicios") && !slug.startsWith("/blog") && !slug.startsWith("/soportes") && !isMendoza && !isBA && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-sm">Contenido de la Sección</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Este contenido es simulado bajo las directrices SEO de alta retención. La URL se encuentra totalmente mapeada en la estructura para evitar errores 404 (páginas huérfanas) y facilitar la indexación automática del rastreador web de Google.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center gap-3 text-xs text-slate-500">
                <AlertCircle className="h-4.5 w-4.5 text-slate-400" />
                <span>Puedes editar o cambiar la palabra clave <strong>"{item.keyword}"</strong> asignada a esta sección ingresando a la pestaña de Sitemap en el CMS.</span>
              </div>
            </div>
          )}

        </div>

        {/* 5. SIDEBAR: NAVIGATION CLUSTER & CAMPAIGN ESTIMATOR */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Action Call for Planificador */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-4.5 w-4.5 text-slate-900" />
                <h3 className="text-xs font-black text-slate-950">Tu Estimación de Presupuesto</h3>
              </div>
              {cartScreens.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  Limpiar Plan
                </button>
              )}
            </div>

            {cartScreens.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <PlusCircle className="h-6 w-6 text-slate-300 mx-auto" />
                <p className="text-[11px] text-slate-400 leading-relaxed px-2 font-medium">
                  El planificador de campaña está vacío. Agrega pantallas desde el catálogo en vivo de Mendoza o Buenos Aires.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Active screens selection */}
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                  {cartScreens.map((screen) => (
                    <div
                      key={screen.id} 
                      onClick={() => setSelectedScreenId(screen.id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 hover:border-slate-800 cursor-pointer transition-colors"
                    >
                      <span className="truncate max-w-30">{screen.nombre}</span>
                    </div>
                  ))}
                </div>

                {/* Weeks control */}
                <div className="space-y-1.5 pt-2 border-t border-slate-150">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Semanas de Campaña:</span>
                    <span>{weeks} Semanas</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={weeks}
                    onChange={(e) => setWeeks(Number(e.target.value))}
                    className="w-full accent-slate-900 cursor-pointer"
                  />
                </div>

                {/* Budget metrics */}
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 space-y-2 text-xs font-bold">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal Neto:</span>
                    <span className="text-slate-800">${cartSubtotal.toLocaleString("es-AR")} / sem</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Impactos estimados:</span>
                    <span className="text-slate-800">+{cartTotalImpacts.toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black border-t border-slate-200/60 pt-2 text-slate-950">
                    <span>Inversión Estimada:</span>
                    <span className="text-slate-950">${cartTotalInvestment.toLocaleString("es-AR")}</span>
                  </div>
                </div>

                {/* Form checkout inline */}
                {!proposalSubmitted ? (
                  <form onSubmit={handleSubmitProposal} className="space-y-2.5 pt-2 border-t border-slate-150">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Enviar Plan a un Asesor</span>
                    <Input
                      type="text"
                      required
                      placeholder="Tu Nombre"
                      value={proposalClient.name}
                      onChange={(e) => setProposalClient({ ...proposalClient, name: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-900"
                    />
                    <Input
                      type="email"
                      required
                      placeholder="Tu Correo Corporativo"
                      value={proposalClient.email}
                      onChange={(e) => setProposalClient({ ...proposalClient, email: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-900"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingProposal}
                      className="w-full py-2 bg-slate-950 hover:bg-slate-850 text-white font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      {isSubmittingProposal ? "Enviando..." : "Solicitar Presupuesto"}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mx-auto" />
                    <h5 className="font-extrabold text-emerald-800 text-xs">Propuesta Solicitada</h5>
                    <p className="text-[10px] text-emerald-600">Nuevo Lead creado en el CMS.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SEO DEEP LINKING CLUSTER NAVIGATION */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-150 pb-2">
              Explorar Secciones
            </h4>

            {/* Sibling Pages Link List */}
            {siblingPages.length > 0 && (
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Secciones Relacionadas</span>
                <div className="flex flex-col gap-1.5 text-xs">
                  {siblingPages.slice(0, 5).map((sib) => (
                    <button
                      key={sib.slug}
                      onClick={() => handleNavigate(sib.slug)}
                      className="w-full text-left font-bold text-slate-600 hover:text-slate-950 hover:bg-slate-50 px-2 py-1 rounded transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">{sib.name}</span>
                      <ArrowRight className="h-3 w-3 text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Child Pages Link List */}
            {childPages.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-150">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Sub-categorías</span>
                <div className="flex flex-col gap-1.5 text-xs">
                  {childPages.map((child) => (
                    <button
                      key={child.slug}
                      onClick={() => handleNavigate(child.slug)}
                      className="w-full text-left font-bold text-slate-600 hover:text-slate-950 hover:bg-slate-50 px-2 py-1 rounded transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">{child.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-350" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA back to main lander */}
            <button
              onClick={() => handleNavigate("/")}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              <Home className="h-3.5 w-3.5 text-slate-600" />
              <span>Volver a la Portada</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
