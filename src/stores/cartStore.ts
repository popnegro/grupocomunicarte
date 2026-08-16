import { create } from "zustand";
import { persist } from "zustand/middleware";

const MIN_WEEKS = 1;
const MAX_WEEKS = 8;

const normalizeWeeks = (weeks: number): number => {
  if (!Number.isFinite(weeks)) return MIN_WEEKS;
  return Math.min(MAX_WEEKS, Math.max(MIN_WEEKS, Math.floor(weeks)));
};

interface CartState {
  cart: string[];
  weeks: number;
  toggleCart: (id: string) => void;
  clearCart: () => void;
  setWeeks: (weeks: number) => void;
}

const getInitialCart = (): string[] => {
  if (typeof window === "undefined") return [];

  try {
    const current = window.localStorage.getItem("smartweb-cart-storage");
    if (current) return [];

    const legacy = window.localStorage.getItem("smartweb_dooh_cart");
    if (!legacy) return [];

    const parsed = JSON.parse(legacy);
    const cart = Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];

    // One-time migration from the legacy CmsContext cart.
    window.localStorage.removeItem("smartweb_dooh_cart");
    return cart;
  } catch {
    return [];
  }
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: getInitialCart(),
      weeks: 4,
      toggleCart: (id) =>
        set((state) => ({
          cart: state.cart.includes(id)
            ? state.cart.filter((itemId) => itemId !== id)
            : [...state.cart, id],
        })),
      clearCart: () => set({ cart: [], weeks: MIN_WEEKS }),
      setWeeks: (weeks) => set({ weeks: normalizeWeeks(weeks) }),
    }),
    {
      name: "smartweb-cart-storage",
      partialize: (state) => ({ cart: state.cart, weeks: state.weeks }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<CartState> | undefined;
        return {
          ...currentState,
          cart: Array.isArray(persisted?.cart)
            ? persisted.cart.filter((id): id is string => typeof id === "string")
            : currentState.cart,
          weeks: normalizeWeeks(Number(persisted?.weeks ?? currentState.weeks)),
        };
      },
    }
  )
);
