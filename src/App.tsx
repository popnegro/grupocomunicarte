import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { CmsProvider } from "./components/CmsContext";
import { LandingView } from "./components/LandingView";
import { DashboardView } from "./components/DashboardView";
import { LoginView } from "./components/LoginView";
import MediaKitBuilderView from "./components/MediaKitBuilderView.tsx"; // Import the new view
import { ToastProvider } from "./components/ui/Toast";

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
    <AuthProvider>
      <ToastProvider>
        <CmsProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Landing View */}
              <Route path="/" element={<LandingView />} />

              {/* Login Route */}
              <Route path="/login" element={<LoginRoute />} />

              {/* Protected Media Kit Builder */}
              <Route
                path="/mediakit-builder/:id"
                element={
                  <ProtectedRoute>
                    <MediaKitBuilderView />
                  </ProtectedRoute>
                }
              />

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
          </BrowserRouter>
        </CmsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
