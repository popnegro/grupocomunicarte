// src/components/LazyAuthProvider.tsx
import React, { Suspense } from "react";
import { AuthContext, AuthContextProps } from "./AuthContext";

const AuthProvider = React.lazy(() => import("./Auth"));

const DummyAuthContext: AuthContextProps = {
  user: null,
  loading: true,
  isAdmin: false,
  logout: () => Promise.resolve(),
  loginWithGoogle: () => Promise.resolve(),
  token: null,
  googleAccessToken: null,
  userRole: "viewer",
  loginAsDemo: () => Promise.resolve(),
  setGoogleAccessToken: () => {},
};

export const LazyAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={
      <AuthContext.Provider value={DummyAuthContext}>
        {children}
      </AuthContext.Provider>
    }>
      <AuthProvider>{children}</AuthProvider>
    </Suspense>
  );
};
