import React, { useState, memo } from "react";
import * as LucideIcons from "lucide-react";
import { SoportesInventory } from "./SoportesInventory";
import { optimizeImageUrl } from "@/src/lib/imageUtils";

interface SoportesViewProps {
  slug: string;
  handleNavigate: (slug: string) => void;
}

const FORMATOS_DATA = [
  {
    id: "peatonal",
    title: "LED Peatonal UHD",
    subtitle: "Smart Totems de Ultra Alta Definición",
    icon: <LucideIcons.Users className="h-4 w-4" />,
    tag: "Tránsito Peatonal y Comercial",
    description: "Módulos de pantallas LED digitales UHD adaptados a nivel de vista peatonal, ideales para zonas comerciales de alto tránsito, paseos y corredores urbanos en Mendoza y Buenos Aires. Su resolución ultra fina permite captar detalles con máxima nitidez.",
    specs: [
      { label: "Pixel Pitch", value: "P2.5 / P3.0 Outdoor UHD" },
      { label: "Medida Estándar", value: "1.20m x 1.80m" },
      { label: "Aspect Ratio", value: "9:16 Vertical" },
      { label: "Tiempo de Exposición", value: "Alto (Permanencia de 15-45 seg)" },
      { label: "Frecuencia de Ciclo", value: "Spots de 5s o 10s en Loops de 60s" }
    ],
    plazas: "Microcentro Mendoza, Calle Arístides, Recoleta, Puerto Madero.",
    seo_anchor: "pantallas-led-peatonales",
    mock_image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "vehicular",
    title: "Monolito Vehicular Gigante",
    subtitle: "Pantallas Monumentales en Accesos Rápidos",
    icon: <LucideIcons.Tv className="h-4 w-4" />,
    tag: "Corredores Viales y Autopistas",
    description: "Estructuras de escala monumental posicionadas estratégicamente a gran altura en las autopistas, accesos metropolitanos y avenidas rápidas de mayor volumen diario. Diseñadas para un impacto masivo inmediato.",
    specs: [
      { label: "Pixel Pitch", value: "P4.0 / P5.0 High Brightness" },
      { label: "Medida Estándar", value: "6.00m x 4.00m / 8.00m x 4.00m" },
      { label: "Aspect Ratio", value: "16:9 Horizontal" },
      { label: "Tiempo de Exposición", value: "Inmediato (Lectura veloz a gran distancia)" },
      { label: "Luminosidad", value: "6500+ nits (Legibilidad solar directa)" }
    ],
    plazas: "Acceso Este Mendoza, Corredor del Oeste, Av. 9 de Julio Buenos Aires.",
    seo_anchor: "pantallas-led-vehiculares",
    mock_image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "mixto",
    title: "Pantalla Mixta Dinámica",
    subtitle: "Impacto Semafórico Estratégico",
    icon: <LucideIcons.Eye className="h-4 w-4" />,
    tag: "Intersecciones Neurálgicas",
    description: "Ubicadas en esquinas críticas con detención semafórica. Logra una cobertura combinada insuperable: impacta al conductor que espera la luz verde y al peatón que cruza la calle. Ofrece los mayores tiempos de exposición (Dwell Time) del mercado.",
    specs: [
      { label: "Pixel Pitch", value: "P3.0 / P4.0 Professional" },
      { label: "Medida Estándar", value: "4.00m x 3.00m" },
      { label: "Aspect Ratio", value: "4:3 / Escala Optimizada" },
      { label: "Tiempo de Exposición", value: "Extremo (Espera semafórica de hasta 60 seg)" },
      { label: "Frecuencia de Ciclo", value: "Sincronizado con fase de tránsito" }
    ],
    plazas: "Principales intersecciones del microcentro de Mendoza y GBA.",
    seo_anchor: "pantallas-led-mixtas",
    mock_image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "monoposte",
    title: "Monoposte Monumental (OOH)",
    subtitle: "Presencia Corporativa Ininterrumpida",
    icon: <LucideIcons.Layers className="h-4 w-4" />,
    tag: "Cartelería Tradicional de Altura",
    description: "Estructuras físicas de envergadura arquitectónica. Al no poseer rotación de pantalla, garantizan el 100% de exclusividad para la marca las 24 horas del día. Equipadas con proyectores LED inteligentes de bajo consumo con encendido crepuscular.",
    specs: [
      { label: "Tecnología", value: "Soporte Físico Estático (Iluminado)" },
      { label: "Medida Estándar", value: "12.00m x 4.00m / 15.00m x 5.00m" },
      { label: "Espacio de Color", value: "CMYK de alta fidelidad cromática" },
      { label: "Exclusividad", value: "100% Única marca sin rotación" },
      { label: "Sustentabilidad", value: "Iluminación inteligente auto-ajustable" }
    ],
    plazas: "Accesos principales, autopistas de Mendoza, autopistas nacionales GBA.",
    seo_anchor: "monopostes-gigantes",
    mock_image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "mobiliario",
    title: "Mobiliario Urbano Inteligente",
    subtitle: "Frecuencia Hiperlocal de Cercanía",
    icon: <LucideIcons.Home className="h-4 w-4" />,
    tag: "Refugios y Paradas de Colectivos",
    description: "Publicidad integrada en paradas de autobuses, refugios peatonales y tótems informativos. Proporciona una alta frecuencia de visualización diaria, integrando de manera orgánica las campañas en la rutina diaria del ciudadano.",
    specs: [
      { label: "Tecnología", value: "Poster de alta resolución retroiluminado" },
      { label: "Medida Estándar", value: "1.15m x 1.75m" },
      { label: "Aspect Ratio", value: "2:3 Vertical" },
      { label: "Segmentación", value: "Hiperlocal por corredor urbano o zona comercial" },
      { label: "Alcance", value: "Alta frecuencia acumulada por proximidad" }
    ],
    plazas: "Circuitos de refugios en zonas comerciales clave de Mendoza.",
    seo_anchor: "mobiliario-urbano",
    mock_image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
  }
];

