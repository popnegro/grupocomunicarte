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
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setGoogleAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const DASHBOARD_ROLES = ["admin", "comercial_dir", "comercial_exec", "ops", "viewer"] as const;
type DashboardRole = (typeof DASHBOARD_ROLES)[number];

const getDashboardRole = (claims: Record<string, unknown>): DashboardRole => {
  const role = typeof claims.role === "string" ? claims.role : "";
  return (DASHBOARD_ROLES as readonly string[]).includes(role) ? role as DashboardRole : "viewer";
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<DashboardRole>("viewer");

  const isAdmin = userRole === "admin";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setLoading(true);
        if (currentUser) {
          setUser(currentUser);
          try {
            const tokenResult = await currentUser.getIdTokenResult();
            const idToken = tokenResult.token;
            setToken(idToken);
            setUserRole(getDashboardRole(tokenResult.claims));
            
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
          setUserRole("viewer");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setUser(null);
        setToken(null);
        setGoogleAccessToken(null);
        setUserRole("viewer");
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
          
          const tokenResult = await result.user.getIdTokenResult();
          const idToken = tokenResult.token;
          setToken(idToken);
          setUser(result.user);
          setUserRole(getDashboardRole(tokenResult.claims));

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
      setUserRole("viewer");
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
