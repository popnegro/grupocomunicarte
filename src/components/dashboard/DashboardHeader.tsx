import React from "react";
import { Role } from "./types";
import { Shield, Sparkles, User, Bell } from "lucide-react";

interface DashboardHeaderProps {
  userRole: Role;
  title: string;
  description: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userRole,
  title,
  description,
}) => {
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
    <header className="border-b border-stone-200/80 bg-white py-5 px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-40">
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
