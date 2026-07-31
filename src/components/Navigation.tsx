import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import { Logo } from "./Logo";
import { useCms } from "./CmsContext";
import { Link, useNavigate, useLocation } from "react-router-dom";


interface NavigationProps {
  onSectionClick?: (section: "inicio" | "espacios" | "mapa" | "mediakit" | "nosotros" | "contacto" | "soportes") => void;
  logoSrc?: string;
  logoAlt?: string;
  brandName?: string;
  brandSubtitle?: string;
  cartCount?: number;
}



export const Navigation: React.FC<NavigationProps> = ({
  onSectionClick,
  logoSrc,
  logoAlt,
  brandName,
  brandSubtitle,
  cartCount = 0,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NAV_ITEMS = [
    { id: "espacios", name: "Espacios Publicitarios", icon: <LucideIcons.LayoutGrid className="h-4 w-4" />, slug: "/#espacios" },
    { id: "mapa", name: "Mapa", icon: <LucideIcons.Map className="h-4 w-4" />, slug: "/#mapa" },
    { id: "soportes", name: "Soportes", icon: <LucideIcons.Monitor className="h-4 w-4" />, slug: "/#soportes" },
    { id: "nosotros", name: "Nosotros", icon: <LucideIcons.Info className="h-4 w-4" />, slug: "/#nosotros-section" },
    { id: "contacto", name: "Contacto", icon: <LucideIcons.Phone className="h-4 w-4" />, slug: "/#contacto" },
  ] as const;

  const handleItemClick = (id: "inicio" | "espacios" | "mapa" | "mediakit" | "soportes" | "nosotros" | "contacto") => {
    setIsMobileMenuOpen(false);
    if (onSectionClick) {
      onSectionClick(id);
    } else {
      const targetId = id === "inicio" ? "hero-section" : `${id}-section`;
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else if (id === "mediakit") {
        navigate("/dashboard/mediakit"); // Navigate to dashboard mediakit for "Mi MediaKit"
      } else {
        navigate(`/#${targetId}`); // Navigate to section on homepage
      }
    }
  };

  return (
    <>
      <div className="fixed top-0 w-full z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200 shadow-xs transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          id="nav-logo"
          to="/"
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
        </Link>

        {/* Desktop Navigation Menu */}
        <nav id="nav-desktop-menu" className="hidden lg:flex items-center gap-1 text-sm font-bold text-stone-600 relative font-sans">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.slug || (item.id === "espacios" && pathname === "/");
            return (
              <Link
                key={item.id}
                id={`nav-link-${item.id}`}
                to={item.slug}
                className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5 relative whitespace-nowrap text-xs tracking-wide uppercase ${
                  isActive
                    ? "text-[#06434a] bg-[#06434a]/8 font-black"
                    : "hover:text-stone-900 hover:bg-stone-100/60"
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons (Dashboard Access & Mobile Toggle) */}
        <div className="flex items-center gap-3 ml-4">
          

          <Link
            id="nav-cta-login"
            to="/dashboard/mediakit"
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-white bg-[#06434a] hover:bg-[#0b5e67] px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer font-sans relative"
          >
            <LucideIcons.FileDown className="h-3.5 w-3.5 text-white" />
            <span>Mi MediaKit</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white shadow-md animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-stone-100 text-stone-800 hover:bg-stone-200 cursor-pointer min-h-11 min-w-11 flex items-center justify-center transition-colors"
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
                  const isActive = pathname === item.slug;
                  return (
                    <Link
                      key={item.id}
                      to={item.slug}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full text-left py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                        isActive
                          ? "bg-[#06434a]/10 text-[#06434a]"
                          : "text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Login/CTA mobile item */}
              <div className="pt-2 border-t border-stone-200/50">
                <Link
                  to="/dashboard/mediakit"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 px-4 text-center text-xs font-bold text-white bg-[#06434a] rounded-full hover:bg-[#0b5e67] transition-colors flex items-center justify-center gap-2 shadow-md relative"
                >
                  <LucideIcons.FileDown className="h-4 w-4" />
                  <span>Mi MediaKit</span>
                  {cartCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white shadow-sm animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    {/* Spacer to prevent content from going under the fixed navbar */}
    <div className="h-18.25 w-full" />
    </>
  );
};
