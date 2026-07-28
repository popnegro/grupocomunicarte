import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import { sitemap, SitemapItem } from "../lib/sitemap";

interface NavigationProps {
  activeSlug: string;
  onNavigate: (slug: string) => void;
  onSetActiveView: (view: "landing" | "dashboard" | "onboarding") => void;
}

// Map subpage slugs to gorgeous, high-context Lucide icons
const getIconForSlug = (slug: string): React.ReactNode => {
  const sizeClass = "h-4 w-4";
  switch (slug) {
    // Nosotros
    case "/nosotros/historia":
      return <LucideIcons.History className={`${sizeClass} text-indigo-500`} />;
    case "/nosotros/equipo":
      return <LucideIcons.Users className={`${sizeClass} text-indigo-500`} />;
    case "/nosotros/grupo-comunicarte":
      return <LucideIcons.Tv className={`${sizeClass} text-indigo-500`} />;
    
    // Servicios
    case "/servicios/publicidad-exterior":
      return <LucideIcons.Monitor className={`${sizeClass} text-sky-500`} />;
    case "/servicios/publicidad-digital":
      return <LucideIcons.Cpu className={`${sizeClass} text-sky-500`} />;
    case "/servicios/campanas-integrales":
      return <LucideIcons.Layers className={`${sizeClass} text-sky-500`} />;
    case "/servicios/consultoria":
      return <LucideIcons.Sparkles className={`${sizeClass} text-sky-500`} />;

    // Espacios Publicitarios
    case "/espacios-publicitarios/carteles":
      return <LucideIcons.Flag className={`${sizeClass} text-emerald-500`} />;
    case "/espacios-publicitarios/pantallas-led":
      return <LucideIcons.Tv className={`${sizeClass} text-emerald-500`} />;
    case "/espacios-publicitarios/mobiliario-urbano":
      return <LucideIcons.Compass className={`${sizeClass} text-emerald-500`} />;
    case "/espacios-publicitarios/centros-comerciales":
      return <LucideIcons.ShoppingBag className={`${sizeClass} text-emerald-500`} />;
    case "/espacios-publicitarios/aeropuertos":
      return <LucideIcons.Plane className={`${sizeClass} text-emerald-500`} />;
    case "/espacios-publicitarios/formatos-especiales":
      return <LucideIcons.Sparkles className={`${sizeClass} text-emerald-500`} />;

    // Ubicaciones
    case "/ubicaciones/buenos-aires":
      return <LucideIcons.MapPin className={`${sizeClass} text-rose-500`} />;
    case "/ubicaciones/mendoza":
      return <LucideIcons.MapPin className={`${sizeClass} text-rose-500`} />;
    case "/ubicaciones/otras-provincias":
      return <LucideIcons.Map className={`${sizeClass} text-rose-500`} />;
    case "/ubicaciones/mapa":
      return <LucideIcons.Compass className={`${sizeClass} text-rose-500`} />;

    // Soluciones
    case "/soluciones/por-industria":
      return <LucideIcons.Briefcase className={`${sizeClass} text-amber-500`} />;
    case "/soluciones/por-objetivo":
      return <LucideIcons.Target className={`${sizeClass} text-amber-500`} />;
    case "/soluciones/por-presupuesto":
      return <LucideIcons.Coins className={`${sizeClass} text-amber-500`} />;

    // Casos de Éxito
    case "/casos-exito/portfolio":
      return <LucideIcons.FolderHeart className={`${sizeClass} text-teal-500`} />;
    case "/casos-exito/galeria":
      return <LucideIcons.Image className={`${sizeClass} text-teal-500`} />;

    // Mediakit
    case "/mediakit/descargas":
      return <LucideIcons.Download className={`${sizeClass} text-cyan-500`} />;
    case "/mediakit/especificaciones":
      return <LucideIcons.Sliders className={`${sizeClass} text-cyan-500`} />;
    case "/mediakit/tarifario":
      return <LucideIcons.CreditCard className={`${sizeClass} text-cyan-500`} />;
    case "/mediakit/faq":
      return <LucideIcons.HelpCircle className={`${sizeClass} text-cyan-500`} />;

    // Blog
    case "/blog/noticias":
      return <LucideIcons.Newspaper className={`${sizeClass} text-violet-500`} />;
    case "/blog/tendencias-ooh":
      return <LucideIcons.TrendingUp className={`${sizeClass} text-violet-500`} />;
    case "/blog/marketing":
      return <LucideIcons.BookOpen className={`${sizeClass} text-violet-500`} />;

    // Contacto
    case "/contacto/cotizacion":
      return <LucideIcons.FileText className={`${sizeClass} text-blue-500`} />;
    case "/contacto/empleo":
      return <LucideIcons.UserCheck className={`${sizeClass} text-blue-500`} />;

    default:
      return <LucideIcons.Sparkles className={`${sizeClass} text-slate-400`} />;
  }
};

