import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { CmsProvider } from "./components/CmsContext";
import { LandingView } from "./components/LandingView";
import { DashboardView } from "./components/DashboardView";
import { LoginView } from "./components/LoginView";
import { ToastProvider } from "./components/ui/Toast";

// High-Contrast Animated Loading screen matching design system
function LoadingScreen({ message }: { message?: string }) {
  let authContext: ReturnType<typeof useAuth> | null = null;
  try {
    authContext = useAuth();
  } catch {
    // Safely fallback if rendered outside AuthProvider
  }

  let defaultMessage = "Verificando autenticación y configuración...";
  if (authContext) {
    if (authContext.loading) {
      defaultMessage = "Sincronizando estado de sesión...";
    } else if (authContext.user) {
      defaultMessage = authContext.isAdmin
        ? "Cargando panel de administración..."
        : "Cargando sesión de usuario...";
    }
  }

  const statusMessage = message || defaultMessage;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center font-sans"
    >
      <div className="relative flex items-center justify-center mb-6">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#06434a] border-t-transparent shadow-xs" />
        <div className="absolute inset-0 rounded-full border border-[#06434a]/10" />
      </div>
      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.25 }}
        className="text-xs font-bold text-[#06434a] uppercase tracking-widest"
      >
        {statusMessage}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.25 }}
        className="mt-2 text-[11px] text-stone-500 max-w-xs leading-relaxed"
      >
        Por favor espera un momento mientras preparamos el entorno.
      </motion.p>
    </motion.div>
  );
}

// Protected Route Component to prevent unauthorized access
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingScreen message="Verificando permisos de acceso..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
          <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600 font-extrabold text-xl">
            403
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Acceso No Autorizado</h2>
          <p className="text-xs text-stone-600 mb-6">
            Esta sección requiere privilegios de Administrador. Si eres usuario registrado, contacta al Administrador Principal para habilitar tu rol.
          </p>
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="w-full py-2.5 px-4 bg-[#06434a] hover:bg-[#0a545d] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Volver al Panel General
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Redirect if already authenticated
function LoginRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Comprobando estado de autenticación..." />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginView />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <CmsProvider>
            <Routes>
              {/* Public Landing View & sitemap inner pages */}
              <Route path="/" element={<LandingView />} />
              <Route path="/nosotros/*" element={<LandingView />} />
              <Route path="/espacios-publicitarios/*" element={<LandingView />} />
              <Route path="/soluciones/*" element={<LandingView />} />
              <Route path="/soportes/*" element={<LandingView />} />
              <Route path="/contacto" element={<LandingView />} />

              {/* Login Route */}
              <Route path="/login" element={<LoginRoute />} />

              {/* Protected Dashboard Suite */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardView />
                  </ProtectedRoute>
                }
              />

              {/* Fallback to Public Landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CmsProvider>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
