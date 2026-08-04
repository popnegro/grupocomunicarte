import React, { createContext, useContext, useState, useEffect } from "react";
import { User, onIdTokenChanged, signOut, GoogleAuthProvider } from "firebase/auth";
import { auth, googleAuthProvider, signInWithPopup } from "../lib/firebase.ts";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  token: string | null;
  googleAccessToken: string | null;
  loginWithGoogle: () => Promise<User>;
  loginAsDemoUser: () => void;
  logout: () => Promise<void>;
  setGoogleAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for sign-in, sign-out, and auto background token refreshes
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);
          
          await fetch("/api/auth/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${idToken}`,
            },
          }).catch(() => {});
        } catch (error) {
          console.error("Error fetching or syncing token:", error);
        }
      } else {
        // If not a demo user, reset
        if (user && (user as any).isDemo) {
          setLoading(false);
          return;
        }
        setUser(null);
        setToken(null);
        setGoogleAccessToken(null);
      }
      setLoading(false);
    });

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
      
      const idToken = await result.user.getIdToken(true);
      setToken(idToken);
      setUser(result.user);

      await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
      }).catch(() => {});

      setLoading(false);
      return result.user;
    } catch (error: any) {
      setLoading(false);
      console.warn("Google login failed:", error?.code || error?.message || error);
      throw error;
    }
  };

  const loginAsDemoUser = () => {
    const mockDemoUser: any = {
      uid: "demo-admin-999",
      displayName: "Administrador Comercial (Demo)",
      email: "admin@grupocomunicarte.com",
      photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      isDemo: true,
      getIdToken: async () => "demo-token-12345",
    };
    setUser(mockDemoUser);
    setToken("demo-token-12345");
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
      setUser(null);
      setToken(null);
      setGoogleAccessToken(null);
      setLoading(false);
    } catch (error) {
      setUser(null);
      setToken(null);
      setGoogleAccessToken(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, googleAccessToken, loginWithGoogle, loginAsDemoUser, logout, setGoogleAccessToken }}>
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
