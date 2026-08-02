import React from "react";
import { Role } from "./types";
import { Shield, Sparkles, User, Bell, ChevronDown, Menu, ChevronLeft, Home } from "lucide-react";
import { useCms } from "../CmsContext";

interface DashboardHeaderProps {
  userRole: Role;
  setUserRole: (role: Role) => void;
  title: string;
  description: string;
  onToggleMobileSidebar?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userRole,
  setUserRole,
  title,
  description,
  onToggleMobileSidebar,
}) => {
  const { setActiveView } = useCms();

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case "admin":
        return { label: "Administrador", color: "bg-red-500/10 text-red-700 border-red-500/20" };
      case "comercial_dir":
        return { label: "Dir. Comercial", color: "bg-teal-500/10 text-teal-700 border-teal-500/20" };
      case "comercial_exec":
        return { label: "Ejec. Comercial", color: "bg-blue-500/10 text-blue-700 border-blue-500/20" };
      case "ops":
        return { label: "Operaciones", color: "bg-amber-500/10 text-amber-700 border-amber-500/20" };
      case "viewer":
        return { label: "Consulta", color: "bg-stone-500/10 text-stone-700 border-stone-500/20" };
    }
  };

  const badge = getRoleBadge(userRole);

  return (
    <header className="border-b border-stone-200/80 bg-white py-5 px-6 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-40">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          onClick={() => setActiveView("landing")}
          className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#06434a] hover:bg-[#06434a]/5 px-4 py-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#06434a]/30"
          aria-label="Volver a landing principal"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="uppercase tracking-wider">Landing</span>
        </button>
        <button
          onClick={() => setActiveView("landing")}
          className="sm:hidden p-2 text-[#06434a] hover:bg-stone-100 rounded-lg min-h-[44px] min-w-[44px]"
          aria-label="Volver a landing"
        >
          <Home className="h-4 w-4" />
        </button>
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            aria-label="Toggle Menu"
            className="md:hidden p-2 -ml-2 rounded-lg text-stone-500 hover:bg-stone-50 hover:text-stone-900 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 font-display flex items-center gap-2">
            {title}
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-extrabold uppercase font-mono tracking-wider">
              v2.0 Active
            </span>
          </h1>
          <p className="text-[11px] text-stone-500 max-w-xl font-medium mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-end">
        {/* Role Switcher RBAC Selector */}
        <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/60 p-1.5 rounded-full shadow-xs">
          <div className="p-1 bg-white rounded-full border border-stone-100 text-stone-500">
            <Shield className="h-3.5 w-3.5" />
          </div>
          <div className="text-right pr-1">
            <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest leading-none">
              Perfil Activo
            </span>
            <span className="block text-[10px] font-bold text-stone-800 leading-none mt-0.5">
              {badge.label}
            </span>
          </div>

          <div className="relative group">
            <button className="p-1 px-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-700 text-[10px] font-bold flex items-center gap-1 border border-stone-100 cursor-pointer shadow-xs transition-all">
              <span>Cambiar</span>
              <ChevronDown className="h-2.5 w-2.5" />
            </button>
            
            {/* dropdown list */}
            <div className="absolute right-0 top-full mt-1.5 bg-white border border-stone-200 rounded-xl shadow-lg py-1.5 w-44 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <span className="block px-3 py-1 text-[8px] font-extrabold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1 mb-1">
                Roles de Sistema
              </span>
              {(["admin", "comercial_dir", "comercial_exec", "ops", "viewer"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRole(r)}
                  className={`w-full px-3 py-1.5 text-left text-[11px] font-semibold hover:bg-stone-50 flex items-center gap-2 transition-colors cursor-pointer ${
                    userRole === r ? "text-[#06434a] bg-[#06434a]/5 font-bold" : "text-stone-600"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${userRole === r ? "bg-[#06434a] animate-pulse" : "bg-stone-300"}`} />
                  <span className="capitalize">{r.replace("_", " ")}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 border-l border-stone-200 pl-4">
          <button className="h-8 w-8 rounded-full border border-stone-200/80 hover:bg-stone-50 flex items-center justify-center text-stone-600 relative cursor-pointer shadow-xs">
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          </button>
          
          <div className="h-8 w-8 rounded-full bg-[#06434a]/8 border border-[#06434a]/15 text-[#06434a] flex items-center justify-center font-bold text-xs select-none shadow-xs">
            GC
          </div>
        </div>
      </div>
    </header>
  );
};
