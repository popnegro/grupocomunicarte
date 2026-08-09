import React from "react";
import { DoohScreen } from "../types";
// Ajusta la ruta según la ubicación real del componente
import { ScreenCard } from "./ScreenCard";

interface EspaciosPublicitariosViewProps {
  allKnownScreens: DoohScreen[];
  setSelectedScreenId: (id: string | null) => void;
}

export const EspaciosPublicitariosView: React.FC<
  EspaciosPublicitariosViewProps
> = ({ allKnownScreens, setSelectedScreenId }) => {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Soportes Publicitarios en Catálogo
        </h1>

        <p className="text-muted-foreground">
          Formatos OOH y DOOH optimizados para alcance demográfico amplio.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {allKnownScreens.map((screen) => (
          <ScreenCard
            key={screen.id}
            screen={screen}
            onFocusOnMap={() => setSelectedScreenId(screen.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default EspaciosPublicitariosView;