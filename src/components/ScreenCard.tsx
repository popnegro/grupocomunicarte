import React, { useState } from "react";
import { DoohScreen } from "@/types";
import { useCms } from "@/components/CmsContext";
import { motion } from "motion/react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Check,
  MapPin,
  Maximize2,
  Calendar,
  Cpu,
  Info,
  Layers,
  ArrowUpDown
} from "lucide-react";

interface ScreenCardProps {
  screen: DoohScreen;
  onFocusOnMap?: () => void;
  isComparing?: boolean;
  onCompareToggle?: () => void;
}

const CardHeaderVisual: React.FC<{
  screen: DoohScreen;
  typeStyles: { dot: string; res: string; size: string; brightness: string };
  onFocusOnMap?: () => void;
}> = ({ screen, typeStyles, onFocusOnMap }) => (
  <div className="relative">
    <img
      src={screen.imageUrl}
      alt={screen.nombre}
      className="h-48 w-full object-cover"
    />
    <div className="absolute top-2 right-2 flex gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFocusOnMap?.();
        }}
        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
      >
        <MapPin size={16} />
      </button>
    </div>
  </div>
);

const CardBodyContent: React.FC<{
  screen: DoohScreen;
  formattedImpacts: string;
  typeStyles: { dot: string; res: string; size: string; brightness: string };
}> = ({ screen, formattedImpacts, typeStyles }) => (
  <CardContent className="p-4">
    <h3 className="text-lg font-bold">{screen.nombre}</h3>
    <p className="text-sm text-gray-500">{screen.ubicacion.direccion}</p>
    <div className="mt-2 flex items-center">
      <span className={`h-2 w-2 rounded-full ${typeStyles.dot} mr-2`}></span>
      <p className="text-sm">{screen.tipo}</p>
    </div>
    <div className="mt-2 text-sm">
      <p>Impactos: {formattedImpacts}</p>
      <p>Resolución: {typeStyles.res}</p>
    </div>
  </CardContent>
);

const CardActionsFooter: React.FC<{
  isInCart: boolean;
  isComparing: boolean;
  onCompareToggle?: () => void;
  onToggleCart: () => void;
}> = ({ isInCart, isComparing, onCompareToggle, onToggleCart }) => (
  <CardFooter className="p-4 flex justify-between">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleCart();
      }}
      className={`p-2 rounded-full ${
        isInCart ? "bg-green-500 text-white" : "bg-gray-200"
      }`}
    >
      {isInCart ? <Check size={16} /> : <Plus size={16} />}
    </button>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onCompareToggle?.();
      }}
      className={`p-2 rounded-full ${
        isComparing ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      <ArrowUpDown size={16} />
    </button>
  </CardFooter>
);

const ScreenDetailModal: React.FC<{
  screen: DoohScreen;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  typeStyles: { dot: string; res: string; size: string; brightness: string };
  onFocusOnMap?: () => void;
}> = ({ screen, isOpen, onOpenChange, typeStyles, onFocusOnMap }) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogTitle>{screen.nombre}</DialogTitle>
      <DialogDescription>
        {screen.ubicacion.direccion}
      </DialogDescription>
      <div>
        <img
          src={screen.imageUrl}
          alt={screen.nombre}
          className="h-64 w-full object-cover rounded-md"
        />
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Layers size={16} />
            <span>{screen.tipo}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={16} />
            <span>{typeStyles.res}</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize2 size={16} />
            <span>{typeStyles.size}</span>
          </div>
          <div className="flex items-center gap-2">
            <Info size={16} />
            <span>Impactos: {screen.impactos}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Desde {new Date(screen.fecha_instalacion).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <button onClick={() => onFocusOnMap?.()} className="text-blue-500 hover:underline">
              Ver en mapa
            </button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);


/**
 * Componente principal de la tarjeta de pantalla.
 */
export const ScreenCard: React.FC<ScreenCardProps> = ({
  screen,
  onFocusOnMap,
  isComparing = false,
  onCompareToggle,
}) => {
  const { cart, toggleCart } = useCms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isInCart = cart.includes(screen.id);

  const typeStyles = {
    Peatonal: { dot: "bg-sky-500", res: "P2.5 High-Definition LED", size: "3.5m x 2.0m", brightness: "5,500 nits" },
    Vehicular: { dot: "bg-teal-500", res: "P4 Premium Outdoor", size: "8.0m x 3.0m", brightness: "7,500 nits" },
    Mixto: { dot: "bg-purple-500", res: "P3.0 Professional Outdoor", size: "5.0m x 3.0m", brightness: "6,500 nits" },
    LeadMóvil: { dot: "bg-amber-500", res: "Formato Móvil", size: "4.0m x 2.0m Doble Cara", brightness: "7,500 nits" },
    Móvil: { dot: "bg-amber-500", res: "Formato Móvil", size: "4.0m x 2.0m Doble Cara", brightness: "7,500 nits" },
  }[screen.tipo] || { dot: "bg-stone-500", res: "P3 Professional LED", size: "4m x 3m", brightness: "5,500 nits" };

  const formattedImpacts = screen.impactos >= 1000 ? `${(screen.impactos / 1000).toFixed(1)}k` : String(screen.impactos);

  return (
    <>
      <motion.div
        layout="position"
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -15 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 28,
          opacity: { duration: 0.25 }
        }}
        className="h-full"
      >
        <Card
          onClick={() => setIsModalOpen(true)}
          className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
            isInCart
              ? "border-[#06434a] ring-1 ring-[#06434a]/10"
              : (screen.tipo === "LeadMóvil" || screen.tipo === "Móvil")
              ? "border-amber-400 hover:border-amber-500"
              : "border-stone-200/80 hover:border-stone-300"
          }`}
        >
          <CardHeaderVisual screen={screen} typeStyles={typeStyles} onFocusOnMap={onFocusOnMap} />
          <CardBodyContent screen={screen} formattedImpacts={formattedImpacts} typeStyles={typeStyles} />
          <CardActionsFooter
            isInCart={isInCart}
            isComparing={isComparing}
            onCompareToggle={onCompareToggle}
            onToggleCart={() => toggleCart(screen.id)}
          />
        </Card>
      </motion.div>

      <ScreenDetailModal
        screen={screen}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        typeStyles={typeStyles}
        onFocusOnMap={onFocusOnMap}
      />
    </>
  );
};
