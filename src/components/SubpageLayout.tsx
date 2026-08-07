import React, { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";
import { findSitemapItemBySlug, getBreadcrumbsForSlug, sitemap, SitemapItem } from "../lib/sitemap";
import { optimizeImageUrl } from "@/src/lib/imageUtils";
import { DoohScreen, Lead } from "../types";
import { AlertCircle, Calculator, Check, ChevronRight, Code, Home, Lock, PlusCircle, RefreshCw, Sparkles, Target, Trash2, Tv, X, Users, Eye, Layers, BookOpen } from "lucide-react";

const UbicacionesView = lazy(() => import("./UbicacionesView").then(m => ({ default: m.UbicacionesView })));
const ContactView = lazy(() => import("./ContactView").then(m => ({ default: m.ContactView })));
const MediaKitView = lazy(() => import("./MediaKitView").then(m => ({ default: m.MediaKitView })));
const NosotrosView = lazy(() => import("./NosotrosView").then(m => ({ default: m.NosotrosView })));
const ServiciosView = lazy(() => import("./ServiciosView").then(m => ({ default: m.ServiciosView })));
const BlogView = lazy(() => import("./BlogView").then(m => ({ default: m.BlogView })));
const SoportesView = lazy(() => import("./SoportesView").then(m => ({ default: m.SoportesView })));
const EspaciosPublicitariosView = lazy(() => import("./EspaciosPublicitariosView").then(m => ({ default: m.EspaciosPublicitariosView })));

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
  toggleCart: (id: string) => void;
  clearCart: () => void;
  weeks: number;
  setWeeks: (weeks: number) => void;
  addLead: (lead: Omit<Lead, "id" | "date">) => Promise<Lead | null>;
}

export const SubpageLayout: React.FC<SubpageLayoutProps> = ({
  slug,
  handleNavigate,
  screens,
  cart,
  toggleCart,
  clearCart,
  weeks,
  setWeeks,
  addLead,
}) => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbsForSlug(slug);
  const item = findSitemapItemBySlug(slug);

  // Dynamic Browser Simulation Tooltip copy
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showJsonLd, setShowJsonLd] = useState(false);

  // Reset local filters on slug changes
  useEffect(() => {
    setSelectedScreenId(null);
  }, [slug]);

  const allKnownScreens = [...screens, ...BUENOS_AIRES_SCREENS];
  const cartScreens = allKnownScreens.filter((s) => cart.includes(s.id));
  const cartSubtotal = cartScreens.reduce((sum, s) => sum + s.precio, 0);
  const cartTotalImpacts = cartScreens.reduce((sum, s) => sum + s.impactos, 0) * 7 * weeks;
  const cartTotalInvestment = cartSubtotal * weeks;

  // Proposal Submission inside subpages
  const [proposalClient, setProposalClient] = useState({ name: "", email: "", company: "" });
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

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

  // Subpage specific state
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);

  // Page specific logic
  const isUbicaciones = location.pathname.startsWith("/ubicaciones");
  const isContacto = location.pathname.startsWith("/contacto");
  const isMediaKit = location.pathname.startsWith("/mediakit");
  const isNosotros = location.pathname.startsWith("/nosotros");
  const isServicios = location.pathname.startsWith("/servicios");
  const isBlog = location.pathname.startsWith("/blog");
  const isSoportes = location.pathname.startsWith("/soportes");
  const isEspacios = location.pathname.startsWith("/espacios-publicitarios");

  const renderContent = () => {
    if (isUbicaciones) {
      return <UbicacionesView slug={slug} screens={screens} selectedScreenId={selectedScreenId} setSelectedScreenId={setSelectedScreenId} BUENOS_AIRES_SCREENS={BUENOS_AIRES_SCREENS} />;
    }
    if (isContacto) {
      return <ContactView slug={slug} addLead={addLead} />;
    }
    if (isMediaKit) {
      return <MediaKitView slug={slug} />;
    }
    if (isNosotros) {
      return <NosotrosView slug={slug} />;
    }
    if (isServicios) {
      return <ServiciosView slug={slug} />;
    }
    if (isBlog) {
      return <BlogView slug={slug} />;
    }
    if (isSoportes) {
      return <SoportesView slug={slug} handleNavigate={handleNavigate} />;
    }
    if (isEspacios) {
      return <EspaciosPublicitariosView allKnownScreens={allKnownScreens} setSelectedScreenId={setSelectedScreenId} />;
    }

    // Default content for other SEO pages
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm">Contenido de la Sección</h3>
        <p className="text-slate-500 text-xs leading-relaxed">
          Este contenido es simulado bajo las directrices SEO de alta retención. La URL se encuentra totalmente mapeada en la estructura para evitar errores 404 (páginas huérfanas) y facilitar la indexación automática del rastreador web de Google.
        </p>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center gap-3 text-xs text-slate-500">
          <Sparkles className="h-4.5 w-4.5 text-slate-400" />
          <span>Puedes editar o cambiar la palabra clave <strong>"{item.keyword}"</strong> asignada a esta sección ingresando a la pestaña de Sitemap en el CMS.</span>
        </div>
      </div>
    );
  };

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
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
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
                  <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#06434a]/20 rounded-full blur-2xl" />
                  
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[8px] bg-secondary/20 text-secondary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.intent}
                    </span>
                    <Tv className="h-4 w-4 text-stone-400" />
                  </div>

                  <div className="space-y-1.5 z-10">
                    <span className="text-[8px] uppercase text-stone-400 font-bold tracking-widest block">Soporte Inteligente</span>
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
          <Suspense fallback={
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs flex items-center justify-center min-h-75">
              <div className="text-center space-y-3">
                <RefreshCw className="h-6 w-6 text-slate-400 mx-auto animate-spin" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm">Cargando Sección...</h4>
                  <p className="text-xs text-slate-500">
                    Optimizando la entrega de contenido para una mejor experiencia.
                  </p>
                </div>
              </div>
            </div>
          }>
            {renderContent()}
          </Suspense>
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
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 hover:border-slate-800 cursor-pointer transition-colors max-w-30"
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
                    <Check className="h-5 w-5 text-emerald-600 mx-auto" />
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
                      <ChevronRight className="h-3 w-3 text-slate-300" />
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
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
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
