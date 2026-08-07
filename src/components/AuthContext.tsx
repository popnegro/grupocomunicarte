import React, { createContext, useContext, useState, useEffect } from "react";
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
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  setGoogleAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Configurable list of admin emails (reads from env var or defaults to main admin email)
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
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setLoading(true);
        if (currentUser) {
          setUser(currentUser);
          try {
            const idToken = await currentUser.getIdToken(true);
            setToken(idToken);
            
            // Sync with PostgreSQL
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
      },
      (error) => {
        console.error("Auth state change error:", error);
        setUser(null);
        setToken(null);
        setGoogleAccessToken(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            setGoogleAccessToken(credential.accessToken);
          }
          
          const idToken = await result.user.getIdToken(true);
          setToken(idToken);
          setUser(result.user);

          // Sync with PostgreSQL
          await safeFetchJson("/api/auth/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${idToken}`,
            },
          });
        }
      } catch (error) {
        console.error("Google redirect login failed:", error);
      } finally {
        setLoading(false);
      }
    };

    handleRedirectResult();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    await signInWithRedirect(auth, googleAuthProvider);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      setGoogleAccessToken(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Logout failed:", error);
      throw error;
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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
