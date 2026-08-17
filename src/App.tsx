import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { LazyAuthProvider } from "./components/LazyAuthProvider";
import { useAuth } from "./components/AuthContext";
import { CmsProvider } from "./components/CmsContext";
import { DashboardView } from "./components/DashboardView";
import { LoginView } from "./components/LoginView";
import { ToastProvider } from "./components/ui/Toast";
import { Layout } from "./components/layout/Layout";
import { PageTransition } from "./components/layout/PageTransition";
import Home from "./pages/Home";
import Inventario from "./pages/Inventario";
import Soportes from "./pages/Soportes";
import Nosotros from "./pages/Nosotros";
import { SelectionProvider } from "./context/SelectionContext";

function LoadingScreen({ message }: { message?: string }) {
  const authContext = (() => { try { return useAuth(); } catch { return null; } })();
  let defaultMessage = "Verificando autenticación y configuración...";
  if (authContext?.loading) defaultMessage = "Sincronizando estado de sesión...";
  else if (authContext?.user) defaultMessage = authContext.isAdmin ? "Cargando panel de administración..." : "Cargando sesión de usuario...";
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent" />
      <p className="mt-5 text-xs font-bold text-gray-900 uppercase tracking-widest">{message || defaultMessage}</p>
    </motion.div>
  );
}

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <LoadingScreen message="Verificando permisos de acceso..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function LoginRoute() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen message="Comprobando estado de autenticación..." />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <LoginView />;
}

function PublicRoutes() {
  const location = useLocation();
  return (
    <Layout>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/soportes" element={<PageTransition><Soportes /></PageTransition>} />
        <Route path="/nosotros" element={<PageTransition><Nosotros /></PageTransition>} />
        <Route path="/inventario" element={<PageTransition><Inventario /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function AppRoutes() {
  const location = useLocation();
  if (location.pathname === "/login") return <LoginRoute />;
  if (location.pathname.startsWith("/dashboard")) {
    return <Routes location={location}><Route path="/dashboard/*" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} /></Routes>;
  }
  return <PublicRoutes />;
}

export default function App() {
  return (
    <LazyAuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <CmsProvider>
            <SelectionProvider>
              <AppRoutes />
            </SelectionProvider>
          </CmsProvider>
        </BrowserRouter>
      </ToastProvider>
    </LazyAuthProvider>
  );
}
