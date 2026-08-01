import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCms } from "./CmsContext";
import { DoohScreen } from "../types";

// Import Shared modular Types & Mock Databases
import { Role, MediaKit, Cotizacion, Reserva, Campaña, Cliente, ChangeLog, LedVehicle } from "./dashboard/types";
import { 
  INITIAL_CLIENTES, 
  INITIAL_MEDIAKITS, 
  INITIAL_COTIZACIONES, 
  INITIAL_RESERVAS, 
  INITIAL_CAMPAÑAS, 
  INITIAL_LOGS, 
  INITIAL_VEHICLES 
} from "./dashboard/mockData";

// Import Modular panels
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardHome } from "./dashboard/DashboardHome";
import { InventoryModule } from "./dashboard/InventoryModule";
import { MediaKitModule } from "./dashboard/MediaKitModule";
import { WorkflowModule } from "./dashboard/WorkflowModule";
import { LedMovilModule } from "./dashboard/LedMovilModule";
import { RevenueModule } from "./dashboard/RevenueModule";
import { CalendarModule } from "./dashboard/CalendarModule";
import { ClientsModule } from "./dashboard/ClientsModule";
import { ReportsModule } from "./dashboard/ReportsModule";
import { AdministrationModule } from "./dashboard/AdministrationModule";

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
  Globe,
  Shield
} from "lucide-react";
import { SitemapSeoView } from "./SitemapSeoView";
import { DesignSystemAuditView } from "./DesignSystemAuditView";

