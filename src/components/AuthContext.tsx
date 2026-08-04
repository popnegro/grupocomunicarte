import React, { createContext, useContext, useState, useEffect } from "react";
import { User, onIdTokenChanged, signOut, GoogleAuthProvider } from "firebase/auth";
import { auth, googleAuthProvider, signInWithPopup } from "../lib/firebase.ts";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  token: string | null;
  googleAccessToken: string | null;
  loginWithGoogle: () => Promise<User>;
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
          // Get token, auto-refreshing if expired
          const idToken = await currentUser.getIdToken();
          setToken(idToken);
          
          // Sync with PostgreSQL
          await fetch("/api/auth/sync", {
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
      
      // Explicitly force a fresh, non-expired ID Token before syncing
      const idToken = await result.user.getIdToken(true);
      setToken(idToken);
      setUser(result.user);

      // Sync with PostgreSQL
      await fetch("/api/auth/sync", {
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
    <AuthContext.Provider value={{ user, loading, token, googleAccessToken, loginWithGoogle, logout, setGoogleAccessToken }}>
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
