import React, { useState, useEffect } from "react";
import { User, onAuthStateChanged, signOut, GoogleAuthProvider } from "firebase/auth";
import {
  auth,
  googleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "../lib/firebase-auth-core";
import { safeFetchJson } from "../lib/apiClient";
import { AuthContext } from "./AuthContext";

const getAdminEmails = (): string[] => {
  const envAdmins = (import.meta as any).env?.VITE_ADMIN_EMAILS || "";
  const list = envAdmins.split(",").map((e: string) => e.trim().toLowerCase()).filter(Boolean);
  if (!list.includes("grupo.comunicarte.dev@gmail.com")) list.push("grupo.comunicarte.dev@gmail.com");
  return list;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const adminEmails = getAdminEmails();
  const isAdmin = Boolean(user?.email && adminEmails.includes(user.email.toLowerCase()));
  const userRole = isAdmin ? "admin" : "viewer";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          const idToken = await currentUser.getIdToken(true);
          setToken(idToken);
          await safeFetchJson("/api/auth/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
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
    }, (error) => {
      console.error("Auth state change error:", error);
      setUser(null);
      setToken(null);
      setGoogleAccessToken(null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) setGoogleAccessToken(credential.accessToken);
          const idToken = await result.user.getIdToken(true);
          setToken(idToken);
          setUser(result.user);
          await safeFetchJson("/api/auth/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
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

  const loginAsDemo = async () => {
    setLoading(true);
    try {
      const demoUser = {
        uid: "demo-user-123",
        email: "grupo.comunicarte.dev@gmail.com",
        displayName: "Usuario Demo",
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
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
      } as unknown as User;
      setUser(demoUser);
      setToken("demo-token-abc-123");
      setGoogleAccessToken("demo-google-access-token");
      await safeFetchJson("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer demo-token-abc-123" },
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
        setUser(null); setToken(null); setGoogleAccessToken(null); return;
      }
      await signOut(auth);
      setUser(null); setToken(null); setGoogleAccessToken(null);
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

export default AuthProvider;
