import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import { InteractiveMap } from "../InteractiveMap";
import { DoohScreen } from "../../types";
import { SpecsOverlay } from "./SpecsOverlay";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"Todos" | "DOOH" | "OOH">("Todos");
  const [selectedStatus, setSelectedStatus] = useState<"Todos" | "Disponible" | "Activo">("Todos");
  const [selectedScreenForSpecs, setSelectedScreenForSpecs] = useState<DoohScreen | null>(null);

  const filteredScreens = useMemo(() => {
    return screens.filter((sc) => {
      if (sc.ciudad !== selectedCity) return false;
      
      // Public list defaults to only active/available screens
      if (sc.status !== "Activo" && sc.status !== "Disponible") return false;

      // Filter by selectedStatus
      if (selectedStatus !== "Todos" && sc.status !== selectedStatus) return false;

      // Filter by selectedType (DOOH/OOH)
      if (selectedType === "DOOH") {
        const isDooh = sc.categoria === "Pantallas LED" || sc.categoria === "LED Móvil";
        if (!isDooh) return false;
      } else if (selectedType === "OOH") {
        const isOoh = sc.categoria === "Tradicionales";
        if (!isOoh) return false;
      }

      // Filter by Search Query (name or zone)
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matches = sc.nombre.toLowerCase().includes(q) || sc.zona.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [screens, selectedCity, selectedType, selectedStatus, searchQuery]);

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
        <span className="text-[10px] bg-[#06434a]/10 text-[#06434a] border border-[#06434a]/20 font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider select-none">
          REDISEÑO ZERO-BASE / PMV ACTIVO
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 tracking-tight font-black leading-none font-display">
          Publicidad Exterior Premium, <span className="text-[#06434a] italic">Simplificada.</span>
        </h1>
        <p className="text-stone-500 text-sm md:text-base leading-relaxed font-medium max-w-2xl">
          Accedé de forma directa a la red exclusiva de pantallas LED de gran formato de <strong>Grupo Comunicarte</strong> en Mendoza y Buenos Aires. Seleccioná ubicaciones con alto tráfico vehicular certificado, armá tu circuito y pautá en 24 horas sin fricciones comerciales.
        </p>
      </div>

      {/* Grid: Map left, streamlined order panel right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Interactive Map of Screens */}
        <div id="espacios" className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="text-left">
                <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <LucideIcons.MapPin className="h-4 w-4 text-[#06434a]" />
                  <span>Soportes Activos en {selectedCity}</span>
                </h2>
                <p className="text-[11px] text-stone-500">Seleccioná un marcador en el mapa o una pantalla de la lista para armar tu circuito.</p>
              </div>

              {/* City Selector */}
              <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                {(["Mendoza", "Buenos Aires"] as const).map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase cursor-pointer transition-all ${
                      selectedCity === city 
                        ? "bg-white text-stone-950 shadow-2xs font-extrabold" 
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Integrated Map Container */}
            <div className="h-[420px] rounded-xl overflow-hidden relative border border-stone-100">
              <InteractiveMap 
                screens={screens.filter(s => s.ciudad === selectedCity)} 
                selectedScreenId={null} 
                onSelectScreen={(id) => {
                  if (id) toggleCart(id);
                }}
              />
            </div>

            {/* Display Mini Screen List with Click to Add */}
            <div className="space-y-4 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-stone-100">
                <span className="block text-[10px] font-black text-[#06434a] uppercase tracking-widest font-mono">Listado Rápido de Soportes</span>
                <span className="text-[10px] text-stone-400 font-bold">{filteredScreens.length} soportes disponibles en {selectedCity}</span>
              </div>

              {/* Dynamic Filter Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                {/* Search query input */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                    <LucideIcons.Search className="h-3.5 w-3.5 text-stone-400" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar avenida o zona..."
                    className="w-full pl-8 pr-3 py-1.5 text-[11px] font-medium bg-white border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:border-[#06434a] transition-all"
                  />
                </div>

                {/* Format dropdown (OOH/DOOH) */}
                <div>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-[11px] font-bold bg-white border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:border-[#06434a] cursor-pointer"
                  >
                    <option value="Todos">Formatos: Todos (OOH/DOOH)</option>
                    <option value="DOOH">Digital (DOOH)</option>
                    <option value="OOH">Estático (OOH)</option>
                  </select>
                </div>

                {/* Availability dropdown */}
                <div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-[11px] font-bold bg-white border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:border-[#06434a] cursor-pointer"
                  >
                    <option value="Todos">Estado: Todos</option>
                    <option value="Disponible">Disponible (Inmediato)</option>
                    <option value="Activo">En Vuelo / Reservado</option>
                  </select>
                </div>
              </div>

              {filteredScreens.length === 0 ? (
                <div className="py-12 text-center bg-stone-50/50 rounded-xl border border-dashed border-stone-200 space-y-2">
                  <LucideIcons.Search className="h-6 w-6 text-stone-400 mx-auto animate-pulse" />
                  <p className="text-xs font-bold text-stone-600">No se encontraron soportes</p>
                  <p className="text-[10px] text-stone-400">Intenta modificando el término de búsqueda o cambiando los filtros seleccionados.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredScreens.map((sc) => {
                    const isInCart = cart.includes(sc.id);
                    return (
                      <div 
                        key={sc.id}
                        onClick={() => setSelectedScreenForSpecs(sc)}
                        className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 group/card ${
                          isInCart 
                            ? "border-[#06434a]/60 bg-[#06434a]/5 shadow-2xs hover:border-[#06434a]" 
                            : "border-stone-200 hover:border-stone-350 bg-white hover:shadow-2xs"
                        }`}
                      >
                        <div className="space-y-1.5 text-left pr-2 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-stone-900 text-[11.5px] block group-hover/card:text-[#06434a] transition-colors">
                              {sc.nombre}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                              {sc.zona} · {sc.impactos.toLocaleString()} imp/día
                            </span>
                            
                            <span className="text-[8.5px] text-[#06434a] font-extrabold opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center gap-1 select-none">
                              <LucideIcons.Eye className="h-3 w-3" />
                              <span>Ficha Técnica</span>
                            </span>
                          </div>
                        </div>

                        {/* Cart circle button */}
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCart(sc.id);
                          }}
                          className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                            isInCart 
                              ? "bg-[#06434a] text-white hover:scale-105" 
                              : "bg-stone-50 text-stone-400 border border-stone-200 hover:border-[#06434a]/30 hover:bg-[#06434a]/5 hover:text-[#06434a] hover:scale-105"
                          }`}
                          title={isInCart ? "Quitar de mi circuito" : "Agregar a mi circuito"}
                        >
                          {isInCart ? <LucideIcons.Check className="h-3.5 w-3.5" /> : <LucideIcons.Plus className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
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
              <span className="text-[10px] bg-[#e6f2f3] text-[#06434a] px-2 py-0.5 rounded-full font-mono font-bold">{cart.length} Soportes</span>
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
                    <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-wider">Nombre Completo *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ana de la Cruz"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50 focus:outline-none focus:border-[#06434a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-wider">Correo Corporativo *</label>
                        <input
                          type="email"
                          required
                          placeholder="nombre@empresa.com"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50 focus:outline-none focus:border-[#06434a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-wider">Teléfono / WhatsApp</label>
                        <input
                          type="tel"
                          placeholder="+54 9 261 1234567"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50 focus:outline-none focus:border-[#06434a]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingContact}
                        className="w-full bg-[#06434a] hover:bg-[#0b5e67] disabled:bg-stone-300 text-white font-extrabold text-[10px] uppercase tracking-wider py-3 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <LucideIcons.Send className="h-3.5 w-3.5" />
                        <span>{isSubmittingContact ? "Enviando..." : "Enviar Cotización de Circuito"}</span>
                      </button>
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
