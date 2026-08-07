import { create } from "zustand";
import { DoohScreen, Lead } from "@/types";
import { apiClient } from "@/lib/apiClient";

interface CmsState {
  screens: DoohScreen[];
  isLoading: boolean;
  fetchPublicScreens: () => Promise<void>;
  addLead: (leadData: Omit<Lead, "id" | "date">) => Promise<Lead | null>;
  occupancyMatrix: Record<string, string[]>;
  updateOccupancy: (screenId: string, weekIndex: number, newStatus: string) => void;
}

export const useCmsStore = create<CmsState>((set) => ({
  screens: [],
  isLoading: false,
  occupancyMatrix: {
    // Mock initial data
    "sc-01": ["campaign", "available", "maintenance", "available"],
    "sc-02": ["available", "reserved", "available", "available"],
    "sc-03": ["available", "available", "available", "available"],
    "sc-04": ["reserved", "reserved", "available", "maintenance"],
  },
  updateOccupancy: (screenId, weekIndex, newStatus) =>
    set((state) => {
      const newMatrix = { ...state.occupancyMatrix };
      if (!newMatrix[screenId]) {
        newMatrix[screenId] = ["available", "available", "available", "available"];
      }
      newMatrix[screenId][weekIndex] = newStatus;
      return { occupancyMatrix: newMatrix };
    }),
  fetchPublicScreens: async () => {
    set({ isLoading: true });
    const res = await apiClient.get<{ success: boolean; data: DoohScreen[] }>("/api/public/screens");
    if (res.ok && res.data?.success) {
      set({ screens: res.data.data });
    }
    set({ isLoading: false });
  },
  addLead: async (leadData) => {
    set({ isLoading: true });
    const res = await apiClient.post<{ success: boolean; data: Lead }>("/api/leads", leadData);
    set({ isLoading: false });
    if (res.ok && res.data?.success) {
      // Opcional: se podría añadir a un estado de `leads` si fuera necesario.
      return res.data.data;
    }
    return null;
  },
}));