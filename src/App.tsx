import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { CmsProvider } from "./components/CmsContext";
import { ToastProvider } from "./components/ui/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollRestoration } from "./components/ScrollRestoration";

const LandingView = React.lazy(() =>
  import("./components/LandingView").then((m) => ({ default: m.LandingView }))
);
const DashboardView = React.lazy(() =>
  import("./components/DashboardView").then((m) => ({ default: m.DashboardView }))
);
const LoginView = React.lazy(() =>
  import("./components/LoginView").then((m) => ({ default: m.LoginView }))
);

// High-Contrast Loading skeleton matching design system
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center font-sans px-6 text-center">
      <div className="w-full max-w-sm bg-white border border-stone-200 p-8 rounded-3xl space-y-6 shadow-xs animate-pulse">
        {/* Mock brand logo */}
        <div className="mx-auto h-12 w-12 rounded-2xl bg-[#06434a]/15 flex items-center justify-center text-[#06434a] font-black text-xl">
          C
        </div>
        
        {/* Mock title and sub */}
        <div className="space-y-2">
          <div className="h-4.5 w-40 bg-stone-200 rounded-md mx-auto" />
          <div className="h-3 w-56 bg-stone-150 rounded-md mx-auto" />
        </div>

        {/* Mock content blocks */}
        <div className="space-y-3 pt-2">
          <div className="h-9 w-full bg-stone-100 rounded-xl" />
          <div className="h-9 w-full bg-stone-100 rounded-xl" />
        </div>

        {/* Loader status */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#06434a] border-t-transparent" />
          <span>Sincronizando seguridad...</span>
        </div>
      </div>
    </div>
  );
}

// Protected Route Component to prevent unauthorized access
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
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
    <BrowserRouter>
      <ScrollRestoration />
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <CmsProvider>
              <React.Suspense fallback={<LoadingScreen />}>
                <Routes>
                  {/* Public Landing View */}
                  <Route path="/" element={<LandingView />} />

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

                  {/* Fallback/Public Routes to Landing */}
                  <Route path="*" element={<LandingView />} />
                </Routes>
              </React.Suspense>
            </CmsProvider>
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
