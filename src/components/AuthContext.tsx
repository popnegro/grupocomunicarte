import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { User } from "firebase/auth";
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

// Helper function to dynamically import our Firebase client
const loadFirebase = async () => {
  const fb = await import("../lib/firebase");
  return {
    auth: fb.auth,
    googleAuthProvider: fb.googleAuthProvider,
    signInWithPopup: fb.signInWithPopup,
    signOut: fb.signOut,
    onAuthStateChanged: fb.onAuthStateChanged,
    GoogleAuthProvider: fb.GoogleAuthProvider,
  };
};

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
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  const location = useLocation();
  const pathname = location.pathname;
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const adminEmails = getAdminEmails();
  const isAdmin = Boolean(user?.email && adminEmails.includes(user.email.toLowerCase()));
  const userRole = isAdmin ? "admin" : "viewer";

  useEffect(() => {
    let active = true;
    const isProtectedOrLogin = pathname.startsWith("/dashboard") || pathname === "/login";

    if (isProtectedOrLogin && !firebaseLoaded) {
      setLoading(true);
      loadFirebase()
        .then(({ auth, onAuthStateChanged }) => {
          if (!active) return;
          setFirebaseLoaded(true);

          // Clear any existing listener first
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
          }

          const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
            if (!active) return;
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
          });

          unsubscribeRef.current = unsubscribe;
        })
        .catch((err) => {
          console.error("Failed to lazy load Firebase:", err);
          if (active) setLoading(false);
        });
    } else if (!isProtectedOrLogin && !firebaseLoaded) {
      // Non-protected and firebase not yet loaded -> immediately clear loading state
      setUser(null);
      setToken(null);
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [pathname, firebaseLoaded]);

  // Clean up subscription on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const { auth, googleAuthProvider, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } = await loadFirebase();
      setFirebaseLoaded(true);

      // Instantly start listening to the state changed if not yet set up
      if (!unsubscribeRef.current) {
        const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
          if (currentUser) {
            setUser(currentUser);
          } else {
            setUser(null);
          }
        });
        unsubscribeRef.current = unsubscribe;
      }

      const result = await signInWithPopup(auth, googleAuthProvider);
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

      setLoading(false);
      return result.user;
    } catch (error) {
      setLoading(false);
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { signOut, auth } = await loadFirebase();
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
