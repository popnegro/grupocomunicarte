import React, { useState } from "react";
import { useCms } from "@/components/CmsContext";
import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/landing/Hero";
import { FeaturedCarousel } from "@/components/landing/FeaturedCarousel";
import { InventoryCatalog } from "@/components/landing/InventoryCatalog";
import { Footer } from "@/components/Footer";
import { SubpageLayout } from "@/components/SubpageLayout";

export const LandingView: React.FC = () => {
  const {
    setActiveView,
    activeSlug,
    setActiveSlug,
    screens,
    cart,
    toggleCart,
    clearCart,
    weeks,
    setWeeks,
    addLead,
  } = useCms();

  // Selected city & catalog tab state (excision of San Juan)
  const [selectedCity, setSelectedCity] = useState<"Mendoza" | "Buenos Aires">("Mendoza");
  const [catalogTab, setCatalogTab] = useState<"tarjetas" | "mapa" | "mediakit">("tarjetas");

  // General B2B Contact form states
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
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Smooth scroll helper
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Section click mapping from Navigation links
  const handleSectionClick = (section: "inicio" | "espacios" | "soluciones" | "nosotros" | "contacto") => {
    if (section === "inicio") {
      handleScrollTo("hero-section");
    } else if (section === "espacios") {
      setCatalogTab("tarjetas");
      handleScrollTo("espacios");
    } else if (section === "soluciones") {
      handleScrollTo("soluciones");
    } else if (section === "nosotros") {
      handleScrollTo("nosotros-section");
    } else if (section === "contacto") {
      handleScrollTo("contacto");
    }
  };

  // General contact submit handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;

    setIsSubmittingContact(true);
    await addLead({
      name: contactForm.name,
      email: contactForm.email,
      company: contactForm.company || "Consulta General",
      source: `Formulario de Contacto (${contactForm.spacePreference})`,
      status: "new",
      value: 1500, // estimated lead strategic value
    });
    setIsSubmittingContact(false);
    setContactSubmitted(true);
  };

  // Exactly 6 sophisticated solutions matching Design System
  const SOLUCIONES_CARDS = [
    {
      id: "sol-01",
      number: "01",
      title: "Pauta LED Digital de Gran Formato",
      description: "Pantallas de envergadura monumental en los corredores metropolitanos con el mayor tráfico vehicular y peatonal para lograr visibilidad masiva y recordación premium.",
      icon: <LucideIcons.Tv className="h-5 w-5" />
    },
    {
      id: "sol-02",
      number: "02",
      title: "Campañas de Frecuencia Dinámica",
      description: "Gestión y actualización en tiempo real de contenidos, permitiendo pautar creatividades dinámicas segmentadas por bandas horarias y optimizadas según las condiciones del entorno.",
      icon: <LucideIcons.Clock className="h-5 w-5" />
    },
    {
      id: "sol-03",
      number: "03",
      title: "Mobiliario Urbano de Alta Densidad",
      description: "Soportes interactivos estratégicamente posicionados a la altura de la vista del peatón en las zonas comerciales y distritos financieros más concurridos de la ciudad.",
      icon: <LucideIcons.Users className="h-5 w-5" />
    },
    {
      id: "sol-04",
      number: "04",
      title: "Rutas Móviles LED de Gran Alcance",
      description: "Dispositivos móviles de emisión lumínica UHD montados en vehículos comerciales certificados para realizar circuitos dinámicos de cobertura en eventos corporativos y lanzamientos.",
      icon: <LucideIcons.Truck className="h-5 w-5" />
    },
    {
      id: "sol-05",
      number: "05",
      title: "Métricas de Audiencia y Auditoría ROI",
      description: "Informes avanzados de flujo y estimación de audiencia que certifican el impacto real de tu pauta publicitaria en vía pública mediante analítica avanzada y georreferenciación.",
      icon: <LucideIcons.BarChart3 className="h-5 w-5" />
    },
    {
      id: "sol-06",
      number: "06",
      title: "Proyectos y Corpóreos Especiales",
      description: "Estructuras personalizadas y activaciones corpóreas a medida diseñadas en conjunto con agencias creativas para generar impacto disruptivo e innovación arquitectónica urbana.",
      icon: <LucideIcons.Sparkles className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-800 selection:bg-stone-200/50 font-sans antialiased overflow-x-hidden">
      {/* 1. Navigation with unified action buttons */}
      <Navigation
        activeSlug={activeSlug}
        onNavigate={(slug) => {
          setActiveSlug(slug);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSetActiveView={setActiveView}
        onSectionClick={(section) => {
          if (activeSlug !== "/") {
            setActiveSlug("/");
            setTimeout(() => handleSectionClick(section), 100);
          } else {
            handleSectionClick(section);
          }
        }}
        cartCount={cart.length}
      />

      {activeSlug === "/" ? (
        <>
          {/* 2. Hero & Plaza selection */}
          <Hero
            screens={screens}
            selectedCity={selectedCity}
            onCitySelect={(city) => {
              setSelectedCity(city);
              // Wait briefly to allow React state mapping before scrolling
              setTimeout(() => handleScrollTo("espacios"), 100);
            }}
            onExploreClick={() => handleScrollTo("espacios")}
          />

          {/* 2b. Featured Screens Carousel proposal */}
          <FeaturedCarousel screens={screens} />

          {/* 3. Refactored "Soluciones" Section */}
          <section id="soluciones" className="bg-stone-50 border-y border-stone-200/80 py-24 font-sans">
            <div className="max-w-7xl mx-auto px-6 space-y-16">
              {/* Section Header */}
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="text-[10px] bg-[#06434a]/5 border border-[#06434a]/10 text-[#06434a] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full select-none">
                  ESTRATEGIA OUT-OF-HOME (OOH)
                </span>
                <h2 className="text-3xl md:text-4xl tracking-tight text-stone-900 font-display font-black">
                  Soluciones de Comunicación Urbana
                </h2>
                <p className="text-stone-500 text-xs md:text-sm leading-relaxed max-w-lg mx-auto font-medium">
                  Soportes inteligentes diseñados para capturar la atención en entornos de alta densidad urbana, garantizando el máximo rendimiento publicitario.
                </p>
              </div>

              {/* 6-Card Solutions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SOLUCIONES_CARDS.map((sol) => (
                  <div
                    key={sol.id} 
                    className="p-6 bg-white border border-stone-200/60 rounded-xl shadow-xs hover:border-[#06434a]/30 transition-all duration-300 flex flex-col justify-between h-full group text-left"
                  >
                    <div className="space-y-4">
                      {/* Top bar with icon and number */}
                      <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-xl bg-stone-50 text-[#06434a] flex items-center justify-center border border-stone-200/60 group-hover:bg-[#06434a] group-hover:text-white group-hover:border-[#06434a] transition-all duration-300">
                          {sol.icon}
                        </div>
                        <span className="text-xs font-mono font-bold text-stone-300 group-hover:text-[#06434a]/30 transition-colors select-none">
                          {sol.number}
                        </span>
                      </div>

                      {/* Header and description */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-stone-900 font-display group-hover:text-[#06434a] transition-colors">
                          {sol.title}
                        </h3>
                        <p className="text-stone-500 text-xs leading-relaxed font-medium">
                          {sol.description}
                        </p>
                      </div>
                    </div>

                    {/* Action button inside card */}
                    <div className="pt-6 border-t border-stone-100 mt-4">
                      <button
                        onClick={() => handleScrollTo("contacto")}
                        className="text-[10px] font-extrabold text-[#06434a] group-hover:text-[#0b5e67] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Consultar Solución</span>
                        <LucideIcons.ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Active Catalog Marketplace (Grid, Map & MediaKit) */}
          <InventoryCatalog
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            activeTab={catalogTab}
            setActiveTab={setCatalogTab}
          />

          {/* NEW: Casos de Éxito / Case Studies Section */}
          <section id="casos-exito" className="bg-white border-t border-stone-200/80 py-24 font-sans">
            <div className="max-w-7xl mx-auto px-6 space-y-16">
              {/* Section Header */}
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="text-[10px] bg-[#06434a]/5 border border-[#06434a]/10 text-[#06434a] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full select-none">
                  HISTORIAS DE IMPACTO
                </span>
                <h2 className="text-3xl md:text-4xl tracking-tight text-stone-900 font-display font-black">
                  Casos de Éxito Certificados
                </h2>
                <p className="text-stone-500 text-xs md:text-sm leading-relaxed max-w-lg mx-auto font-medium">
                  Campañas reales de marcas líderes que multiplicaron su visibilidad urbana a través de nuestra red premium.
                </p>
              </div>

              {/* Case Studies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    brand: "TOYOTA AR",
                    title: "Lanzamiento Hilux Conquest",
                    description: "Dominación estratégica mediante circuito de LED Móvil sincronizado con pantallas UHD de gran formato en principales centros de consumo de Mendoza.",
                    metrics: "+1.4M",
                    metricLabel: "Impactos semanales reales",
                    badgeColor: "bg-red-50 text-red-700 border-red-100"
                  },
                  {
                    brand: "COCA-COLA CO",
                    title: "Campaña de Verano DOOH",
                    description: "Programación horaria inteligente con creatividades dinámicas emitidas durante las horas pico de tránsito vehicular en Plaza San Martín y accesos clave.",
                    metrics: "85%",
                    metricLabel: "Cobertura de audiencia activa",
                    badgeColor: "bg-red-50 text-red-700 border-red-100"
                  },
                  {
                    brand: "CERVEZA PATAGONIA",
                    title: "Rutas del Sabor OOH",
                    description: "Soportes tradicionales georreferenciados combinados con pautas digitales de alta definición localizadas a metros de los principales refugios de la marca.",
                    metrics: "12x",
                    metricLabel: "Retorno de inversión de marca",
                    badgeColor: "bg-amber-50 text-amber-700 border-amber-100"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 bg-stone-50 border border-stone-200/60 rounded-xl flex flex-col justify-between text-left space-y-6 hover:shadow-2xs transition-shadow duration-300">
                    <div className="space-y-3">
                      <span className="text-[9px] font-mono font-black text-stone-400 block uppercase tracking-widest">{item.brand}</span>
                      <h3 className="text-sm font-extrabold text-stone-900 font-display">{item.title}</h3>
                      <p className="text-stone-500 text-xs leading-relaxed font-medium">{item.description}</p>
                    </div>

                    <div className="pt-4 border-t border-stone-200/40">
                      <div className="text-2xl font-display font-black text-[#06434a]">{item.metrics}</div>
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{item.metricLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Nosotros Section */}
          <section id="nosotros-section" className="bg-stone-50 border-t border-stone-200 py-24 font-sans">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="text-[10px] bg-stone-200/60 border border-stone-300 text-stone-600 font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full">
                  HOLDING DE COMUNICACIÓN URBANA
                </span>
                <h2 className="text-3xl font-display font-black tracking-tight text-stone-900">
                  Sobre Grupo Comunicarte
                </h2>
                <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-medium">
                  <strong>Grupo Comunicarte</strong> es un holding líder dedicado al desarrollo, innovación y explotación estratégica de soportes publicitarios y comunicación exterior (OOH y DOOH) en Argentina.
                </p>
                <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-medium">
                  Conectamos marcas, agencias de medios y audiencias masivas combinando ubicaciones físicas inigualables, tecnología LED inteligente ultra nítida y sistemas de auditoría con métricas reales. Nuestra infraestructura certificada garantiza un uptime de emisión publicitaria del 99.9%.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-bold text-stone-700">
                  <div className="flex items-center gap-2">
                    <LucideIcons.ShieldCheck className="h-4.5 w-4.5 text-[#06434a]" />
                    <span>Auditoría de Pauta 100% Transparente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LucideIcons.Sparkles className="h-4.5 w-4.5 text-amber-500" />
                    <span>Hardware UHD de Última Generación</span>
                  </div>
                </div>
              </div>

              {/* Institutional Video block with elegant mockup */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm aspect-video rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-md group shrink-0 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-850 flex flex-col items-center justify-center space-y-3.5">
                    <div className="h-12 w-12 rounded-full bg-white text-stone-950 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300 cursor-pointer">
                      <LucideIcons.Play className="h-5 w-5 text-stone-950 fill-stone-950 translate-x-0.5" />
                    </div>
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Video Institucional Grupo Comunicarte</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* NEW: FAQ Section (Notion/Linear Accordion) */}
          <section id="faq-section" className="bg-[#FAF9F5] border-t border-stone-200/80 py-24 font-sans">
            <div className="max-w-4xl mx-auto px-6 space-y-12">
              {/* Section Header */}
              <div className="text-center space-y-4">
                <span className="text-[10px] bg-stone-200/60 border border-stone-300 text-stone-600 font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full select-none">
                  RESOLUCIÓN DE DUDAS B2B
                </span>
                <h2 className="text-3xl md:text-4xl tracking-tight text-stone-900 font-display font-black">
                  Preguntas Frecuentes
                </h2>
                <p className="text-stone-500 text-xs md:text-sm leading-relaxed max-w-lg mx-auto font-medium">
                  Todo lo que necesitás saber sobre la programación, reserva y auditoría de tu pauta publicitaria en vía pública.
                </p>
              </div>

              {/* Accordion Drawers */}
              <div className="space-y-4">
                {[
                  {
                    id: "faq-1", 
                    q: "¿Qué es la publicidad DOOH y cómo funciona en la plataforma?",
                    a: "El DOOH (Digital Out Of Home) es la digitalización de la publicidad en vía pública. Nuestra plataforma permite explorar nuestra red en tiempo real, filtrar soportes por plaza y volumen de impactos diarios, y armar propuestas (MediaKits) listas para cotizar con nuestro equipo de asesores."
                  },
                  {
                    id: "faq-2",
                    q: "¿Cómo funciona el creador de propuestas (MediaKit)?",
                    a: "Navegás por nuestro catálogo, agregás las pantallas o soportes móviles de tu interés al MediaKit, definís la cantidad de semanas que querés pautar y enviás tu solicitud de planificación. Generamos una cotización corporativa formal consolidada basada en tu selección."
                  },
                  {
                    id: "faq-3",
                    q: "¿Cuál es la frecuencia del loop y la duración de cada spot?",
                    a: "Por defecto, los spots en nuestras pantallas LED UHD exteriores tienen una duración de 15 segundos y rotan continuamente en loops optimizados de alta recordación de marca."
                  },
                  {
                    id: "faq-4",
                    q: "¿Cómo se auditan y certifican las métricas de audiencia?",
                    a: "Utilizamos sensores de flujo vehicular/peatonal inteligentes y datos georreferenciados para auditar el flujo real urbano y certificar los impactos diarios estimados en cada zona, asegurando total transparencia en tu pauta."
                  }
                ].map((item) => {
                  const isOpen = openFaq === item.id;
                  return (
                    <div
                      key={item.id}
                      className="border border-stone-200 bg-white rounded-xl overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : item.id)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left font-display font-bold text-sm text-stone-900 hover:text-[#06434a] transition-colors focus:outline-none cursor-pointer"
                      >
                        <span>{item.q}</span>
                        {isOpen ? (
                          <LucideIcons.Minus className="h-4 w-4 text-[#06434a] shrink-0" />
                        ) : (
                          <LucideIcons.Plus className="h-4 w-4 text-stone-400 shrink-0" />
                        )}
                      </button>

                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          isOpen ? "max-h-[200px] border-t border-stone-100" : "max-h-0"
                        }`}
                      >
                        <div className="px-6 py-5 text-xs text-stone-600 leading-relaxed font-medium bg-stone-50/50">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 6. General Contact Form section */}
          <section id="contacto" className="py-24 bg-stone-900 text-white relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2522_1px,transparent_1px),linear-gradient(to_bottom,#2a2522_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20 pointer-events-none" />
 
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              
              <div className="lg:col-span-6 space-y-6 text-left">
                <span className="text-[9px] bg-white/10 text-stone-300 border border-white/20 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                  Canal de Atención B2B Directo
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight leading-tight">
                  Agendá una Asesoría con un Experto
                </h2>
                <p className="text-stone-300 text-xs md:text-sm leading-relaxed">
                  Escribinos para delinear el plan de impacto visual óptimo para tu marca. Nuestro equipo comercial de 
                  <strong> Grupo Comunicarte</strong> te asesorará en la selección física de soportes y la programación dinámica.
                </p>

                <div className="space-y-3 text-xs text-stone-300 font-semibold pt-4">
                  <div className="flex items-center gap-3">
                    <LucideIcons.Mail className="h-4 w-4 text-amber-500" />
                    <span>comercial@grupocomunicarte.com.ar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <LucideIcons.Phone className="h-4 w-4 text-amber-500" />
                    <span>+54 261 455-8800</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <LucideIcons.MapPin className="h-4 w-4 text-amber-500" />
                    <span>Av. San Martín 1240, Mendoza Capital / Av. del Libertador 1800, CABA</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-6 rounded-4xl border border-stone-200 bg-white p-6 text-stone-900 shadow-2xl md:p-8">
                <h3 className="text-md font-bold text-stone-900 mb-1 font-display">Completa tu consulta comercial</h3>
                <p className="text-stone-500 text-xs mb-6">Nos contactaremos contigo en menos de 24 horas hábiles.</p>

                <div className="space-y-4">
                  {!contactSubmitted ? (
                    <form
                      onSubmit={handleContactSubmit}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">
                            Nombre Completo *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ana de la Cruz"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-stone-50 focus:outline-none focus:border-[#06434a]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">
                            Empresa / Marca
                          </label>
                          <input
                            type="text"
                            placeholder="Acme Corp"
                            value={contactForm.company}
                            onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-stone-50 focus:outline-none focus:border-[#06434a]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">
                            Correo Corporativo *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="nombre@empresa.com"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-stone-50 focus:outline-none focus:border-[#06434a]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            placeholder="+54 9 261 1234567"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-stone-50 focus:outline-none focus:border-[#06434a]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">
                          Plaza Geográfica de Interés
                        </label>
                        <select
                          value={contactForm.spacePreference}
                          onChange={(e) => setContactForm({ ...contactForm, spacePreference: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-stone-50 font-semibold text-stone-700 focus:outline-none cursor-pointer"
                        >
                          <option value="Mendoza">Plaza Mendoza</option>
                          <option value="Buenos Aires">Plaza Buenos Aires</option>
                          <option value="Todas">Múltiples Plazas</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">
                          Detalle de Campaña / Mensaje
                        </label>
                        <textarea
                          placeholder="Escribí aquí tus dudas o detalles..."
                          rows={3}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-stone-50 focus:outline-none focus:border-[#06434a]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingContact}
                        className="w-full bg-[#06434a] hover:bg-[#0b5e67] disabled:bg-stone-300 text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-full shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>{isSubmittingContact ? "Enviando..." : "Enviar Consulta Directa"}</span>
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-8 space-y-4 font-sans">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                        <LucideIcons.CheckCircle className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-stone-900 text-sm font-display">¡Consulta Comercial Recibida!</h4>
                        <p className="text-xs text-stone-500 leading-relaxed px-4">
                          Tus datos se guardaron exitosamente. Nuestro equipo comercial se comunicará contigo de inmediato para coordinar el pautado.
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
                        className="text-xs font-bold text-[#06434a] hover:underline cursor-pointer"
                      >
                        Enviar otra consulta
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </section>
        </>
      ) : (
        <SubpageLayout
          slug={activeSlug}
          handleNavigate={(slug) => {
            setActiveSlug(slug);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          screens={screens}
          cart={cart}
          clearCart={clearCart}
          weeks={weeks}
          setWeeks={setWeeks}
          addLead={addLead}
        />
      )}

      {/* 8. Unified Footer */}
      <Footer
        onNavigate={(slug) => {
          setActiveSlug(slug);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSetActiveView={setActiveView}
        onSectionScroll={(sectionId) => {
          if (activeSlug !== "/") {
            setActiveSlug("/");
            setTimeout(() => handleSectionClick(sectionId as any), 100);
          } else {
            handleSectionClick(sectionId as any);
          }
        }}
      />
    </div>
  );
};
