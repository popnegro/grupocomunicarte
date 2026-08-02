import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import { useCms } from "./CmsContext";
import { sitemap, SitemapItem } from "@/lib/sitemap";
import { InteractiveMap } from "@/components/InteractiveMap";
import { ScreenCard } from "@/components/ScreenCard";
import { DoohScreen, Lead } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SoportesInventory } from "@/components/SoportesInventory";

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
  screens: DoohScreen[];
  cart: string[];
  clearCart: () => void;
  weeks: number;
  setWeeks: (weeks: number) => void;
  addLead: (lead: Omit<Lead, "id" | "date">) => Promise<Lead | null>;
}

function findSitemapItemBySlug(slug: string): SitemapItem | null {
  const find = (items: SitemapItem[]): SitemapItem | null => {
    for (const item of items) {
      if (item.slug === slug) return item;
      if (item.children) {
        const found = find(item.children);
        if (found) return found;
      }
    }
    return null;
  };
  return find(sitemap);
}

export const SubpageLayout: React.FC<SubpageLayoutProps> = ({
  slug,
  handleNavigate,
  screens,
  cart,
  clearCart,
  weeks,
  setWeeks,
  addLead,
}) => {
  const item = findSitemapItemBySlug(slug);
  const breadcrumbs = getBreadcrumbsForSlug(slug);
  const { toggleCart } = useCms();

  // Dynamic Browser Simulation Tooltip copy
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showJsonLd, setShowJsonLd] = useState(false);

  // Mendoza / BA select logic
  const isMendoza = slug.includes("mendoza");
  const isBA = slug.includes("buenos-aires");
  const currentProvince = isBA ? "Buenos Aires" : "Mendoza";
  const provinceScreens = useMemo(() => isBA ? BUENOS_AIRES_SCREENS : screens, [isBA, screens]);
  const activeScreens = useMemo(() => provinceScreens.filter((s) => s.status === "Activo" || s.status === "Disponible"), [provinceScreens]);

  // Filter Catalog states (Local to subpage layout to prevent inter-view pollution)
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"Todos" | "Peatonal" | "Vehicular" | "Mixto">("Todos");
  const [filterZone, setFilterZone] = useState("Todas");
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);

  // Reset local filters on slug changes
  useEffect(() => {
    setSearchQuery("");
    setFilterType("Todos");
    setFilterZone("Todas");
    setSelectedScreenId(null);
  }, [slug]);

  // Filtering calculations
  const filteredScreens = useMemo(() => {
    return activeScreens.filter((screen) => {
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
    });
  }, [activeScreens, searchQuery, filterType, filterZone, slug]);

  const availableZones = useMemo(() => ["Todas", ...Array.from(new Set(activeScreens.map((s) => s.zona)))], [activeScreens]);

  // Cart calculation helpers
  const cartScreens = useMemo(() => screens.filter((s) => cart.includes(s.id)), [screens, cart]);
  const cartSubtotal = useMemo(() => cartScreens.reduce((sum, s) => sum + s.precio, 0), [cartScreens]);
  const cartTotalImpacts = useMemo(() => cartScreens.reduce((sum, s) => sum + s.impactos, 0) * 7 * weeks, [cartScreens, weeks]);
  const cartTotalInvestment = useMemo(() => cartSubtotal * weeks, [cartSubtotal, weeks]);

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
        <LucideIcons.AlertCircle className="h-16 w-16 text-slate-400 mx-auto" />
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

  function getBreadcrumbsForSlug(slug: string): SitemapItem[] {
    const path: SitemapItem[] = [];
    const findPath = (items: SitemapItem[], currentPath: SitemapItem[]): boolean => {
      for (const item of items) {
        const newPath = [...currentPath, item];
        if (item.slug === slug) {
          path.push(...newPath);
          return true;
        }
        if (item.children && findPath(item.children, newPath)) return true;
      }
      return false;
    };
    findPath(sitemap, []);
    return path;
  }

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
              <LucideIcons.Lock className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
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
              <LucideIcons.Code className="h-3.5 w-3.5" />
              <span>Ver Schema JSON-LD</span>
            </button>
          </div>
        </div>

        {/* SEO Metadata and Stats bar */}
        <div className="p-4 bg-slate-900/40 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-medium border-t border-slate-850/40">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Palabra Clave Objetivo (SEO)</span>
            <span className="text-white font-bold font-mono text-slate-200 flex items-center gap-1.5">
              <LucideIcons.Target className="h-3.5 w-3.5 text-sky-400" />
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
                  <LucideIcons.X className="h-4 w-4" />
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
              {index > 0 && <LucideIcons.ChevronRight className="h-3.5 w-3.5 text-slate-350" />}
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
                  src={item.imageUrl as string}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                /* Dynamic content-aware vector illustration */
                <div className="w-full h-full p-5 flex flex-col justify-between relative overflow-hidden select-none">
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(var(--color-accent)_1.5px,transparent_1.5px)] bg-size-[10px_10px]" />
                  <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#06434a]/20 rounded-full blur-2xl" />
                  
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[8px] bg-[#07BE8A]/20 text-[#07BE8A] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.intent}
                    </span>
                    <LucideIcons.Tv className="h-4 w-4 text-stone-400" />
                  </div>

                  <div className="space-y-1.5 z-10">
                    <span className="text-[8px] uppercase text-stone-400 font-bold tracking-widest block">Soporte Inteligente</span>
                    <div className="text-sm font-display font-black text-white leading-snug truncate">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      <span className="text-[9px] font-mono font-medium text-stone-300 truncate">Keyword: "{item.keyword}"</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between z-10 border-t border-white/5 pt-3 text-[9px] font-sans font-medium text-stone-400">
                    <span>Indexado Google</span>
                    <span className="text-[#07BE8A] font-bold">100% Optimizado</span>
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
                    <LucideIcons.Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10" />
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
                  <InteractiveMap
                    screens={filteredScreens}
                    selectedScreenId={selectedScreenId}
                    onSelectScreen={(id) => setSelectedScreenId(id)}
                  />
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
                    <LucideIcons.Tv className="h-10 w-10 text-slate-300 mx-auto mb-2" />
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
                    <LucideIcons.CheckCircle className="h-7 w-7" />
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
              <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-8 space-y-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-size-[3rem_3rem] opacity-20" />
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
                          <LucideIcons.RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Preparando descarga...</span>
                        </>
                      ) : (
                        <>
                          <LucideIcons.FileDown className="h-4 w-4 text-slate-950" />
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
                      <LucideIcons.CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span>¡Descarga simulada iniciada con éxito! Archivo procesado correctamente.</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Technical specifications checklist */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
                <div className="border-b border-slate-150 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-900">Especificaciones Técnicas para Creativos</h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">Asegura la mejor fidelidad en nuestras pantallas LED gigantes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-3 rounded-xl border border-slate-150 p-4">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <LucideIcons.Monitor className="h-4.5 w-4.5 text-slate-600" />
                      <span>Pantallas LED Digitales (DOOH)</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-500 font-medium">
                      <li>• Formato recomendado: MP4 (H.264), JPG</li>
                      <li>• Aspect Ratio nativo: 16:9 y 4:3</li>
                      <li>• Resolución: 1920x1080px (mínimo)</li>
                      <li>• Duración estándar del Spot: 5 a 10 segundos</li>
                    </ul>
                  </div>

                  <div className="space-y-3 rounded-xl border border-slate-150 p-4">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <LucideIcons.Layers className="h-4.5 w-4.5 text-slate-600" />
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
                {screens.map((screen: DoohScreen) => (
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
                    <span className="absolute -left-[21px] top-0.5 h-3.5 w-3.5 rounded-full bg-slate-950 border-4 border-white" />
                    <span className="font-extrabold text-slate-900 block text-xs">Año 2004 - Fundación</span>
                    <p className="text-slate-500 mt-1">Colocación de la primera valla estática en el microcentro de Mendoza.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0.5 h-3.5 w-3.5 rounded-full bg-slate-400 border-4 border-white" />
                    <span className="font-extrabold text-slate-900 block text-xs">Año 2012 - Cobertura Provincial</span>
                    <p className="text-slate-500 mt-1">Llegamos a San Rafael, Maipú y Luján de Cuyo con más de 250 caras estáticas.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0.5 h-3.5 w-3.5 rounded-full bg-slate-400 border-4 border-white" />
                    <span className="font-extrabold text-slate-900 block text-xs">Año 2018 - El Salto Digital (DOOH)</span>
                    <p className="text-slate-500 mt-1">Inauguración de la primera pantalla LED de alta frecuencia en Sarmiento y 9 de Julio.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0.5 h-3.5 w-3.5 rounded-full bg-slate-900 animate-pulse border-4 border-white" />
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
                    <LucideIcons.Tv className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">Soportes Digitales Inteligentes (DOOH)</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Nuestras pantallas LED disponen de conexión inalámbrica, permitiendo cambiar creatividades según el horario del día o clima imperante para maximizar la conversión.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg inline-block">
                    <LucideIcons.Layers className="h-5 w-5" />
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
          {slug.startsWith("/soportes") && (
            <div className="space-y-6 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs">
              <div className="border-b border-slate-150 pb-4">
                <h2 className="text-xl font-black text-slate-900">
                  Inventario de Soportes en Vía Pública
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Catálogo completo e interactivo de dispositivos fijos, pantallas LED digitales UHD y unidades móviles.
                </p>
              </div>
              <SoportesInventory
                onNavigateToCityMap={(city) => {
                  if (city === "Buenos Aires") handleNavigate("/ubicaciones/buenos-aires");
                  else if (city === "Mendoza") handleNavigate("/ubicaciones/mendoza");
                }}
              />
            </div>
          )}

          {/* DEFAULT / OTHERS STATS */}
          {!slug.startsWith("/contacto") && !slug.startsWith("/mediakit") && !slug.startsWith("/nosotros") && !slug.startsWith("/servicios") && !slug.startsWith("/blog") && !slug.startsWith("/soportes") && !isMendoza && !isBA && ( 
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-sm">Contenido de la Sección</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Este contenido es simulado bajo las directrices SEO de alta retención. La URL se encuentra totalmente mapeada en la estructura para evitar errores 404 (páginas huérfanas) y facilitar la indexación automática del rastreador web de Google.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center gap-3 text-xs text-slate-500">
                <LucideIcons.Sparkles className="h-4.5 w-4.5 text-slate-400" />
                <span>Puedes editar o cambiar la palabra clave <strong>"{item.keyword}"</strong> asignada a esta sección ingresando a la pestaña de Sitemap en el CMS.</span>
              </div>
            </div>
          )}

        </div>

        {/* 5. SIDEBAR: NAVIGATION CLUSTER & CAMPAIGN ESTIMATOR */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Action Call for Planificador */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <div className="flex items-center gap-2">
                <LucideIcons.Calculator className="h-4.5 w-4.5 text-slate-900" />
                <h3 className="text-xs font-black text-slate-950">Tu Estimación de Presupuesto</h3>
              </div>
              {cartScreens.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LucideIcons.Trash2 className="h-3 w-3" />
                  Limpiar Plan
                </button>
              )}
            </div>

            {cartScreens.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <LucideIcons.PlusCircle className="h-6 w-6 text-slate-300 mx-auto" />
                <p className="text-[11px] text-slate-400 leading-relaxed px-2 font-medium">
                  El planificador de campaña está vacío. Agrega pantallas desde el catálogo en vivo de Mendoza o Buenos Aires.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Active screens selection */}
                <div className="flex max-h-24 flex-wrap gap-1 overflow-y-auto pr-1">
                  {cartScreens.map((screen) => (
                    <div
                      key={screen.id}
                      onClick={() => setSelectedScreenId(screen.id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 hover:border-slate-800 cursor-pointer transition-colors"
                    >
                      <span className="truncate max-w-[120px]">{screen.nombre}</span>
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
                    <input
                      type="text"
                      required
                      placeholder="Tu Nombre"
                      value={proposalClient.name}
                      onChange={(e) => setProposalClient({ ...proposalClient, name: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-900"
                    />
                    <input
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
                    <LucideIcons.Check className="h-5 h-5 text-emerald-600 mx-auto" />
                    <h5 className="font-extrabold text-emerald-800 text-xs">Propuesta Solicitada</h5>
                    <p className="text-[10px] text-emerald-600">Nuevo Lead creado en el CMS.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SEO DEEP LINKING CLUSTER NAVIGATION */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-150 pb-2">
              Explorar Secciones
            </h4>

            {/* Sibling Pages Link List */}
            {siblingPages.length > 0 && (
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Secciones Relacionadas</span>
                <div className="flex flex-col gap-1.5 text-xs">
                  {siblingPages.slice(0, 5).map((sib: SitemapItem) => (
                    <button
                      key={sib.slug}
                      onClick={() => handleNavigate(sib.slug)}
                      className="w-full text-left font-bold text-slate-600 hover:text-slate-950 hover:bg-slate-50 px-2 py-1 rounded transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">{sib.name}</span>
                      <LucideIcons.ArrowRight className="h-3 w-3 text-slate-300" />
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
                  {childPages.map((child: SitemapItem) => (
                    <button
                      key={child.slug}
                      onClick={() => handleNavigate(child.slug)}
                      className="w-full text-left font-bold text-slate-600 hover:text-slate-950 hover:bg-slate-50 px-2 py-1 rounded transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">{child.name}</span>
                      <LucideIcons.ChevronRight className="h-3.5 w-3.5 text-slate-350" />
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
              <LucideIcons.Home className="h-3.5 w-3.5 text-slate-600" />
              <span>Volver a la Portada</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
