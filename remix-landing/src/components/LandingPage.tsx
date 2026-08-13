import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MapPin, Monitor, Smartphone } from 'lucide-react';
import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from './Navbar';
import { BrandCarousel } from './BrandCarousel';
import { BrandLogo } from './BrandLogo';
import { FeaturedSupportCard } from './FeaturedSupportCard';

const formats = [
  {
    title: 'Pantallas LED',
    description: 'Alta visibilidad para campañas de impacto en puntos estratégicos.',
    href: '/soportes-publicitarios/pantallas-led',
    icon: Monitor,
  },
  {
    title: 'Soportes tradicionales',
    description: 'Presencia urbana sostenida en corredores y ubicaciones de alto tránsito.',
    href: '/soportes-publicitarios/tradicional',
    icon: MapPin,
  },
  {
    title: 'LED Móvil',
    description: 'Una pantalla que lleva tu campaña a distintos puntos de la ciudad.',
    href: '/soportes-publicitarios/led-movil',
    icon: Smartphone,
  },
];

export function LandingPage() {
  const { supports, isLoading, selectedSupports, toggleSupportSelection } = useApp();

  const featuredSupports = useMemo(
    () => supports
      .filter((support) => support.featured && support.status === 'available')
      .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999))
      .slice(0, 9),
    [supports],
  );

  return (
    <div className="min-h-screen bg-white text-[#082028]">
      <Navbar />

      <main>
        <section className="border-b border-[#DCE4DF] bg-[#F7F9F7]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#049A41]">Publicidad exterior · Mendoza + Buenos Aires</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-[#082028] sm:text-5xl lg:text-6xl">Ubicaciones que hacen visible tu marca.</h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#40515A] sm:text-lg">Explorá nuestro inventario de soportes, armá tu selección y pedí una propuesta comercial sin precios publicados.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/explorer" className="inline-flex items-center gap-2 rounded-xl bg-[#049A41] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#038537]">Explorar soportes <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/mediakit" className="inline-flex items-center gap-2 rounded-xl border border-[#DCE4DF] bg-white px-5 py-3 text-sm font-extrabold text-[#082028] transition-colors hover:border-[#049A41] hover:text-[#049A41]">Solicitar cotización</Link>
              </div>
              <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                {['Sin precios públicos', 'Selección de hasta 50 soportes', 'Cobertura Mendoza + Buenos Aires'].map((item) => (
                  <div key={item} className="flex items-start gap-2 rounded-xl bg-white px-3 py-3 text-xs font-bold text-[#40515A] ring-1 ring-[#DCE4DF]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#049A41]" /><span>{item}</span></div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#DCE4DF] bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between border-b border-[#DCE4DF] pb-4">
                <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#049A41]">Inventario</p><p className="mt-1 text-sm font-extrabold text-[#082028]">Explorá por formato y plaza</p></div>
                <BrandLogo size="sm" variant="icon" />
              </div>
              <div className="mt-5 grid gap-3">
                {formats.map(({ title, description, href, icon: Icon }) => (
                  <Link key={title} to={href} className="group rounded-2xl border border-[#DCE4DF] bg-[#F7F9F7] p-4 transition-all hover:-translate-y-0.5 hover:border-[#049A41] hover:bg-white">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F0E4] text-[#049A41]"><Icon className="h-5 w-5" /></div>
                      <div className="min-w-0"><div className="flex items-center justify-between gap-3"><h2 className="text-sm font-extrabold text-[#082028]">{title}</h2><ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#049A41]" /></div><p className="mt-1 text-xs leading-5 text-[#64748B]">{description}</p></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <BrandCarousel />

        <section className="border-b border-[#DCE4DF] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#049A41]">Soportes destacados</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#082028] sm:text-3xl">Ubicaciones seleccionadas para tu próxima campaña</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">Explorá los destacados, miralos en el mapa y agregá directamente los que te interesen a tu solicitud de cotización.</p>
              </div>
              <Link to="/explorer" className="inline-flex shrink-0 items-center gap-2 text-sm font-extrabold text-[#049A41] hover:text-[#038537]">Ver todo el inventario <ArrowRight className="h-4 w-4" /></Link>
            </div>

            {isLoading ? (
              <div className="mt-8 flex gap-4 overflow-hidden pb-2">
                {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-[520px] w-[86vw] max-w-[390px] shrink-0 animate-pulse rounded-2xl bg-[#F7F9F7] sm:w-[360px]" />)}
              </div>
            ) : featuredSupports.length > 0 ? (
              <div className="mt-8">
                <div id="featured-supports-carousel" className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {featuredSupports.map((support) => (
                    <div key={support.id} className="w-[86vw] max-w-[390px] shrink-0 snap-start sm:w-[360px]">
                      <FeaturedSupportCard support={support} selected={selectedSupports.some((selected) => selected.id === support.id)} onAdd={toggleSupportSelection} />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-[#64748B] sm:hidden"><span>Deslizá para explorar</span><ArrowRight className="h-4 w-4 text-[#049A41]" aria-hidden="true" /></div>
                <div className="mt-3 flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.12em] text-[#64748B]">{featuredSupports.length} destacados · selección comercial directa</div>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-[#DCE4DF] bg-[#F7F9F7] p-8 text-center"><p className="text-sm font-extrabold text-[#082028]">No hay soportes destacados publicados.</p><p className="mt-1 text-xs text-[#64748B]">El equipo puede seleccionar y ordenar destacados desde el Dashboard.</p></div>
            )}
          </div>
        </section>

        <section className="bg-[#082028] text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-18">
            <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8FE3B1]">Siguiente paso</p><h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Armá tu selección y pedí una propuesta comercial.</h2><p className="mt-3 text-sm leading-6 text-slate-300">Sin tarifas publicadas. Elegí las ubicaciones que te interesan y nuestro equipo comercial prepara la cotización.</p></div>
            <div className="flex flex-wrap gap-3"><Link to="/explorer" className="inline-flex items-center gap-2 rounded-xl bg-[#049A41] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#038537]">Explorar inventario <ArrowRight className="h-4 w-4" /></Link><Link to="/mediakit" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-extrabold text-white hover:bg-white/15">Solicitar cotización</Link></div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#DCE4DF] bg-white px-4 py-8 text-xs text-slate-600 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row"><BrandLogo size="sm" variant="full" /><div className="text-center md:text-right text-[11px] text-slate-500"><p className="font-extrabold text-[#082028]">Grupo Comunicarte S.A. © 2026</p><p className="mt-1">Mendoza - Buenos Aires, República Argentina · Todos los derechos reservados.</p></div></div>
      </footer>
    </div>
  );
}
