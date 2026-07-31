import React, { useState } from "react";
import { DoohScreen } from "../../types";
import { 
  TrendingUp, 
  Sparkles, 
  DollarSign, 
  Percent, 
  CheckCircle, 
  ArrowRight, 
  HelpCircle, 
  AlertCircle,
  Building,
  Target,
  FileCheck
} from "lucide-react";

interface RevenueModuleProps {
  screens: DoohScreen[];
  onUpdateScreenPrice: (id: string, price: number) => void;
}

interface Advice {
  id: string;
  tipo: "aumento" | "descuento" | "reemplazo";
  titulo: string;
  descripcion: string;
  targetScreenId: string;
  targetScreenNombre: string;
  precioSugerido: number;
  razon: string;
  aplicado: boolean;
}

export const RevenueModule: React.FC<RevenueModuleProps> = ({
  screens,
  onUpdateScreenPrice,
}) => {
  const [showToast, setShowToast] = useState<string | null>(null);

  // Initial mockup AI recommendations
  const [adviceList, setAdviceList] = useState<Advice[]>([
    {
      id: "ad-1",
      tipo: "aumento",
      titulo: "Incrementar Tarifa Premium Mendoza Centro",
      descripcion: "El soporte Sarmiento y 9 de Julio (sc-01) registra ocupación ininterrumpida del 100% las últimas 5 semanas.",
      targetScreenId: "sc-01",
      targetScreenNombre: "Sarmiento y 9 de Julio",
      precioSugerido: 102000, // 85000 * 1.20
      razon: "Alta elasticidad precio detectada por sobre-demanda corporativa.",
      aplicado: false
    },
    {
      id: "ad-2",
      tipo: "descuento",
      titulo: "Oferta Flash de Ocupación Estacional",
      descripcion: "El soporte Las Heras y Mitre (sc-03) tiene disponibilidad total libre para agosto.",
      targetScreenId: "sc-03",
      targetScreenNombre: "Las Heras y Mitre",
      precioSugerido: 60000, // 80000 -> 25% discount
      razon: "Optimización de inventario perecedero. Mejor vender con margen menor que mantener ocioso.",
      aplicado: false
    }
  ]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleApplyAdvice = (advice: Advice) => {
    onUpdateScreenPrice(advice.targetScreenId, advice.precioSugerido);
    
    setAdviceList((prev) =>
      prev.map((a) => (a.id === advice.id ? { ...a, aplicado: true } : a))
    );

    triggerToast(`¡Recomendación aplicada! Nueva tarifa para ${advice.targetScreenNombre}: $${advice.precioSugerido.toLocaleString()}`);
  };

  // Occupancy metrics per plaza
  const stats = [
    { plaza: "Mendoza", rate: 92, status: "Alta Demanda", color: "text-teal-600 bg-teal-50 border-teal-200" },
    { plaza: "Buenos Aires", rate: 85, status: "Alta Demanda", color: "text-emerald-600 bg-emerald-50 border-emerald-200" }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans space-y-8 text-left">
      
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-bold py-3 px-5 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Title */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
          Optimización de Rendimiento
        </span>
        <h2 className="text-xl font-bold text-stone-950 font-display mt-2">
          Revenue Management Inteligente
        </h2>
      </div>

      {/* Occupancy stats cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-stone-400 uppercase tracking-widest font-mono">
          Tasa de Ocupación por Plaza Comercial
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((item) => (
            <div key={item.plaza} className="bg-white border border-stone-200 rounded-2xl p-5 flex items-center justify-between shadow-2xs">
              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold text-stone-400 uppercase font-mono">Plaza {item.plaza}</span>
                <span className="text-2xl font-black text-stone-900 font-mono block">
                  {item.rate}%
                </span>
                <span className={`inline-block text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${item.color}`}>
                  {item.status}
                </span>
              </div>

              {/* simulated mini circular chart */}
              <div className="relative h-14 w-14 flex items-center justify-center">
                <svg className="absolute transform -rotate-90 w-full h-full">
                  <circle cx="28" cy="28" r="24" className="stroke-stone-100 fill-transparent" strokeWidth="4" />
                  <circle cx="28" cy="28" r="24" className="stroke-[#06434a] fill-transparent" strokeWidth="4" 
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - item.rate / 100)}`}
                  />
                </svg>
                <span className="text-[10px] font-black text-[#06434a] font-mono">{item.rate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Recommendations */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
          <h3 className="text-xs font-extrabold text-stone-700 uppercase tracking-wider font-mono">
            Recomendaciones Dinámicas de Tarifación (IA Price Advisor)
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {adviceList.map((advice) => (
            <div
              key={advice.id}
              className={`bg-white border rounded-2xl p-5 hover:border-stone-300 transition-all shadow-2xs flex flex-col justify-between space-y-4 ${
                advice.aplicado ? "opacity-60" : ""
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                    advice.tipo === "aumento"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                      : "bg-amber-50 text-amber-700 border-amber-150"
                  }`}>
                    {advice.tipo === "aumento" ? "Tarifa Premium Suggested" : "Descuento Flash Suggested"}
                  </span>

                  {advice.aplicado && (
                    <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-extrabold uppercase">
                      ✓ Aplicado
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-black text-stone-900 font-display leading-tight">
                  {advice.titulo}
                </h4>

                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {advice.descripcion}
                </p>

                <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl space-y-1">
                  <span className="block text-[8px] font-bold text-stone-400 uppercase font-mono">Diagnóstico de la IA</span>
                  <p className="text-[10px] text-stone-600 font-medium">{advice.razon}</p>
                </div>
              </div>

              {/* pricing details and actions */}
              <div className="border-t border-stone-100 pt-3.5 flex items-center justify-between text-xs font-bold text-stone-850">
                <div>
                  <span className="block text-[8px] text-stone-400 uppercase">Tarifa Sugerida</span>
                  <span className="font-mono text-sm text-[#06434a] font-black mt-0.5 block">
                    ${advice.precioSugerido.toLocaleString()} <span className="text-[10px] text-stone-400">/ sem</span>
                  </span>
                </div>

                {!advice.aplicado && (
                  <button
                    onClick={() => handleApplyAdvice(advice)}
                    className="px-4 py-2 bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase rounded-full cursor-pointer transition-colors shadow-2xs"
                  >
                    Aplicar Tarifación
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
