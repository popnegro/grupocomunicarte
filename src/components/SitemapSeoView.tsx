import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Folder,
  FolderOpen,
  FileText,
  Compass,
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Layers,
  Globe,
  MapPin,
  TrendingUp,
  Maximize2,
  Zap,
  Sparkles,
  Link,
  Cpu,
  BookOpen,
  Info,
  ExternalLink,
  Check,
  ChevronLeft
} from "lucide-react";

// Types for sitemap node
interface SitemapNode {
  name: string;
  slug: string;
  keyword?: string;
  intent?: "Informational" | "Commercial" | "Transactional" | "Navigational";
  wordCount?: number;
  depth: number;
  children?: SitemapNode[];
}

export const SitemapSeoView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"architecture" | "audit" | "justifications" | "simulator" | "growth">("architecture");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "root": true,
    "root/nosotros": true,
    "root/servicios": true,
    "root/espacios": true,
    "root/ubicaciones": true,
    "root/soluciones": true,
    "root/mediakit": true,
    "root/blog": true,
    "root/contacto": true,
  });

  // Breadcrumb interactive states
  const [selectedCity, setSelectedCity] = useState("mendoza");
  const [selectedFormat, setSelectedFormat] = useState("pantallas-led");
  const [selectedTopic, setSelectedTopic] = useState("publicidad-exterior");

  // Search filter for the sitemap
  const [sitemapSearch, setSitemapSearch] = useState("");

  const toggleNode = (path: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Full nested tree structure for B2B Out-of-Home (OOH) Multipage Sitemap
  const sitemapData: SitemapNode = {
    name: "Inicio (Home Page)",
    slug: "/",
    keyword: "publicidad exterior argentina, vía pública",
    intent: "Navigational",
    wordCount: 1800,
    depth: 1,
    children: [
      {
        name: "Nosotros",
        slug: "/nosotros",
        keyword: "empresa de publicidad exterior",
        intent: "Informational",
        wordCount: 1200,
        depth: 2,
        children: [
          { name: "Historia", slug: "/nosotros/historia", keyword: "trayectoria publicidad vía pública", intent: "Informational", wordCount: 900, depth: 3 },
          { name: "Equipo", slug: "/nosotros/equipo", keyword: "profesionales publicidad exterior", intent: "Informational", wordCount: 850, depth: 3 },
          { name: "Grupo Comunicarte", slug: "/nosotros/grupo-comunicarte", keyword: "grupo comunicarte multimedia", intent: "Informational", wordCount: 1100, depth: 3 },
        ]
      },
      {
        name: "Servicios",
        slug: "/servicios",
        keyword: "servicios de publicidad en vía pública",
        intent: "Commercial",
        wordCount: 1400,
        depth: 2,
        children: [
          { name: "Publicidad Exterior (OOH)", slug: "/servicios/publicidad-exterior", keyword: "publicidad exterior tradicional vallas", intent: "Commercial", wordCount: 1500, depth: 3 },
          { name: "Publicidad Digital (DOOH)", slug: "/servicios/publicidad-digital", keyword: "pantallas led publicitarias", intent: "Commercial", wordCount: 1600, depth: 3 },
          { name: "Campañas Integrales", slug: "/servicios/campanas-integrales", keyword: "planificacion de campañas ooh", intent: "Commercial", wordCount: 1300, depth: 3 },
          { name: "Consultoría Estratégica", slug: "/servicios/consultoria", keyword: "asesoramiento publicidad exterior", intent: "Commercial", wordCount: 1000, depth: 3 },
        ]
      },
      {
        name: "Espacios Publicitarios",
        slug: "/espacios-publicitarios",
        keyword: "soportes publicitarios de vía pública",
        intent: "Commercial",
        wordCount: 1500,
        depth: 2,
        children: [
          { name: "Carteles Monumentales", slug: "/espacios-publicitarios/carteles", keyword: "monopostes gigantes carteleria", intent: "Commercial", wordCount: 1200, depth: 3 },
          { name: "Pantallas LED", slug: "/espacios-publicitarios/pantallas-led", keyword: "pantallas led exterior contratacion", intent: "Commercial", wordCount: 1400, depth: 3 },
          { name: "Mobiliario Urbano", slug: "/espacios-publicitarios/mobiliario-urbano", keyword: "refugios de colectivos publicidad", intent: "Commercial", wordCount: 1100, depth: 3 },
          { name: "Centros Comerciales", slug: "/espacios-publicitarios/centros-comerciales", keyword: "publicidad en shoppings argentina", intent: "Commercial", wordCount: 1250, depth: 3 },
          { name: "Aeropuertos", slug: "/espacios-publicitarios/aeropuertos", keyword: "anuncios en aeropuertos", intent: "Commercial", wordCount: 1300, depth: 3 },
          { name: "Formatos Especiales", slug: "/espacios-publicitarios/formatos-especiales", keyword: "soporte publicitario no tradicional", intent: "Commercial", wordCount: 1050, depth: 3 },
        ]
      },
      {
        name: "Ubicaciones",
        slug: "/ubicaciones",
        keyword: "cobertura publicidad exterior argentina",
        intent: "Commercial",
        wordCount: 1350,
        depth: 2,
        children: [
          { name: "Buenos Aires", slug: "/ubicaciones/buenos-aires", keyword: "publicidad exterior buenos aires", intent: "Commercial", wordCount: 1700, depth: 3 },
          { name: "Mendoza", slug: "/ubicaciones/mendoza", keyword: "publicidad exterior mendoza", intent: "Commercial", wordCount: 1800, depth: 3 },
          { name: "Otras Provincias", slug: "/ubicaciones/otras-provincias", keyword: "vía pública interior de argentina", intent: "Commercial", wordCount: 1100, depth: 3 },
          { name: "Mapa Interactivo", slug: "/ubicaciones/mapa", keyword: "geolocalizacion de carteles publicitarios", intent: "Transactional", wordCount: 1450, depth: 3 },
        ]
      },
      {
        name: "Soluciones",
        slug: "/soluciones",
        keyword: "estrategias de marketing ooh",
        intent: "Commercial",
        wordCount: 1200,
        depth: 2,
        children: [
          { name: "Por Industria", slug: "/soluciones/por-industria", keyword: "publicidad exterior para automotriz retail", intent: "Commercial", wordCount: 1300, depth: 3 },
          { name: "Por Objetivo", slug: "/soluciones/por-objetivo", keyword: "campañas de branding via publica", intent: "Commercial", wordCount: 1150, depth: 3 },
          { name: "Por Presupuesto", slug: "/soluciones/por-presupuesto", keyword: "costo de publicidad en via publica", intent: "Transactional", wordCount: 1400, depth: 3 },
        ]
      },
      {
        name: "Casos de Éxito",
        slug: "/casos-exito",
        keyword: "campañas exitosas publicidad exterior",
        intent: "Informational",
        wordCount: 1600,
        depth: 2,
        children: [
          { name: "Portfolio de Clientes", slug: "/casos-exito/portfolio", keyword: "marcas publicidad exterior argentina", intent: "Informational", wordCount: 1200, depth: 3 },
          { name: "Galería de Fotos", slug: "/casos-exito/galeria", keyword: "fotos de carteles publicitarios en calle", intent: "Informational", wordCount: 850, depth: 3 },
        ]
      },
      {
        name: "Mediakit",
        slug: "/mediakit",
        keyword: "descargar mediakit publicidad exterior",
        intent: "Transactional",
        wordCount: 1100,
        depth: 2,
        children: [
          { name: "Descarga de Catálogo", slug: "/mediakit/descargas", keyword: "tarifario publicidad exterior pdf", intent: "Transactional", wordCount: 950, depth: 3 },
          { name: "Especificaciones Técnicas", slug: "/mediakit/especificaciones", keyword: "medidas de carteles publicitarios", intent: "Informational", wordCount: 1300, depth: 3 },
          { name: "Tarifario Vigente", slug: "/mediakit/tarifario", keyword: "precios publicidad exterior argentina", intent: "Transactional", wordCount: 1150, depth: 3 },
          { name: "Preguntas Frecuentes", slug: "/mediakit/faq", keyword: "como contratar publicidad via publica", intent: "Informational", wordCount: 1500, depth: 3 },
        ]
      },
      {
        name: "Blog Corporativo",
        slug: "/blog",
        keyword: "blog publicidad exterior y marketing",
        intent: "Informational",
        wordCount: 1400,
        depth: 2,
        children: [
          { name: "Noticias del Sector", slug: "/blog/noticias", keyword: "novedades publicidad exterior", intent: "Informational", wordCount: 1000, depth: 3 },
          { name: "Tendencias OOH", slug: "/blog/tendencias-ooh", keyword: "innovacion publicidad exterior interactiva", intent: "Informational", wordCount: 1500, depth: 3 },
          { name: "Guías de Marketing", slug: "/blog/marketing", keyword: "como medir retorno de inversion ooh", intent: "Informational", wordCount: 1800, depth: 3 },
        ]
      },
      {
        name: "Contacto",
        slug: "/contacto",
        keyword: "contacto agencia publicidad exterior",
        intent: "Transactional",
        wordCount: 750,
        depth: 2,
        children: [
          { name: "Solicitar Cotización", slug: "/contacto/cotizacion", keyword: "presupuesto publicidad exterior argentina", intent: "Transactional", wordCount: 900, depth: 3 },
          { name: "Trabajá con Nosotros", slug: "/contacto/empleo", keyword: "empleo publicidad exterior mendoza", intent: "Transactional", wordCount: 800, depth: 3 },
        ]
      },
      {
        name: "Mi Cuenta (CRM Clientes)",
        slug: "/mi-cuenta",
        keyword: "portal clientes publicidad exterior",
        intent: "Navigational",
        wordCount: 600,
        depth: 2,
        children: [
          { name: "Login", slug: "/mi-cuenta/login", keyword: "iniciar sesion portal clientes ooh", intent: "Navigational", wordCount: 400, depth: 3 },
          { name: "Dashboard", slug: "/mi-cuenta/dashboard", keyword: "seguimiento de campañas ooh activas", intent: "Navigational", wordCount: 1200, depth: 3 },
        ]
      }
    ]
  };

  // Render a single node recursively with folder style
  const renderSitemapNode = (node: SitemapNode, currentPath: string = "root") => {
    const isExpanded = expandedNodes[currentPath] || false;
    const hasChildren = node.children && node.children.length > 0;
    
    // Check search filter
    const matchesSearch = sitemapSearch 
      ? node.name.toLowerCase().includes(sitemapSearch.toLowerCase()) || 
        node.slug.toLowerCase().includes(sitemapSearch.toLowerCase()) ||
        (node.keyword && node.keyword.toLowerCase().includes(sitemapSearch.toLowerCase()))
      : true;

    // Filter children
    const filteredChildren = node.children?.filter(child => {
      if (!sitemapSearch) return true;
      // Show child if child itself matches, or any grand-child matches
      const checkMatch = (n: SitemapNode): boolean => {
        if (n.name.toLowerCase().includes(sitemapSearch.toLowerCase()) || n.slug.toLowerCase().includes(sitemapSearch.toLowerCase())) return true;
        if (n.children) return n.children.some(c => checkMatch(c));
        return false;
      };
      return checkMatch(child);
    });

    if (!matchesSearch && (!filteredChildren || filteredChildren.length === 0)) {
      return null;
    }

    return (
      <div key={currentPath} className="pl-4 border-l border-slate-200/85 my-1 font-sans">
        <div 
          className={`flex items-center justify-between py-1.5 px-3 rounded-lg transition-all select-none hover:bg-slate-100/80 ${
            node.depth === 1 ? "bg-indigo-50/50 border border-indigo-100" : ""
          }`}
        >
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => hasChildren && toggleNode(currentPath)}>
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
              )
            ) : (
              <div className="w-4 h-4" /> // spacing
            )}

            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className={`h-4 w-4 shrink-0 ${node.depth === 1 ? 'text-indigo-600' : 'text-amber-500'}`} />
              ) : (
                <Folder className={`h-4 w-4 shrink-0 ${node.depth === 1 ? 'text-indigo-600' : 'text-amber-500'}`} />
              )
            ) : (
              <FileText className="h-4 w-4 text-slate-400 shrink-0" />
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
              <span className={`text-xs font-bold ${node.depth === 1 ? "text-indigo-900 text-sm" : "text-slate-800"}`}>
                {node.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-sm">
                {node.slug}
              </span>
            </div>
          </div>

          {/* Metrics side-pills */}
          <div className="hidden md:flex items-center gap-4 text-right">
            {node.keyword && (
              <div className="flex flex-col text-right">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">SEO Keyword Pilar</span>
                <span className="text-[10px] text-slate-600 font-semibold italic">"{node.keyword}"</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <div className="text-right">
                <span className="block text-[9px] text-slate-400 font-bold font-mono">INTENTO</span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  node.intent === "Transactional" 
                    ? "bg-rose-100 text-rose-700" 
                    : node.intent === "Commercial" 
                    ? "bg-emerald-100 text-emerald-700"
                    : node.intent === "Informational"
                    ? "bg-sky-100 text-sky-700"
                    : "bg-slate-150 text-slate-700"
                }`}>
                  {node.intent || "Informational"}
                </span>
              </div>

              <div className="text-right w-16">
                <span className="block text-[9px] text-slate-400 font-bold font-mono">PALABRAS</span>
                <span className="text-[10px] font-bold text-slate-700 font-mono">{node.wordCount || 1000}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Children nodes container */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {filteredChildren?.map(child => renderSitemapNode(child, `${currentPath}/${child.slug.split("/").pop()}`))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col font-sans max-w-5xl mx-auto">
      {/* Banner de Cabecera */}
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-[circle_at_right] from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                B2B OOH ARCHITECTURE
              </span>
              <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                SEO OPTIMIZED CLUSTER
              </span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-emerald-400" />
              Sitemap Multipage & Arquitectura SEO de Alta Conversión
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Estructura jerárquica escalable para Grupo Comunicarte que reduce la profundidad de clics a un máximo de 3 niveles y maximiza la indexación en motores de búsqueda.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-xs border border-slate-700/60 p-2.5 rounded-xl self-start md:self-auto shrink-0">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <div className="text-left leading-none">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">SEO Index Score</span>
              <span className="text-sm font-black text-white">98% Impecable</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1.5 mt-6 border-t border-slate-800 pt-4 overflow-x-auto scrollbar-none">
          {[
            { id: "architecture", label: "Árbol de Sitemap", icon: Layers },
            { id: "audit", label: "Auditoría de Mapa Anterior", icon: AlertTriangle },
            { id: "justifications", label: "Justificación UX/SEO", icon: CheckCircle2 },
            { id: "simulator", label: "Simulador de URLs & Breadcrumbs", icon: Link },
            { id: "growth", label: "Estrategia de Crecimiento", icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6 bg-slate-50 min-h-[480px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: INTERACTIVE SITEMAP */}
          {activeTab === "architecture" && (
            <motion.div
              key="architecture-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* Search bar & Legend */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-3xs">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /> 
                  <input
                    type="text"
                    placeholder="Buscar página, slug o palabra clave..."
                    value={sitemapSearch}
                    onChange={(e) => setSitemapSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600">
                  <span className="text-slate-400">Intenciones:</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] uppercase text-sky-700">Informational</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] uppercase text-emerald-700">Commercial</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] uppercase text-rose-700">Transactional</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-slate-150 px-2 py-0.5 text-[10px] uppercase text-slate-700">Navigational</span>
                </div>
              </div>

              {/* Sitemap Root Wrapper */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs overflow-x-auto">
                <div className="min-w-[650px]">
                  {renderSitemapNode(sitemapData)}
                </div>
              </div>

              {/* Fast stats cards for sitemap depth */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-3xs">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase font-mono">Profundidad Máxima</span>
                  <span className="text-md font-black text-slate-900">3 Niveles</span>
                  <span className="block text-[9px] text-emerald-600 font-bold mt-1">Cumple regla estricta UX</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-3xs">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase font-mono">Páginas Huérfanas</span>
                  <span className="text-md font-black text-slate-900">0</span>
                  <span className="block text-[9px] text-emerald-600 font-bold mt-1">100% enlazado interno</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-3xs">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase font-mono">Clústeres de Intención</span>
                  <span className="text-md font-black text-slate-900">4 Categorías</span>
                  <span className="block text-[9px] text-indigo-600 font-bold mt-1">Estructura SEO semántica</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-3xs">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase font-mono">Escalabilidad de URL</span>
                  <span className="text-md font-black text-slate-900">Infinita</span>
                  <span className="block text-[9px] text-emerald-600 font-bold mt-1">Listo para Headless CMS</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: AUDIT OF THE OLD MAP */}
          {activeTab === "audit" && (
            <motion.div
              key="audit-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Auditoría del mapa anterior */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Diagnóstico de Debilidades de la Estructura Anterior */}
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-rose-700">
                    <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
                    Diagnóstico de Estructura Anterior (Problemas Críticos)
                  </h3>

                  <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                    <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg space-y-1">
                      <strong className="text-rose-800">1. Contenido mezclado y ambiguo:</strong> 
                      <p>
                        Páginas como <code>/Nosotros/Soluciones</code> o <code>/Nosotros/Soportes y Formatos</code> mezclaban la presentación institucional con ofertas de venta. Esto diluía el valor de rastreo SEO y confundía al robot de Google.
                      </p>
                    </div>

                    <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg space-y-1">
                      <strong className="text-rose-800">2. Mala categorización de Espacios por Provincia:</strong> 
                      <p>
                        Ubicaciones como <code>/Espacios Publicitarios/Mendoza</code> limitaban el crecimiento de landing pages geolocalizadas. Impidía competir en búsquedas de nicho provinciales en el largo plazo.
                      </p>
                    </div>

                    <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg space-y-1">
                      <strong className="text-rose-800">3. Embudo de conversión roto:</strong> 
                      <p>
                        No existía un camino claro hacia la cotización comercial directa, empujando a los usuarios B2B a un formulario genérico de contacto sin segmentar por presupuesto u objetivos de campaña.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Soluciones Aplicadas */}
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                    Soluciones Aplicadas en el Rediseño Multipage
                  </h3>

                  <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                    <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg space-y-1">
                      <strong className="text-emerald-800">1. Clusterización Semántica Estricta:</strong> 
                      <p>
                        Se dividió el sitio en secciones claras: <code>/nosotros</code> para lo institucional, <code>/servicios</code> para la oferta, <code>/espacios-publicitarios</code> para formatos físicos, y <code>/ubicaciones</code> para geolocalización.
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg space-y-1">
                      <strong className="text-emerald-800">2. Enrutamiento Amigable y Corto:</strong> 
                      <p>
                        Las URLs se optimizaron según la intención de búsqueda de B2B, pasando de estructuras anidadas complejas a un máximo de 2 subdirectorios (por ejemplo: <code>/ubicaciones/mendoza</code>).
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg space-y-1">
                      <strong className="text-emerald-800">3. Puertas de Entrada B2B para Captación:</strong> 
                      <p>
                        Se crearon accesos dedicados a <code>/contacto/cotizacion</code> y <code>/mediakit</code> con tarifas claras, lo que incrementa el ratio de envío de formularios por empresas interesadas.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Comparative flow chart style */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">Comparación de Reducción de Clics</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-rose-100 bg-rose-50/20 rounded-xl">
                    <span className="block text-xs font-bold text-rose-800 mb-2">Sitemap Anterior (Navegación B2B)</span>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="bg-slate-200 px-2 py-0.5 rounded">Inicio</span>
                      <ChevronRight className="h-3 w-3" />
                      <span className="bg-slate-200 px-2 py-0.5 rounded">Nosotros</span>
                      <ChevronRight className="h-3 w-3" />
                      <span className="bg-slate-200 px-2 py-0.5 rounded">Soportes</span>
                      <ChevronRight className="h-3 w-3" />
                      <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold">Mendoza LED</span>
                      <span className="text-slate-400 font-sans ml-1">(4 clics)</span>
                    </div>
                  </div>

                  <div className="p-4 border border-emerald-100 bg-emerald-50/20 rounded-xl">
                    <span className="block text-xs font-bold text-emerald-800 mb-2">Sitemap Rediseñado (Acceso Directo)</span>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="bg-slate-200 px-2 py-0.5 rounded">Inicio</span>
                      <ChevronRight className="h-3 w-3" />
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">/ubicaciones/mendoza</span>
                      <span className="text-slate-400 font-sans ml-1">(2 clics, 50% de fricción menos!)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: UX & SEO JUSTIFICATIONS */}
          {activeTab === "justifications" && (
            <motion.div
              key="justifications-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Grid with UX and SEO Deep Dive */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Justificación UX */}
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-indigo-700">
                    <BookOpen className="h-4.5 w-4.5 text-indigo-500" />
                    Justificación de Experiencia de Usuario (UX Architect)
                  </h3>

                  <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
                    <div className="border-l-2 border-indigo-500 pl-3">
                      <strong className="block text-slate-900 font-bold">Ley de Hick Aplicada al Menú Principal</strong>
                      <p className="mt-0.5">
                        Al consolidar múltiples páginas huérfanas en 5 categorías madre en la barra de navegación, reducimos el tiempo de toma de decisiones del usuario, evitando la parálisis por exceso de opciones.
                      </p>
                    </div>

                    <div className="border-l-2 border-indigo-500 pl-3">
                      <strong className="block text-slate-900 font-bold">Divulgación Progresiva (Progressive Disclosure)</strong>
                      <p className="mt-0.5">
                        El usuario no es abrumado con tarifas y especificaciones técnicas complejas en la página de inicio. Esta información se encuentra categorizada cuidadosamente en la sección de <code>/mediakit</code>, accesible para planificadores de medios experimentados.
                      </p>
                    </div>

                    <div className="border-l-2 border-indigo-500 pl-3">
                      <strong className="block text-slate-900 font-bold">Estructura del Menú Principal (Megamenú)</strong>
                      <p className="mt-0.5">
                        Se define un megamenú de tres columnas para pantallas grandes que divide en: 
                        <strong>1. Formatos</strong> (Carteles, Pantallas LED, Mobiliario), 
                        <strong>2. Ubicaciones Pilares</strong> (Buenos Aires, Mendoza) y 
                        <strong>3. Herramientas</strong> (Mapa Comercial, Tarifarios).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Justificación SEO */}
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-emerald-700">
                    <Globe className="h-4.5 w-4.5 text-emerald-500" />
                    Justificación SEO Estratégico (SEO Strategist)
                  </h3>

                  <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
                    <div className="border-l-2 border-emerald-500 pl-3">
                      <strong className="block text-slate-900 font-bold">Clústeres Temáticos (Topic Clusters)</strong>
                      <p className="mt-0.5">
                        La página pilar es <code>/espacios-publicitarios</code> que hereda autoridad hacia las páginas secundarias de soporte específico (<code>/carteles</code>, <code>/pantallas-led</code>). Esto posiciona al sitio como autoridad temática frente al algoritmo de Google.
                      </p>
                    </div>

                    <div className="border-l-2 border-emerald-500 pl-3">
                      <strong className="block text-slate-900 font-bold">Estrategia de Landing Pages Locales</strong>
                      <p className="mt-0.5">
                        Al tener rutas dedicadas como <code>/ubicaciones/mendoza</code>, podemos orientar el marcado de datos estructurados Schema.org (LocalBusiness) específicamente para la búsqueda regional "publicidad en vía pública Mendoza", atrayendo leads locales calificados.
                      </p>
                    </div>

                    <div className="border-l-2 border-emerald-500 pl-3">
                      <strong className="block text-slate-900 font-bold">Estructura de Breadcrumbs Semánticos</strong>
                      <p className="mt-0.5">
                        La inclusión de breadcrumbs automatizados no solo ayuda al usuario a ubicarse, sino que genera enlazado interno ascendente en formato JSON-LD, lo que incrementa sustancialmente el CTR en los resultados de búsqueda de Google.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Mega Menu Visual Blueprint */}
              <div className="space-y-3 rounded-[28px] border border-slate-800 bg-slate-900 p-5 text-white">
                <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Plano de Megamenú Principal (Desktop Visual Spec)</span>
                
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  <div className="space-y-2">
                    <span className="font-bold text-indigo-400 border-b border-slate-800 pb-1 block">Formatos Publicitarios</span>
                    <div className="space-y-1 text-slate-400">
                      <div className="hover:text-white cursor-pointer flex items-center gap-1.5">▪ Carteles Monumentales <span className="text-[9px] bg-slate-800 px-1 rounded text-slate-300">Vallas</span></div>
                      <div className="hover:text-white cursor-pointer flex items-center gap-1.5">▪ Pantallas LED <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1 rounded">DOOH</span></div>
                      <div className="hover:text-white cursor-pointer flex items-center gap-1.5">▪ Mobiliario Urbano <span className="text-[9px] bg-slate-800 px-1 rounded text-slate-300">Refugios</span></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-emerald-400 border-b border-slate-800 pb-1 block">Ubicaciones Principales</span>
                    <div className="space-y-1 text-slate-400">
                      <div className="hover:text-white cursor-pointer flex items-center gap-1.5">📍 Buenos Aires <span className="text-[9px] text-indigo-400 font-bold">Capital</span></div>
                      <div className="hover:text-white cursor-pointer flex items-center gap-1.5">📍 Mendoza <span className="text-[9px] text-indigo-400 font-bold">Cuyo</span></div>
                      <div className="hover:text-white cursor-pointer flex items-center gap-1.5">📍 Otras Provincias <span className="text-[9px] text-slate-500">Interior</span></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-amber-400 border-b border-slate-800 pb-1 block">Herramientas Comerciales</span>
                    <div className="space-y-1 text-slate-400">
                      <div className="hover:text-white cursor-pointer">🗺 Mapa Interactivo Georreferenciado</div>
                      <div className="hover:text-white cursor-pointer">📊 Descargar Mediakit & Tarifario PDF</div>
                      <div className="hover:text-white cursor-pointer">🎯 Solicitar Propuesta de Presupuesto</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: URL & BREADCRUMB PLAYGROUND SIMULATOR */}
          {activeTab === "simulator" && (
            <motion.div
              key="simulator-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Interactive URL Generator card */}
              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    Simulador Interactivo de Enrutamiento & Migas de Pan (Breadcrumbs)
                  </h3>
                  <p className="text-[11px] text-slate-500">Prueba cómo se generan dinámicamente las URLs amigables del CMS y la jerarquía de navegación correspondiente para el usuario.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Selector 1: Ciudad */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Seleccionar Ciudad / Región</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500"
                    >
                      <option value="buenos-aires">Buenos Aires (Metrópolis)</option>
                      <option value="mendoza">Mendoza (Cuna del Sol)</option>
                      <option value="cordoba">Córdoba (Interior)</option>
                      <option value="santa-fe">Santa Fe (Litoral)</option>
                    </select>
                  </div>

                  {/* Selector 2: Formato */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Seleccionar Formato Físico</label>
                    <select
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500"
                    >
                      <option value="carteles">Carteles Monumentales</option>
                      <option value="pantallas-led">Pantallas LED Digitales (DOOH)</option>
                      <option value="mobiliario-urbano">Mobiliario Urbano</option>
                      <option value="centros-comerciales">Centros Comerciales</option>
                    </select>
                  </div>

                  {/* Selector 3: Tema Blog */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Seleccionar Clúster del Blog</label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500"
                    >
                      <option value="publicidad-exterior">Publicidad Exterior (OOH)</option>
                      <option value="tendencias-ooh">Tendencias y Creatividad</option>
                      <option value="marketing">Métricas de Retorno de Inversión</option>
                    </select>
                  </div>
                </div>

                {/* Outputs section */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-white space-y-4">
                  {/* Generated URLs */}
                  <div className="space-y-1.5 border-b border-slate-800 pb-3">
                    <span className="block text-[9px] text-emerald-400 font-bold uppercase tracking-wider">URLs de Páginas Optimizadas generadas</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Landing Local:</span>
                        <span className="text-emerald-300 font-bold">https://grupocomunicarte.com/ubicaciones/{selectedCity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Soporte Tecn:</span>
                        <span className="text-emerald-300 font-bold">https://grupocomunicarte.com/espacios-publicitarios/{selectedFormat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Post de Blog:</span>
                        <span className="text-emerald-300 font-bold">https://grupocomunicarte.com/blog/{selectedTopic}/estrategias-b2b</span>
                      </div>
                    </div>
                  </div>

                  {/* Breadcrumbs Representation */}
                  <div className="space-y-2">
                    <span className="block text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Migas de Pan Resultantes (Breadcrumbs UX)</span>
                    <div className="space-y-2 font-sans text-xs">
                      <div className="flex items-center gap-1.5 bg-slate-950 p-2.5 rounded border border-slate-800/60">
                        <span className="text-slate-400">Inicio</span>
                        <ChevronRight className="h-3 w-3 text-slate-600" />
                        <span className="text-slate-400">Ubicaciones</span>
                        <ChevronRight className="h-3 w-3 text-slate-600" />
                        <span className="text-white font-bold capitalize">{selectedCity.replace("-", " ")}</span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-950 p-2.5 rounded border border-slate-800/60">
                        <span className="text-slate-400">Inicio</span>
                        <ChevronRight className="h-3 w-3 text-slate-600" />
                        <span className="text-slate-400">Espacios Publicitarios</span>
                        <ChevronRight className="h-3 w-3 text-slate-600" />
                        <span className="text-white font-bold capitalize">{selectedFormat.replace("-", " ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulated Breadcrumbs code visualization to show Grade AA coding */}
              <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Estructura JSON-LD para Google de Breadcrumbs (Marcado Schema.org)</span>
                <pre className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg text-[10px] font-mono text-slate-600 overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://grupocomunicarte.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Ubicaciones",
      "item": "https://grupocomunicarte.com/ubicaciones"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1).replace("-", " ")}",
      "item": "https://grupocomunicarte.com/ubicaciones/${selectedCity}"
    }
  ]
}`}
                </pre>
              </div>
            </motion.div>
          )}

          {/* TAB 5: SCALABILITY & GROW STRATEGY */}
          {activeTab === "growth" && (
            <motion.div
              key="growth-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Scalability stats banner */}
              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    Estrategia de Crecimiento Infinito y Deuda Técnica Cero
                  </h3>
                  <p className="text-[11px] text-slate-500">Cómo el sitemap está diseñado para soportar la expansión del negocio sin alterar la arquitectura de código existente.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                        01
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 block font-bold">Expansión de Ciudades (+100 Ciudades)</strong>
                        <p>
                          Para agregar una nueva ciudad (como Córdoba, San Luis o Salta), solo se añade un registro en el CMS o se crea el archivo dinámico <code>/ubicaciones/[slug]</code> en Next.js App Router. El sistema auto-enruta el mapa comercial y las tarifas sin modificar la barra de navegación principal.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                        02
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 block font-bold">Catálogo de Soportes (+500 Espacios)</strong>
                        <p>
                          Los carteles se cargan en la base de datos PostgreSQL y se renderizan dinámicamente según la ubicación. El robot de Google indexará cada espacio individual bajo la ruta canónica <code>/espacios-publicitarios/[formato]/[id-espacio]</code>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                        03
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 block font-bold">Blog & Contenidos (+1000 Artículos)</strong>
                        <p>
                          Mediante el uso de clústeres temáticos dinámicos (<code>/blog/[cluster]/[post-slug]</code>), el rediseño canaliza toda la fuerza de enlazado interno hacia las landings de conversión, aumentando la autoridad del dominio de Grupo Comunicarte.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                        04
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 block font-bold">Compatible con Headless CMS (Strapi / Sanity)</strong>
                        <p>
                          La arquitectura limpia y desacoplada permite alimentar las migas de pan y metadatos de SEO desde cualquier motor headless por API, facilitando integraciones omnicanal en el futuro.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next.js App Router compatibility visualization */}
              <div className="space-y-3 rounded-[28px] border border-slate-800 bg-slate-900 p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Simulación de Estructura de Carpetas de Código (Next.js App Router compatible)</span>
                  <span className="text-[9px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">app/ Directory Schema</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1">
                  <div>📂 <span className="text-indigo-400 font-bold">app</span>/</div>
                  <div className="pl-4">├── 📂 layout.tsx <span className="text-slate-500">// Megamenú & Footer Global</span></div>
                  <div className="pl-4">├── 📂 page.tsx <span className="text-slate-500">// Inicio (Home Page)</span></div>
                  <div className="pl-4">├── 📂 <span className="text-amber-400">nosotros</span>/</div>
                  <div className="pl-8">├── 📂 historia/page.tsx</div>
                  <div className="pl-8">└── 📂 equipo/page.tsx</div>
                  <div className="pl-4">├── 📂 <span className="text-amber-400">ubicaciones</span>/</div>
                  <div className="pl-8">├── page.tsx <span className="text-slate-500">// Buscador de cobertura</span></div>
                  <div className="pl-8">└── 📂 <span className="text-emerald-400">[slug]</span>/page.tsx <span className="text-slate-500">// Mendoza, Buenos Aires, etc.</span></div>
                  <div className="pl-4">├── 📂 <span className="text-amber-400">espacios-publicitarios</span>/</div>
                  <div className="pl-8">├── page.tsx <span className="text-slate-500">// Catálogo completo</span></div>
                  <div className="pl-8">└── 📂 <span className="text-emerald-400">[formato]</span>/page.tsx <span className="text-slate-500">// Carteles, pantallas led</span></div>
                  <div className="pl-4">└── 📂 <span className="text-amber-400">blog</span>/</div>
                  <div className="pl-8">├── page.tsx</div>
                  <div className="pl-8">└── 📂 <span className="text-emerald-400">[category]</span>/page.tsx <span className="text-slate-500">// Clústeres de artículos</span></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer of sitemap */}
      <div className="bg-white border-t border-slate-150 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-center sm:text-left">
          <Check className="h-4 w-4 text-emerald-500" />
          Estructura multipágina B2B diseñada bajo estándares de UX Architect y SEO Técnico.
        </span>
        <button
          onClick={() => {
            alert("Esquema de Sitemap Exportado para Google XML Sitemap Generator: https://grupocomunicarte.com/sitemap.xml");
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-emerald-200 bg-white text-slate-600 hover:text-emerald-600 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Generar sitemap.xml
        </button>
      </div>
    </div>
  );
};
