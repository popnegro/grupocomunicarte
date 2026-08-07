import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DoohScreen } from "../types";
import { useCartStore } from "../stores/cartStore";
import { useCms } from "./CmsContext";
import { getScreenAvailability } from "../utils/availability";

import { ScreenCardHeader } from "./screencard/ScreenCardHeader";
import { ScreenCardBody } from "./screencard/ScreenCardBody";
import { ScreenCardFooter } from "./screencard/ScreenCardFooter";
import { ScreenDetailDialog } from "./screencard/ScreenDetailDialog";
import { getScreenLocationBenefits } from "../utils/screencard";

interface ScreenCardProps {
  screen: DoohScreen;
  onFocusOnMap?: () => void;
  isComparing?: boolean;
  onCompareToggle?: () => void;
}

export const ScreenCard = ({
  screen,
  onFocusOnMap,
  isComparing = false,
  onCompareToggle,
}: ScreenCardProps) => {
  const { cart } = useCartStore();
  const { occupancyMatrix } = useCms();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isInCart = cart.includes(screen.id);
  const availability = getScreenAvailability(screen, occupancyMatrix);
  const isReserved = availability.status === "reserved";

  const locationBenefits = useMemo(() => getScreenLocationBenefits(screen), [screen]);

  const cardClasses = [
    "group relative flex flex-col h-full bg-white border rounded-[20px] overflow-hidden transition-all duration-300 cursor-pointer",
    isReserved
      ? "border-stone-200 opacity-80 shadow-none hover:shadow-2xs"
      : isInCart
      ? "border-[#06434a] ring-1 ring-[#06434a]/10 shadow-xs hover:shadow-md hover:-translate-y-1"
      : (screen.tipo === "LeadMóvil" || screen.tipo === "Móvil")
      ? "border-amber-400 hover:border-amber-500 shadow-xs hover:shadow-md hover:-translate-y-1"
      : "border-stone-200/80 hover:border-stone-300 shadow-xs hover:shadow-md hover:-translate-y-1",
  ].join(" ");

  return (
    <>
      <motion.div layout="position" initial={{ opacity: 0, scale: 0.96, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: -15 }} transition={{ type: "spring", stiffness: 300, damping: 28, opacity: { duration: 0.25 } }} className="h-full">
        <div onClick={() => setIsModalOpen(true)} className={cardClasses}>
          <ScreenCardHeader screen={screen} isReserved={isReserved} availabilityMessage={availability.toastMessage} onFocusOnMap={onFocusOnMap} />
          <ScreenCardBody screen={screen} availability={availability} />
          <ScreenCardFooter screenId={screen.id} ctaLabel={availability.ctaLabel} isReserved={isReserved} isInCart={isInCart} isComparing={isComparing} onCompareToggle={onCompareToggle} />
        </div>
      </motion.div>

      <ScreenDetailDialog isOpen={isModalOpen} onOpenChange={setIsModalOpen} screen={screen} availability={availability} locationBenefits={locationBenefits} onFocusOnMap={onFocusOnMap} />
    </>
  );
};
