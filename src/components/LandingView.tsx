import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCms } from "./CmsContext";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import { Navigation } from "./Navigation";
import { Hero } from "./landing/Hero";
import { InventoryCatalog } from "./landing/InventoryCatalog";
import { Footer } from "./Footer";
import { Card } from "@/src/components/ui/card";
import { SubpageLayout } from "./SubpageLayout";

export const LandingView: React.FC = () => {
  const { pathname } = useLocation();
  const {
    content,
    addLead,
    screens,
    cart,
  } = useCms();

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7493/ingest/f8c8e631-57b0-4152-abc1-83ff85c4f09b", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "8483d9" },
      body: JSON.stringify({
        sessionId: "8483d9",
        runId: "pre-fix",
        hypothesisId: "A",
        location: "LandingView.tsx:mount",
        message: "LandingView mounted",
        data: { pathname, isHomepage: pathname === "/" },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [pathname]);

  // Selected city & catalog tab state
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

  // FAQ state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Smooth scroll helper
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Section click mapping from Navigation links
  const handleSectionClick = (section: "inicio" | "espacios" | "mapa" | "mediakit" | "nosotros" | "contacto" | "soportes") => {
    if (section === "inicio") {
      handleScrollTo("hero-section");
    } else if (section === "espacios") {
      setCatalogTab("tarjetas");
      handleScrollTo("espacios");
    } else if (section === "mapa") {
      setCatalogTab("mapa");
      handleScrollTo("espacios");
    } else if (section === "mediakit") {
      setCatalogTab("mediakit");
      handleScrollTo("espacios");
    } else if (section === "soportes") {
      handleScrollTo("soportes");
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

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-800 selection:bg-stone-200/50 font-sans antialiased overflow-x-hidden">
      {/* 1. Navigation with unified action buttons */}
      <Navigation
        onSectionClick={handleSectionClick}
        cartCount={cart.length}
      />

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

      {/* 3. Soluciones & Services grid */}
      <section id="soluciones" className="bg-stone-50 border-y border-stone-200 py-24 font-sans">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          
          {/* Section title */}
          <div className="text-center max-w-2xl mx-auto space-y-3.5">
            <span className="text-[10px] bg-[#06434a]/8 border border-[#06434a]/15 text-[#06434a] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full">
              Estrategia Exterior B2B
            </span>
            <h2 className="text-3xl md:text-4xl tracking-tight text-stone-900 font-display font-black">
              Estrategias de Comunicación y Soluciones
            </h2>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
              Diseñamos soluciones integrales que trascienden el soporte físico, combinando alto alcance urbano con segmentación táctica.
            </p>
          </div>

          {/* Benefits Cards mapped directly from CMS content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.benefits.map((item, index) => {
              // Resolve corresponding Lucide icon dynamically
              const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Sparkles;
              return (
                <Card
                  key={item.id || index}
                  className="bg-white border border-stone-200 p-6 rounded-[20px] shadow-xs hover:border-[#06434a]/30 hover:shadow-md transition-all duration-300 space-y-4"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#06434a]/8 text-[#06434a] flex items-center justify-center">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 font-display">{item.title}</h3>
                  <p className="text-stone-500 text-xs leading-relaxed">{item.description}</p>
                </Card>
              );
            })}
          </div>

          {/* User Requested: Services grid section */}
          <div id="servicios-grid" className="pt-16 border-t border-stone-200 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[9px] bg-amber-500/10 text-amber-700 font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                Servicios Exclusivos
              </span>
              <h3 className="text-2xl font-bold text-stone-900 font-display">
                Nuestros Servicios Urbanos
              </h3>
              <p className="text-xs text-stone-500">
                Llevamos tu comunicación al siguiente nivel con soporte premium y auditorías constantes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <LucideIcons.Tv className="h-5 w-5" />,
                  title: "DOOH Inteligente y Dinámico",
                  description: "Anuncios dinámicos en nuestra red de pantallas LED 4K. Sincronización remota, brillo adaptativo y programación inteligente de spots.",
                  badge: "UHD LED"
                },
                {
                  icon: <LucideIcons.Target className="h-5 w-5" />,
                  title: "Planificación de Medios B2B",
                  description: "Campañas geolocalizadas con segmentación de audiencia vehicular y peatonal de alta densidad en Mendoza y Buenos Aires.",
                  badge: "Estratégico"
                },
                {
                  icon: <LucideIcons.TrendingUp className="h-5 w-5" />,
                  title: "Métricas de Audiencia y ROI",
                  description: "Monitoreo continuo y estimaciones de impacto de flujo real para medir con precisión la efectividad del pautado de marca.",
                  badge: "Analítica"
                },
                {
                  icon: <LucideIcons.Layers className="h-5 w-5" />,
                  title: "Mobiliario Urbano de Alta Gama",
                  description: "Soportes situados estratégicamente en intersecciones neurálgicas y zonas de altísima afluencia comercial para máxima fijación visual.",
                  badge: "Alta Cobertura"
                },
                {
                  icon: <LucideIcons.PenTool className="h-5 w-5" />,
                  title: "Optimización Creativa de Piezas",
                  description: "Asesoría técnica para adaptar tus creatividades OOH a resoluciones idóneas, garantizando legibilidad, contraste cromático y visualización óptima.",
                  badge: "Soporte Creativo"
                },
                {
                  icon: <LucideIcons.Users className="h-5 w-5" />,
                  title: "Atención Exclusiva de Agencias",
                  description: "Especialistas dedicados a agencias creativas, grandes cuentas y campañas institucionales complejas de gran volumen nacional.",
                  badge: "Corporativo"
                }
              ].map((service, idx) => (
                <div
                  key={idx} // Convert to Card
                  className="p-5 bg-white border border-stone-200 rounded-[16px] hover:border-[#06434a]/30 hover:shadow-sm transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-stone-50 text-[#06434a] border border-stone-100 flex items-center justify-center">
                        {service.icon}
                      </div>
                      <span className="text-[8px] bg-stone-100 text-stone-500 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {service.badge}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-900 font-display">
                      {service.title}
                    </h4>

                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-auto">
                    <button
                      onClick={() => handleScrollTo("contacto")}
                      className="text-[10px] font-bold text-[#06434a] hover:text-[#0b5e67] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <span>Consultar servicio</span>
                      <LucideIcons.ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div> // End of Card
              ))}
            </div>
          </div>

          {/* Soportes / Hardware specs breakdown */}
          <div id="soportes" className="pt-16 border-t border-stone-200 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[9px] bg-stone-100 text-stone-500 font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-stone-200">
                Hardware e Infraestructura
              </span>
              <h3 className="text-2xl font-bold text-stone-900 font-display">
                Formatos y Dispositivos de Exhibición
              </h3>
              <p className="text-xs text-stone-500">
                Soportes tecnológicos de última gama diseñados para capturar impactos nítidos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "LED Peatonal de Alta Definición",
                  desc: "Soportes adaptados a nivel peatonal perfectos para corredores comerciales y avenidas de flujo continuo. Brillo autotenuable inteligente.",
                  spec: "Módulo LED P2.5 UHD",
                  icon: <LucideIcons.Monitor className="h-5 w-5 text-sky-600" />
                },
                {
                  title: "Monolito Vehicular Monumental",
                  desc: "Pantallas de gran envergadura orientadas a flujos rápidos de avenidas y accesos viales con altísima recordación vehicular.",
                  spec: "Módulo LED P4 Premium Outdoor",
                  icon: <LucideIcons.Cpu className="h-5 w-5 text-emerald-600" />
                },
                {
                  title: "Pantalla Mixta Dinámica",
                  desc: "Equilibrio ideal. Diseñado para intersecciones con detención semafórica peatonal y paradas de transporte público masivo.",
                  spec: "Módulo LED P3.0 Professional",
                  icon: <LucideIcons.Layers className="h-5 w-5 text-purple-600" />
                }
              ].map((support, idx) => (
                <div key={idx} className="p-5 bg-white border border-stone-200 rounded-[16px] space-y-3.5">
                  <div className="flex items-center gap-2.5"> {/* CardHeader-like */}
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                      {support.icon}
                    </div>
                    <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-widest font-mono">
                      {support.spec}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 font-display">{support.title}</h4> {/* CardTitle */}
                  <p className="text-[11px] text-stone-500 leading-relaxed">{support.desc}</p> {/* CardDescription */}
                </div> // End of Card
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. Active Catalog Marketplace (Grid, Map & MediaKit) */}
      <InventoryCatalog
        selectedCity={selectedCity}
        activeTab={catalogTab}
        setActiveTab={setCatalogTab}
      />

      {/* 5. Nosotros Section */}
      <section id="nosotros-section" className="bg-stone-50 border-t border-stone-200 py-24 font-sans">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full">
              Holding de Comunicación Urbana
            </span>
            <h2 className="text-3xl font-display font-black tracking-tight text-stone-900">
              Sobre Grupo Comunicarte
            </h2>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed">
              <strong>Grupo Comunicarte</strong> es una corporación argentina líder con más de una década de trayectoria 
              dedicada al desarrollo e innovación de soportes publicitarios y comunicación OOH (Out Of Home). 
              El holding conecta anunciantes, marcas de consumo masivo y agencias con audiencias en el espacio urbano 
              a través de una red premium de pantallas LED inteligentes y cartelería tradicional geolocalizada.
            </p>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed">
              Nuestro propósito reside en transformar la vía pública clásica en un ecosistema publicitario interactivo y analítico, 
              brindando consistencia operativa del 99.9% y visibilidad garantizada las 24 horas del día.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-bold text-stone-700">
              <div className="flex items-center gap-2">
                <LucideIcons.ShieldAlert className="h-4 w-4 text-[#06434a]" />
                <span>Auditoría de Pauta 100% Real</span>
              </div>
              <div className="flex items-center gap-2">
                <LucideIcons.Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                <span>Hardware UHD de Última Generación</span>
              </div>
            </div>
          </div>

          {/* Institutional Video block with elegant mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm aspect-[16/9] rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-md group shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-850 flex flex-col items-center justify-center space-y-3.5">
                <div className="h-12 w-12 rounded-full bg-white text-stone-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 cursor-pointer">
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
          <div className="lg:col-span-6 bg-white text-stone-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-stone-200">
            <h3 className="text-md font-bold text-stone-900 mb-1 font-display">Completa tu consulta comercial</h3>
            <p className="text-stone-500 text-xs mb-6">Nos contactaremos contigo en menos de 24 horas hábiles.</p>

            <AnimatePresence mode="wait">
              {!contactSubmitted ? (
                <motion.form
                  key="contact-form"
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
                </motion.form>
              ) : (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4 font-sans"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 7. FAQ Accordion section */}
      <section id="faq-section" className="py-24 max-w-3xl mx-auto px-6 font-sans">
        <div className="text-center mb-14 space-y-2">
          <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-500 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            Preguntas Frecuentes
          </span>
          <h2 className="text-2xl font-bold text-stone-900 font-display">
            Soporte de Consultas OOH
          </h2>
        </div>

        <div className="space-y-4">
          {content.faq.map((item, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden transition-all duration-300 shadow-xs hover:border-stone-300"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left font-bold text-stone-900 flex items-center justify-between gap-4 cursor-pointer text-xs uppercase tracking-wide"
                >
                  <span>{item.question}</span>
                  <LucideIcons.ChevronDown
                    className={`h-4 w-4 text-stone-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#06434a]" : ""}`}
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
                      <div className="px-6 pb-5 pt-1 text-stone-500 text-xs leading-relaxed border-t border-stone-100">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
        </>
      

      {/* 8. Unified Footer */}
      <Footer
        onNavigate={(slug) => {
          // #region agent log
          fetch("http://127.0.0.1:7493/ingest/f8c8e631-57b0-4152-abc1-83ff85c4f09b", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "8483d9" },
            body: JSON.stringify({
              sessionId: "8483d9",
              runId: "pre-fix",
              hypothesisId: "B",
              location: "LandingView.tsx:Footer.onNavigate",
              message: "Footer navigate invoked",
              data: { slug, hasSetActiveSlug: typeof setActiveSlug !== "undefined" },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
          // #endregion
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
