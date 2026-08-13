import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Monitor, Megaphone, CheckCircle2 } from 'lucide-react';
import { Navbar } from './Navbar';
import { BrandCarousel } from './BrandCarousel';
import { BrandLogo } from './BrandLogo';
import { SupportImage } from './SupportImage';
import { useApp } from '../context/AppContext';

const trustItems = [
  'Inventario real y actualizado',
  'Mendoza y Buenos Aires',
  'Tarifas bajo cotización',
];

const typeHighlights = [
  {
    label: 'Pantallas LED',
    description: 'Impacto digital en ubicaciones de alta circulación.',
    href: '/soportes/led',
    icon: Monitor,
  },
  {
    label: 'Soportes tradicionales',
    description: 'Formatos de vía pública para cobertura sostenida.',
    href: '/soportes/tradicional',
    icon: Megaphone,
  },
  {
    label: 'LED Móvil',
    description: 'Movilidad, activaciones y cobertura flexible.',
    href: '/soportes/led-movil',
    icon: MapPin,
  },
];

export function LandingPage() {
  const { supports, isLoading } = useApp();
  const featuredSupports = supports.filter((support) => support.status === 'available').slice(0, 6);

  return (
    <div className="min-h-screen bg-white text-[#082028]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-[#F7F9F7] border-b border-[#DCE4DF]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B9C7BF] bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#40515A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#049A41]" aria-hidden="true" />
                Publicidad exterior
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-[-0.04em] text-[#082028] sm:text-6xl lg:text-7xl">
                Tu marca, en las ubicaciones que importan.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#40515A] sm:text-lg sm:leading-8">
                Explorá soportes publicitarios reales en Mendoza y Buenos Aires, compará ubicaciones y armá tu selección para pedir una propuesta comercial.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/explorer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#049A41] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#038537] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41]"
                >
                  Explorar soportes
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/mediakit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#B9C7BF] bg-white px-5 py-3 text-sm font-extrabold text-[#082028] transition hover:border-[#049A41] hover:text-[#049A41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41]"
                >
                  Solicitar cotización
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {trustItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-bold text-[#40515A]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#049A41]" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-[#DCE4DF] bg-[#082028] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80"
                alt="Publicidad exterior y entorno urbano"
                className="h-[360px] w-full object-cover opacity-70 sm:h-[460px]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#082028] via-[#082028]/85 to-transparent p-6 sm:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#049A41]">Cobertura</p>
                    <p className="mt-1 text-2xl font-black text-white">Mendoza + Buenos Aires</p>
                  </div>
                  <BrandLogo size="sm" variant="icon" className="opacity-95" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <BrandCarousel />

        <section className="border-b border-[#DCE4DF] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#049A41]">Elegí el formato</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#082028] sm:text-4xl">
                Una cobertura para cada objetivo de campaña.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#40515A] sm:text-base">
                Navegá por formato, plaza o ubicación y encontrá rápidamente los soportes que mejor se adaptan a tu estrategia.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {typeHighlights.map(({ label, description, href, icon: Icon }) => (
                <Link
                  key={label}
                  to={href}
                  className="group rounded-2xl border border-[#DCE4DF] bg-[#F7F9F7] p-6 transition hover:-translate-y-0.5 hover:border-[#049A41] hover:bg-white hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F0E4] text-[#049A41]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-[#082028]">{label}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#40515A]">{description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-[#049A41]">
                    Explorar formato
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F7F9F7] border-b border-[#DCE4DF]">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#049A41]">Inventario destacado</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#082028] sm:text-4xl">
                  Algunas ubicaciones para empezar a explorar.
                </h2>
              </div>
              <Link to="/explorer" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#049A41]">
                Ver todo el inventario
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {isLoading ? (
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-72 animate-pulse rounded-2xl border border-[#DCE4DF] bg-white" />
                ))}
              </div>
            ) : featuredSupports.length > 0 ? (
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featuredSupports.map((support) => (
                  <Link
                    key={support.id}
                    to="/explorer"
                    className="group overflow-hidden rounded-2xl border border-[#DCE4DF] bg-white transition hover:-translate-y-0.5 hover:border-[#049A41] hover:shadow-md"
                  >
                    <div className="relative h-48 overflow-hidden bg-[#082028]">
                      <SupportImage
                        src={support.imageUrl}
                        alt={support.name}
                        supportName={support.name}
                        supportType={support.type}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#082028]">
                        {support.plaza}
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#049A41]">{support.type}</p>
                      <h3 className="mt-1 text-base font-black text-[#082028]">{support.name}</h3>
                      <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-[#40515A]">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#049A41]" aria-hidden="true" />
                        {support.address}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-[#DCE4DF] pt-4">
                        <span className="text-[10px] font-bold text-[#64748B]">{support.size}</span>
                        <span className="text-[10px] font-extrabold text-[#049A41]">Ver soporte →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-[#B9C7BF] bg-white p-8 text-center">
                <p className="text-sm font-bold text-[#40515A]">El inventario estará disponible próximamente.</p>
                <Link to="/mediakit" className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#049A41]">
                  Contactar al equipo comercial
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#082028]">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#049A41]">Siguiente paso</p>
                <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                  Encontrá tus ubicaciones, armá la selección y dejá que nuestro equipo prepare la propuesta.
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  to="/explorer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#049A41] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#038537]"
                >
                  Abrir Explorer
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/mediakit"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/10"
                >
                  Hablar con comercial
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#DCE4DF] bg-white px-6 py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between lg:px-2">
            <BrandLogo size="sm" variant="full" />
            <div className="text-center text-[11px] leading-5 text-[#64748B] md:text-right">
              <p className="font-extrabold text-[#082028]">Grupo Comunicarte S.A. © 2026</p>
              <p>Mendoza - Buenos Aires, República Argentina • Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