export const Navigation: React.FC<NavigationProps> = ({
  activeSlug,
  onNavigate,
  onSetActiveView,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileAccordions, setMobileAccordions] = useState<Record<string, boolean>>({});

  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter sitemap to find items we want to render in main navigation menu
  // Exclude Mi Cuenta because we render it on the far right as a distinct CTA button
  const mainNavItems = sitemap.filter(
    (item) => item.slug !== "/mi-cuenta" && item.slug !== "/"
  );

  const isActive = (slug: string) => {
    if (slug === "/") {
      return activeSlug === "/";
    }
    return activeSlug === slug || activeSlug.startsWith(slug + "/");
  };

  const handleMobileAccordionToggle = (slug: string) => {
    setMobileAccordions((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const handleLinkClick = (slug: string) => {
    onNavigate(slug);
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <div ref={navRef} className="relative w-full bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-150">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          id="nav-logo"
          onClick={() => handleLinkClick("/")}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="h-9 w-9 rounded-xl bg-slate-950 flex items-center justify-center text-white font-black text-xl shadow-md shadow-slate-950/10 group-hover:scale-105 transition-transform duration-200">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base tracking-tight text-slate-900 leading-none">SmartWeb</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Grupo Comunicarte</span>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav id="nav-desktop-menu" className="hidden xl:flex items-center gap-1.5 text-sm font-bold text-slate-500 relative">
          {/* Dynamic Sitemap Items */}
          {mainNavItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const active = isActive(item.slug);

            if (!hasChildren) {
              return (
                <button
                  key={item.slug}
                  id={`nav-link-${item.slug.replace(/\//g, "-")}`}
                  onClick={() => handleLinkClick(item.slug)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    active
                      ? "text-slate-950 bg-slate-50"
                      : "hover:text-slate-950 hover:bg-slate-50/50"
                  }`}
                >
                  {item.name}
                </button>
              );
            }

            return (
              <div
                key={item.slug}
                className="relative py-1"
                onMouseEnter={() => setOpenDropdown(item.slug)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  id={`nav-dropdown-trigger-${item.slug.replace(/\//g, "-")}`}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    active
                      ? "text-slate-950 bg-slate-50"
                      : "hover:text-slate-950 hover:bg-slate-50/50"
                  }`}
                >
                  <span>{item.name}</span>
                  <LucideIcons.ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      openDropdown === item.slug ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openDropdown === item.slug && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-1.5 w-64 bg-white border border-slate-150 rounded-xl shadow-xl py-2 z-50 overflow-hidden"
                    >
                      {/* Optional: Add a parent landing page link inside the dropdown if appropriate */}
                      <button
                        onClick={() => handleLinkClick(item.slug)}
                        className={`w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-black flex items-center gap-2.5 border-b border-slate-100 pb-2 mb-1.5 ${
                          activeSlug === item.slug ? "text-slate-950 bg-slate-50/50" : "text-slate-500 hover:text-slate-950"
                        }`}
                      >
                        <LucideIcons.Compass className="h-3.5 w-3.5 text-slate-400" />
                        <span>Ver Todo: {item.name}</span>
                      </button>

                      {item.children?.map((child) => (
                        <button
                          key={child.slug}
                          id={`nav-child-${child.slug.replace(/\//g, "-")}`}
                          onClick={() => handleLinkClick(child.slug)}
                          className={`w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center gap-2.5 ${
                            activeSlug === child.slug
                              ? "text-slate-950 bg-slate-50"
                              : "text-slate-600 hover:text-slate-950"
                          }`}
                        >
                          {getIconForSlug(child.slug)}
                          <div className="flex flex-col">
                            <span className="leading-tight">{child.name}</span>
                            {child.description && (
                              <span className="text-[10px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                                {child.description}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Action Buttons (Dashboard Access & Mobile Toggle) */}
        <div className="flex items-center gap-3">
          <button
            id="nav-cta-login"
            onClick={() => onSetActiveView("dashboard")}
            className="hidden sm:flex items-center gap-2 text-xs font-black text-slate-950 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-350 px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <LucideIcons.LogIn className="h-3.5 w-3.5 text-slate-950" />
            <span>Inicio sesión</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <LucideIcons.X className="h-5 w-5" />
            ) : (
              <LucideIcons.Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="xl:hidden bg-white border-t border-slate-150 overflow-hidden shadow-inner max-h-[80vh] overflow-y-auto"
          >
            <div className="px-6 py-5 space-y-4">
              <div className="flex flex-col gap-1.5">
                {/* Inicio Mobile Link */}
                <button
                  onClick={() => handleLinkClick("/")}
                  className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold flex items-center gap-2.5 ${
                    activeSlug === "/"
                      ? "bg-slate-950 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <LucideIcons.Home className="h-4 w-4" />
                  <span>Inicio</span>
                </button>

                {/* Sitemap Items Accordion style */}
                {mainNavItems.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const active = isActive(item.slug);
                  const isOpen = !!mobileAccordions[item.slug];

                  if (!hasChildren) {
                    return (
                      <button
                        key={item.slug}
                        onClick={() => handleLinkClick(item.slug)}
                        className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold flex items-center gap-2.5 ${
                          active
                            ? "bg-slate-50 text-slate-950"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <LucideIcons.Compass className="h-4 w-4 text-slate-400" />
                        <span>{item.name}</span>
                      </button>
                    );
                  }

                  return (
                    <div key={item.slug} className="border border-slate-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleMobileAccordionToggle(item.slug)}
                        className={`w-full text-left py-3 px-3 text-sm font-bold flex items-center justify-between ${
                          active ? "bg-slate-50/70 text-slate-950" : "text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <LucideIcons.Folder className="h-4 w-4 text-slate-400" />
                          <span>{item.name}</span>
                        </span>
                        <LucideIcons.ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="bg-slate-50/50 pl-4 pr-3 py-1.5 space-y-1 border-t border-slate-50">
                          {/* Parent View All */}
                          <button
                            onClick={() => handleLinkClick(item.slug)}
                            className={`w-full text-left py-2 px-3 text-xs font-black text-slate-500 hover:text-slate-950 flex items-center gap-2.5`}
                          >
                            <LucideIcons.Compass className="h-3.5 w-3.5 text-slate-400" />
                            <span>Ver todo en {item.name}</span>
                          </button>

                          {/* Children */}
                          {item.children?.map((child) => (
                            <button
                              key={child.slug}
                              onClick={() => handleLinkClick(child.slug)}
                              className={`w-full text-left py-2 px-3 rounded-md text-xs font-bold flex items-center gap-2.5 ${
                                activeSlug === child.slug
                                  ? "bg-white text-slate-950 shadow-xs border border-slate-200/50 font-black"
                                  : "text-slate-600 hover:text-slate-950 hover:bg-white/45"
                              }`}
                            >
                              {getIconForSlug(child.slug)}
                              <span>{child.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Login/CTA mobile item */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onSetActiveView("dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 px-4 text-center text-xs font-black text-white bg-slate-950 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-md shadow-slate-950/10 min-h-[44px]"
                >
                  <LucideIcons.LogIn className="h-4 w-4" />
                  <span>Inicio de sesión (Portal B2B)</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
