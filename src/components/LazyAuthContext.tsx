// src/components/LazyAuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";

export interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

export const LazyAuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useLazyAuth = () => {
  const context = useContext(LazyAuthContext);
  if (!context) {
    throw new Error("useLazyAuth must be used within a LazyAuthProvider");
  }
  return context;
};

export const LazyAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authProvider, setAuthProvider] = useState<React.ComponentType<{ children: React.ReactNode }> | null>(null);

  useEffect(() => {
    // This effect will run only on the client-side, and will load the real AuthProvider
    import("./AuthContext").then((module) => {
      setAuthProvider(() => module.AuthProvider);
    });
  }, []);

  if (!authProvider) {
    // Render a loading state or null while the real provider is loading
    return null; 
  }

  const AuthProvider = authProvider;

  return <AuthProvider>{children}</AuthProvider>;
};
