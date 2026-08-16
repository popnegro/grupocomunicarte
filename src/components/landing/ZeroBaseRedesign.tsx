import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import { InteractiveMap } from "../InteractiveMap";
import { DoohScreen } from "../../types";
import { SpecsOverlay } from "./SpecsOverlay";
import { Badge, Button, Input } from "../../design-system";
import { useCms } from "../CmsContext";
import { Skeleton } from "../ui/skeleton";
import { StitchExplorerPanel } from "./StitchExplorerPanel";
import { StitchFeaturedLocations } from "./StitchFeaturedLocations";

interface ZeroBaseRedesignProps {
  screens: DoohScreen[];
  selectedCity: "Mendoza" | "Buenos Aires";
  setSelectedCity: (city: "Mendoza" | "Buenos Aires") => void;
  cart: string[];
  toggleCart: (id: string) => void;
  contactForm: {
    name: string;
    email: string;
    phone: string;
    company: string;
    spacePreference: string;
    message: string;
  };
  setContactForm: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    company: string;
    spacePreference: string;
    message: string;
  }>>;
  contactSubmitted: boolean;
  setContactSubmitted: (val: boolean) => void;
  isSubmittingContact: boolean;
  handleContactSubmit: (e: React.FormEvent) => void;
}

export const ZeroBaseRedesign: React.FC<ZeroBaseRedesignProps> = ({
  screens,
  selectedCity,
  setSelectedCity,
  cart,
  toggleCart,
  contactForm,
  setContactForm,
  contactSubmitted,
  setContactSubmitted,
  isSubmittingContact,
  handleContactSubmit,
}) => {
  const { loadingScreens } = useCms();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"Todos" | "Tradicionales" | "Pantallas LED" | "LED Móvil">("Todos");
  const [selectedStatus, setSelectedStatus] = useState<"Todos" | "Disponible" | "Activo">("Todos");
  const [selectedScreenForSpecs, setSelectedScreenForSpecs] = useState<DoohScreen | null>(null);
  const [mapFocusScreenId, setMapFocusScreenId] = useState<string | null>(null);

  // Pagination for Infinite Scroll
  const [visibleCount, setVisibleCount] = useState(6);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCity, selectedCategory, selectedStatus, searchQuery]);

  const filteredScreens = useMemo(() => {
    return screens.filter((sc) => {
      if (sc.ciudad !== selectedCity) return false;
      
      // Public list defaults to only active/available screens
      if (sc.status !== "Activo" && sc.status !== "Disponible") return false;

      // Filter by selectedStatus
      if (selectedStatus !== "Todos" && sc.status !== selectedStatus) return false;

      // Filter by selectedCategory (Tradicionales, Pantallas LED, LED Móvil)
      if (selectedCategory !== "Todos" && sc.categoria !== selectedCategory) return false;

      // Filter by Search Query (name or zone)
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matches = sc.nombre.toLowerCase().includes(q) || sc.zona.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [screens, selectedCity, selectedCategory, selectedStatus, searchQuery]);

  const paginatedScreens = useMemo(() => {
    return filteredScreens.slice(0, visibleCount);
  }, [filteredScreens, visibleCount]);

  // Featured carousel states
  const [carouselIndex, setCarouselIndex] = useState(0);

  const featuredScreens = useMemo(() => {
    return screens.filter(s => s.ciudad === selectedCity && s.categoria === "Pantallas LED" && s.status === "Activo");
  }, [screens, selectedCity]);

  useEffect(() => {
    setCarouselIndex(0);
  }, [selectedCity]);

  const getCarouselPhoto = (id: string) => {
    const map: Record<string, string> = {
      "sc-01": "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&w=1200&q=80",
      "sc-02": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
      "sc-03": "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1200&q=80",
      "sc-11": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      "ba-01": "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&w=1200&q=80",
      "ba-02": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
      "ba-03": "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1200&q=80",
    };
    return map[id] || "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&w=1200&q=80";
  };

  const handleLocateFeaturedScreen = (screen: DoohScreen) => {
    setSelectedCity(screen.ciudad as "Mendoza" | "Buenos Aires");
    setMapFocusScreenId(screen.id);
    window.setTimeout(() => {
      document.getElementById("catalog-explorer-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  return (
    <motion.main 
      id="hero-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12"
    >
      {/* Minimalist Typographic Header */}
      <div className="max-w-3xl space-y-4 text-left">
        <h1 className="text-4xl md:text-6xl text-stone-900 tracking-tight font-black leading-none font-display">
          Publicidad Exterior Premium, <span className="text-[#06434a]">Simplificada.</span>
        </h1>
        <p className="text-stone-500 text-sm md:text-base leading-relaxed font-medium max-w-2xl">
          Accedé de forma directa a la red exclusiva de pantallas LED de gran formato de <strong>Grupo Comunicarte</strong> en Mendoza y Buenos Aires. Seleccioná ubicaciones con alto tráfico vehicular certificado, armá tu circuito y pautá en 24 horas sin fricciones comerciales.
        </p>
      </div>

      {/* Stitch — Ubicaciones Destacadas */}
      <StitchFeaturedLocations
        screens={screens}
        selectedCity={selectedCity}
        cart={cart}
        toggleCart={toggleCart}
        onOpenDetail={setSelectedScreenForSpecs}
        onLocate={handleLocateFeaturedScreen}
      />

      {/* Explorador + Circuito */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div id="espacios" className="lg:col-span-8 space-y-4">
          <StitchExplorerPanel
            screens={screens}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            cart={cart}
            toggleCart={toggleCart}
            onOpenDetail={setSelectedScreenForSpecs}
            focusScreenId={mapFocusScreenId}
          />
        </div>

        {/* Right Side: Streamlined MediaKit Checkout Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl shadow-xs p-6 space-y-6 text-left relative">
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest flex items-center gap-1.5">
                  <LucideIcons.Layers className="h-4 w-4 text-[#06434a]" />
                  <span>Mi Circuito</span>
                </h3>
                <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Sincronizado (Auto-Save)
                </span>
              </div>
              <Badge variant="primary" className="px-2 py-0.5">{cart.length} Soportes</Badge>
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center space-y-3 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                <LucideIcons.SlidersHorizontal className="h-8 w-8 text-stone-300 mx-auto animate-pulse" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-stone-700">Tu circuito está vacío</p>
                  <p className="text-[10px] text-stone-400 max-w-[200px] mx-auto leading-relaxed">Selecciona soportes en el mapa o en la lista para armar tu cotización.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2 max-h-[180px] overflow-y-auto scrollbar-none pr-1">
                  {cart.map((id) => {
                    const sc = screens.find(s => s.id === id);
                    if (!sc) return null;
                    return (
                      <div key={id} className="p-3 bg-stone-50 border border-stone-150 rounded-xl flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <strong className="font-extrabold text-stone-900 text-[11px]">{sc.nombre}</strong>
                          <span className="block text-[9px] font-mono text-stone-400">{sc.impactos.toLocaleString()} impactos/día · {sc.ciudad}</span>
                        </div>
                        <button 
                          onClick={() => toggleCart(id)}
                          className="p-1 hover:bg-stone-200 rounded text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                        >
                          <LucideIcons.Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Direct checkout form */}
                <div className="pt-4 border-t border-stone-100 space-y-4">
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest font-mono">Formulario de Reserva Directa</h4>
                  
                  {!contactSubmitted ? (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <Input
                        label="Nombre Completo *"
                        type="text"
                        required
                        placeholder="Ana de la Cruz"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      />

                      <Input
                        label="Correo Corporativo *"
                        type="email"
                        required
                        placeholder="nombre@empresa.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />

                      <Input
                        label="Teléfono / WhatsApp"
                        type="tel"
                        placeholder="+54 9 261 1234567"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      />

                      <Button
                        type="submit"
                        disabled={isSubmittingContact}
                        loading={isSubmittingContact}
                        variant="primary"
                        className="w-full py-3 flex items-center justify-center gap-2 text-[10px]"
                      >
                        <LucideIcons.Send className="h-3.5 w-3.5" />
                        <span>Enviar Cotización de Circuito</span>
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-4 space-y-3 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <LucideIcons.CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                      <div className="space-y-1">
                        <p className="font-bold text-emerald-950 text-xs">¡Circuito Solicitado!</p>
                        <p className="text-[10px] text-emerald-800 leading-relaxed">Guardamos tus datos y ubicaciones con éxito. Un asesor comercial especializado se contactará contigo por WhatsApp y mail en menos de 2 horas hábiles.</p>
                      </div>
                      <button 
                        onClick={() => setContactSubmitted(false)}
                        className="text-[10px] text-[#06434a] font-bold underline cursor-pointer"
                      >
                        Enviar otra consulta
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {selectedScreenForSpecs && (
          <SpecsOverlay
            screen={selectedScreenForSpecs}
            onClose={() => setSelectedScreenForSpecs(null)}
            isInCart={cart.includes(selectedScreenForSpecs.id)}
            toggleCart={() => toggleCart(selectedScreenForSpecs.id)}
          />
        )}
      </AnimatePresence>
    </motion.main>
  );
};
