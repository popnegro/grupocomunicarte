import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MapPin, Monitor, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SupportTypePage } from '../../server/SupportTypePage';

const SITE_ORIGIN = 'https://grupocomunicarte.vercel.app';

type SeoMeta = {
  title: string;
  description: string;
  path: string;
};

function useSeoMeta({ title, description, path }: SeoMeta) {
  useEffect(() => {
    document.title = title;
    const canonicalHref = `${SITE_ORIGIN}${path}`;

    const upsertMeta = (name: string, content: string) => {
      let node = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!node) {
        node = document.createElement('meta');
        node.name = name;
        document.head.appendChild(node);
      }
      node.content = content;
    };

    upsertMeta('description', description);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalHref;

    return () => {
      document.title = 'Grupo Comunicarte';
    };
  }, [description, path, title]);
}

const marketingPages = {
  nosotros: {
    title: 'Nosotros | Grupo Comunicarte',
    description: 'Conocé Grupo Comunicarte, empresa de publicidad exterior con cobertura en Mendoza y Buenos Aires.',
    path: '/nosotros',
    eyebrow: 'Grupo Comunicarte',
    heading: 'Publicidad exterior con cobertura real y mirada comercial.',
    intro: 'Conectamos marcas con audiencias a través de soportes publicitarios ubicados en corredores y puntos estratégicos de Mendoza y Buenos Aires.',
    sections: [
      ['Experiencia y cobertura', 'Trabajamos con un inventario que combina pantallas LED, soportes tradicionales y soluciones LED móvil para resolver campañas de distintas escalas y objetivos.'],
      ['Planificación orientada a resultados', 'Nuestro enfoque comercial parte de la ubicación, el formato, el período y la disponibilidad para construir propuestas que puedan convertirse en campañas concretas.'],
      ['Una experiencia digital más simple', 'Nuestro explorador permite descubrir ubicaciones, revisar sus características y armar una selección antes de solicitar una cotización al equipo comercial.'],
    ],
  },
  soluciones: {
    title: 'Soluciones de publicidad exterior | Grupo Comunicarte',
    description: 'Soluciones de publicidad exterior para campañas de marca, cobertura urbana y comunicación de alto impacto en Mendoza y Buenos Aires.',
    path: '/soluciones',
    eyebrow: 'Soluciones',
    heading: 'Soluciones de publicidad exterior para distintas necesidades de campaña.',
    intro: 'Combinamos formatos, ubicaciones y cobertura para ayudarte a construir una presencia urbana consistente, medible y alineada con los objetivos de tu marca.',
    sections: [
      ['Cobertura urbana', 'Elegí ubicaciones estratégicas según plaza, circulación y tipo de soporte para construir campañas con presencia sostenida.'],
      ['Campañas dinámicas', 'Las pantallas LED permiten trabajar piezas audiovisuales y mensajes cambiantes para generar mayor variedad creativa en espacios de alta visibilidad.'],
      ['Movilidad y activación', 'LED Móvil amplía la capacidad de llevar una campaña a distintos recorridos, eventos, zonas comerciales y puntos de interés.'],
    ],
  },
} as const;

