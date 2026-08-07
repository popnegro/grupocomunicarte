import { create } from "zustand";
import { DoohScreen, Lead } from "@/src/types";
import { apiClient } from "@/src/lib/apiClient";

interface CmsState {
  screens: DoohScreen[];
  isLoading: boolean;
  fetchPublicScreens: () => Promise<void>;
  addLead: (leadData: Omit<Lead, "id" | "date">) => Promise<Lead | null>;
}

export const useCmsStore = create<CmsState>((set) => ({
  screens: [],
  isLoading: false,
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