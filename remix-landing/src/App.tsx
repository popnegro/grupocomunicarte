import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BrandLogo } from './components/BrandLogo';
import { LandingPage } from './components/LandingPage';

const ExplorerPage = lazy(() => import('./components/ExplorerPage').then((module) => ({ default: module.ExplorerPage })));
const ContactForm = lazy(() => import('./components/ContactForm').then((module) => ({ default: module.ContactForm })));
const LoginView = lazy(() => import('./components/LoginView').then((module) => ({ default: module.LoginView })));
const DashboardShell = lazy(() => import('./components/DashboardShell').then((module) => ({ default: module.DashboardShell })));
const DashboardHome = lazy(() => import('./components/DashboardHome').then((module) => ({ default: module.DashboardHome })));
const DashboardSupportsPage = lazy(() => import('./components/DashboardSupportsPage').then((module) => ({ default: module.DashboardSupportsPage })));
const DashboardLeadsPage = lazy(() => import('./components/DashboardLeadsPage').then((module) => ({ default: module.DashboardLeadsPage })));
const DashboardClientsPage = lazy(() => import('./components/DashboardClientsPage').then((module) => ({ default: module.DashboardClientsPage })));
const DashboardMediaKitPage = lazy(() => import('./components/DashboardMediaKitPage').then((module) => ({ default: module.DashboardMediaKitPage })));
const MarketingSeoPage = lazy(() => import('./components/SeoPage').then((module) => ({ default: module.MarketingSeoPage })));
const SupportSeoPage = lazy(() => import('./components/SeoPage').then((module) => ({ default: module.SupportSeoPage })));

const PageLayout = () => (
  <>
    <Navbar />
    <main><Outlet /></main>
    <footer className="bg-white text-slate-600 text-xs py-8 px-6 border-t border-[#DCE4DF] mt-12 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3"><BrandLogo size="sm" variant="full" /></div>
        <div className="text-center md:text-right text-[11px] text-slate-500 space-y-1">
          <p className="font-extrabold text-[#082028]">Grupo Comunicarte S.A. © 2026</p>
          <p>Mendoza - Buenos Aires, República Argentina • Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </>
);

const ProtectedDashboardModule = ({ children }: { children: ReactNode }) => {
  const { user } = useApp();
  return user ? <DashboardShell>{children}</DashboardShell> : <Navigate to="/login" replace />;
};

const RouteFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center px-6">
    <div className="text-sm font-semibold text-slate-500">Cargando…</div>
  </div>
);

const LazyRoute = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<RouteFallback />}>{children}</Suspense>
);

export default function App() {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LazyRoute><LoginView /></LazyRoute>} />

        <Route path="/dashboard" element={<LazyRoute><ProtectedDashboardModule><DashboardHome /></ProtectedDashboardModule></LazyRoute>} />
        <Route path="/dashboard/soportes" element={<LazyRoute><ProtectedDashboardModule><DashboardSupportsPage /></ProtectedDashboardModule></LazyRoute>} />
        <Route path="/dashboard/inventario" element={<Navigate to="/dashboard/soportes" replace />} />
        <Route path="/dashboard/leads" element={<LazyRoute><ProtectedDashboardModule><DashboardLeadsPage /></ProtectedDashboardModule></LazyRoute>} />
        <Route path="/dashboard/clientes" element={<LazyRoute><ProtectedDashboardModule><DashboardClientsPage /></ProtectedDashboardModule></LazyRoute>} />
        <Route path="/dashboard/clients" element={<Navigate to="/dashboard/clientes" replace />} />
        <Route path="/dashboard/mediakits" element={<LazyRoute><ProtectedDashboardModule><DashboardMediaKitPage /></ProtectedDashboardModule></LazyRoute>} />

        <Route element={<PageLayout />}>
          <Route path="/nosotros" element={<LazyRoute><MarketingSeoPage kind="nosotros" /></LazyRoute>} />
          <Route path="/soluciones" element={<LazyRoute><MarketingSeoPage kind="soluciones" /></LazyRoute>} />
          <Route path="/soportes-publicitarios" element={<LazyRoute><SupportSeoPage kind="base" /></LazyRoute>} />
          <Route path="/soportes-publicitarios/pantallas-led" element={<LazyRoute><SupportSeoPage kind="led" /></LazyRoute>} />
          <Route path="/soportes-publicitarios/tradicional" element={<LazyRoute><SupportSeoPage kind="tradicional" /></LazyRoute>} />
          <Route path="/soportes-publicitarios/led-movil" element={<LazyRoute><SupportSeoPage kind="movil" /></LazyRoute>} />
          <Route path="/mediakit" element={<LazyRoute><div className="py-16 px-4 max-w-4xl mx-auto"><ContactForm /></div></LazyRoute>} />
          <Route path="/soportes" element={<Navigate to="/soportes-publicitarios" replace />} />
          <Route path="/soportes/led" element={<Navigate to="/soportes-publicitarios/pantallas-led" replace />} />
          <Route path="/soportes/tradicional" element={<Navigate to="/soportes-publicitarios/tradicional" replace />} />
          <Route path="/soportes/led-movil" element={<Navigate to="/soportes-publicitarios/led-movil" replace />} />
        </Route>

        <Route path="/explorer" element={<LazyRoute><ExplorerPage /></LazyRoute>} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </div>
  );
}
