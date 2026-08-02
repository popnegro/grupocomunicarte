export interface SitemapItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  keyword: string;
  intent?: "Transactional" | "Commercial" | "Informational";
  wordCount?: number;
  imageUrl?: string;
  children?: SitemapItem[];
}

export const sitemap: SitemapItem[] = [
  {
    id: "home",
    name: "Inicio",
    slug: "/",
    description: "Página de inicio de Grupo Comunicarte, líderes en publicidad exterior y DOOH en Argentina.",
    keyword: "publicidad exterior, DOOH, pantallas LED, Mendoza, Buenos Aires, vía pública",
    intent: "Commercial",
    wordCount: 1200,
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop"
  },
  {
    id: "nosotros",
    name: "Nosotros",
    slug: "/nosotros",
    description: "Conocé la historia, misión y equipo detrás de Grupo Comunicarte. Expertos en comunicación visual.",
    keyword: "quienes somos, equipo, historia, misión, valores, publicidad, empresa",
    intent: "Informational",
    wordCount: 800,
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1740&auto=format&fit=crop"
  },
  {
    id: "servicios",
    name: "Servicios",
    slug: "/servicios",
    description: "Descubrí todos los servicios que ofrecemos: pantallas LED, cartelería, campañas 360 y más.",
    keyword: "servicios, pantallas LED, cartelería, vía pública, campañas publicitarias, marketing",
    intent: "Commercial",
    wordCount: 1000,
    children: [
      {
        id: "pantallas-led",
        name: "Pantallas LED",
        slug: "/servicios/pantallas-led",
        description: "Publicidad de alto impacto en nuestras pantallas LED de última generación.",
        keyword: "pantallas LED, publicidad digital, DOOH, gran formato, alta definición",
        intent: "Transactional",
        wordCount: 600
      },
      {
        id: "carteleria",
        name: "Cartelería",
        slug: "/servicios/carteleria",
        description: "Soluciones de cartelería tradicional y moderna para tu marca.",
        keyword: "cartelería, vía pública, gigantografías, mobiliario urbano, branding",
        intent: "Transactional",
        wordCount: 500
      },
      {
        id: "campanas-360",
        name: "Campañas 360",
        slug: "/servicios/campanas-360",
        description: "Diseñamos y ejecutamos campañas publicitarias integrales con máxima efectividad.",
        keyword: "campañas 360, marketing integral, estrategia publicitaria, medios, planificación",
        intent: "Commercial",
        wordCount: 700
      },
    ],
  },
  {
    id: "inventario",
    name: "Inventario",
    slug: "/inventario",
    description: "Explorá nuestro inventario de ubicaciones estratégicas en Mendoza y Buenos Aires.",
    keyword: "inventario, ubicaciones, pantallas disponibles, mapa, Mendoza, Buenos Aires",
    intent: "Transactional",
    wordCount: 400
  },
  {
    id: "contacto",
    name: "Contacto",
    slug: "/contacto",
    description: "Contactate con Grupo Comunicarte para solicitar un presupuesto o asesoramiento personalizado.",
    keyword: "contacto, presupuesto, consulta, atención al cliente, dirección, teléfono",
    intent: "Transactional",
    wordCount: 300
  },
  {
    id: "blog",
    name: "Blog",
    slug: "/blog",
    description: "Leé las últimas noticias y tendencias del mundo de la publicidad y el marketing digital.",
    keyword: "blog, noticias, tendencias, publicidad, marketing, artículos, DOOH",
    intent: "Informational",
    wordCount: 900
  },
];
