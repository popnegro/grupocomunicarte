import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCms } from "./CmsContext";
import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { Navigation } from "./Navigation";
import { Hero } from "./landing/Hero";
import { InventoryCatalog } from "./landing/InventoryCatalog";
import { Footer } from "./Footer";
import { SubpageLayout } from "./SubpageLayout";
import { InteractiveMap } from "./InteractiveMap";
import { ZeroBaseRedesign } from "./landing/ZeroBaseRedesign";

export const LandingView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    addLead,
    setActiveView,
    screens,
    cart,
    toggleCart,
    clearCart,
    weeks,
    setWeeks,
    activeSlug,
    setActiveSlug,
  } = useCms();

  useEffect(() => {
    if (location.pathname !== activeSlug) {
      setActiveSlug(location.pathname);
    }
  }, [location.pathname, activeSlug, setActiveSlug]);

  // Selected city & catalog tab state (excision of San Juan)
  const [selectedCity, setSelectedCity] = useState<"Mendoza" | "Buenos Aires">("Mendoza");
  const [catalogTab, setCatalogTab] = useState<"tarjetas" | "mapa" | "mediakit">("tarjetas");
  
  // Locked on ZeroBase premium theme for production
  const isZeroBase = true;

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

  // Smooth scroll helper
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Section click mapping from Navigation links
  const handleSectionClick = (section: "inicio" | "soportes" | "espacios" | "soluciones" | "nosotros" | "contacto") => {
    if (section === "inicio") {
      handleScrollTo("hero-section");
    } else if (section === "soportes") {
      navigate("/soportes");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (location.pathname !== "/" && ["espacios", "soluciones", "nosotros-section", "contacto"].includes(section)) {
        navigate("/");
        setTimeout(() => {
            handleScrollTo(section);
        }, 100);
    } else if (section === "espacios") { // Kept for explicitness
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
    try {
      await addLead({
        name: contactForm.name,
        email: contactForm.email,
        company: contactForm.company || "Consulta General",
        source: `Formulario de Contacto (${contactForm.spacePreference})`,
        status: "new",
        value: 1500, // estimated lead strategic value
      });
      setContactSubmitted(true);
    } catch (error) {
      console.error("[LandingView] Contact submission failed:", error);
    } finally {
      setIsSubmittingContact(false);
    }
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

  // JSON-LD structured schema for local business & DOOH spaces catalog
  const seoJsonLd = {
    "@context": "https://schema.org",
    "@type": "AdvertisingService",
    "name": "Grupo Comunicarte DOOH",
    "description": "Red Premium de Pantallas LED de Gran Formato en Mendoza y Buenos Aires. Publicidad exterior digital simplificada y certificada.",
    "url": typeof window !== "undefined" ? window.location.origin : "https://grupocomunicarte.com.ar",
    "logo": "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&w=200&q=80",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mendoza",
      "addressCountry": "AR"
    },
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Mendoza"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Buenos Aires"
      }
    ],
    "provider": {
      "@type": "LocalBusiness",
      "name": "Grupo Comunicarte",
      "telephone": "+54 261 455-8800"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "ARS",
      "offerCount": screens.length,
      "description": "Soportes publicitarios digitales UHD bajo cotización directa"
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-800 selection:bg-stone-200/50 font-sans antialiased overflow-x-hidden pb-12">
      {/* Dynamic SEO JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seoJsonLd) }}
      />
      {/* 1. Navigation with unified action buttons */}
      <Navigation
        activeSlug={activeSlug}
        onNavigate={(slug) => {
          navigate(slug);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSetActiveView={setActiveView}
        onSectionClick={(section) => {
          if (section === "soportes") {
            navigate("/soportes");
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => handleSectionClick(section), 100);
          } else {
            handleSectionClick(section);
          }
        }}
        cartCount={cart.length}
      />



      {activeSlug === "/" ? (
        <>
          {isZeroBase ? (
            <ZeroBaseRedesign
              screens={screens}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              cart={cart}
              toggleCart={toggleCart}
              contactForm={contactForm}
              setContactForm={setContactForm}
              contactSubmitted={contactSubmitted}
              setContactSubmitted={setContactSubmitted}
              isSubmittingContact={isSubmittingContact}
              handleContactSubmit={handleContactSubmit}
            />
          ) : (
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
          )}

          {/* 3. Refactored "Soluciones" Section */}
          <section id="soluciones" className="bg-stone-50 border-y border-stone-200/80 py-24 font-sans">
            <div className="max-w-7xl mx-auto px-6 space-y-16">
              {/* Section Header */}
              <div className="text-center max-w-2xl mx-auto space-y-4">
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
          {!isZeroBase && (
            <InventoryCatalog
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              activeTab={catalogTab}
              setActiveTab={setCatalogTab}
            />
          )}

          {/* NEW: Casos de Éxito / Case Studies Section */}
          <section id="casos-exito" className="bg-white border-t border-stone-200/80 py-24 font-sans">
            <div className="max-w-7xl mx-auto px-6 space-y-16">
              {/* Section Header */}
              <div className="text-center max-w-2xl mx-auto space-y-4">
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
                <div className="w-full max-w-sm aspect-[16/9] rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-md group shrink-0 relative">
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

          {/* 6. General Contact Form section */}
          <section id="contacto" className="py-24 bg-stone-900 text-white relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2522_1px,transparent_1px),linear-gradient(to_bottom,#2a2522_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              
              <div className="lg:col-span-6 space-y-6 text-left">
               
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
              <div className="lg:col-span-6 bg-white text-stone-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-stone-200">
                <h3 className="text-md font-bold text-stone-900 mb-1 font-display">Contacto</h3>
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
                            className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:border-[#06434a]"
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
                            className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:border-[#06434a]"
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
                            className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:border-[#06434a]"
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
                            className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:border-[#06434a]"
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
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 font-semibold text-stone-700 focus:outline-none cursor-pointer"
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
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:border-[#06434a]"
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
            navigate(slug);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          screens={screens}
          cart={cart}
          toggleCart={toggleCart}
          clearCart={clearCart}
          weeks={weeks}
          setWeeks={setWeeks}
          addLead={addLead}
        />
      )}

      {/* 8. Unified Footer */}
      <Footer
        onNavigate={(slug) => {
          navigate(slug);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSetActiveView={setActiveView}
        onSectionScroll={(sectionId) => {
          if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => handleSectionClick(sectionId as any), 100);
          } else {
            handleSectionClick(sectionId as any);
          }
        }}
      />


    </div>
  );
};
