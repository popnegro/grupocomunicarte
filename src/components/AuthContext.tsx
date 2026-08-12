import React, { createContext, useContext, useState, useEffect } from "react";
import { safeFetchJson } from "../lib/apiClient";
import type { User, UserMetadata } from "firebase/auth";
import {
  auth,
  googleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
} from "../lib/firebase-auth";

export interface AuthContextProps {
  user: User | null;
  loading: boolean;
  token: string | null;
  googleAccessToken: string | null;
  isAdmin: boolean;
  userRole: string;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
  setGoogleAccessToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const getAdminEmails = (): string[] => {
  const envAdmins = (import.meta as any).env?.VITE_ADMIN_EMAILS || "";
  const list = envAdmins.split(",").map((e: string) => e.trim().toLowerCase()).filter(Boolean);
  if (!list.includes("grupo.comunicarte.dev@gmail.com")) {
    list.push("grupo.comunicarte.dev@gmail.com");
  }
  return list;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const adminEmails = getAdminEmails();
  const isAdmin = Boolean(user?.email && adminEmails.includes(user.email.toLowerCase()));
  const userRole = isAdmin ? "admin" : "viewer";

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const initializeAuth = async () => {
      try {
        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (cancelled) return;
          setLoading(true);
          if (currentUser) {
            setUser(currentUser);
            try {
              const idToken = await currentUser.getIdToken(true);
              if (cancelled) return;
              setToken(idToken);
              await safeFetchJson("/api/auth/sync", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${idToken}`,
                },
              });
            } catch (error) {
              console.error("Error fetching or syncing token:", error);
            }
          } else {
            setUser(null);
            setToken(null);
            setGoogleAccessToken(null);
          }
          setLoading(false);
        });

        const result = await getRedirectResult(auth);
        if (result && !cancelled) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            setGoogleAccessToken(credential.accessToken);
          }

          const idToken = await result.user.getIdToken(true);
          if (!cancelled) {
            setToken(idToken);
            setUser(result.user);
            await safeFetchJson("/api/auth/sync", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`,
              },
            });
          }
        }
      } catch (error) {
        console.error("Firebase auth initialization failed:", error);
        if (!cancelled) {
          setUser(null);
          setToken(null);
          setGoogleAccessToken(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    await signInWithRedirect(auth, googleAuthProvider);
  };

  const loginAsDemo = async () => {
    setLoading(true);
    try {
      const demoUser = {
        uid: "demo-user-123",
        email: "grupo.comunicarte.dev@gmail.com",
        displayName: "Usuario Demo",
        emailVerified: true,
        isAnonymous: false,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        } as UserMetadata,
        providerData: [],
        getIdToken: async () => "demo-token-abc-123",
        getIdTokenResult: async () => ({
          token: "demo-token-abc-123",
          claims: {},
          authTime: new Date().toISOString(),
          expirationTime: new Date(Date.now() + 3600000).toISOString(),
          issuedAtTime: new Date().toISOString(),
          signInProvider: "custom",
          signInSecondFactor: null,
        }),
        reload: async () => {},
        toJSON: () => ({}),
        providerId: "firebase",
        photoURL: null,
        phoneNumber: null,
        tenantId: null,
        refreshToken: "demo-refresh-token",
        delete: async () => { console.log("Demo user delete called"); },
      } as unknown as User;

      setUser(demoUser);
      setToken("demo-token-abc-123");
      setGoogleAccessToken("demo-google-access-token");

      await safeFetchJson("/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer demo-token-abc-123",
        },
      });
    } catch (err) {
      console.error("Demo login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (user?.uid === "demo-user-123") {
        setUser(null);
        setToken(null);
        setGoogleAccessToken(null);
        return;
      }
      await signOut(auth);
      setUser(null);
      setToken(null);
      setGoogleAccessToken(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, googleAccessToken, isAdmin, userRole, loginWithGoogle, loginAsDemo, logout, setGoogleAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
