import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { DoohScreen } from "../types";

export interface UseInventoryResult {
  screens: DoohScreen[];
  loading: boolean;
  error: Error | null;
  success: boolean;
  refetch: () => Promise<void>;
  addScreen: (screen: DoohScreen) => Promise<void>;
  updateScreen: (id: string, updatedFields: Partial<DoohScreen>) => Promise<void>;
  deleteScreen: (id: string) => Promise<void>;
}

/**
 * Custom hook to manage the inventory (screens/soportes) from Firestore.
 * Handles loading, error, and success states gracefully.
 */
export function useInventory(): UseInventoryResult {
  const [screens, setScreens] = useState<DoohScreen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const fetchScreens = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const querySnapshot = await getDocs(collection(db, "screens"));
      const items: DoohScreen[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          nombre: data.nombre || "",
          zona: data.zona || "",
          tipo: data.tipo || "Peatonal",
          categoria: data.categoria || "Pantallas LED",
          ciudad: data.ciudad || "Mendoza",
          impactos: Number(data.impactos) || 0,
          precio: Number(data.precio) || 0,
          status: data.status || "Activo",
          lat: Number(data.lat) || 0,
          lng: Number(data.lng) || 0,
          nota: data.nota || "",
          dimensiones: data.dimensiones || "",
          brillo: data.brillo || "",
          refreshRate: data.refreshRate || "",
          formato: data.formato || "",
          cobertura: data.cobertura || "",
          video: data.video || "",
          horarios: data.horarios || "",
          ruta: data.ruta || undefined,
          reservationEndDate: data.reservationEndDate || undefined,
        });
      });

      setScreens(items);
      setSuccess(true);
    } catch (err: any) {
      console.error("[useInventory] Error fetching inventory from Firestore:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch screens on initial mount
  useEffect(() => {
    fetchScreens();
  }, [fetchScreens]);

  const addScreen = useCallback(async (screen: DoohScreen) => {
    setError(null);
    setSuccess(false);
    try {
      const docRef = doc(db, "screens", screen.id);
      await setDoc(docRef, screen);
      
      // Update local state instantly
      setScreens((prev) => {
        const index = prev.findIndex((s) => s.id === screen.id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = screen;
          return next;
        }
        return [...prev, screen];
      });
      setSuccess(true);
    } catch (err: any) {
      console.error("[useInventory] Error adding screen to Firestore:", err);
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    }
  }, []);

  const updateScreen = useCallback(async (id: string, updatedFields: Partial<DoohScreen>) => {
    setError(null);
    setSuccess(false);
    try {
      const docRef = doc(db, "screens", id);
      await updateDoc(docRef, updatedFields as any);

      // Update local state instantly
      setScreens((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
      );
      setSuccess(true);
    } catch (err: any) {
      console.error("[useInventory] Error updating screen in Firestore:", err);
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    }
  }, []);

  const deleteScreen = useCallback(async (id: string) => {
    setError(null);
    setSuccess(false);
    try {
      const docRef = doc(db, "screens", id);
      await deleteDoc(docRef);

      // Update local state instantly
      setScreens((prev) => prev.filter((s) => s.id !== id));
      setSuccess(true);
    } catch (err: any) {
      console.error("[useInventory] Error deleting screen from Firestore:", err);
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    }
  }, []);

  return {
    screens,
    loading,
    error,
    success,
    refetch: fetchScreens,
    addScreen,
    updateScreen,
    deleteScreen,
  };
}
