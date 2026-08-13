import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BrandLogo } from './components/BrandLogo';
import { LandingPage } from './components/LandingPage';
import { AboutPage } from '../server/AboutPage';
import { SupportsPage } from '../server/SupportsPage';
import { SupportTypePage } from '../server/SupportTypePage';
import { SolutionsPage } from '../server/SolutionsPage';
import { ExplorerPage } from './components/ExplorerPage';
import { ContactForm } from './components/ContactForm';

// Layout con Navbar y Footer para las páginas estándar
const PageLayout = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar setRoute={(path: string) => navigate(path)} />
      <main><Outlet /></main>
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
    </>
  )
};

export default function App() {
  return (
    <div className="font-sans bg-gray-50">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Rutas con Layout (Navbar/Footer) */}
        <Route element={<PageLayout />}>
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/soportes" element={<SupportsPage />} />
          <Route path="/soportes/led" element={<SupportTypePage type="led" />} />
          <Route path="/soportes/tradicional" element={<SupportTypePage type="tradicional" />} />
          <Route path="/soportes/led-movil" element={<SupportTypePage type="led-movil" />} />
          <Route path="/soluciones" element={<SolutionsPage />} />
          <Route path="/mediakit" element={<div className="py-16 px-4"><ContactForm /></div>} />
        </Route>

        {/* Rutas de página completa sin layout estándar */}
        <Route path="/explorer" element={<ExplorerPage />} />

        {/* Fallback para 404 */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </div>
  );
}
