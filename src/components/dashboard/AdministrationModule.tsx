import React, { useState } from "react";
import { ChangeLog, Role } from "./types";
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  Sliders, 
  UserCheck, 
  Activity,
  Sparkles,
  Lock,
  Unlock,
  AlertCircle
} from "lucide-react";

interface AdministrationModuleProps {
  logs: ChangeLog[];
  userRole: Role;
}

export const AdministrationModule: React.FC<AdministrationModuleProps> = ({
  logs,
  userRole,
}) => {
  const [showToast, setShowToast] = useState<string | null>(null);

  // Initial mockup permission configuration states
  const [perms, setPerms] = useState({
    editPrices: true,
    approveContracts: true,
    viewRevenue: true,
    editRoutes: false
  });

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleTogglePerm = (key: keyof typeof perms) => {
    if (userRole !== "admin") {
      triggerToast("Error: Solo los perfiles de Administrador pueden redefinir políticas globales de seguridad.");
      return;
    }
    setPerms((prev) => ({ ...prev, [key]: !prev[key] }));
    triggerToast(`Directiva de seguridad "${key}" actualizada.`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans space-y-8 text-left">
      
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-bold py-3 px-5 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
          Gobernanza de Seguridad
        </span>
        <h2 className="text-xl font-bold text-stone-950 font-display mt-2">
          Administración & Seguridad RBAC
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Security / RBAC Permissions panel */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Shield className="h-4.5 w-4.5 text-[#06434a]" />
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono">
              Control de Accesos Basado en Roles (RBAC)
            </h3>
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed font-normal">
            El sistema se rige por políticas estrictas de control. Estás navegando con el perfil comercial de <strong className="text-stone-800">{userRole.replace("_", " ").toUpperCase()}</strong>.
          </p>

          <div className="space-y-3.5 pt-1">
            {([
              { key: "editPrices", label: "Modificación Tarifaria Base", desc: "Permite cambiar precios semanales directos del catálogo." },
              { key: "approveContracts", label: "Aprobación de Contratos y Reservas", desc: "Autoriza la transformación de cotizaciones en pautas de emisión." },
              { key: "viewRevenue", label: "Visualización de Pronósticos de Revenue", desc: "Acceso a analíticas de margen comercial e ingresos proyectados." },
              { key: "editRoutes", label: "Planificación de Circuitos GPS LED Móvil", desc: "Permite redefinir las secuencias de parada de las unidades móviles." }
            ] as const).map((opt) => {
              const active = perms[opt.key];
              return (
                <div
                  key={opt.key}
                  onClick={() => handleTogglePerm(opt.key)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    active 
                      ? "bg-emerald-50/20 border-emerald-200" 
                      : "bg-stone-50/50 border-stone-200"
                  }`}
                >
                  <div className="text-left pr-4">
                    <span className="block text-[11px] font-bold text-stone-800">{opt.label}</span>
                    <span className="block text-[9px] text-stone-400 font-semibold mt-0.5 leading-snug">{opt.desc}</span>
                  </div>

                  <div className="shrink-0">
                    {active ? (
                      <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-2xs">
                        <Unlock className="h-3.5 w-3.5" />
                      </div>
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center border border-stone-200 shadow-2xs">
                        <Lock className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit trail Global change logs panel */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Clock className="h-4.5 w-4.5 text-[#06434a]" />
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono">
              Bitácora de Auditoría Global (Logs)
            </h3>
          </div>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div key={log.id} className="p-3 bg-stone-50 border border-stone-100 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[8px] font-bold text-stone-400 uppercase tracking-wider font-mono">
                  <span>Usuario: {log.user}</span>
                  <span>{log.date}</span>
                </div>
                <p className="text-[10px] text-stone-800 font-semibold text-left">
                  {log.action}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
