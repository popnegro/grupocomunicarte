import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BrandCarousel } from './BrandCarousel';
import { SupportsPage } from '../../server/SupportsPage';
import { SolutionsPage } from '../../server/SolutionsPage';
import { BrandLogo } from './BrandLogo';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main>
        <section className="relative isolate overflow-hidden bg-slate-900 py-24 sm:py-32">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2830&q=80"
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-30"
          />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7C3AED]">Publicidad exterior</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Conectamos tu marca con millones de personas
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Descubrí nuestro inventario de soportes en Mendoza y Buenos Aires y encontrá las ubicaciones que mejor encajan con tu campaña.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/explorer')}
                className="rounded-md bg-[#049A41] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#038537]"
              >
                Explorar inventario <span aria-hidden="true">→</span>
              </button>
              <button
                onClick={() => navigate('/mediakit')}
                className="rounded-md bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 hover:bg-white/15"
              >
                Solicitar cotización
              </button>
            </div>
          </div>
        </section>

        <BrandCarousel />

        <section id="soportes" className="scroll-mt-16">
          <SupportsPage />
        </section>

        <section id="soluciones" className="scroll-mt-16">
          <SolutionsPage />
        </section>

        <footer className="bg-white text-slate-600 text-xs py-8 px-6 border-t border-[#DCE4DF] mt-12 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <BrandLogo size="sm" variant="full" />
            </div>
            <div className="text-center md:text-right text-[11px] text-slate-500 space-y-1">
              <p className="font-extrabold text-[#082028]">Grupo Comunicarte S.A. © 2026</p>
              <p>Mendoza - Buenos Aires, República Argentina • Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