export const DashboardView: React.FC = () => {
  const {
    screens,
    setScreens,
    updateScreen,
    currentDashboardTab: activeTab,
    setCurrentDashboardTab: setActiveTab,
    setActiveView,
  } = useCms();

  // Active User Profile (RBAC state)
  const [userRole, setUserRole] = useState<Role>("comercial_dir");

  // Sidebar navigation state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core commercial databases states
  const [mediaKits, setMediaKits] = useState<MediaKit[]>(INITIAL_MEDIAKITS);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>(INITIAL_COTIZACIONES);
  const [reservas, setReservas] = useState<Reserva[]>(INITIAL_RESERVAS);
  const [campañas, setCampañas] = useState<Campaña[]>(INITIAL_CAMPAÑAS);
  const [clientes, setClientes] = useState<Cliente[]>(INITIAL_CLIENTES);
  const [logs, setLogs] = useState<ChangeLog[]>(INITIAL_LOGS);
  const [vehicles, setVehicles] = useState<LedVehicle[]>(INITIAL_VEHICLES);

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

  // State helper: Update screen price (from Revenue Pricing advisor)
  const handleUpdateScreenPrice = (id: string, price: number) => {
    setScreens((prev) =>
      prev.map((s) => (s.id === id ? { ...s, precio: price } : s))
    );
    const screen = screens.find((s) => s.id === id);
    addLog(`Aplicó recomendación IA: Actualizó tarifa de ${screen?.nombre || id} a $${price.toLocaleString()}`);
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
    const newQuote: Cotizacion = {
      id: qtId,
      mediakitId: mkId,
      mediakitNombre: mk.nombre,
      clienteNombre: mk.clienteNombre,
      descuentoPercent: 0,
      validez: "2026-08-30",
      condiciones: "Facturación directa con el 50% de anticipo.",
      total: baseCost,
      estado: "Pendiente"
    };

    setCotizaciones((prev) => [newQuote, ...prev]);
    
    // Update MediaKit state to reflecting "Cotizando"
    handleUpdateMediaKit(mkId, { estado: "Cotizando" });
    setActiveTab("reservas"); // auto redirect to pipeline workflow
    addLog(`Generó Cotización #${qtId} a partir de propuesta MediaKit: ${mk.nombre}`);
  };

  // State helper: Approve Quote -> Converts to Reservation (Workflow Transition 2)
  const handleApproveCotizacion = (qtId: string) => {
    const quote = cotizaciones.find((q) => q.id === qtId);
    if (!quote) return;

    // Update Quote status
    setCotizaciones((prev) =>
      prev.map((q) => (q.id === qtId ? { ...q, estado: "Aceptada" } : q))
    );

    // Locate matching MediaKit screens list
    const mk = mediaKits.find((m) => m.id === quote.mediakitId);
    const screenId = mk?.screenIds[0] || "sc-01";
    const screenObj = screens.find((s) => s.id === screenId);

    // Spawn Reservation
    const rvId = `rv-gen-${Date.now()}`;
    const newRes: Reserva = {
      id: rvId,
      mediakitId: quote.mediakitId,
      clienteNombre: quote.clienteNombre,
      screenId,
      screenNombre: screenObj?.nombre || "Pantalla Seleccionada",
      fechaInicio: "2026-08-01",
      fechaFin: "2026-08-28",
      estado: "Pendiente",
      conflictiva: false
    };

    setReservas((prev) => [newRes, ...prev]);
    addLog(`Cerró Cotización #${qtId}. Reserva generada para anunciante: ${quote.clienteNombre}`);
  };

  // State helper: Approve Reservation -> Converts to Active Campaign (Workflow Transition 3)
  const handleApproveReserva = (rvId: string) => {
    const res = reservas.find((r) => r.id === rvId);
    if (!res) return;

    // Update reservation state
    setReservas((prev) =>
      prev.map((r) => (r.id === rvId ? { ...r, estado: "Confirmada" } : r))
    );

    // Spawn Active Campaign
    const cpId = `cp-gen-${Date.now()}`;
    const newCamp: Campaña = {
      id: cpId,
      reservaId: rvId,
      clienteNombre: res.clienteNombre,
      nombre: `Campaña Oficial — ${res.clienteNombre}`,
      screenId: res.screenId,
      screenNombre: res.screenNombre,
      fechaInicio: res.fechaInicio,
      fechaFin: res.fechaFin,
      progreso: 0,
      estado: "Planificada"
    };

    setCampañas((prev) => [newCamp, ...prev]);
    addLog(`Reserva #${rvId} firmada y confirmada. Planificado vuelo de Campaña #${cpId}`);
  };

  // Navigation mapping list
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "¿Qué tengo que hacer hoy?" },
    { id: "mediakit", label: "MediaKit Editor", icon: FileText, desc: "Notion Editor y Propuestas IA" },
    { id: "inventario", label: "Inventario", icon: Tv, desc: "Backoffice CRUD de soportes fijos/LED" },
    { id: "calendario", label: "Calendario", icon: Calendar, desc: "Timeline de ocupación de soportes" },
    { id: "reservas", label: "Workflow Ventas", icon: Layers, desc: "Cotizaciones, Reservas y Overbooking" },
    { id: "clientes", label: "Clientes CRM", icon: Users, desc: "Directorio de anunciantes" },
    { id: "led-movil", label: "LED Móvil", icon: Radio, desc: "Planificador de circuitos GPS móviles" },
    { id: "revenue", label: "Revenue IA", icon: TrendingUp, desc: "Optimización de tarifas" },
    { id: "seo", label: "Estrategia SEO", icon: Globe, desc: "Arquitectura multipágina y sitemap" },
    { id: "reportes", label: "Reportes", icon: BarChart3, desc: "Analíticas corporativas" },
    { id: "administracion", label: "Administración", icon: Settings2, desc: "Logs de auditoría y RBAC" },
    { id: "design-system", label: "Design System", icon: Shield, desc: "Consola de Tokens, Guías UX/UI y Accesibilidad" }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF9F5] text-stone-800 relative">
      
      {/* Mobile Sidebar Toggle Backdrop Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black z-40 md:hidden"
          />
        )}
      </AnimatePresence>
      
      {/* 1. Sidebar Panel */}
      <aside className={`border-r border-stone-200/80 bg-white flex flex-col justify-between transition-all duration-300 shrink-0 shadow-2xs z-50
        /* Position adaptive */
        fixed inset-y-0 left-0 md:relative md:flex h-full
        ${mobileSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
        ${sidebarCollapsed ? "md:w-16 w-64" : "md:w-64 w-64"}
      `}>
        <div className="flex flex-col h-full overflow-y-auto">
          
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between gap-3 text-[#06434a] select-none font-display text-left">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-[#06434a] flex items-center justify-center text-white shrink-0 shadow-sm font-black text-sm">
                C
              </div>
              {(!sidebarCollapsed || mobileSidebarOpen) && (
                <div className="min-w-0">
                  <span className="block text-xs font-black tracking-tight leading-none text-stone-900 uppercase">Grupo Comunicarte</span>
                  <span className="block text-[8px] font-bold text-stone-400 mt-1 leading-none uppercase tracking-widest">SaaS DOOH Platform</span>
                </div>
              )}
            </div>
            {/* Mobile close button inside header */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg text-stone-400 hover:bg-stone-50 hover:text-stone-700 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Cerrar menú"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Links navigation group */}
          <nav className="p-4 flex-1 space-y-1">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  whileHover={{ scale: 1.01, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`w-full py-3 px-3 md:p-2.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-all min-h-[44px] ${
                    active 
                      ? "bg-[#06434a] text-white font-bold shadow-sm" 
                      : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-amber-300 animate-pulse" : ""}`} />
                  {(!sidebarCollapsed || mobileSidebarOpen) && (
                    <div className="min-w-0 text-left">
                      <span className="block text-xs leading-none">{item.label}</span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Return to Public Website section */}
          <div className="p-4 border-t border-stone-100">
            <motion.button
              onClick={() => {
                setActiveView("landing");
                setMobileSidebarOpen(false);
              }}
              whileHover={{ scale: 1.01, x: 3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-full py-3 px-3 md:p-2.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-all text-emerald-800 hover:bg-emerald-50/50 hover:text-emerald-950 font-bold min-h-[44px]"
            >
              <Globe className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
              {(!sidebarCollapsed || mobileSidebarOpen) && (
                <span className="text-xs leading-none">Ver Sitio Público</span>
              )}
            </motion.button>
          </div>

        </div>

        {/* Collapser Toggle Footer */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-stone-50 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer transition-colors mx-auto lg:mx-0 hidden md:block"
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
              onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            />
          );
        })()}

        {/* Sub-view router container */}
        <div className="flex-1 overflow-y-auto relative bg-[#FAF9F5]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="w-full min-h-full"
            >
              {activeTab === "dashboard" && (
                <DashboardHome
                  mediaKits={mediaKits}
                  cotizaciones={cotizaciones}
                  reservas={reservas}
                  campañas={campañas}
                  clientes={clientes}
                  userRole={userRole}
                  onNavigateToTab={setActiveTab}
                  onApproveReserva={handleApproveReserva}
                  onApproveCotizacion={handleApproveCotizacion}
                  setCampañas={setCampañas}
                  setClientes={setClientes}
                  setCotizaciones={setCotizaciones}
                  setReservas={setReservas}
                  addLog={addLog}
                />
              )}

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

              {activeTab === "reservas" && (
                <WorkflowModule
                  cotizaciones={cotizaciones}
                  reservas={reservas}
                  campañas={campañas}
                  screens={screens}
                  userRole={userRole}
                  onUpdateCotizacion={(id, data) => setCotizaciones((prev) => prev.map((q) => (q.id === id ? { ...q, ...data } : q)))}
                  onUpdateReserva={(id, data) => setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)))}
                  onUpdateCampaña={(id, data) => setCampañas((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))}
                  onApproveCotizacion={handleApproveCotizacion}
                  onApproveReserva={handleApproveReserva}
                />
              )}

              {activeTab === "led-movil" && (
                <LedMovilModule
                  vehicles={vehicles}
                  onUpdateVehicle={(id, data) => setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...data } : v)))}
                  onAddVehicle={(vh) => setVehicles((prev) => [...prev, vh])}
                />
              )}

              {activeTab === "revenue" && (
                <RevenueModule
                  screens={screens}
                  onUpdateScreenPrice={handleUpdateScreenPrice}
                />
              )}

              {activeTab === "calendario" && (
                <CalendarModule
                  screens={screens}
                  onUpdateScreenStatus={(id, status) => handleUpdateScreen(id, { status: status as any })}
                />
              )}

              {activeTab === "clientes" && (
                <ClientsModule
                  clientes={clientes}
                  userRole={userRole}
                  onAddCliente={(cliente) => setClientes((prev) => [...prev, cliente])}
                />
              )}

              {activeTab === "reportes" && (
                <ReportsModule />
              )}

              {activeTab === "seo" && (
                <SitemapSeoView />
              )}

              {activeTab === "administracion" && (
                <AdministrationModule
                  logs={logs}
                  userRole={userRole}
                />
              )}

              {activeTab === "design-system" && (
                <DesignSystemAuditView />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
};
