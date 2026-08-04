import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useCms } from "./CmsContext";
import { DoohScreen } from "../types";
import { useToast } from "./ui/Toast";
import { usePageMetadata } from "../hooks/usePageMetadata";

// Shared types and local helpers
import { Role, MediaKit, Cliente, ChangeLog, Cotizacion, Reserva, Campaña } from "./dashboard/types";
import { 
  INITIAL_COTIZACIONES, 
  INITIAL_RESERVAS, 
  INITIAL_CAMPAÑAS, 
} from "./dashboard/mockData";

// Modular sub-views
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardSkeleton } from "./dashboard/DashboardSkeleton";

const DashboardHome = React.lazy(() =>
  import("./dashboard/DashboardHome").then((m) => ({ default: m.DashboardHome }))
);
const InventoryModule = React.lazy(() =>
  import("./dashboard/InventoryModule").then((m) => ({ default: m.InventoryModule }))
);
const MediaKitModule = React.lazy(() =>
  import("./dashboard/MediaKitModule").then((m) => ({ default: m.MediaKitModule }))
);
const ClientsModule = React.lazy(() =>
  import("./dashboard/ClientsModule").then((m) => ({ default: m.ClientsModule }))
);
const SettingsModule = React.lazy(() =>
  import("./dashboard/SettingsModule").then((m) => ({ default: m.SettingsModule }))
);
const AiPlannerModule = React.lazy(() =>
  import("./dashboard/AiPlannerModule").then((m) => ({ default: m.AiPlannerModule }))
);
const AuditModule = React.lazy(() =>
  import("./dashboard/AuditModule").then((m) => ({ default: m.AuditModule }))
);

import { DashboardAppShellSkeleton } from "./ui/reusable-skeletons";

