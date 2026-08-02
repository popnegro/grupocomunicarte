// Sitemap Definition and SEO Structure for Grupo Comunicarte
// Built in alignment with the B2B OOH Multipage framework (Prompt Maestro)

export interface SitemapItem {
  name: string;
  slug: string;
  keyword: string;
  intent: "Informational" | "Commercial" | "Transactional" | "Navigational";
  wordCount: number;
  description: string;
  imageUrl?: string;
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
        name: "Quiénes somos",
        slug: "/nosotros/quienes-somos",
        keyword: "quienes somos publicidad exterior",
        intent: "Informational",
        wordCount: 900,
        description: "Más de dos décadas conectando marcas con audiencias masivas en la vía pública."
      },
      {
        name: "Grupo Comunicarte",
        slug: "/nosotros/grupo-comunicarte",
        keyword: "grupo comunicarte multimedia",
        intent: "Informational",
        wordCount: 1100,
        description: "Nuestra corporación de medios y soluciones integradas de cartelería y marketing digital."
      },
      {
        name: "Cobertura",
        slug: "/nosotros/cobertura",
        keyword: "cobertura nacional publicidad exterior",
        intent: "Informational",
        wordCount: 1000,
        description: "Llegamos a los puntos estratégicos de mayor afluencia y visualizaciones de Argentina."
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
        name: "Mediakit",
        slug: "/nosotros/mediakit",
        keyword: "mediakit publicidad exterior",
        intent: "Transactional",
        wordCount: 1200,
        description: "Descarga las especificaciones técnicas, catálogos, medidas y tarifas vigentes de Grupo Comunicarte."
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
        name: "Mendoza",
        slug: "/espacios-publicitarios/mendoza",
        keyword: "publicidad exterior mendoza",
        intent: "Commercial",
        wordCount: 1800,
        description: "Soportes estratégicos en microcentro, accesos clave y zonas de alta afluencia en Mendoza."
      },
      {
        name: "Buenos Aires",
        slug: "/espacios-publicitarios/buenos-aires",
        keyword: "publicidad exterior buenos aires",
        intent: "Commercial",
        wordCount: 1700,
        description: "Cobertura premium en autopistas, corredores viales y puntos neurálgicos de Buenos Aires."
      },
      {
        name: "Cartelería",
        slug: "/espacios-publicitarios/carteleria",
        keyword: "monopostes gigantes carteleria",
        intent: "Commercial",
        wordCount: 1200,
        description: "Carteles de altura y monopostes gigantes ubicados en autopistas y avenidas clave."
      },
      {
        name: "Pantallas LED",
        slug: "/espacios-publicitarios/pantallas-led",
        keyword: "pantallas led exterior contratacion",
        intent: "Commercial",
        wordCount: 1400,
        description: "Circuitos de pantallas inteligentes digitales de gran formato con excelente definición."
      },
      {
        name: "Mobiliario Urbano",
        slug: "/espacios-publicitarios/mobiliario-urbano",
        keyword: "refugios de colectivos publicidad",
        intent: "Commercial",
        wordCount: 1100,
        description: "Publicidad en refugios peatonales y paradas de autobús de alta frecuencia visual."
      },
      {
        name: "Todos los soportes",
        slug: "/espacios-publicitarios/todos",
        keyword: "catalogo completo publicidad exterior",
        intent: "Commercial",
        wordCount: 1500,
        description: "Explora la totalidad de nuestra red de pantallas digitales y soportes físicos a nivel país."
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
        name: "Empresas",
        slug: "/soluciones/empresas",
        keyword: "publicidad exterior corporativa empresas",
        intent: "Commercial",
        wordCount: 1300,
        description: "Campañas corporativas de alto impacto para potenciar marcas líderes del sector privado."
      },
      {
        name: "Agencias",
        slug: "/soluciones/agencias",
        keyword: "planificacion ooh para agencias de publicidad",
        intent: "Commercial",
        wordCount: 1250,
        description: "Herramientas de pautado ágil, reportes automáticos y comisiones preferenciales para agencias."
      },
      {
        name: "Gobierno",
        slug: "/soluciones/gobierno",
        keyword: "campanas de comunicacion publica gobierno",
        intent: "Commercial",
        wordCount: 1100,
        description: "Difusión de servicios públicos, campañas de concientización y comunicados institucionales estatales."
      },
      {
        name: "Franquicias",
        slug: "/soluciones/franquicias",
        keyword: "publicidad local para franquicias",
        intent: "Commercial",
        wordCount: 1150,
        description: "Formatos hiperlocales optimizados para redes de tiendas físicas y franquicias nacionales."
      },
      {
        name: "Campañas Integrales",
        slug: "/soluciones/campanas-integrales",
        keyword: "campañas integrales marketing exterior",
        intent: "Commercial",
        wordCount: 1400,
        description: "Planificación estratégica que combina múltiples soportes físicos y digitales para máximo alcance."
      }
    ]
  },
  {
    name: "Soportes",
    slug: "/soportes",
    keyword: "soportes publicitarios de via publica",
    intent: "Commercial",
    wordCount: 1600,
    description: "Descubre nuestro catálogo completo de soportes fijos, pantallas LED digitales y cartelería de alta definición.",
    children: [
      {
        name: "LED Peatonal UHD",
        slug: "/soportes/led-peatonal",
        keyword: "pantalla led peatonal",
        intent: "Commercial",
        wordCount: 1100,
        description: "Módulo LED P2.5 UHD adaptado a nivel peatonal para corredores comerciales y avenidas de flujo continuo."
      },
      {
        name: "Monolito Vehicular",
        slug: "/soportes/monolito-vehicular",
        keyword: "pantalla led vehicular",
        intent: "Commercial",
        wordCount: 1200,
        description: "Módulo LED P4 Premium Outdoor diseñado para captar impacto visual en avenidas y accesos viales rápidos."
      },
      {
        name: "Pantalla Mixta Dinámica",
        slug: "/soportes/pantalla-mixta",
        keyword: "pantalla led mixta",
        intent: "Commercial",
        wordCount: 1150,
        description: "Módulo LED P3.0 Professional para intersecciones con detención semafórica y flujos cruzados."
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
    children: []
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