type Format = typeof FORMATOS_DATA[0];
type FormatId = Format['id'];

const FormatTab = memo(({ format, activeFormat, setActiveFormat }: { format: Format, activeFormat: FormatId, setActiveFormat: (id: FormatId) => void }) => (
  <button
    key={format.id}
    onClick={() => setActiveFormat(format.id as FormatId)}
    className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer border ${
      activeFormat === format.id
        ? "bg-primary text-primary-foreground border-primary shadow-xs"
        : "bg-stone-50 text-stone-600 hover:bg-stone-100 border-stone-200/60"
    }`}
  >
    {format.icon}
    <span>{format.title}</span>
  </button>
));

const FormatDetail = memo(({ format }: { format: Format }) => (
  <div className="lg:col-span-7 space-y-4">
    <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
      {format.tag}
    </span>
    <h4 className="text-lg font-black text-stone-900 font-display">{format.title}</h4>
    <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-sans font-medium">
      {format.description}
    </p>

    {/* Spec table */}
    <div className="bg-stone-50 border border-stone-200/60 rounded-xl overflow-hidden shadow-xs">
      <div className="divide-y divide-stone-150 text-xs">
        {format.specs.map((spec, i) => (
          <div key={i} className="px-4 py-2.5 flex justify-between items-center bg-white/50">
            <span className="font-bold text-stone-500">{spec.label}</span>
            <span className="font-extrabold text-stone-800">{spec.value}</span>
          </div>
        ))}
        <div className="px-4 py-2.5 flex justify-between items-center bg-white/50">
          <span className="font-bold text-stone-500">Ubicaciones Recomendadas</span>
          <span className="font-extrabold text-primary text-right max-w-xs">{format.plazas}</span>
        </div>
      </div>
    </div>

    <button
      onClick={() => document.getElementById("catalog-explorer-section")?.scrollIntoView({ behavior: "smooth", block: "start" })}
      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wide rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
    >
      <LucideIcons.Search className="h-4 w-4 text-white" />
      <span>Filtrar este formato en catálogo</span>
    </button>
  </div>
));

export const SoportesView: React.FC<SoportesViewProps> = ({ slug, handleNavigate }) => {
  const [activeFormat, setActiveFormat] = useState<"peatonal" | "vehicular" | "mixto" | "monoposte" | "mobiliario">("peatonal");

  const isMainPage = slug === "/soportes";
  const isPeatonalSub = slug === "/soportes/led-peatonal";
  const isVehicularSub = slug === "/soportes/monolito-vehicular";
  const isMixtoSub = slug === "/soportes/pantalla-mixta";

  return (
    <div className="space-y-10">
      {/* 1. EDUCATIONAL SEO COPY SECTION */}
      {isMainPage && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-8 shadow-xs text-left font-sans">
          <div className="border-b border-stone-150 pb-5 space-y-2">
            <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block">
              Guía de Formatos de Comunicación Urbana
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-black text-stone-900 tracking-tight leading-tight">
              Formatos de Pauta Publicitaria Exterior (OOH & DOOH)
            </h2>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed max-w-3xl font-medium">
              Para maximizar el impacto y retorno de inversión de tu campaña B2B, es fundamental entender las características técnicas y demográficas de cada soporte de vía pública. Explora nuestra guía de formatos pensada para planificadores de medios y creativos.
            </p>
          </div>

          {/* Interactive Selector Tabs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider">Explorador de Soportes</h3>
              <div className="flex flex-wrap gap-1.5">
                {FORMATOS_DATA.map((f) => <FormatTab key={f.id} format={f} activeFormat={activeFormat} setActiveFormat={setActiveFormat as (id: FormatId) => void} />)}
              </div>
            </div>

            {/* Display Selected Format Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
              {FORMATOS_DATA.filter((f) => f.id === activeFormat).map((f) => <FormatDetail key={f.id} format={f} />)}

              {/* Visual Frame mock representation */}
              <div className="lg:col-span-5">
                {FORMATOS_DATA.filter((f) => f.id === activeFormat).map((f) => (
                  <div key={f.id} className="w-full aspect-video sm:aspect-4/3 bg-slate-950 rounded-2xl border border-stone-200/60 shadow-md relative overflow-hidden p-5 flex flex-col justify-end group">
                    <div className="absolute inset-0 z-0">
                      <img
                        src={optimizeImageUrl(f.mock_image)}
                        alt={f.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-40 filter grayscale contrast-125 animate-fadeIn"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    </div>
                    <div className="relative z-10 space-y-1">
                      <span className="text-[8px] font-mono text-emerald-400 font-extrabold tracking-widest block uppercase">Visualización Certificada</span>
                      <h5 className="text-sm font-bold text-white font-display leading-tight">{f.title}</h5>
                      <p className="text-[10px] text-stone-300">Formato disponible en Mendoza y Buenos Aires.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compare Matrix Table */}
          <div className="space-y-3 pt-6 border-t border-stone-100">
            <h3 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <LucideIcons.LayoutGrid className="h-4 w-4 text-primary" />
              Matriz Comparativa de Soportes
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              La siguiente tabla interactiva detalla el rendimiento y alcance sugerido para facilitar la planificación estratégica de agencias de publicidad.
            </p>
            <div className="overflow-x-auto border border-stone-200 rounded-xl shadow-xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-extrabold uppercase text-[9px] tracking-wider select-none">
                    <th className="px-4 py-3">Formato / Soporte</th>
                    <th className="px-4 py-3">Tipo de Flujo</th>
                    <th className="px-4 py-3">Especificación Técnica</th>
                    <th className="px-4 py-3">Permanencia Promedio</th>
                    <th className="px-4 py-3">Plazas Disponibles</th>
                    <th className="px-4 py-3 text-right">Métrica Semanal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150 font-medium text-stone-700">
                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-stone-900">LED Peatonal UHD</td>
                    <td className="px-4 py-3">Peatonal</td>
                    <td className="px-4 py-3 font-mono">P2.5 / P3.0 UHD (9:16)</td>
                    <td className="px-4 py-3">15 - 45 segundos</td>
                              <td className="px-4 py-3 text-stone-500">Mendoza &amp; Baires</td>
                              <td className="px-4 py-3 text-right text-primary font-black">+30.000 OTS</td>
                  </tr>
                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-stone-900">Monolito Vehicular</td>
                    <td className="px-4 py-3">Vehicular</td>
                    <td className="px-4 py-3 font-mono">P4.0 / P5.0 Giant (16:9)</td>
                    <td className="px-4 py-3">3 - 5 segundos</td>
                              <td className="px-4 py-3 text-stone-500">Mendoza &amp; Autopistas</td>
                              <td className="px-4 py-3 text-right text-primary font-black">+75.000 OTS</td>
                  </tr>
                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-stone-900">Pantalla Mixta Esquinas</td>
                              <td className="px-4 py-3">Vehicular &amp; Peatonal</td>
                    <td className="px-4 py-3 font-mono">P3.0 Sync Semáforo (4:3)</td>
                    <td className="px-4 py-3">30 - 60 segundos</td>
                    <td className="px-4 py-3 text-stone-500">Microcentros Clave</td>
                              <td className="px-4 py-3 text-right text-primary font-black">+50.000 OTS</td>
                  </tr>
                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-stone-900">Monoposte Gigante</td>
                    <td className="px-4 py-3">Flujo Rápido / Ruta</td>
                    <td className="px-4 py-3 font-mono">CMYK Lona Estática</td>
                    <td className="px-4 py-3">Permanente 24hs</td>
                              <td className="px-4 py-3 text-stone-500">Principales Accesos</td>
                              <td className="px-4 py-3 text-right text-primary font-black">+120.000 OTS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Creative Designing Guidelines (Strong SEO optimization) */}
          <div className="space-y-3 pt-6 border-t border-stone-100">
            <h3 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <LucideIcons.BookOpen className="h-4 w-4 text-primary" />
              Diseño para Vía Pública: Claves del Éxito
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Debido a las dinámicas de circulación en entornos urbanos abiertos, los contenidos deben optimizarse con reglas de diseño exterior específicas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
              <div className="p-4 bg-stone-50 border border-stone-200/50 rounded-xl space-y-2">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-1.5">
                  <LucideIcons.Tv className="h-4 w-4 text-primary" />
                  Contraste de Fondo
                </h4>
                <p className="text-stone-500 leading-relaxed font-medium">
                  Los fondos oscuros aumentan la legibilidad bajo la luz solar y reducen el destello nocturno, protegiendo la fatiga visual de los conductores viales.
                </p>
              </div>
              <div className="p-4 bg-stone-50 border border-stone-200/50 rounded-xl space-y-2">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-1.5">
                  <LucideIcons.Clock className="h-4 w-4 text-primary" />
                  La Regla de los 3s
                </h4>
                <p className="text-stone-500 leading-relaxed font-medium">
                  Un spot exitoso debe asimilarse en 3 segundos. Limita el texto a 1 título impactante, un isotipo grande y 1 llamado a la acción concreto.
                </p>
              </div>
              <div className="p-4 bg-stone-50 border border-stone-200/50 rounded-xl space-y-2">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-1.5">
                  <LucideIcons.AlertCircle className="h-4 w-4 text-primary" />
                  Tipografía de Gran Peso
                </h4>
                <p className="text-stone-500 leading-relaxed font-medium">
                  Usa fuentes Sans-Serif audaces (Bold, Black) con suficiente interlineado. Evita tipografías Serif muy delgadas o cursivas, difíciles de leer a la distancia.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CHILDS SPECIFIC SEO CONTENT */}
      {isPeatonalSub && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 text-left font-sans">
          <div className="border-b border-stone-150 pb-4 space-y-2">
            <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-100 font-extrabold uppercase px-3.5 py-1 rounded-full inline-block">
              Formato Especializado DOOH
            </span>
            <h2 className="text-2xl font-black text-stone-900 font-display">Pantallas LED Peatonales UHD (Smart Totems)</h2>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-medium">
              Las pantallas LED peatonales de ultra alta definición (UHD) son el soporte óptimo para captar la atención de audiencias en reposo o circulación peatonal continua. Ubicadas estratégicamente a nivel de los ojos en los principales paseos comerciales y distritos de negocios de Mendoza y Buenos Aires, ofrecen un prolongado tiempo de exposición para tu logo o piezas publicitarias dinámicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
            <div className="space-y-4">
              <h3 className="font-extrabold text-stone-800 text-sm">Ventajas de la Pauta Peatonal</h3>
              <ul className="space-y-2.5 text-stone-500 leading-relaxed list-disc pl-5">
                <li><strong>Contacto Visual Directo:</strong> Posicionamiento perpendicular a la visual a 1.60m de altura, eliminando distracciones visuales elevadas.</li>
                <li><strong>Mayor Tiempo de Lectura:</strong> Al circular a pie, el transeúnte dispone de un promedio de 15 a 45 segundos para asimilar detalles finos, códigos QR de interacción o promociones de cercanía.</li>
                <li><strong>Audiencia Cualificada:</strong> Ubicación precisa en polos gastronómicos y paseos de compras de alto poder adquisitivo (Maipú, Calle Arístides, Recoleta).</li>
              </ul>
            </div>
            <div className="bg-stone-50 border border-stone-200/60 p-5 rounded-xl space-y-3">
              <h3 className="font-extrabold text-stone-850 text-sm">Ficha Técnica Recomendada</h3>
              <div className="space-y-2 divide-y divide-stone-150 text-stone-600">
                <div className="flex justify-between py-1.5"><span className="font-bold">Pixel Pitch</span><span className="font-extrabold text-stone-850">P2.5 / P3.0 Premium</span></div>
                <div className="flex justify-between py-1.5"><span className="font-bold">Aspect Ratio</span><span className="font-extrabold text-stone-850">9:16 Vertical</span></div>
                <div className="flex justify-between py-1.5"><span className="font-bold">Resolución Óptima</span><span className="font-extrabold text-stone-850">1080 x 1920 píxeles</span></div>
                <div className="flex justify-between py-1.5"><span className="font-bold">Ciclo del Spot</span><span className="font-extrabold text-stone-850">5s o 10s en Loop de 1min</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isVehicularSub && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 text-left font-sans">
          <div className="border-b border-stone-150 pb-4 space-y-2">
            <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 font-extrabold uppercase px-3.5 py-1 rounded-full inline-block">
              Formato Especializado DOOH
            </span>
            <h2 className="text-2xl font-black text-stone-900 font-display">Monolitos LED Vehiculares Gigantes</h2>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-medium">
              El formato monolito vehicular gigante de alta luminosidad es el referente absoluto para campañas de cobertura masiva e instalación de marca en el Top of Mind colectivo. Ubicados en los accesos viales metropolitanos y autopistas rápidas con más de 100.000 visualizaciones diarias, estos dispositivos garantizan un impacto visual ineludible gracias a su luminosidad inteligente que se regula automáticamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
            <div className="space-y-4">
              <h3 className="font-extrabold text-stone-800 text-sm">Estrategia de Pauta en Autopistas</h3>
              <ul className="space-y-2.5 text-stone-500 leading-relaxed list-disc pl-5">
                <li><strong>Cobertura Masiva Inmediata:</strong> Ideal para lanzamientos nacionales o corporativos masivos de gran escala.</li>
                <li><strong>Visibilidad a Gran Distancia:</strong> Los gabinetes de alta escala de hasta 32 metros cuadrados garantizan lectura clara a más de 150 metros.</li>
                <li><strong>Legibilidad Solar Extrema:</strong> Los chips LED de alta potencia emiten más de 6500 nits, evitando el lavado de imagen con sol de frente.</li>
              </ul>
            </div>
            <div className="bg-stone-50 border border-stone-200/60 p-5 rounded-xl space-y-3">
              <h3 className="font-extrabold text-stone-850 text-sm">Ficha Técnica de Altura</h3>
              <div className="space-y-2 divide-y divide-stone-150 text-stone-600">
                <div className="flex justify-between py-1.5"><span className="font-bold">Pixel Pitch</span><span className="font-extrabold text-stone-850">P4.0 / P5.0 Outdoor</span></div>
                <div className="flex justify-between py-1.5"><span className="font-bold">Aspect Ratio</span><span className="font-extrabold text-stone-850">16:9 Horizontal</span></div>
                <div className="flex justify-between py-1.5"><span className="font-bold">Medida Estándar</span><span className="font-extrabold text-stone-850">6.00m x 4.00m</span></div>
                <div className="flex justify-between py-1.5"><span className="font-bold">Luminosidad</span><span className="font-extrabold text-stone-850">6500+ nits</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMixtoSub && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 text-left font-sans">
          <div className="border-b border-stone-150 pb-4 space-y-2">
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold uppercase px-3.5 py-1 rounded-full inline-block">
              Formato Especializado DOOH
            </span>
            <h2 className="text-2xl font-black text-stone-900 font-display">Pantallas Mixtas Semafóricas Dinámicas</h2>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-medium">
              El formato mixto semafórico representa el equilibrio perfecto en rendimiento publicitario. Ubicadas en las esquinas más transitadas con detención de semáforo obligatoria, estas pantallas capturan la atención prolongada del conductor detenido (hasta 60 segundos de Dwell Time) e impactan en paralelo al flujo constante de peatones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
            <div className="space-y-4">
              <h3 className="font-extrabold text-stone-800 text-sm">Ventajas del Impacto Semafórico</h3>
              <ul className="space-y-2.5 text-stone-500 leading-relaxed list-disc pl-5">
                <li><strong>Tiempo de Exposición Sobresaliente:</strong> Ofrece la mayor retención de mensaje del mercado publicitario OOH gracias a la detención del tránsito.</li>
                <li><strong>Impacto Multipantalla:</strong> Logra un alcance sinérgico vehicular y peatonal combinado.</li>
                <li><strong>Tasa de Recordación Elevada:</strong> La baja velocidad de circulación en cruces neurálgicos propicia una asimilación del 100% de la creatividad.</li>
              </ul>
            </div>
            <div className="bg-stone-50 border border-stone-200/60 p-5 rounded-xl space-y-3">
              <h3 className="font-extrabold text-stone-850 text-sm">Ficha Técnica Semáforo</h3>
              <div className="space-y-2 divide-y divide-stone-150 text-stone-600">
                <div className="flex justify-between py-1.5"><span className="font-bold">Pixel Pitch</span><span className="font-extrabold text-stone-850">P3.0 Professional Outdoor</span></div>
                <div className="flex justify-between py-1.5"><span className="font-bold">Aspect Ratio</span><span className="font-extrabold text-stone-850">4:3 / Escala Optimizada</span></div>
                <div className="flex justify-between py-1.5"><span className="font-bold">Medida Estándar</span><span className="font-extrabold text-stone-850">4.00m x 3.00m</span></div>
                <div className="flex justify-between py-1.5"><span className="font-bold">Dwell Time</span><span className="font-extrabold text-stone-850">30 - 60 seg</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATALOG SEARCH TOOL COMPONENT */}
      <div id="catalog-explorer-section" className="space-y-6 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="border-b border-slate-150 pb-4 text-left font-sans">
          <h2 className="text-xl font-black text-slate-900">
            {isPeatonalSub ? "Pantallas Peatonal UHD en Catálogo" : isVehicularSub ? "Monolitos Vehiculares en Catálogo" : isMixtoSub ? "Pantallas Mixtas en Catálogo" : "Buscador de Soportes en Catálogo Comercial"}
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            {isPeatonalSub ? "Listado filtrado de pantallas peatonales. Agrega las deseadas al estimador lateral." : isVehicularSub ? "Listado de pantallas vehiculares gigantes en accesos rápidos." : isMixtoSub ? "Soportes ubicados en cruces semafóricos estratégicos de alta retención." : "Filtra nuestro catálogo interactivo de Mendoza y Buenos Aires para estimar presupuestos."}
          </p>
        </div>
        <SoportesInventory
          initialTipo={isPeatonalSub ? "Peatonal" : isVehicularSub ? "Vehicular" : isMixtoSub ? "Mixto" : undefined}
          initialCategoria={isMainPage ? undefined : "Pantallas LED"}
          onNavigateToCityMap={(city) => {
            if (city === "Buenos Aires") handleNavigate("/ubicaciones/buenos-aires");
            else if (city === "Mendoza") handleNavigate("/ubicaciones/mendoza");
          }}
        />
      </div>
    </div>
  );
};