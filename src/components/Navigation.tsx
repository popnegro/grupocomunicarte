import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import { Logo } from "./Logo";

interface NavigationProps {
  activeSlug: string;
  onNavigate: (slug: string) => void;
  onSetActiveView: (view: "landing" | "dashboard") => void;
  onSectionClick?: (section: "inicio" | "soporte" | "espacios" | "soluciones" | "nosotros" | "contacto") => void;
  logoSrc?: string;
  logoAlt?: string;
  brandName?: string;
  brandSubtitle?: string;
  cartCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSlug,
  onNavigate,
  onSetActiveView,
  onSectionClick,
  logoSrc,
  logoAlt,
  brandName,
  brandSubtitle,
  cartCount = 0,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("inicio");
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { id: "inicio", name: "Inicio", icon: <LucideIcons.Home className="h-4 w-4" /> },
    { id: "soporte", name: "Soportes", icon: <LucideIcons.Tv className="h-4 w-4" /> },
    { id: "espacios", name: "Espacios Publicitarios", icon: <LucideIcons.LayoutGrid className="h-4 w-4" /> },
    { id: "soluciones", name: "Soluciones", icon: <LucideIcons.Layers className="h-4 w-4" /> },
    { id: "nosotros", name: "Nosotros", icon: <LucideIcons.Info className="h-4 w-4" /> },
  ] as const;

  const handleItemClick = (id: "inicio" | "soporte" | "espacios" | "soluciones" | "nosotros" | "contacto") => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    if (onSectionClick) {
      onSectionClick(id);
    } else {
      // Fallback scroll to element
      const element = document.getElementById(id === "inicio" ? "hero-section" : `${id}-section`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <div className="fixed top-0 w-full z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200 shadow-xs transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          id="nav-logo"
          onClick={() => handleItemClick("inicio")}
          className="flex items-center text-left cursor-pointer select-none group focus:outline-none rounded-xl transition-all"
          aria-label="Grupo Comunicarte - Volver al inicio"
        >
          <Logo
            variant="dark"
            src={logoSrc}
            alt={logoAlt}
            brandName={brandName}
            brandSubtitle={brandSubtitle}
            className="group-hover:scale-[1.01] transition-transform duration-200"
          />
        </button>

        {/* Desktop Navigation Menu */}
        <nav id="nav-desktop-menu" className="hidden lg:flex items-center gap-1 text-sm font-bold text-stone-600 relative font-sans">
          {NAV_ITEMS.map((item) => {
            const active = item.id === "soporte"
              ? (activeSlug === "/soporte" || activeSlug.startsWith("/soporte"))
              : (activeSlug === "/" && activeSection === item.id);
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5 relative whitespace-nowrap text-xs tracking-wide uppercase ${
                  active
                    ? "text-[#06434a] bg-[#06434a]/8 font-black"
                    : "hover:text-stone-900 hover:bg-stone-100/60"
                }`}
              >
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons (Dashboard Access & Mobile Toggle) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigate("/dashboard");
            }}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-white px-4 py-2.5 border border-stone-200 hover:bg-stone-50 active:scale-95 rounded-full transition-all cursor-pointer font-sans"
          >
            <LucideIcons.Lock className="h-3.5 w-3.5 text-[#06434a]" />
            <span>Consola</span>
          </button>

          <button
            id="nav-cta-contacto"
            onClick={() => handleItemClick("contacto")}
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-white bg-[#06434a] hover:bg-[#0b5e67] px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer font-sans relative"
          >
            <LucideIcons.Phone className="h-3.5 w-3.5 text-white" />
            <span>Contacto</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-stone-100 text-stone-800 hover:bg-stone-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
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
            className="lg:hidden bg-[#FAF9F5] border-t border-stone-200 overflow-hidden shadow-inner max-h-[85vh] overflow-y-auto"
          >
            <div className="px-6 py-5 space-y-4 font-sans">
              <div className="flex flex-col gap-1.5">
                {NAV_ITEMS.map((item) => {
                  const active = item.id === "soporte"
                    ? (activeSlug === "/soporte" || activeSlug.startsWith("/soporte"))
                    : (activeSlug === "/" && activeSection === item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full text-left py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                        active
                          ? "bg-[#06434a]/10 text-[#06434a]"
                          : "text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.name}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Contacto mobile item */}
              <div className="pt-2 border-t border-stone-200/50">
                <button
                  onClick={() => {
                    handleItemClick("contacto");
                  }}
                  className="w-full py-3 px-4 text-center text-xs font-bold text-white bg-[#06434a] rounded-full hover:bg-[#0b5e67] transition-colors flex items-center justify-center gap-2 shadow-md relative"
                >
                  <LucideIcons.Phone className="h-4 w-4" />
                  <span>Contacto</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    {/* Spacer to prevent content from going under the fixed navbar */}
    <div className="h-[73px] w-full" />
    </>
  );
};
