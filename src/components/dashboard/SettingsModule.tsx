import React from "react";
import { useAuth } from "../AuthContext";
import { User, Shield, LogOut, Key, Mail, Calendar, Settings } from "lucide-react";

interface SettingsModuleProps {
  userRole: string;
  setUserRole: (role: any) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({ userRole, setUserRole }) => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador Global";
      case "comercial_dir":
        return "Director Comercial (RBAC)";
      case "comercial_ejec":
        return "Comercial Ejecutivo";
      default:
        return role;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-sans">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-stone-900 flex items-center gap-2 font-display">
          <Settings className="h-5 w-5 text-[#06434a]" />
          Configuración y Perfil
        </h2>
        <p className="text-xs text-stone-500">
          Gestiona tu perfil de usuario, revisa tu rol dentro de la organización y ajusta preferencias del sistema.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-150 p-6 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-stone-100">
          <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-150 flex items-center justify-center font-black text-xl shrink-0 uppercase shadow-2xs">
            {user?.email ? user.email.substring(0, 2) : "US"}
          </div>
          <div className="space-y-1 text-left">
            <h3 className="font-extrabold text-stone-900 text-sm">{user?.displayName || "Usuario SmartWeb"}</h3>
            <p className="text-xs text-stone-500 flex items-center gap-1.5 leading-none">
              <Mail className="h-3.5 w-3.5" />
              {user?.email}
            </p>
            <p className="text-xs text-stone-500 flex items-center gap-1.5 leading-none">
              <Shield className="h-3.5 w-3.5 text-[#06434a]" />
              Rol actual: <span className="font-bold text-[#06434a]">{getRoleBadge(userRole)}</span>
            </p>
          </div>
        </div>

        {/* Roles Selector for RBAC demonstration */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-stone-900 flex items-center gap-2 uppercase tracking-wider">
            Conmutador de Roles (Simulador de Permisos)
          </h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Como Tech Lead / Product Manager, puedes alternar de forma segura entre los perfiles autorizados de la empresa para auditar la interfaz según la matriz de accesos (RBAC).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => setUserRole("comercial_dir")}
              className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                userRole === "comercial_dir"
                  ? "border-[#06434a] bg-[#06434a]/5 text-[#06434a]"
                  : "border-stone-200 hover:bg-stone-50 text-stone-600"
              }`}
            >
              Director Comercial
            </button>
            <button
              onClick={() => setUserRole("comercial_ejec")}
              className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                userRole === "comercial_ejec"
                  ? "border-[#06434a] bg-[#06434a]/5 text-[#06434a]"
                  : "border-stone-200 hover:bg-stone-50 text-stone-600"
              }`}
            >
              Comercial Ejecutivo
            </button>
            <button
              onClick={() => setUserRole("admin")}
              className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                userRole === "admin"
                  ? "border-[#06434a] bg-[#06434a]/5 text-[#06434a]"
                  : "border-stone-200 hover:bg-stone-50 text-stone-600"
              }`}
            >
              Administrador Global
            </button>
          </div>
        </div>

        {/* Action Logout Block */}
        <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <h5 className="text-xs font-bold text-stone-900">Finalizar Sesión Activa</h5>
            <p className="text-[11px] text-stone-500">Cierra tu sesión de forma segura y destruye las credenciales locales de persistencia.</p>
          </div>
          <button
            onClick={logout}
            className="w-full sm:w-auto px-5 py-3 border border-red-200 rounded-full text-xs font-extrabold text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </div>
    </div>
  );
};
