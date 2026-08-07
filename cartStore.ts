import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  cart: string[];
  weeks: number;
  toggleCart: (id: string) => void;
  clearCart: () => void;
  setWeeks: (weeks: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      weeks: 4,
      toggleCart: (id) =>
        set((state) => ({
          cart: state.cart.includes(id)
            ? state.cart.filter((itemId) => itemId !== id)
            : [...state.cart, id],
        })),
      clearCart: () => set({ cart: [], weeks: 1 }),
      setWeeks: (weeks) => set({ weeks }),
    }),
    { name: "smartweb-cart-storage" } // Nombre para persistir en localStorage
  )
);