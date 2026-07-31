import React, { useState } from "react";
import { Role } from "./dashboard/types";
import {
  INITIAL_CLIENTES,
  INITIAL_MEDIAKITS,
  INITIAL_COTIZACIONES,
  INITIAL_RESERVAS,
  INITIAL_CAMPAÑAS,
  INITIAL_LOGS,
  INITIAL_VEHICLES
} from "./dashboard/mockData";

// Lucide Icons
import {
  LayoutDashboard,
  Tv,
  FileText,
  Calendar,
  Layers,
  Users,
  Briefcase,
  Radio,
  TrendingUp,
  BarChart3,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { DashboardHeader } from "./dashboard/DashboardHeader";

export const DashboardView: React.FC = () => {
  const { pathname } = useLocation();

  // Active User Profile (RBAC state)
  const [userRole, setUserRole] = useState<Role>("comercial_dir");

  // Sidebar navigation state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // State audit-log generator helper
  const addLog = (action: string) => {
    const newLog: ChangeLog = {
      id: `lg-gen-${Date.now()}`,
      user: userRole === "admin" ? "Administrador" : userRole === "comercial_dir" ? "Director Comercial" : "Comercial Ejec.",
      action,
      date: "Justo ahora"
    };
  };

  // Navigation mapping list
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "¿Qué tengo que hacer hoy?" },
    { path: "mediakit", label: "MediaKit Editor", icon: FileText, desc: "Notion Editor y Propuestas IA" },
    { path: "inventario", label: "Inventario", icon: Tv, desc: "Backoffice CRUD de soportes fijos/LED" },
    { path: "calendario", label: "Calendario", icon: Calendar, desc: "Timeline de ocupación de soportes" },
    { path: "reservas", label: "Workflow Ventas", icon: Layers, desc: "Cotizaciones, Reservas y Overbooking" },
    { path: "clientes", label: "Clientes CRM", icon: Users, desc: "Directorio de anunciantes" },
    { path: "led-movil", label: "LED Móvil", icon: Radio, desc: "Planificador de circuitos GPS móviles" },
    { path: "revenue", label: "Revenue IA", icon: TrendingUp, desc: "Optimización de tarifas" },
    { path: "sitemap", label: "Estrategia SEO", icon: Globe, desc: "Arquitectura multipágina y sitemap" },
    { path: "reportes", label: "Reportes", icon: BarChart3, desc: "Analíticas corporativas" },
    { path: "administracion", label: "Administración", icon: Settings2, desc: "Logs de auditoría y RBAC" }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF9F5] text-stone-800">

      {/* 1. Sidebar Panel */}
      <aside className={`border-r border-stone-200/80 bg-white flex flex-col justify-between transition-all duration-300 relative shrink-0 z-50 shadow-2xs ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}>
        <div className="flex flex-col h-full overflow-y-auto">

          {/* Logo Brand Header */}
          <div className="p-5 border-b border-stone-100 flex items-center gap-3 text-[#06434a] select-none font-display text-left">
            <div className="h-7 w-7 rounded-lg bg-[#06434a] flex items-center justify-center text-white shrink-0 shadow-sm font-black text-sm">
              C
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <span className="block text-xs font-black tracking-tight leading-none text-stone-900 uppercase">Grupo Comunicarte</span>
                <span className="block text-[8px] font-bold text-stone-400 mt-1 leading-none uppercase tracking-widest">SaaS DOOH Platform</span>
              </div>
            )}
          </div>

          {/* Links navigation group */}
          <nav className="p-4 flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === `/dashboard/${item.path}` || (item.path === "/dashboard" && pathname === "/dashboard");
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-all ${
                    isActive
                      ? "bg-[#06434a] text-white font-bold shadow-sm"
                      : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-amber-300 animate-pulse" : ""}`} />
                  {!sidebarCollapsed && (
                    <div className="min-w-0 text-left">
                      <span className="block text-xs leading-none">{item.label}</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Collapser Toggle Footer */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-stone-50 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer transition-colors mx-auto lg:mx-0"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Dynamic header title & description map */}
        {(() => {
          const matched = navItems.find((n) => pathname === `/dashboard/${n.path}` || (n.path === "/dashboard" && pathname === "/dashboard"));
          const headerTitle = matched?.label || "Consola de Gestión";
          const headerDesc = matched?.desc || "Consola general de administración comercial DOOH.";

          return (
            <DashboardHeader
              userRole={userRole}
              setUserRole={setUserRole}
              title={headerTitle}
              description={headerDesc}
            />
          );
        })()}

        {/* Sub-view router container */}
        <div className="flex-1 overflow-y-auto relative bg-[#FAF9F5]">
          <Outlet />
        </div>
      </main>

    </div>
  );
};
