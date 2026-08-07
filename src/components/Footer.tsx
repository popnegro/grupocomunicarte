import React from "react";
import * as LucideIcons from "lucide-react";
import { Logo } from "./Logo";

interface FooterProps {
  onNavigate?: (slug: string) => void;
  onSetActiveView?: (view: "landing" | "dashboard") => void;
  onSectionScroll?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSetActiveView, onSectionScroll }) => {
  const currentYear = new Date().getFullYear();

  const handleScrollTo = (sectionId: string) => {
    if (onSectionScroll) {
      onSectionScroll(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="border-t border-stone-200 bg-stone-50 text-stone-800 font-sans transition-all duration-300">
      {/* Top section with multi-column list */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-6 flex flex-col items-start">
          <button
            onClick={() => handleScrollTo("hero-section")}
            className="focus:outline-none rounded-xl transition-all cursor-pointer"
            aria-label="Grupo Comunicarte - Volver al inicio"
          >
            <Logo variant="dark" />
          </button>
          
          <p className="text-xs text-stone-500 leading-relaxed max-w-xs font-normal">
            Líderes en comunicación e impacto visual exterior en Argentina. Planificamos y auditamos campañas OOH de alto impacto comercial con tecnología DOOH inteligente.
          </p>

          <div className="flex items-center gap-3 text-stone-400">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#06434a] transition-colors p-1"
              aria-label="LinkedIn Grupo Comunicarte"
            >
              <LucideIcons.Linkedin className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#06434a] transition-colors p-1"
              aria-label="Instagram Grupo Comunicarte"
            >
              <LucideIcons.Instagram className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#06434a] transition-colors p-1"
              aria-label="Facebook Grupo Comunicarte"
            >
              <LucideIcons.Facebook className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {/* Column 1: Nosotros */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">
            Nosotros
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-600">
            {[
              { label: "Quiénes Somos", target: "nosotros-section" },
              { label: "Trayectoria Grupo Comunicarte", target: "nosotros-section" },
              { label: "Cobertura de Plazas", target: "hero-section" },
              { label: "Infraestructura LED", target: "nosotros-section" },
            ].map((link, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleScrollTo(link.target)}
                  className="hover:text-[#06434a] hover:underline underline-offset-4 focus:outline-none transition-all text-left font-semibold cursor-pointer"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Soluciones */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">
            Soluciones
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-600">
            {[
              { label: "DOOH Inteligente", target: "soluciones" },
              { label: "Planificación de Medios", target: "soluciones" },
              { label: "Métricas de Audiencia", target: "soluciones" },
              { label: "Soporte Corporativo", target: "soluciones" },
            ].map((link, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleScrollTo(link.target)}
                  className="hover:text-[#06434a] hover:underline underline-offset-4 focus:outline-none transition-all text-left font-semibold cursor-pointer"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Soportes Publicitarios */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">
            Espacios
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-600">
            {[
              { label: "Plaza Mendoza", target: "espacios" },
              { label: "Plaza Buenos Aires", target: "espacios" },
              { label: "Catálogo Completo", target: "espacios" },
            ].map((link, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleScrollTo(link.target)}
                  className="hover:text-[#06434a] hover:underline underline-offset-4 focus:outline-none transition-all text-left font-semibold cursor-pointer"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Middle section: B2B quick access bar */}
      <div className="border-t border-stone-200 bg-stone-100/50 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-stone-500 font-semibold">
              Portal Comercial OOH & Agencias activo
            </span>
          </div>
          {onSetActiveView && (
            <button
              onClick={() => onSetActiveView("dashboard")}
              className="text-xs font-extrabold text-[#06434a] hover:text-[#0b5e67] bg-white border border-stone-200 hover:bg-stone-50 py-2.5 px-5 rounded-full transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <LucideIcons.LogIn className="h-3.5 w-3.5" />
              <span>Consola Comercial B2B</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Legal section */}
      <div className="border-t border-stone-200 bg-stone-100/80 py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 font-semibold text-stone-600">
            <span onClick={() => handleScrollTo("contacto")} className="hover:text-[#06434a] cursor-pointer transition-colors">Términos del Ciclo</span>
            <span onClick={() => handleScrollTo("contacto")} className="hover:text-[#06434a] cursor-pointer transition-colors">Normas Técnicas DOOH</span>
            <span onClick={() => handleScrollTo("contacto")} className="hover:text-[#06434a] cursor-pointer transition-colors">Contacto Directo</span>
          </div>

          <div className="font-medium text-stone-400 text-center sm:text-right">
            &copy; {currentYear} Grupo Comunicarte. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};
