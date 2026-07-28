import React, { useState } from "react";
import { useCms } from "./CmsContext";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import { ScreenCard } from "./ScreenCard";
import { InteractiveMap } from "./InteractiveMap";
import { DoohScreen } from "../types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

// Helper to resolve Lucide Icon string safely
const DynamicIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    return <LucideIcons.Sparkles className={className} />;
  }
  return <IconComponent className={className} />;
};

// Premium Buenos Aires Screens for the /buenos aires view
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

export const LandingView: React.FC = () => {
  const {
    content,
    addLead,
    setActiveView,
    screens,
    cart,
    toggleCart,
    clearCart,
    weeks,
    setWeeks,
  } = useCms();

  // Navigation states
  const [isNosotrosOpen, setIsNosotrosOpen] = useState(false);
  const [isEspaciosOpen, setIsEspaciosOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileNosotrosOpen, setIsMobileNosotrosOpen] = useState(false);
  const [isMobileEspaciosOpen, setIsMobileEspaciosOpen] = useState(false);

  // Active province state for spaces
  const [selectedProvince, setSelectedProvince] = useState<"Mendoza" | "Buenos Aires">("Mendoza");

  // Lead / Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    spacePreference: "Mendoza",
    message: "",
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Proposal checkout state
  const [proposalClient, setProposalClient] = useState({ name: "", email: "", company: "" });
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  // Catalog filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"Todos" | "Peatonal" | "Vehicular" | "Mixto">("Todos");
  const [filterZone, setFilterZone] = useState("Todas");
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);

  // Media kit state
  const [mediaKitDownloading, setMediaKitDownloading] = useState(false);
  const [mediaKitSuccess, setMediaKitSuccess] = useState(false);

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Switch screens list according to selected province
  const currentScreens = selectedProvince === "Mendoza" ? screens : BUENOS_AIRES_SCREENS;
  const activeScreens = currentScreens.filter((screen) => screen.status === "Activo" || screen.status === "Disponible");

  // Filtering calculations
  const filteredScreens = activeScreens.filter((screen) => {
    const matchesSearch =
      screen.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screen.zona.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "Todos" || screen.tipo === filterType;
    const matchesZone = filterZone === "Todas" || screen.zona === filterZone;
    return matchesSearch && matchesType && matchesZone;
  });

  const availableZones = ["Todas", ...Array.from(new Set(activeScreens.map((s) => s.zona)))];

  // Cart / Cotizador calculations supporting both provinces seamlessly
  const allKnownScreens = [...screens, ...BUENOS_AIRES_SCREENS];
  const cartScreens = allKnownScreens.filter((s) => cart.includes(s.id));
  const cartSubtotal = cartScreens.reduce((sum, s) => sum + s.precio, 0);
  const cartTotalImpacts = cartScreens.reduce((sum, s) => sum + s.impactos, 0) * 7 * weeks;
  const cartTotalInvestment = cartSubtotal * weeks;

  // Form submission: Proposal Form
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalClient.name || !proposalClient.email || cartScreens.length === 0) return;

    setIsSubmittingProposal(true);
    await addLead({
      name: proposalClient.name,
      email: proposalClient.email,
      company: proposalClient.company,
      source: `Cotizador DOOH (${selectedProvince})`,
      status: "qualified",
      value: cartTotalInvestment,
    });
    setIsSubmittingProposal(false);
    setProposalSubmitted(true);
  };

  // Form submission: General Contact Form
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;

    setIsSubmittingContact(true);
    await addLead({
      name: contactForm.name,
      email: contactForm.email,
      company: contactForm.company || "Contacto General",
      source: `Contacto - Interés: ${contactForm.spacePreference}`,
      status: "new",
      value: 1500, // estimated lead value
    });
    setIsSubmittingContact(false);
    setContactSubmitted(true);
  };

  // Smooth scroll handler
  const scrollToSection = (id: string, province?: "Mendoza" | "Buenos Aires") => {
    if (province) {
      setSelectedProvince(province);
      setFilterZone("Todas"); // Reset zone filter on province change
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
    setIsNosotrosOpen(false);
    setIsEspaciosOpen(false);
  };

  // Simulation of Media Kit download
  const handleDownloadMediaKit = () => {
    setMediaKitDownloading(true);
    setTimeout(() => {
      setMediaKitDownloading(false);
      setMediaKitSuccess(true);
      setTimeout(() => setMediaKitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-100 font-sans antialiased overflow-x-hidden">
      {/* CMS Connection Notice */}
      <div className="bg-slate-900 text-white text-[10px] md:text-xs py-2 px-4 text-center font-bold tracking-wider flex items-center justify-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>CONECTADO AL CMS: Los cambios en el Dashboard se actualizan al instante en el sitio</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-45 bg-white/90 backdrop-blur-md border-b border-slate-150 px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => scrollToSection("inicio")} 
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="h-9 w-9 rounded-xl bg-slate-950 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-slate-950/10">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base tracking-tight text-slate-900 leading-none">SmartWeb</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Grupo Comunicarte</span>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 relative">
          {/* Inicio Link */}
          <button 
            onClick={() => scrollToSection("inicio")} 
            className="hover:text-slate-950 transition-colors cursor-pointer"
          >
            Inicio
          </button>

          {/* Nosotros Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsNosotrosOpen(true)}
            onMouseLeave={() => setIsNosotrosOpen(false)}
          >
            <button className="flex items-center gap-1.5 hover:text-slate-950 transition-colors cursor-pointer py-1">
              <span>Nosotros</span>
              <LucideIcons.ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isNosotrosOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {isNosotrosOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-52 bg-white border border-slate-150 rounded-xl shadow-xl py-2 z-50 overflow-hidden"
                >
                  <button 
                    onClick={() => scrollToSection("soluciones")} 
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-2"
                  >
                    <LucideIcons.Sparkles className="h-3.5 w-3.5 text-slate-400" />
                    <span>/soluciones</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection("soportes")} 
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-2"
                  >
                    <LucideIcons.Monitor className="h-3.5 w-3.5 text-slate-400" />
                    <span>/soportes</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection("mediakit")} 
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-2"
                  >
                    <LucideIcons.FileText className="h-3.5 w-3.5 text-slate-400" />
                    <span>/mediakit</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection("grupo-comunicarte")} 
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-2"
                  >
                    <LucideIcons.Tv className="h-3.5 w-3.5 text-slate-400" />
                    <span>/grupo comunicarte</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Espacios Publicitarios Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsEspaciosOpen(true)}
            onMouseLeave={() => setIsEspaciosOpen(false)}
          >
            <button className="flex items-center gap-1.5 hover:text-slate-950 transition-colors cursor-pointer py-1">
              <span>Espacios publicitarios</span>
              <LucideIcons.ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isEspaciosOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {isEspaciosOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-48 bg-white border border-slate-150 rounded-xl shadow-xl py-2 z-50 overflow-hidden"
                >
                  <button 
                    onClick={() => scrollToSection("espacios-publicitarios", "Mendoza")} 
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-2"
                  >
                    <LucideIcons.MapPin className="h-3.5 w-3.5 text-sky-500" />
                    <span>/mendoza</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection("espacios-publicitarios", "Buenos Aires")} 
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-2"
                  >
                    <LucideIcons.MapPin className="h-3.5 w-3.5 text-teal-500" />
                    <span>/buenos aires</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contacto Link */}
          <button 
            onClick={() => scrollToSection("contacto")} 
            className="hover:text-slate-950 transition-colors cursor-pointer"
          >
            Contacto
          </button>
        </nav>

        {/* Action Buttons (Dashboard Access & Mobile Toggle) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView("dashboard")}
            className="hidden md:flex items-center gap-2 text-xs font-extrabold text-slate-950 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-350 px-4 py-2 rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <LucideIcons.LogIn className="h-3.5 w-3.5 text-slate-950" />
            <span>Inicio sesión</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 cursor-pointer"
          >
            {isMobileMenuOpen ? <LucideIcons.X className="h-5 w-5" /> : <LucideIcons.Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-150 px-6 py-4 space-y-4"
          >
            <div className="flex flex-col gap-3 font-bold text-sm text-slate-600">
              <button 
                onClick={() => scrollToSection("inicio")} 
                className="w-full text-left py-1 hover:text-slate-900"
              >
                Inicio
              </button>

              {/* Mobile Nosotros Collapsible */}
              <div className="space-y-1">
                <button 
                  onClick={() => setIsMobileNosotrosOpen(!isMobileNosotrosOpen)} 
                  className="w-full text-left py-1 hover:text-slate-900 flex items-center justify-between"
                >
                  <span>Nosotros</span>
                  <LucideIcons.ChevronDown className={`h-4 w-4 transform transition-transform ${isMobileNosotrosOpen ? "rotate-180" : ""}`} />
                </button>
                {isMobileNosotrosOpen && (
                  <div className="pl-4 space-y-2 py-1 text-xs">
                    <button onClick={() => scrollToSection("soluciones")} className="w-full text-left py-1 block text-slate-500 hover:text-slate-900">/soluciones</button>
                    <button onClick={() => scrollToSection("soportes")} className="w-full text-left py-1 block text-slate-500 hover:text-slate-900">/soportes</button>
                    <button onClick={() => scrollToSection("mediakit")} className="w-full text-left py-1 block text-slate-500 hover:text-slate-900">/mediakit</button>
                    <button onClick={() => scrollToSection("grupo-comunicarte")} className="w-full text-left py-1 block text-slate-500 hover:text-slate-900">/grupo comunicarte</button>
                  </div>
                )}
              </div>

              {/* Mobile Espacios Collapsible */}
              <div className="space-y-1">
                <button 
                  onClick={() => setIsMobileEspaciosOpen(!isMobileEspaciosOpen)} 
                  className="w-full text-left py-1 hover:text-slate-900 flex items-center justify-between"
                >
                  <span>Espacios publicitarios</span>
                  <LucideIcons.ChevronDown className={`h-4 w-4 transform transition-transform ${isMobileEspaciosOpen ? "rotate-180" : ""}`} />
                </button>
                {isMobileEspaciosOpen && (
                  <div className="pl-4 space-y-2 py-1 text-xs">
                    <button onClick={() => scrollToSection("espacios-publicitarios", "Mendoza")} className="w-full text-left py-1 block text-slate-500 hover:text-slate-900">/mendoza</button>
                    <button onClick={() => scrollToSection("espacios-publicitarios", "Buenos Aires")} className="w-full text-left py-1 block text-slate-500 hover:text-slate-900">/buenos aires</button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => scrollToSection("contacto")} 
                className="w-full text-left py-1 hover:text-slate-900"
              >
                Contacto
              </button>

              <button
                onClick={() => {
                  setActiveView("dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 text-center text-xs font-extrabold text-white bg-slate-950 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <LucideIcons.LogIn className="h-4 w-4" />
                <span>Inicio sesión</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 1: INICIO (HERO) */}
      <section id="inicio" className="relative pt-12 pb-20 md:py-28 max-w-6xl mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-slate-200/80 border border-slate-300/40 text-[10px] md:text-xs font-bold tracking-widest text-slate-800 uppercase px-3 py-1 rounded-full">
            <LucideIcons.TrendingUp className="h-3.5 w-3.5 text-slate-900" />
            {content.hero.badge || "Impacto Comercial DOOH"}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-3xl mx-auto">
            {content.hero.title}
          </h1>

          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
            {content.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => scrollToSection("espacios-publicitarios")}
              className="w-full sm:w-auto bg-slate-950 hover:bg-slate-850 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md shadow-slate-950/10 transition-all text-center cursor-pointer"
            >
              Explorar Espacios Publicitarios
            </button>
            <button
              onClick={() => scrollToSection("contacto")}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm px-8 py-3.5 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Agendar Asesoría B2B
            </button>
          </div>
        </div>

        {/* Live Screens Statistics Overview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-16 md:mt-24">
          <div className="bg-white border border-slate-250 p-6 rounded-xl shadow-sm text-center">
            <span className="block text-3xl font-black text-slate-950 tracking-tight">14+</span>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Ubicaciones Premium</span>
          </div>
          <div className="bg-white border border-slate-250 p-6 rounded-xl shadow-sm text-center">
            <span className="block text-3xl font-black text-slate-950 tracking-tight">100%</span>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Sincronización Digital</span>
          </div>
          <div className="bg-white border border-slate-250 p-6 rounded-xl shadow-sm text-center">
            <span className="block text-3xl font-black text-slate-950 tracking-tight">+1.5M</span>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Audiencia Semanal</span>
          </div>
          <div className="bg-white border border-slate-250 p-6 rounded-xl shadow-sm text-center">
            <span className="block text-3xl font-black text-slate-950 tracking-tight">4K Ultra</span>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Soportes de Alta Gama</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: NOSOTROS */}
      <section className="bg-white border-y border-slate-200/80 py-20">
        <div className="max-w-6xl mx-auto px-6 space-y-24">
          
          {/* SUB-SECTION 2.1: /SOLUCIONES */}
          <div id="soluciones" className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] bg-slate-900 text-white font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                Estrategias Digitales
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                /soluciones
              </h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                Nuestras herramientas combinan pauta en vía pública clásica con segmentación digital de vanguardia, impulsando el alcance real de tu marca.
              </p>
            </div>

            {/* Editable Benefits / Solutions Cards in CMS */}
            <div className="grid md:grid-cols-3 gap-8">
              {content.benefits.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-slate-50 border border-slate-200/75 p-6 rounded-xl hover:border-slate-350 hover:shadow-md transition-all duration-300 space-y-4"
                >
                  <div className="h-10 w-10 rounded-lg bg-slate-950 text-white flex items-center justify-center">
                    <DynamicIcon name={item.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SUB-SECTION 2.2: /SOPORTES */}
          <div id="soportes" className="pt-8 border-t border-slate-100 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-800 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                Hardware e Infraestructura
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                /soportes
              </h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                Soportes LED de altísima definición estratégicamente ubicados para absorber la máxima atención de peatones y conductores.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Soporte 1 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="p-3 bg-sky-50 text-sky-600 rounded-lg inline-block">
                  <LucideIcons.Tv className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm uppercase text-slate-400 tracking-wider">Pantalla Peatonal</h3>
                  <h4 className="font-black text-lg text-slate-900 mt-1">LED P2.5 High-Definition</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Pantallas de rango óptico peatonal ideales para centros comerciales y avenidas de gran afluencia de transeúntes. Brillo inteligente autoadaptativo.
                </p>
                <div className="border-t border-slate-200/60 pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold"><span className="text-slate-400">Tamaño:</span> <span className="text-slate-700">2.4m x 1.8m (4.32m²)</span></div>
                  <div className="flex justify-between font-semibold"><span className="text-slate-400">Brillo:</span> <span className="text-slate-700">4,500 nits (Auto-Dim)</span></div>
                  <div className="flex justify-between font-semibold"><span className="text-slate-400">Refresh Rate:</span> <span className="text-slate-700">3,840 Hz (Flicker-Free)</span></div>
                </div>
              </div>

              {/* Soporte 2 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-lg inline-block">
                  <LucideIcons.Monitor className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm uppercase text-slate-400 tracking-wider">Monolito Vehicular</h3>
                  <h4 className="font-black text-lg text-slate-900 mt-1">LED P4 Premium Outdoor</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Gabinetes monumentales diseñados para lectura veloz en rutas, accesos viales y avenidas principales con gran circulación automotriz.
                </p>
                <div className="border-t border-slate-200/60 pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold"><span className="text-slate-400">Tamaño:</span> <span className="text-slate-700">6.0m x 3.0m (18.00m²)</span></div>
                  <div className="flex justify-between font-semibold"><span className="text-slate-400">Brillo:</span> <span className="text-slate-700">7,500 nits (High-Contrast)</span></div>
                  <div className="flex justify-between font-semibold"><span className="text-slate-400">Refresh Rate:</span> <span className="text-slate-700">3,840 Hz (Flicker-Free)</span></div>
                </div>
              </div>

              {/* Soporte 3 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg inline-block">
                  <LucideIcons.Cpu className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm uppercase text-slate-400 tracking-wider">Pantalla Mixta</h3>
                  <h4 className="font-black text-lg text-slate-900 mt-1">LED P3.0 Professional</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Equilibrio técnico perfecto. Diseñado para cruces de alto tránsito vehicular que además disponen de esperas peatonales y paradas de buses.
                </p>
                <div className="border-t border-slate-200/60 pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold"><span className="text-slate-400">Tamaño:</span> <span className="text-slate-700">4.0m x 3.0m (12.00m²)</span></div>
                  <div className="flex justify-between font-semibold"><span className="text-slate-400">Brillo:</span> <span className="text-slate-700">6,000 nits (Eco-Saving)</span></div>
                  <div className="flex justify-between font-semibold"><span className="text-slate-400">Refresh Rate:</span> <span className="text-slate-700">3,840 Hz (Flicker-Free)</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* SUB-SECTION 2.3: /MEDIAKIT */}
          <div id="mediakit" className="pt-8 border-t border-slate-100 space-y-12">
            <div className="grid md:grid-cols-12 gap-8 items-center bg-slate-950 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
              
              <div className="md:col-span-7 space-y-4 relative z-10">
                <span className="text-[10px] bg-white/10 text-white border border-white/20 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                  Métricas de Audiencia
                </span>
                <h2 className="text-3xl font-black tracking-tight leading-tight">
                  /mediakit
                </h2>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
                  Nuestro Media Kit contiene toda la información estadística demográfica de la audiencia de SmartWeb. Tasas de retención, impactos georreferenciados en Mendoza y Buenos Aires, formatos técnicos recomendados y planes comerciales anuales.
                </p>
                
                <div className="pt-4 flex flex-wrap gap-4">
                  <button
                    onClick={handleDownloadMediaKit}
                    disabled={mediaKitDownloading}
                    className="px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {mediaKitDownloading ? (
                      <>
                        <LucideIcons.RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Generando PDF...</span>
                      </>
                    ) : (
                      <>
                        <LucideIcons.FileDown className="h-4 w-4 text-slate-950" />
                        <span>Descargar Media Kit Comercial</span>
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {mediaKitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-lg flex items-center gap-2 text-xs font-bold text-emerald-300 max-w-sm mt-3"
                    >
                      <LucideIcons.CheckCircle className="h-4.5 w-4.5 text-emerald-400" />
                      <span>¡Descarga simulada iniciada! Documento listo para el pautado.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Graphic Mockup inside media kit panel */}
              <div className="md:col-span-5 relative z-10 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Vista Rápida Media Kit</span>
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold"><span className="text-slate-300">Retención Visual</span> <span className="text-white">92%</span></div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 rounded-full" style={{ width: "92%" }} /></div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold"><span className="text-slate-300">Público Activo (Commuters)</span> <span className="text-white">74%</span></div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-sky-400 rounded-full" style={{ width: "74%" }} /></div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold"><span className="text-slate-300">Consistencia Operativa</span> <span className="text-white">99.9%</span></div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-purple-400 rounded-full" style={{ width: "99.9%" }} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SUB-SECTION 2.4: /GRUPO COMUNICARTE */}
          <div id="grupo-comunicarte" className="pt-8 border-t border-slate-100 space-y-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <span className="text-[10px] bg-slate-150 border border-slate-200 text-slate-800 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                  El Holding de Medios Detrás
                </span>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">
                  /grupo comunicarte
                </h2>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
                  <strong>Grupo Comunicarte</strong> es una corporación argentina líder en comunicación exterior y publicidad urbana. Con más de una década de trayectoria, el holding impulsa la transformación digital y automatizada en la vía pública mediante soportes interactivos y la robusta suite inteligente de SmartWeb.
                </p>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
                  Nuestra alianza une la precisión del hardware con la agilidad del software, permitiendo a los anunciantes optimizar de forma autónoma presupuestos, pautado inteligente y medición analítica en Mendoza y Buenos Aires.
                </p>
              </div>

              {/* Graphic container simulating institutional video */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md group">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 to-slate-800 flex flex-col items-center justify-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                    <LucideIcons.Play className="h-5 w-5 fill-slate-950 translate-x-0.5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ver Video Institucional</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: ESPACIOS PUBLICITARIOS (CATALOG & MAP) */}
      <section id="espacios-publicitarios" className="py-20 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] bg-slate-900 text-white font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            Localización de Soportes
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Espacios Publicitarios Activos
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Filtra, cotiza e interactúa con nuestro inventario en tiempo real. Selecciona tu provincia para ver los espacios disponibles.
          </p>
        </div>

        {/* PROVINCE TAB SELECTOR */}
        <div className="flex justify-center border-b border-slate-200 max-w-md mx-auto">
          <button
            onClick={() => {
              setSelectedProvince("Mendoza");
              setFilterZone("Todas");
            }}
            className={`w-1/2 py-3 text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              selectedProvince === "Mendoza"
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Mendoza ({screens.length})
          </button>
          <button
            onClick={() => {
              setSelectedProvince("Buenos Aires");
              setFilterZone("Todas");
            }}
            className={`w-1/2 py-3 text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              selectedProvince === "Buenos Aires"
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Buenos Aires ({BUENOS_AIRES_SCREENS.length})
          </button>
        </div>

        {/* Map and Catalog Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Catalog & Filter list */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center gap-3 shadow-xs">
              {/* Search */}
              <div className="relative w-full md:w-1/3">
                <LucideIcons.Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>

              {/* Type Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
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

              {/* Zone Filter Dropdown */}
              <div className="w-full md:w-auto md:ml-auto">
                <select
                  value={filterZone}
                  onChange={(e) => setFilterZone(e.target.value)}
                  className="w-full md:w-auto px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer"
                >
                  {availableZones.map((zone) => (
                    <option key={zone} value={zone}>
                      Zona: {zone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Screens List Grid */}
            {filteredScreens.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredScreens.map((screen) => (
                  <ScreenCard
                    key={screen.id}
                    screen={screen}
                    onFocusOnMap={() => setSelectedScreenId(screen.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-6 border border-dashed border-slate-250 rounded-2xl bg-white space-y-6 max-w-lg mx-auto flex flex-col items-center justify-center shadow-xs">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-slate-50 border border-slate-200 animate-pulse" />
                  <LucideIcons.Tv className="h-8 w-8 text-slate-400 relative z-10" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="font-black text-slate-900 text-sm">Sin resultados</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    No encontramos espacios publicitarios activos en {selectedProvince} que coincidan con la búsqueda.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterType("Todos");
                    setFilterZone("Todas");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>

          {/* Interactive Map & Planificador */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Interactive Leaflet Map Box */}
            <div className="h-[380px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
              <InteractiveMap
                screens={filteredScreens}
                selectedScreenId={selectedScreenId}
                onSelectScreen={(id) => setSelectedScreenId(id)}
              />
            </div>

            {/* Campaign Planificador / Cotizador box */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <div className="flex items-center gap-2">
                  <LucideIcons.Calculator className="h-4.5 w-4.5 text-slate-900" />
                  <h3 className="text-sm font-black text-slate-950">Planificador de Campaña</h3>
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
                <div className="text-center py-8 space-y-2">
                  <LucideIcons.PlusCircle className="h-6 w-6 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 px-4 leading-relaxed font-medium">
                    Tu cotizador está vacío. Agrega pantallas desde el catálogo o interactúa directamente con los marcadores del mapa.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected Screens pills */}
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {cartScreens.map((screen) => (
                      <div
                        key={screen.id}
                        onClick={() => setSelectedScreenId(screen.id)}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 hover:border-slate-900 cursor-pointer transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                        <span className="truncate max-w-[120px]">{screen.nombre}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCart(screen.id);
                          }}
                          className="text-slate-400 hover:text-slate-950 ml-1 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Campaign weeks config */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Duración de la Campaña (Semanas)
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {([1, 2, 4, 8, 12] as const).map((w) => (
                        <button
                          key={w}
                          onClick={() => setWeeks(w)}
                          className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            weeks === w
                              ? "bg-slate-950 border-slate-950 text-white"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {w} sem
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pricing / Estimates review panel */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Pantallas Elegidas
                        </span>
                        <span className="text-sm font-extrabold text-slate-800">
                          {cartScreens.length} ubicaciones
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Alcance Estimado
                        </span>
                        <span className="text-sm font-extrabold text-slate-800">
                          {cartTotalImpacts.toLocaleString("es-AR")} imp.
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Inversión Total ({weeks} semanas)
                        </span>
                        <span className="text-base font-black text-slate-950">
                          ${cartTotalInvestment.toLocaleString("es-AR")}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Inversión Semanal
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          ${cartSubtotal.toLocaleString("es-AR")}/sem
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lead form triggers */}
                  <div className="border-t border-slate-150 pt-4">
                    <AnimatePresence mode="wait">
                      {!proposalSubmitted ? (
                        <motion.form
                          key="proposal-form"
                          onSubmit={handleSubmitProposal}
                          className="space-y-3 text-left"
                        >
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Solicitar Presupuesto Formalizado (PDF)
                          </h4>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Tu Nombre"
                              required
                              value={proposalClient.name}
                              onChange={(e) =>
                                setProposalClient({ ...proposalClient, name: e.target.value })
                              }
                              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="email"
                                placeholder="Tu Correo"
                                required
                                value={proposalClient.email}
                                onChange={(e) =>
                                  setProposalClient({ ...proposalClient, email: e.target.value })
                                }
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                              />
                              <input
                                type="text"
                                placeholder="Empresa"
                                value={proposalClient.company}
                                onChange={(e) =>
                                  setProposalClient({ ...proposalClient, company: e.target.value })
                                }
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmittingProposal}
                            className="w-full bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            {isSubmittingProposal ? (
                              <span>Generando Presupuesto...</span>
                            ) : (
                              <>
                                <LucideIcons.FileText className="h-3.5 w-3.5" />
                                <span>Solicitar Presupuesto</span>
                              </>
                            )}
                          </button>
                        </motion.form>
                      ) : (
                        <motion.div
                          key="proposal-success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg text-center space-y-2.5"
                        >
                          <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                            <LucideIcons.Check className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-emerald-900 text-xs">¡Presupuesto Solicitado!</h4>
                            <p className="text-[10px] text-emerald-700 leading-relaxed px-1 mt-0.5">
                              Se ha generado un nuevo Lead Comercial calificado por valor de <strong>${cartTotalInvestment.toLocaleString("es-AR")}</strong> en el Dashboard CRM. Nos contactaremos a la brevedad.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setProposalSubmitted(false);
                              setProposalClient({ name: "", email: "", company: "" });
                            }}
                            className="text-[9px] font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
                          >
                            Modificar cotización
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CONTACTO */}
      <section id="contacto" className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center relative overflow-hidden">
          {/* subtle background mesh */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
          
          <div className="md:col-span-6 space-y-6 relative z-10">
            <span className="text-[10px] bg-white/10 text-white border border-white/20 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
              Canal de Atención B2B
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Contacto y Asesoramiento Comercial
            </h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
              Escríbenos para armar un plan personalizado para tu negocio. Nuestro equipo comercial de <strong>Grupo Comunicarte</strong> te guiará en la selección de pantallas y el diseño de estrategias dinámicas.
            </p>

            <div className="space-y-4 pt-2 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-3">
                <LucideIcons.Mail className="h-5 w-5 text-emerald-400" />
                <span>ventas@comunicarte.com.ar</span>
              </div>
              <div className="flex items-center gap-3">
                <LucideIcons.Phone className="h-5 w-5 text-emerald-400" />
                <span>+54 261 455-8800</span>
              </div>
              <div className="flex items-center gap-3">
                <LucideIcons.MapPin className="h-5 w-5 text-emerald-400" />
                <span>Av. San Martín 1240, Mendoza Capital / Av. del Libertador 1800, CABA</span>
              </div>
            </div>
          </div>

          {/* Elegant Contact Form Container */}
          <div className="md:col-span-6 bg-white text-slate-950 rounded-xl p-6 shadow-xl border border-slate-100 relative z-10">
            <h3 className="text-md font-bold text-slate-900 mb-1">Completa tus datos</h3>
            <p className="text-slate-500 text-xs mb-6">Nos comunicaremos en menos de 24 horas.</p>

            <AnimatePresence mode="wait">
              {!contactSubmitted ? (
                <motion.form
                  key="contact-form"
                  onSubmit={handleContactSubmit}
                  className="space-y-4"
                >
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
                      Espacio Publicitario de Interés
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
                      Mensaje / Consulta
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Contanos sobre tu campaña..."
                      rows={3}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    {isSubmittingContact ? "Enviando..." : "Enviar Consulta"}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <LucideIcons.CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">¡Consulta Recibida!</h4>
                    <p className="text-xs text-slate-500 leading-relaxed px-4">
                      Tus datos se han guardado con éxito. Se ha creado un nuevo Lead con origen en tu consulta comercial, visible de inmediato en el <strong>Dashboard CMS</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactForm({
                        name: "",
                        email: "",
                        phone: "",
                        company: "",
                        spacePreference: "Mendoza",
                        message: "",
                      });
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
                  >
                    Enviar otra consulta
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section id="faq" className="py-20 bg-slate-100/50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12 space-y-3">
            <span className="text-[10px] bg-slate-200 text-slate-800 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
              Soporte de Consultas
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="space-y-3">
            {content.faq.map((item, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-xs"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left font-bold text-slate-900 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50/50 cursor-pointer text-sm"
                  >
                    <span>{item.question}</span>
                    <LucideIcons.ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1 text-slate-500 text-xs md:text-sm leading-relaxed border-t border-slate-100/50">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic SEO Meta Preview Container */}
      <section id="seo" className="py-20 max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-800 font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full">
                Indexación y SEO Activo
              </span>
              <h3 className="text-lg font-black text-slate-900">Visualización en Buscadores</h3>
            </div>
            <button
              onClick={() => {
                setActiveView("dashboard");
              }}
              className="text-xs font-bold text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              Configurar SEO en Dashboard
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 max-w-2xl font-sans">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <LucideIcons.Search className="h-3.5 w-3.5 text-slate-400" />
              <span>https://smartweb.ai</span>
            </div>
            <h4 className="text-lg text-blue-800 hover:underline font-semibold leading-tight cursor-pointer">
              {content.seo.metaTitle}
            </h4>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
              {content.seo.metaDescription}
            </p>
            <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
              <span className="font-bold text-slate-500">Keywords:</span>
              {content.seo.keywords.split(",").map((kw, i) => (
                <span key={i} className="bg-white text-slate-600 border border-slate-150 px-2 py-0.5 rounded-md font-mono font-bold">
                  {kw.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-slate-950 flex items-center justify-center text-white font-black text-sm">
              C
            </div>
            <span className="font-extrabold text-slate-800 text-sm">Grupo Comunicarte - SmartWeb SaaS</span>
          </div>

          <div className="flex items-center gap-6 font-bold">
            <span className="hover:text-slate-600 cursor-pointer">Términos</span>
            <span className="hover:text-slate-600 cursor-pointer">Privacidad</span>
            <span className="hover:text-slate-600 cursor-pointer">Soporte B2B</span>
          </div>

          <div className="font-semibold text-slate-400">
            &copy; 2026 Grupo Comunicarte. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
