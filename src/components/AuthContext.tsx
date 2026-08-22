import React, { createContext, useContext, useState, useEffect } from "react";
import { User, onIdTokenChanged, signOut, GoogleAuthProvider } from "firebase/auth";
import { auth, googleAuthProvider, signInWithPopup } from "../lib/firebase";
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

interface AuthSyncResponse {
  success: boolean;
  data?: {
    uid: string;
    role: string;
  };
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const DASHBOARD_ROLES = ["admin", "comercial_dir", "comercial_exec", "ops", "viewer"] as const;
type DashboardRole = (typeof DASHBOARD_ROLES)[number];

const getDashboardRole = (role: unknown): DashboardRole => {
  return typeof role === "string" && (DASHBOARD_ROLES as readonly string[]).includes(role)
    ? role as DashboardRole
    : "viewer";
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<DashboardRole>("viewer");

  const isAdmin = userRole === "admin";

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(
      auth,
      async (currentUser) => {
        setLoading(true);

        if (!currentUser) {
          setUser(null);
          setToken(null);
          setGoogleAccessToken(null);
          setUserRole("viewer");
          setLoading(false);
          return;
        }

        setUser(currentUser);

        try {
          const tokenResult = await currentUser.getIdTokenResult();
          const idToken = tokenResult.token;
          setToken(idToken);

          // Server RBAC is authoritative for the dashboard role. Firebase
          // token claims remain useful for identity, but never override the
          // role stored in PostgreSQL.
          const syncResponse = await safeFetchJson<AuthSyncResponse>("/api/auth/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${idToken}`,
            },
          });

          if (syncResponse.ok && syncResponse.data?.data?.role) {
            setUserRole(getDashboardRole(syncResponse.data.data.role));
          } else {
            // Fail closed if authoritative RBAC cannot be obtained.
            setUserRole("viewer");
          }
        } catch (error) {
          console.error("Error fetching or syncing authentication state:", error);
          setToken(null);
          setUserRole("viewer");
        } finally {
          setLoading(false);
        }
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

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setGoogleAccessToken(credential.accessToken);
      }
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
