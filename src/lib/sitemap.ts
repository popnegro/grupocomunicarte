// Sitemap Definition and SEO Structure for Grupo Comunicarte
// Built in alignment with the B2B OOH Multipage framework (Prompt Maestro)

export interface SitemapItem {
  name: string;
  slug: string;
  keyword: string;
  intent: "Informational" | "Commercial" | "Transactional" | "Navigational";
  wordCount: number;
  description: string;
  children?: SitemapItem[];
}

export const sitemap: SitemapItem[] = [
  {
    name: "Inicio",
    slug: "/",
    keyword: "publicidad exterior argentina",
    intent: "Navigational",
    wordCount: 1800,
    description: "Página principal de Grupo Comunicarte. Líderes en publicidad exterior (OOH) y pantallas LED de gran formato en Argentina.",
    children: []
  },
  {
    name: "Nosotros",
    slug: "/nosotros",
    keyword: "empresa de publicidad exterior",
    intent: "Informational",
    wordCount: 1200,
    description: "Conoce nuestra trayectoria, equipo y el respaldo de Grupo Comunicarte en la comunicación pública de alto impacto.",
    children: [
      {
        name: "Historia",
        slug: "/nosotros/historia",
        keyword: "trayectoria publicidad via publica",
        intent: "Informational",
        wordCount: 900,
        description: "Más de dos décadas conectando marcas con audiencias masivas en la vía pública."
      },
      {
        name: "Equipo",
        slug: "/nosotros/equipo",
        keyword: "profesionales publicidad exterior",
        intent: "Informational",
        wordCount: 850,
        description: "El equipo multidisciplinario detrás de la planificación, colocación y auditoría de tus campañas OOH."
      },
      {
        name: "Grupo Comunicarte",
        slug: "/nosotros/grupo-comunicarte",
        keyword: "grupo comunicarte multimedia",
        intent: "Informational",
        wordCount: 1100,
        description: "Nuestra corporación de medios y soluciones integradas de cartelería y marketing digital."
      }
    ]
  },
  {
    name: "Servicios",
    slug: "/servicios",
    keyword: "servicios de publicidad en via publica",
    intent: "Commercial",
    wordCount: 1400,
    description: "Explora nuestras soluciones integrales de publicidad exterior, pantallas digitales de alta resolución y consultoría estratégica.",
    children: [
      {
        name: "Publicidad Exterior (OOH)",
        slug: "/servicios/publicidad-exterior",
        keyword: "publicidad exterior tradicional vallas",
        intent: "Commercial",
        wordCount: 1500,
        description: "Soportes físicos estáticos de gran escala, monopostes y vallas con visibilidad garantizada."
      },
      {
        name: "Publicidad Digital (DOOH)",
        slug: "/servicios/publicidad-digital",
        keyword: "pantallas led publicitarias",
        intent: "Commercial",
        wordCount: 1600,
        description: "Circuitos de pantallas LED inteligentes con segmentación horaria y dinamismo total."
      },
      {
        name: "Campañas Integrales",
        slug: "/servicios/campanas-integrales",
        keyword: "planificacion de campañas ooh",
        intent: "Commercial",
        wordCount: 1300,
        description: "Planificación estratégica que combina múltiples soportes para un alcance óptimo."
      },
      {
        name: "Consultoría Estratégica",
        slug: "/servicios/consultoria",
        keyword: "asesoramiento publicidad exterior",
        intent: "Commercial",
        wordCount: 1000,
        description: "Asesoría personalizada para la optimización de presupuestos de vía pública."
      }
    ]
  },
  {
    name: "Espacios Publicitarios",
    slug: "/espacios-publicitarios",
    keyword: "soportes publicitarios de via publica",
    intent: "Commercial",
    wordCount: 1500,
    description: "Contamos con un catálogo premium de cartelería monumental, pantallas LED exteriores y mobiliario urbano de primer nivel.",
    children: [
      {
        name: "Carteles Monumentales",
        slug: "/espacios-publicitarios/carteles",
        keyword: "monopostes gigantes carteleria",
        intent: "Commercial",
        wordCount: 1200,
        description: "Carteles de altura y postes gigantes ubicados en autopistas y avenidas clave."
      },
      {
        name: "Pantallas LED",
        slug: "/espacios-publicitarios/pantallas-led",
        keyword: "pantallas led exterior contratacion",
        intent: "Commercial",
        wordCount: 1400,
        description: "Pantallas inteligentes digitales con excelente definición de brillo."
      },
      {
        name: "Mobiliario Urbano",
        slug: "/espacios-publicitarios/mobiliario-urbano",
        keyword: "refugios de colectivos publicidad",
        intent: "Commercial",
        wordCount: 1100,
        description: "Publicidad en refugios peatonales y paradas de autobús con alta frecuencia visual."
      },
      {
        name: "Centros Comerciales",
        slug: "/espacios-publicitarios/centros-comerciales",
        keyword: "publicidad en shoppings argentina",
        intent: "Commercial",
        wordCount: 1250,
        description: "Soportes ubicados en zonas de alto consumo y tráfico en centros comerciales premium."
      },
      {
        name: "Aeropuertos",
        slug: "/espacios-publicitarios/aeropuertos",
        keyword: "anuncios en aeropuertos",
        intent: "Commercial",
        wordCount: 1300,
        description: "Impacta a viajeros corporativos y turistas con pantallas de alta visibilidad."
      },
      {
        name: "Formatos Especiales",
        slug: "/espacios-publicitarios/formatos-especiales",
        keyword: "soporte publicitario no tradicional",
        intent: "Commercial",
        wordCount: 1050,
        description: "Estructuras a medida e instalaciones creativas de vía pública."
      }
    ]
  },
  {
    name: "Ubicaciones",
    slug: "/ubicaciones",
    keyword: "cobertura publicidad exterior argentina",
    intent: "Commercial",
    wordCount: 1350,
    description: "Brindamos una amplia cobertura en los principales centros urbanos de Argentina, incluyendo Buenos Aires y Mendoza.",
    children: [
      {
        name: "Buenos Aires",
        slug: "/ubicaciones/buenos-aires",
        keyword: "publicidad exterior buenos aires",
        intent: "Commercial",
        wordCount: 1700,
        description: "Gran Buenos Aires y autopistas metropolitanas de máxima densidad vehicular."
      },
      {
        name: "Mendoza",
        slug: "/ubicaciones/mendoza",
        keyword: "publicidad exterior mendoza",
        intent: "Commercial",
        wordCount: 1800,
        description: "La provincia de Mendoza con soportes estratégicos en microcentro y accesos clave."
      },
      {
        name: "Otras Provincias",
        slug: "/ubicaciones/otras-provincias",
        keyword: "via publica interior de argentina",
        intent: "Commercial",
        wordCount: 1100,
        description: "Cobertura nacional en las principales capitales de provincia de Argentina."
      },
      {
        name: "Mapa Interactivo",
        slug: "/ubicaciones/mapa",
        keyword: "geolocalizacion de carteles publicitarios",
        intent: "Transactional",
        wordCount: 1450,
        description: "Visualiza geográficamente todos nuestros soportes disponibles con filtros avanzados."
      }
    ]
  },
  {
    name: "Soluciones",
    slug: "/soluciones",
    keyword: "estrategias de marketing ooh",
    intent: "Commercial",
    wordCount: 1200,
    description: "Soluciones de comunicación diseñadas por industria, objetivos y presupuestos para optimizar el retorno de inversión.",
    children: [
      {
        name: "Por Industria",
        slug: "/soluciones/por-industria",
        keyword: "publicidad exterior para automotriz retail",
        intent: "Commercial",
        wordCount: 1300,
        description: "Campañas a medida para retail, automotrices, finanzas, consumo masivo y gobierno."
      },
      {
        name: "Por Objetivo",
        slug: "/soluciones/por-objetivo",
        keyword: "campanas de branding via publica",
        intent: "Commercial",
        wordCount: 1150,
        description: "Campañas enfocadas en cobertura masiva, lanzamientos de producto u ofertas regionales."
      },
      {
        name: "Por Presupuesto",
        slug: "/soluciones/por-presupuesto",
        keyword: "costo de publicidad en via publica",
        intent: "Transactional",
        wordCount: 1400,
        description: "Paquetes escalables adaptados desde pymes hasta corporaciones internacionales."
      }
    ]
  },
  {
    name: "Casos de Éxito",
    slug: "/casos-exito",
    keyword: "campañas exitosas publicidad exterior",
    intent: "Informational",
    wordCount: 1600,
    description: "Nuestros clientes y los resultados medibles de nuestras vallas y pantallas digitales de gran visibilidad.",
    children: [
      {
        name: "Portfolio",
        slug: "/casos-exito/portfolio",
        keyword: "marcas publicidad exterior argentina",
        intent: "Informational",
        wordCount: 1200,
        description: "Casos de estudio detallados con métricas de recordación e impacto visual."
      },
      {
        name: "Galería",
        slug: "/casos-exito/galeria",
        keyword: "fotos de carteles publicitarios en calle",
        intent: "Informational",
        wordCount: 850,
        description: "Registro fotográfico en alta resolución de las campañas activas de nuestros anunciantes."
      }
    ]
  },
  {
    name: "Mediakit",
    slug: "/mediakit",
    keyword: "descargar mediakit publicidad exterior",
    intent: "Transactional",
    wordCount: 1100,
    description: "Descarga las especificaciones técnicas, catálogos, medidas, y la guía para planificadores de medios de Grupo Comunicarte.",
    children: [
      {
        name: "Descargas",
        slug: "/mediakit/descargas",
        keyword: "tarifario publicidad exterior pdf",
        intent: "Transactional",
        wordCount: 950,
        description: "Acceso inmediato al MediaKit PDF, tarifas actuales e instructivos de diseño."
      },
      {
        name: "Especificaciones Técnicas",
        slug: "/mediakit/especificaciones",
        keyword: "medidas de carteles publicitarios",
        intent: "Informational",
        wordCount: 1300,
        description: "Requisitos de archivos, resoluciones recomendadas y perfiles de color para impresión."
      },
      {
        name: "Tarifario",
        slug: "/mediakit/tarifario",
        keyword: "precios publicidad exterior argentina",
        intent: "Transactional",
        wordCount: 1150,
        description: "Consulta de precios transparentes y bonificaciones por volumen de contratación."
      },
      {
        name: "Preguntas Frecuentes",
        slug: "/mediakit/faq",
        keyword: "como contratar publicidad via publica",
        intent: "Informational",
        wordCount: 1500,
        description: "Respuestas directas sobre tiempos de montaje, duración mínima y seguros de vía pública."
      }
    ]
  },
  {
    name: "Blog",
    slug: "/blog",
    keyword: "blog publicidad exterior y marketing",
    intent: "Informational",
    wordCount: 1400,
    description: "Novedades, análisis de tendencias globales, casos innovadores y el futuro de la publicidad exterior interactiva.",
    children: [
      {
        name: "Noticias",
        slug: "/blog/noticias",
        keyword: "novedades publicidad exterior",
        intent: "Informational",
        wordCount: 1000,
        description: "Últimos lanzamientos de Grupo Comunicarte y noticias corporativas."
      },
      {
        name: "Tendencias OOH",
        slug: "/blog/tendencias-ooh",
        keyword: "innovacion publicidad exterior interactiva",
        intent: "Informational",
        wordCount: 1500,
        description: "Información sobre cartelería 3D, interactividad, realidad aumentada y programática."
      },
      {
        name: "Marketing",
        slug: "/blog/marketing",
        keyword: "como medir retorno de inversion ooh",
        intent: "Informational",
        wordCount: 1800,
        description: "Métodos modernos de medición de audiencia (OTS, impactos estimativos) en vía pública."
      }
    ]
  },
  {
    name: "Contacto",
    slug: "/contacto",
    keyword: "contacto agencia publicidad exterior",
    intent: "Transactional",
    wordCount: 750,
    description: "Ponte en contacto con nuestro equipo comercial para planificar tu próxima campaña de vía pública.",
    children: [
      {
        name: "Solicitar Cotización",
        slug: "/contacto/cotizacion",
        keyword: "presupuesto publicidad exterior argentina",
        intent: "Transactional",
        wordCount: 900,
        description: "Formulario segmentado para recibir una cotización detallada según tu presupuesto."
      },
      {
        name: "Trabajá con Nosotros",
        slug: "/contacto/empleo",
        keyword: "empleo publicidad exterior mendoza",
        intent: "Transactional",
        wordCount: 800,
        description: "Búsqueda activa de instaladores, diseñadores gráficos y asesores comerciales."
      }
    ]
  },
  {
    name: "Mi Cuenta",
    slug: "/mi-cuenta",
    keyword: "portal clientes publicidad exterior",
    intent: "Navigational",
    wordCount: 600,
    description: "Portal privado para anunciantes y agencias de publicidad exterior de Grupo Comunicarte.",
    children: [
      {
        name: "Login",
        slug: "/mi-cuenta/login",
        keyword: "iniciar sesion portal clientes ooh",
        intent: "Navigational",
        wordCount: 400,
        description: "Inicio de sesión seguro para gestionar contratos y revisar reportes de visualización."
      },
      {
        name: "Dashboard",
        slug: "/mi-cuenta/dashboard",
        keyword: "seguimiento de campanas ooh activas",
        intent: "Navigational",
        wordCount: 1200,
        description: "Monitoreo en tiempo real de ubicaciones contratadas, facturas y fotos de campaña."
      }
    ]
  }
];

