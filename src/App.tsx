import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { CmsProvider } from "./components/CmsContext";
import { PublicSite } from "./components/PublicSite";
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
  return <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans"><div className="h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent" /><p className="mt-5 text-xs font-bold text-black uppercase tracking-widest">{message || defaultMessage}</p></motion.div>;
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

function DashboardShell() {
  const location = useLocation();
  useEffect(() => {
    document.body.classList.add("dashboard-route");
    return () => document.body.classList.remove("dashboard-route");
  }, [location.pathname]);
  return <div className="dashboard-shell"><DashboardView /></div>;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <CmsProvider>
            <SelectionProvider>
              <Routes>
                <Route path="/*" element={<PublicSite />} />
                <Route path="/inventario" element={<Inventario />} />
                <Route path="/login" element={<LoginRoute />} />
                <Route path="/dashboard/*" element={<ProtectedRoute><DashboardShell /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </SelectionProvider>
          </CmsProvider>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
