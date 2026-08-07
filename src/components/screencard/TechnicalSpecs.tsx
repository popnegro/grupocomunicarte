import React from "react";
import { Cpu } from "lucide-react";
import { DoohScreen } from "../../types";

interface TechnicalSpecsProps {
  screen: DoohScreen;
}

export const TechnicalSpecs = React.memo(({ screen }: TechnicalSpecsProps) => {
  const specs = [
    screen.dimensiones && { label: "Dimensiones Físicas", value: screen.dimensiones },
    screen.tipo && { label: "Tipo / Cobertura", value: `${screen.tipo}${screen.cobertura ? ` · ${screen.cobertura}` : ""}` },
    screen.brillo && { label: "Pico de Brillo", value: screen.brillo },
    screen.formato && { label: "Soporte Multimedia", value: screen.formato },
    { label: "Frecuencia de Loop", value: "Spot de 15s en rotación constante" },
  ].filter(Boolean) as { label: string; value: string }[];

  if (specs.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-150 pb-1.5 font-display">
        <Cpu className="h-4 w-4 text-[#06434a]" />
        Especificaciones Técnicas
      </h3>
      <div className="grid grid-cols-2 gap-3.5 text-xs">
        {specs.map((spec) => (
          <div key={spec.label} className="space-y-0.5">
            <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">
              {spec.label}
            </span>
            <span className="font-semibold text-stone-800 block">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