// Lucide Icons
import {
  Home as HomeIcon,
  Tv,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
  Loader,
  Sparkles,
  X,
  Menu,
  Shield
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const { token } = useAuth();
  const { setActiveView, content } = useCms();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const matchedLabel = 
    location.pathname === "/dashboard/inventory" ? "Inventario Comercial" :
    location.pathname === "/dashboard/clients" ? "Clientes CRM" :
    location.pathname === "/dashboard/mediakits" ? "Editor de MediaKits" :
    location.pathname === "/dashboard/settings" ? "Configuración" :
    location.pathname === "/dashboard/audit" ? "Registro de Auditoría" :
    location.pathname === "/dashboard/ai-planner" ? "Planificador IA" :
    "Consola Principal";

  usePageMetadata({
    title: `${matchedLabel} | Panel`,
    description: `Consola de administración interna de Grupo Comunicarte para la gestión de ${matchedLabel}, optimización comercial y logística de soportes DOOH.`
  });

  // Active User Profile (RBAC state)
  const [userRole, setUserRole] = useState<Role>("comercial_dir");

  // Sidebar navigation state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // States fetched dynamically from PostgreSQL
  const [screens, setScreens] = useState<DoohScreen[]>([]);
  const [mediaKits, setMediaKits] = useState<MediaKit[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [logs, setLogs] = useState<ChangeLog[]>([]);

  // States initialized from mock templates for analytical simulation
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>(INITIAL_COTIZACIONES);
  const [reservas, setReservas] = useState<Reserva[]>(INITIAL_RESERVAS);
  const [campanas, setCampanas] = useState<Campaña[]>(INITIAL_CAMPAÑAS);

  // General loading flag
  const [loading, setLoading] = useState(true);

  // Load state from PostgreSQL APIs
  const fetchDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const [screensRes, clientsRes, mkRes, logsRes] = await Promise.all([
        fetch("/api/screens", { headers }),
        fetch("/api/clients", { headers }),
        fetch("/api/mediakits", { headers }),
        fetch("/api/changelogs", { headers }),
      ]);

      const [screensData, clientsData, mkData, logsData] = await Promise.all([
        screensRes.json(),
        clientsRes.json(),
        mkRes.json(),
        logsRes.json(),
      ]);

      if (screensData.success) setScreens(screensData.data);
      if (clientsData.success) setClientes(clientsData.data);
      if (mkData.success) setMediaKits(mkData.data);
      if (logsData.success) setLogs(logsData.data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // DB-Connected Changelog Logger
  const addLog = async (action: string) => {
    if (!token) return;
    const userLabel = userRole === "admin" ? "Administrador" : userRole === "comercial_dir" ? "Director Comercial" : "Comercial Ejec.";
    const newLog = {
      id: `lg-gen-${Date.now()}`,
      user: userLabel,
      action,
      date: "Justo ahora",
    };

    try {
      const res = await fetch("/api/changelogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newLog),
      });
      const data = await res.json();
      if (data.success) {
        setLogs((prev) => [data.data, ...prev]);
      }
    } catch (err) {
      console.error("Error logging changelog:", err);
      // Fallback
      setLogs((prev) => [newLog, ...prev]);
    }
  };

  // --- CRUD HANDLERS CONNECTED TO POSTGRESQL ---

  // Inventory Screen Add
  const handleAddScreen = async (screen: DoohScreen) => {
    if (!token) return;
    try {
      const res = await fetch("/api/screens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-User-Role": userRole
        },
        body: JSON.stringify(screen),
      });
      const data = await res.json();
      if (data.success) {
        setScreens((prev) => [...prev, data.data]);
        addLog(`Agregó un nuevo soporte al catálogo comercial: ${screen.nombre}`);
        toast.success(`Soporte "${screen.nombre}" agregado correctamente.`);
      } else {
        toast.error(data.error || "No se pudo agregar el soporte comercial.");
      }
    } catch (err) {
      console.error("Error adding screen:", err);
      toast.error("Error de red al intentar agregar el soporte.");
    }
  };

  // Inventory Screen Update
  const handleUpdateScreen = async (id: string, updatedFields: Partial<DoohScreen>) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/screens/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-User-Role": userRole
        },
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json();
      if (data.success) {
        setScreens((prev) => prev.map((s) => (s.id === id ? data.data : s)));
        const screenName = screens.find((s) => s.id === id)?.nombre || id;
        if (updatedFields.status === "Pausado") {
          addLog(`Archivó temporalmente el soporte comercial: ${screenName}`);
          toast.info(`Soporte "${screenName}" pausado (archivado).`);
        } else if (updatedFields.status === "Disponible") {
          addLog(`Restauró y activó el soporte comercial: ${screenName}`);
          toast.success(`Soporte "${screenName}" activado y disponible.`);
        } else {
          addLog(`Editó especificaciones en soporte comercial: ${screenName}`);
          toast.success(`Soporte "${screenName}" actualizado correctamente.`);
        }
      } else {
        toast.error(data.error || "No se pudo actualizar el soporte comercial.");
      }
    } catch (err) {
      console.error("Error updating screen:", err);
      toast.error("Error de red al intentar actualizar el soporte.");
    }
  };

  // Inventory Screen Delete
  const handleDeleteScreen = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/screens/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-User-Role": userRole
        },
      });
      const data = await res.json();
      if (data.success) {
        const screenName = screens.find((s) => s.id === id)?.nombre || id;
        setScreens((prev) => prev.filter((s) => s.id !== id));
        addLog(`Eliminó de manera permanente el soporte comercial: ${screenName}`);
        toast.success(`Soporte "${screenName}" eliminado definitivamente.`);
      } else {
        toast.error(`Error de permisos: ${data.error || "No tienes privilegios para realizar esta acción."}`);
      }
    } catch (err: any) {
      console.error("Error deleting screen:", err);
      toast.error("Error de conexión al intentar eliminar el soporte.");
    }
  };

  // Clients CRM Add
  const handleAddCliente = async (cliente: Cliente) => {
    if (!token) return;
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(cliente),
      });
      const data = await res.json();
      if (data.success) {
        setClientes((prev) => [...prev, data.data]);
        addLog(`Registró un nuevo cliente en el CRM: ${cliente.empresa}`);
        toast.success(`Cliente "${cliente.empresa}" registrado con éxito.`);
      } else {
        toast.error(data.error || "No se pudo registrar el cliente.");
      }
    } catch (err) {
      console.error("Error adding client:", err);
      toast.error("Error de conexión al intentar registrar el cliente.");
    }
  };

  // Clients CRM Update
  const handleUpdateCliente = async (id: string, updatedFields: Partial<Cliente>) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json();
      if (data.success) {
        setClientes((prev) => prev.map((c) => (c.id === id ? data.data : c)));
        addLog(`Actualizó el perfil/estado del cliente CRM: ${data.data.empresa}`);
        toast.success(`Cliente "${data.data.empresa}" actualizado.`);
      } else {
        toast.error(data.error || "No se pudo actualizar el cliente.");
      }
    } catch (err) {
      console.error("Error updating client:", err);
      toast.error("Error de conexión al intentar actualizar el cliente.");
    }
  };

  // MediaKit Creator
  const handleAddMediaKit = async (mk: MediaKit) => {
    if (!token) return;
    try {
      const res = await fetch("/api/mediakits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(mk),
      });
      const data = await res.json();
      if (data.success) {
        setMediaKits((prev) => [data.data, ...prev]);
        addLog(`Creó la propuesta MediaKit: ${mk.nombre}`);
        toast.success(`Propuesta MediaKit "${mk.nombre}" guardada con éxito.`);
      } else {
        toast.error(data.error || "No se pudo guardar la propuesta.");
      }
    } catch (err) {
      console.error("Error adding mediakit:", err);
      toast.error("Error de conexión al guardar el MediaKit.");
    }
  };

  // MediaKit Updater
  const handleUpdateMediaKit = async (id: string, updatedFields: Partial<MediaKit>) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/mediakits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json();
      if (data.success) {
        setMediaKits((prev) => prev.map((m) => (m.id === id ? data.data : m)));
        toast.success("MediaKit actualizado.");
      } else {
        toast.error(data.error || "No se pudo actualizar la propuesta.");
      }
    } catch (err) {
      console.error("Error updating mediakit:", err);
      toast.error("Error de conexión al actualizar el MediaKit.");
    }
  };

  // MediaKit Deleter
  const handleDeleteMediaKit = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/mediakits/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setMediaKits((prev) => prev.filter((m) => m.id !== id));
        addLog(`Eliminó propuesta MediaKit id: ${id}`);
        toast.success("Propuesta eliminada correctamente.");
      } else {
        toast.error(data.error || "No se pudo eliminar la propuesta.");
      }
    } catch (err) {
      console.error("Error deleting mediakit:", err);
      toast.error("Error de conexión al eliminar el MediaKit.");
    }
  };

  // Workflow Transition: Generate Quote from MediaKit
  const handleGenerateQuoteFromMediaKit = async (mkId: string) => {
    const mk = mediaKits.find((m) => m.id === mkId);
    if (!mk) return;

    const baseCost = mk.soportesEdicionInline.reduce((sum, item) => {
      const scr = screens.find((s) => s.id === item.id);
      return sum + (scr?.precio || 0) * item.duracionSem;
    }, 0);

    const qtId = `qt-gen-${Date.now()}`;
    await handleUpdateMediaKit(mkId, { estado: "Cotizando" });
    addLog(`Generó Cotización #${qtId} (Total: $${baseCost.toLocaleString()}) a partir de propuesta MediaKit: ${mk.nombre}`);
  };

  // Interactive UI workflows: Approval bookings
  const handleApproveReserva = (id: string) => {
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: "Confirmada" } : r))
    );
    addLog(`Aprobó y reservó de forma permanente la reserva comercial #${id}`);
  };

  // Interactive UI workflows: Approval quotations
  const handleApproveCotizacion = (id: string) => {
    setCotizaciones((prev) =>
      prev.map((q) => (q.id === id ? { ...q, estado: "Aceptada" } : q))
    );
    addLog(`Aprobó propuesta de tarifa comercial en Cotización #${id}`);
  };

  // Sidebar navigation setup
  const navItems = [
    { id: "home", label: "Consola Principal", icon: HomeIcon, path: "/dashboard", desc: "Métricas generales y centro de control comercial" },
    { id: "inventario", label: "Inventario Comercial", icon: Tv, path: "/dashboard/inventory", desc: "Edición y administración del catálogo de soportes físicos y pantallas LED" },
    { id: "clientes", label: "Clientes CRM", icon: Users, path: "/dashboard/clients", desc: "Registro de contactos de ventas, agencias y corporativos" },
    { id: "mediakit", label: "Editor de MediaKits", icon: FileText, path: "/dashboard/mediakits", desc: "Diseño Notion-style y generación de propuestas comerciales inteligentes con IA" },
    { id: "ai-planner", label: "Planificador IA", icon: Sparkles, path: "/dashboard/ai-planner", desc: "Optimización inteligente de campañas y ROI mediante Inteligencia Artificial" },
    { id: "auditoria", label: "Registro de Auditoría", icon: Shield, path: "/dashboard/audit", desc: "Historial completo de operaciones y auditoría inteligente con Google Sheets e IA" },
    { id: "settings", label: "Configuración", icon: Settings, path: "/dashboard/settings", desc: "Control de usuario y preferencias del sistema" },
  ];

  if (loading) {
    return <DashboardAppShellSkeleton />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF9F5] text-stone-800 font-sans">
      
      {/* Mobile Sidebar Overlay Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)} 
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 lg:hidden"
        />
      )}

      {/* 1. Sidebar Panel */}
      <aside className={`border-r border-stone-200 bg-white flex flex-col justify-between transition-all duration-300 fixed inset-y-0 left-0 z-50 shadow-lg lg:static lg:shadow-none ${
        sidebarCollapsed ? "w-16 lg:w-16" : "w-64 lg:w-64"
      } ${
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="flex flex-col h-full overflow-y-auto">
          
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between text-[#06434a] select-none font-display text-left">
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

            {/* Mobile close button */}
            {mobileSidebarOpen && (
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="lg:hidden p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-stone-800 cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            )}
          </div>

          {/* Links navigation group */}
          <nav className="p-4 flex-1 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/dashboard/");
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setMobileSidebarOpen(false); // Close mobile drawer on navigation!
                  }}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-all ${
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
                </button>
              );
            })}
          </nav>

          {/* Return to Public Website section */}
          <div className="p-4 border-t border-stone-100">
            <button
              onClick={() => {
                setActiveView("landing");
                navigate("/");
                setMobileSidebarOpen(false);
              }}
              className="w-full p-2.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-all text-emerald-800 hover:bg-emerald-50/50 hover:text-emerald-950 font-bold"
            >
              <Globe className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
              {(!sidebarCollapsed || mobileSidebarOpen) && (
                <span className="text-xs leading-none">Ver Sitio Público</span>
              )}
            </button>
          </div>

        </div>

        {/* Collapser Toggle Footer */}
        <div className="p-4 border-t border-stone-100 hidden lg:flex items-center justify-between">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-stone-50 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer transition-colors mx-auto lg:mx-0"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {(() => {
          const matched = navItems.find((n) => n.path === location.pathname) || navItems[0];
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
          <React.Suspense fallback={<DashboardSkeleton />}>
            <Routes>
              <Route
                path="/"
                element={
                  <DashboardHome
                    mediaKits={mediaKits}
                    cotizaciones={cotizaciones}
                    reservas={reservas}
                    campañas={campanas}
                    clientes={clientes}
                    userRole={userRole}
                    onNavigateToTab={(tabId) => {
                      const matchedTab = navItems.find(item => item.id === tabId);
                      if (matchedTab) navigate(matchedTab.path);
                    }}
                    onApproveReserva={handleApproveReserva}
                    onApproveCotizacion={handleApproveCotizacion}
                    setCampañas={setCampanas}
                    setClientes={setClientes}
                    setCotizaciones={setCotizaciones}
                    setReservas={setReservas}
                    addLog={addLog}
                  />
                }
              />

              <Route
                path="/inventory"
                element={
                  <InventoryModule
                    screens={screens}
                    userRole={userRole}
                    onUpdateScreen={handleUpdateScreen}
                    onAddScreen={handleAddScreen}
                    onDeleteScreen={handleDeleteScreen}
                  />
                }
              />

              <Route
                path="/clients"
                element={
                  <ClientsModule
                    clientes={clientes}
                    userRole={userRole}
                    onAddCliente={handleAddCliente}
                    onUpdateCliente={handleUpdateCliente}
                  />
                }
              />

              <Route
                path="/mediakits"
                element={
                  <MediaKitModule
                    mediaKits={mediaKits}
                    clientes={clientes}
                    screens={screens}
                    userRole={userRole}
                    onUpdateMediaKit={handleUpdateMediaKit}
                    onAddMediaKit={handleAddMediaKit}
                    onDeleteMediaKit={handleDeleteMediaKit}
                    onGenerateQuoteFromMediaKit={handleGenerateQuoteFromMediaKit}
                  />
                }
              />

              <Route
                path="/settings"
                element={
                  <SettingsModule
                    userRole={userRole}
                    setUserRole={setUserRole}
                  />
                }
              />

              <Route
                path="/audit"
                element={
                  <AuditModule
                    logs={logs}
                    userRole={userRole}
                    addLog={addLog}
                    onRefreshLogs={fetchDashboardData}
                  />
                }
              />

              <Route
                path="/ai-planner"
                element={
                  <AiPlannerModule
                    screens={screens}
                    token={token}
                    onAddMediaKit={handleAddMediaKit}
                    userRole={userRole}
                  />
                }
              />

              {/* Fallback inside dashboard routing */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </React.Suspense>
        </div>
      </main>

    </div>
  );
};
