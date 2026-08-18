import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { CmsProvider } from "./components/CmsContext";
import { LandingView } from "./components/LandingView";
import { DashboardView } from "./components/DashboardView";
import { LoginView } from "./components/LoginView";
import { ToastProvider } from "./components/ui/Toast";
import Inventario from "./pages/Inventario";
import { SelectionProvider } from "./context/SelectionContext";

function LoadingScreen({ message }: { message?: string }) {
  let authContext: ReturnType<typeof useAuth> | null = null;
  try { authContext = useAuth(); } catch {}
  let defaultMessage = "Verificando autenticación y configuración...";
  if (authContext?.loading) defaultMessage = "Sincronizando estado de sesión...";
  else if (authContext?.user) defaultMessage = authContext.isAdmin ? "Cargando panel de administración..." : "Cargando sesión de usuario...";
  return <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center font-sans"><div className="h-12 w-12 animate-spin rounded-full border-4 border-[#06434a] border-t-transparent" /><p className="mt-5 text-xs font-bold text-[#06434a] uppercase tracking-widest">{message || defaultMessage}</p></motion.div>;
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

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <CmsProvider>
            <SelectionProvider>
              <Routes>
                <Route path="/" element={<LandingView />} />
                <Route path="/nosotros/*" element={<LandingView />} />
                <Route path="/espacios-publicitarios/*" element={<LandingView />} />
                <Route path="/soluciones/*" element={<LandingView />} />
                <Route path="/soportes/*" element={<LandingView />} />
                <Route path="/contacto" element={<LandingView />} />
                <Route path="/inventario" element={<Inventario />} />
                <Route path="/login" element={<LoginRoute />} />
                <Route path="/dashboard/*" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </SelectionProvider>
          </CmsProvider>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
