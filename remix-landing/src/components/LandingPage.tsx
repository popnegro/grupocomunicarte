import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BrandCarousel } from '../components/BrandCarousel';
import { SupportsPage } from '../../server/SupportsPage';
import { SolutionsPage } from '../../server/SolutionsPage';
import { BrandLogo } from './BrandLogo';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <Navbar setRoute={navigate} /> 

      <main>
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80"
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-30"
          />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Conectamos tu marca con millones de personas</h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                La plataforma líder en publicidad exterior de alto impacto. Descubre nuestro inventario en Mendoza y Buenos Aires y planifica tu próxima campaña.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
                <button onClick={() => navigate('/explorer')} className="hover:text-gray-200">Explorar inventario <span aria-hidden="true">→</span></button>
              </div>
            </div>
          </div>
        </div>

        <BrandCarousel />

        {/* For the demo, we embed the content of Supports and Solutions pages directly */}
        <div id="soportes">
          <SupportsPage />
        </div>

        <div id="soluciones">
          <SolutionsPage />
        </div>

        {/* Footer */}
        <footer className="bg-[#082028] text-slate-300 text-xs py-8 px-6 border-t border-[#049A41]/20 mt-12 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <BrandLogo size="sm" variant="full" />
            </div>
            <div className="text-center md:text-right text-[11px] text-slate-400 space-y-1">
              <p className="font-extrabold text-white">Grupo Comunicarte S.A. © 2026</p>
              <p>Mendoza - Buenos Aires, República Argentina • Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
