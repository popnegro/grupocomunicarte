import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BrandLogo } from './components/BrandLogo';
import { LandingPage } from './components/LandingPage';
import { ExplorerPage } from './components/ExplorerPage';
import { ContactForm } from './components/ContactForm';
import { MarketingSeoPage, SupportSeoPage } from './components/SeoPage';

const PageLayout = () => (
  <>
    <Navbar />
    <main><Outlet /></main>
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
  </>
);

export default function App() {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<PageLayout />}>
          <Route path="/nosotros" element={<MarketingSeoPage kind="nosotros" />} />
          <Route path="/soluciones" element={<MarketingSeoPage kind="soluciones" />} />
          <Route path="/soportes-publicitarios" element={<SupportSeoPage kind="base" />} />
          <Route path="/soportes-publicitarios/pantallas-led" element={<SupportSeoPage kind="led" />} />
          <Route path="/soportes-publicitarios/tradicional" element={<SupportSeoPage kind="tradicional" />} />
          <Route path="/soportes-publicitarios/led-movil" element={<SupportSeoPage kind="movil" />} />
          <Route path="/mediakit" element={<div className="py-16 px-4 max-w-4xl mx-auto"><ContactForm /></div>} />

          <Route path="/soportes" element={<Navigate to="/soportes-publicitarios" replace />} />
          <Route path="/soportes/led" element={<Navigate to="/soportes-publicitarios/pantallas-led" replace />} />
          <Route path="/soportes/tradicional" element={<Navigate to="/soportes-publicitarios/tradicional" replace />} />
          <Route path="/soportes/led-movil" element={<Navigate to="/soportes-publicitarios/led-movil" replace />} />
        </Route>

        <Route path="/explorer" element={<ExplorerPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </div>
  );
}