// Utility: get flat representation of all pages in the sitemap for simple routing
export function getFlatSitemap(): SitemapItem[] {
  const flat: SitemapItem[] = [];
  function recurse(item: SitemapItem) {
    flat.push(item);
    if (item.children) {
      item.children.forEach(recurse);
    }
  }
  sitemap.forEach(recurse);
  return flat;
}

// Utility: Find an item by its slug path
export function findSitemapItemBySlug(slug: string): SitemapItem | undefined {
  const flat = getFlatSitemap();
  return flat.find((item) => item.slug === slug);
}

// Utility: get breadcrumbs array for a given slug
export interface BreadcrumbItem {
  name: string;
  slug: string;
}

export function getBreadcrumbsForSlug(slug: string): BreadcrumbItem[] {
  if (slug === "/") {
    return [{ name: "Inicio", slug: "/" }];
  }

  const breadcrumbs: BreadcrumbItem[] = [{ name: "Inicio", slug: "/" }];
  const segments = slug.split("/").filter(Boolean);
  
  let currentAccumulated = "";
  for (const segment of segments) {
    currentAccumulated += `/${segment}`;
    const found = findSitemapItemBySlug(currentAccumulated);
    if (found) {
      breadcrumbs.push({ name: found.name, slug: found.slug });
    } else {
      breadcrumbs.push({ 
        name: segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " "), 
        slug: currentAccumulated 
      });
    }
  }

  return breadcrumbs;
}