export function MarketingSeoPage({ kind }: { kind: keyof typeof marketingPages }) {
  const page = marketingPages[kind];
  useSeoMeta(page);

  return (
    <div className="bg-white text-[#082028]">
      <section className="border-b border-[#DCE4DF] bg-[#F7F9F7]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <nav className="text-xs font-semibold text-[#64748B]" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#049A41]">Inicio</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>{kind === 'nosotros' ? 'Nosotros' : 'Soluciones'}</span>
          </nav>
          <div className="mt-8 max-w-4xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#049A41]">{page.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#082028] sm:text-5xl lg:text-6xl">{page.heading}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#40515A] sm:text-lg">{page.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/explorer" className="inline-flex items-center gap-2 rounded-xl bg-[#049A41] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#038537]">Explorar ubicaciones <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/mediakit" className="inline-flex items-center gap-2 rounded-xl border border-[#DCE4DF] bg-white px-5 py-3 text-sm font-extrabold text-[#082028] hover:border-[#049A41] hover:text-[#049A41]">Solicitar cotización</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8 lg:py-20">
        {page.sections.map(([heading, body]) => (
          <article key={heading} className="rounded-2xl border border-[#DCE4DF] bg-white p-6 shadow-sm">
            <CheckCircle2 className="h-5 w-5 text-[#049A41]" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-extrabold text-[#082028]">{heading}</h2>
            <p className="mt-3 text-sm leading-6 text-[#64748B]">{body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

const supportSeo = {
  base: {
    title: 'Soportes publicitarios en Mendoza y Buenos Aires | Grupo Comunicarte',
    description: 'Explorá soportes publicitarios, pantallas LED, soportes tradicionales y LED móvil con cobertura en Mendoza y Buenos Aires.',
    path: '/soportes-publicitarios',
    heading: 'Soportes publicitarios en Mendoza y Buenos Aires',
    intro: 'Descubrí formatos de publicidad exterior, compará ubicaciones y armá una selección para solicitar una propuesta comercial.',
  },
  led: {
    title: 'Pantallas LED publicitarias | Grupo Comunicarte',
    description: 'Pantallas LED publicitarias en Mendoza y Buenos Aires para campañas dinámicas y de alta visibilidad.',
    path: '/soportes-publicitarios/pantallas-led',
    heading: 'Pantallas LED publicitarias en Mendoza y Buenos Aires',
    intro: 'Un formato dinámico para campañas que necesitan visibilidad, frecuencia y capacidad de actualizar mensajes en ubicaciones estratégicas.',
  },
  tradicional: {
    title: 'Soportes tradicionales publicitarios | Grupo Comunicarte',
    description: 'Soportes tradicionales de publicidad exterior y cartelería de gran formato en Mendoza y Buenos Aires.',
    path: '/soportes-publicitarios/tradicional',
    heading: 'Soportes tradicionales de publicidad exterior',
    intro: 'Formatos de gran presencia urbana para campañas que buscan continuidad, cobertura y reconocimiento de marca.',
  },
  movil: {
    title: 'LED Móvil publicitario | Grupo Comunicarte',
    description: 'LED Móvil para campañas publicitarias itinerantes en Mendoza y Buenos Aires.',
    path: '/soportes-publicitarios/led-movil',
    heading: 'LED Móvil para campañas itinerantes',
    intro: 'Una solución flexible para llevar el mensaje de tu marca a distintos recorridos, eventos, zonas comerciales y puntos de interés.',
  },
} as const;

type SupportSeoKind = keyof typeof supportSeo;

export function SupportSeoPage({ kind }: { kind: SupportSeoKind }) {
  const page = supportSeo[kind];
  useSeoMeta(page);
  const { supports, isLoading } = useApp();

  if (kind !== 'base') {
    const mapping = { led: 'led', tradicional: 'tradicional', movil: 'led-movil' } as const;
    return (
      <div className="bg-white">
        <section className="border-b border-[#DCE4DF] bg-[#F7F9F7]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <nav className="text-xs font-semibold text-[#64748B]" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-[#049A41]">Inicio</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <Link to="/soportes-publicitarios" className="hover:text-[#049A41]">Soportes publicitarios</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span>{page.heading}</span>
            </nav>
            <div className="mt-8 max-w-4xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#049A41]">Soportes publicitarios</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-[#082028] sm:text-5xl">{page.heading}</h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#40515A] sm:text-lg">{page.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/explorer" state={{ filters: { type: kind === 'led' ? 'Pantallas LED' : kind === 'tradicional' ? 'Soportes Tradicionales' : 'LED Móvil' } }} className="inline-flex items-center gap-2 rounded-xl bg-[#049A41] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#038537]">Explorar ubicaciones <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/mediakit" className="inline-flex items-center gap-2 rounded-xl border border-[#DCE4DF] bg-white px-5 py-3 text-sm font-extrabold text-[#082028] hover:border-[#049A41] hover:text-[#049A41]">Solicitar cotización</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              ['Qué ofrece este formato', 'Conocé sus usos, alcance y características para entender cuándo conviene incorporarlo a una campaña.'],
              ['Cómo se cotiza', 'La tarifa se define según ubicación, período, formato y disponibilidad. El equipo comercial prepara la propuesta a medida.'],
              ['Dónde encontrarlo', 'Usá el explorador para localizar soportes disponibles y revisar sus fichas antes de agregarlos a tu selección.'],
            ].map(([heading, body]) => (
              <article key={heading} className="rounded-2xl border border-[#DCE4DF] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-extrabold text-[#082028]">{heading}</h2>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#DCE4DF] bg-[#F7F9F7]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-black tracking-tight text-[#082028]">Ubicaciones disponibles para explorar</h2>
              <p className="mt-3 text-sm leading-6 text-[#64748B]">Encontrá soportes de esta categoría en el inventario actual y revisá su ficha antes de solicitar una propuesta.</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(isLoading ? [] : supports.filter((support) => support.type === (mapping[kind])) .slice(0, 6)).map((support) => (
                <Link key={support.id} to="/explorer" className="rounded-2xl border border-[#DCE4DF] bg-white p-5 hover:border-[#049A41]">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#049A41]">{support.plaza}</p>
                  <h3 className="mt-1 text-sm font-extrabold text-[#082028]">{support.name}</h3>
                  <p className="mt-2 text-xs text-[#64748B]">{support.address}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="sr-only">
          <SupportTypePage type={mapping[kind]} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <section className="border-b border-[#DCE4DF] bg-[#F7F9F7]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <nav className="text-xs font-semibold text-[#64748B]" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#049A41]">Inicio</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>Soportes publicitarios</span>
          </nav>
          <div className="mt-8 max-w-4xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#049A41]">Publicidad exterior</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#082028] sm:text-5xl lg:text-6xl">{page.heading}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#40515A] sm:text-lg">{page.intro}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['Pantallas LED', 'Campañas dinámicas y de alta visibilidad.', '/soportes-publicitarios/pantallas-led', Monitor],
            ['Soportes tradicionales', 'Presencia urbana sostenida y gran formato.', '/soportes-publicitarios/tradicional', MapPin],
            ['LED Móvil', 'Movilidad para activaciones y recorridos.', '/soportes-publicitarios/led-movil', Smartphone],
          ].map(([heading, body, href, Icon]) => {
            const IconComponent = Icon as typeof Monitor;
            return (
              <Link key={heading as string} to={href as string} className="group rounded-2xl border border-[#DCE4DF] bg-white p-6 shadow-sm hover:-translate-y-0.5 hover:border-[#049A41]">
                <IconComponent className="h-6 w-6 text-[#049A41]" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-extrabold text-[#082028]">{heading}</h2>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">{body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#049A41]">Conocer formato <ArrowRight className="h-4 w-4" /></span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
