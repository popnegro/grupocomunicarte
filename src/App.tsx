import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { CmsProvider } from "./components/CmsContext";
import { ToastProvider } from "./components/ui/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Lazy-loaded major routes to minimize the initial bundle size
const LandingView = React.lazy(() => import("./components/LandingView").then(m => ({ default: m.LandingView })));
const DashboardView = React.lazy(() => import("./components/DashboardView").then(m => ({ default: m.DashboardView })));
const LoginView = React.lazy(() => import("./components/LoginView").then(m => ({ default: m.LoginView })));

// High-Contrast Loading spinner matching design system
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center font-sans">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#06434a] border-t-transparent shadow-xs"></div>
      <p className="mt-4 text-xs font-bold text-stone-500 uppercase tracking-widest">Cargando...</p>
    </div>
  );
}

// Protected Route Component to prevent unauthorized access
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingScreen />;
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
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginView />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <CmsProvider>
              <Suspense fallback={<LoadingScreen />}>
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
              </Suspense>
            </CmsProvider>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}
