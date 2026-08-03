import React, { useState } from "react";
import { useCms } from "./CmsContext";
import { DoohScreen } from "../types";

// Import Shared modular Types & Mock Databases
import { Role, MediaKit, Cliente, ChangeLog } from "./dashboard/types";
import { 
  INITIAL_CLIENTES, 
  INITIAL_MEDIAKITS, 
  INITIAL_LOGS, 
} from "./dashboard/mockData";

// Import Modular panels
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { InventoryModule } from "./dashboard/InventoryModule";
import { MediaKitModule } from "./dashboard/MediaKitModule";

// Lucide Icons
import {
  Tv,
  FileText,
  ChevronLeft,
  ChevronRight,
  Globe
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const {
    screens,
    setScreens,
    currentDashboardTab: activeTab,
    setCurrentDashboardTab: setActiveTab,
    setActiveView,
  } = useCms();

  // Active User Profile (RBAC state)
  const [userRole, setUserRole] = useState<Role>("comercial_dir");

  // Sidebar navigation state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core commercial databases states
  const [mediaKits, setMediaKits] = useState<MediaKit[]>(INITIAL_MEDIAKITS);
  const [clientes, setClientes] = useState<Cliente[]>(INITIAL_CLIENTES);
  const [logs, setLogs] = useState<ChangeLog[]>(INITIAL_LOGS);

  // State audit-log generator helper
  const addLog = (action: string) => {
    const newLog: ChangeLog = {
      id: `lg-gen-${Date.now()}`,
      user: userRole === "admin" ? "Administrador" : userRole === "comercial_dir" ? "Director Comercial" : "Comercial Ejec.",
      action,
      date: "Justo ahora"
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // State helper: Add screen to catalogue (Inventory CRUD)
  const handleAddScreen = (screen: DoohScreen) => {
    setScreens((prev) => [...prev, screen]);
    addLog(`Agregó un nuevo soporte al catálogo comercial: ${screen.nombre}`);
  };

  // State helper: Update screen in catalogue
  const handleUpdateScreen = (id: string, data: Partial<DoohScreen>) => {
    setScreens((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
    const screen = screens.find((s) => s.id === id);
    if (data.status === "Pausado") {
      addLog(`Archivó temporalmente el soporte comercial: ${screen?.nombre || id}`);
    } else if (data.status === "Disponible") {
      addLog(`Restauró y activó el soporte comercial: ${screen?.nombre || id}`);
    } else {
      addLog(`Editó especificaciones en soporte comercial: ${screen?.nombre || id}`);
    }
  };

  // State helper: Delete screen (Hard delete)
  const handleDeleteScreen = (id: string) => {
    const screen = screens.find((s) => s.id === id);
    setScreens((prev) => prev.filter((s) => s.id !== id));
    addLog(`Eliminó de manera permanente el soporte comercial: ${screen?.nombre || id}`);
  };

  // State helper: Add MediaKit
  const handleAddMediaKit = (mk: MediaKit) => {
    setMediaKits((prev) => [mk, ...prev]);
    addLog(`Creó la propuesta MediaKit: ${mk.nombre}`);
  };

  // State helper: Update MediaKit
  const handleUpdateMediaKit = (id: string, data: Partial<MediaKit>) => {
    setMediaKits((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...data } : m))
    );
  };

  // State helper: Generate Quote from MediaKit (Workflow Transition 1)
  const handleGenerateQuoteFromMediaKit = (mkId: string) => {
    const mk = mediaKits.find((m) => m.id === mkId);
    if (!mk) return;

    // Calculate sum of pricing
    const baseCost = mk.soportesEdicionInline.reduce((sum, item) => {
      const scr = screens.find((s) => s.id === item.id);
      return sum + (scr?.precio || 0) * item.duracionSem;
    }, 0);

    const qtId = `qt-gen-${Date.now()}`;
    
    // Update MediaKit state to reflecting "Cotizando"
    handleUpdateMediaKit(mkId, { estado: "Cotizando" });
    addLog(`Generó Cotización #${qtId} (Total: $${baseCost.toLocaleString()}) a partir de propuesta MediaKit: ${mk.nombre}`);
  };

  // Navigation mapping list
  const navItems = [
    { id: "inventario", label: "Inventario Comercial", icon: Tv, desc: "Edición y administración del catálogo de soportes físicos y pantallas LED" },
    { id: "mediakit", label: "Editor de MediaKits", icon: FileText, desc: "Diseño Notion-style y generación de propuestas comerciales inteligentes con IA" }
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
              const active = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-all ${
                    active 
                      ? "bg-[#06434a] text-white font-bold shadow-sm" 
                      : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-amber-300 animate-pulse" : ""}`} />
                  {!sidebarCollapsed && (
                    <div className="min-w-0 text-left">
                      <span className="block text-xs leading-none">{item.label}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Return to Public Website section */}
          <div className="p-4 border-t border-stone-100">
            <button
              onClick={() => setActiveView("landing")}
              className="w-full p-2.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-all text-emerald-800 hover:bg-emerald-50/50 hover:text-emerald-950 font-bold"
            >
              <Globe className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
              {!sidebarCollapsed && (
                <span className="text-xs leading-none">Ver Sitio Público</span>
              )}
            </button>
          </div>

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
          const matched = navItems.find((n) => n.id === activeTab);
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
          {activeTab === "inventario" && (
            <InventoryModule
              screens={screens}
              userRole={userRole}
              onUpdateScreen={handleUpdateScreen}
              onAddScreen={handleAddScreen}
              onDeleteScreen={handleDeleteScreen}
            />
          )}

          {activeTab === "mediakit" && (
            <MediaKitModule
              mediaKits={mediaKits}
              clientes={clientes}
              screens={screens}
              userRole={userRole}
              onUpdateMediaKit={handleUpdateMediaKit}
              onAddMediaKit={handleAddMediaKit}
              onDeleteMediaKit={(id) => setMediaKits((prev) => prev.filter((m) => m.id !== id))}
              onGenerateQuoteFromMediaKit={handleGenerateQuoteFromMediaKit}
            />
          )}
        </div>
      </main>

    </div>
  );
};
