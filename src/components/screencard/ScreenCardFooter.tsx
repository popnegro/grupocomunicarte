import React from "react";
import { useCartStore } from "../../stores/cartStore";
import { Plus, Check } from "lucide-react";

interface ScreenCardFooterProps {
  screenId: string;
  ctaLabel: string;
  isReserved: boolean;
  isInCart: boolean;
  isComparing: boolean;
  onCompareToggle?: () => void;
}

export const ScreenCardFooter = React.memo(({ screenId, ctaLabel, isReserved, isInCart, isComparing, onCompareToggle }: ScreenCardFooterProps) => {
  const { toggleCart } = useCartStore();

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompareToggle?.();
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCart(screenId);
  };

  const compareButtonClasses = `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
    isComparing ? "bg-stone-50 text-[#06434a] border-[#06434a]/30" : "bg-white text-stone-500 border-stone-200 hover:text-stone-800 hover:border-stone-300"
  }`;

  const cartButtonClasses = `flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wide transition-all duration-200 cursor-pointer ${
    isInCart ? "bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200" : isReserved ? "bg-stone-800 hover:bg-stone-900 text-white shadow-xs" : "bg-[#06434a] hover:bg-[#0b5e67] text-white shadow-xs"
  }`;

  return (
    <div className="p-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
      {onCompareToggle ? (
        <button type="button" onClick={handleCompareClick} className={compareButtonClasses}>
          <div className={`h-3 w-3 rounded-md flex items-center justify-center border transition-all ${isComparing ? "bg-[#06434a] border-[#06434a]" : "border-stone-300 bg-white"}`}>
            {isComparing && <Check className="h-2 w-2 text-white stroke-[4px]" />}
          </div>
          <span>Comparar</span>
        </button>
      ) : (
        <div className="text-[9px] text-stone-400 font-bold uppercase">
          COBERTURA PREMIUM
        </div>
      )}

      <button onClick={handleCartClick} className={cartButtonClasses}>
        {isInCart ? (
          <><Check className="h-3 w-3 text-emerald-600" /><span>✓ Agregado</span></>
        ) : (
          <><Plus className="h-3 w-3" /><span>{ctaLabel}</span></>
        )}
      </button>
    </div>
  );
});
