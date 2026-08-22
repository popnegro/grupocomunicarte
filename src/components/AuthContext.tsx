import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut, GoogleAuthProvider } from "firebase/auth";
import { auth, googleAuthProvider, signInWithRedirect, getRedirectResult } from "../lib/firebase";
import { safeFetchJson } from "../lib/apiClient";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  token: string | null;
  googleAccessToken: string | null;
  isAdmin: boolean;
  userRole: string;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setGoogleAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

type AuthSyncData = {
  roles?: string[];
  isAdmin?: boolean;
  tenantId?: string | null;
};

async function syncFirebaseIdentity(idToken: string): Promise<AuthSyncData> {
  const response = await safeFetchJson<AuthSyncData>("/api/auth/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok || !response.data) {
    throw new Error(response.errorDetail?.message || response.error || "No se pudo sincronizar la identidad con el servidor.");
  }

  return response.data;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = userRoles.includes("admin");
  const userRole = userRoles[0] || "viewer";

  const applyAuthenticatedUser = async (currentUser: User, accessToken?: string | null) => {
    const idToken = await currentUser.getIdToken(true);
    const syncData = await syncFirebaseIdentity(idToken);
    setUser(currentUser);
    setToken(idToken);
    setUserRoles(syncData.roles || []);
    if (accessToken) setGoogleAccessToken(accessToken);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      try {
        if (!currentUser) {
          setUser(null);
          setToken(null);
          setGoogleAccessToken(null);
          setUserRoles([]);
          return;
        }
        await applyAuthenticatedUser(currentUser);
      } catch (error) {
        console.error("Authentication/RBAC synchronization failed:", error);
        setUser(null);
        setToken(null);
        setGoogleAccessToken(null);
        setUserRoles([]);
        try { await signOut(auth); } catch {}
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result) return;
        const credential = GoogleAuthProvider.credentialFromResult(result);
        await applyAuthenticatedUser(result.user, credential?.accessToken || null);
      } catch (error) {
        console.error("Google redirect login failed:", error);
        setUser(null);
        setToken(null);
        setGoogleAccessToken(null);
        setUserRoles([]);
        try { await signOut(auth); } catch {}
      } finally {
        setLoading(false);
      }
    };

    void handleRedirectResult();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleAuthProvider);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      setGoogleAccessToken(null);
      setUserRoles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, googleAccessToken, isAdmin, userRole, loginWithGoogle, logout, setGoogleAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
