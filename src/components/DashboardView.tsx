import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useCms } from "./CmsContext";
import { DoohScreen } from "../types";
import { useToast } from "./ui/Toast";
import { safeFetchJson } from "../lib/apiClient";

// Shared types and local helpers
import { Role, MediaKit, Cliente, ChangeLog, Cotizacion, Reserva, Campaña } from "./dashboard/types";
import { 
  INITIAL_COTIZACIONES, 
  INITIAL_RESERVAS, 
  INITIAL_CAMPAÑAS, 
} from "./dashboard/mockData";

// Modular sub-views
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardHome } from "./dashboard/DashboardHome";
import { InventoryModule } from "./dashboard/InventoryModule";
import { MediaKitModule } from "./dashboard/MediaKitModule";
import { ClientsModule } from "./dashboard/ClientsModule";
import { SettingsModule } from "./dashboard/SettingsModule";
import { AiPlannerModule } from "./dashboard/AiPlannerModule";
import { SlidesSyncModule } from "./dashboard/SlidesSyncModule";
import { AdministrationModule } from "./dashboard/AdministrationModule";
import { GmailModule } from "./dashboard/GmailModule";
import { LeadsModule } from "./dashboard/LeadsModule";
import { LocationsModule } from "./dashboard/LocationsModule";
import { ReportsModule } from "./dashboard/ReportsModule";

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
  Database,
  Shield,
  Mail as MailIcon,
  MapPin,
  BarChart3,
  Inbox
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  desc: string;
}

export const NavGroups = [
  {
    groupName: "GENERAL",
    items: [
      { id: "home", label: "Dashboard", icon: HomeIcon, path: "/dashboard", desc: "Métricas generales y centro de control comercial" },
      { id: "leads", label: "Leads", icon: Inbox, path: "/dashboard/leads", desc: "Gestión de leads y prospección comercial" },
      { id: "gmail", label: "Contactos", icon: MailIcon, path: "/dashboard/gmail", desc: "Bandeja de entrada y envío de correos integrados con Gmail" }
    ]
  },
  {
    groupName: "OPERACIÓN",
    items: [
      { id: "ai-planner", label: "Campañas", icon: Sparkles, path: "/dashboard/ai-planner", desc: "Optimización inteligente de campañas y ROI mediante Inteligencia Artificial" },
      { id: "clientes", label: "Clientes", icon: Users, path: "/dashboard/clients", desc: "Registro de contactos de ventas, agencias y corporativos" },
      { id: "locations", label: "Ubicaciones", icon: MapPin, path: "/dashboard/locations", desc: "Georreferenciación y cobertura de soportes en tiempo real" },
      { id: "inventario", label: "Inventario", icon: Tv, path: "/dashboard/inventory", desc: "Edición y administración del catálogo de soportes físicos y pantallas LED" }
    ]
  },
  {
    groupName: "ANÁLISIS",
    items: [
      { id: "reports", label: "Analytics", icon: BarChart3, path: "/dashboard/reports", desc: "Métricas de conversión y rendimiento comercial" },
      { id: "mediakit", label: "Reportes", icon: FileText, path: "/dashboard/mediakits", desc: "Diseño Notion-style y generación de propuestas comerciales inteligentes con IA" }
    ]
  },
  {
    groupName: "CONFIGURACIÓN",
    items: [
      { id: "settings", label: "Configuración", icon: Settings, path: "/dashboard/settings", desc: "Control de usuario y preferencias del sistema" },
      { id: "admin", label: "Usuarios", icon: Shield, path: "/dashboard/admin", desc: "Gobernanza de seguridad, usuarios, roles, logs, storage y SEO técnico" }
    ]
  }
];

// Flat navigation list for routing and active tab checks
export const NavItems: NavItem[] = NavGroups.reduce<NavItem[]>((acc, group) => [...acc, ...group.items], []);

export const DashboardView: React.FC = () => {
  const { token, user, userRole: authUserRole } = useAuth();
  const { setActiveView, setScreens: setCmsScreens } = useCms();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Active User Profile (RBAC state)
  const [userRole, setUserRole] = useState<Role>("comercial_dir");

  useEffect(() => {
    if (authUserRole === "admin") {
      setUserRole("admin");
    }
  }, [authUserRole]);

  // Sidebar navigation state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
  const [loadingScreens, setLoadingScreens] = useState(true);

  // Load state from PostgreSQL APIs
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const [screensRes, clientsRes, mkRes, logsRes] = await Promise.all([
        safeFetchJson<{ success: boolean; data: DoohScreen[] }>("/api/screens", { headers }),
        safeFetchJson<{ success: boolean; data: Cliente[] }>("/api/clients", { headers }),
        safeFetchJson<{ success: boolean; data: MediaKit[] }>("/api/mediakits", { headers }),
        safeFetchJson<{ success: boolean; data: ChangeLog[] }>("/api/changelogs", { headers }),
      ]);

      if (screensRes.data?.success && Array.isArray(screensRes.data.data)) {
        setScreens(screensRes.data.data);
        setCmsScreens(screensRes.data.data);
      }
      if (clientsRes.data?.success && Array.isArray(clientsRes.data.data)) setClientes(clientsRes.data.data);
      if (mkRes.data?.success && Array.isArray(mkRes.data.data)) setMediaKits(mkRes.data.data);
      if (logsRes.data?.success && Array.isArray(logsRes.data.data)) setLogs(logsRes.data.data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [token, setCmsScreens]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // On mount, load screens from Firestore under centralized management (with local fallback)
  useEffect(() => {
    const loadScreensFromFirestore = async () => {
      setLoadingScreens(true);
      try {
        const { collection, getDocs, doc, setDoc } = await import("firebase/firestore");
        const { db } = await import("../lib/firebase");
        const snapshot = await getDocs(collection(db, "screens"));
        const fsScreens: DoohScreen[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fsScreens.push({
            id: docSnap.id,
            nombre: data.nombre || "",
            zona: data.zona || "",
            tipo: data.tipo || "Peatonal",
            categoria: data.categoria || "Pantallas LED",
            ciudad: data.ciudad || "Mendoza",
            impactos: Number(data.impactos) || 0,
            precio: Number(data.precio) || 0,
            status: data.status || "Activo",
            lat: Number(data.lat) || 0,
            lng: Number(data.lng) || 0,
            nota: data.nota || "",
            dimensiones: data.dimensiones || "",
            brillo: data.brillo || "",
            refreshRate: data.refreshRate || "",
            formato: data.formato || "",
            cobertura: data.cobertura || "",
          });
        });

        if (fsScreens.length > 0) {
          setScreens(fsScreens);
          setCmsScreens(fsScreens);
        } else {
          // If Firestore contains no screens yet, seed it with local store screens
          const { useCmsStore } = await import("./CmsContext");
          const defaultScreens = useCmsStore.getState().screens || [];
          for (const s of defaultScreens) {
            await setDoc(doc(db, "screens", s.id), s);
          }
          setScreens(defaultScreens);
          setCmsScreens(defaultScreens);
        }
      } catch (err) {
        console.warn("[DashboardView] Firestore screens load failed, falling back:", err);
        const { useCmsStore } = await import("./CmsContext");
        const defaultScreens = useCmsStore.getState().screens || [];
        setScreens(defaultScreens);
      } finally {
        // Explicit slight delay for a realistic loading feel to show the skeleton
        setTimeout(() => {
          setLoadingScreens(false);
        }, 1200);
      }
    };
    loadScreensFromFirestore();
  }, [setCmsScreens]);

  // 1. On mount, load campaigns from Firestore for centralized management
  useEffect(() => {
    const loadCampaignsFromFirestore = async () => {
      try {
        const { collection, getDocs } = await import("firebase/firestore");
        const { db } = await import("../lib/firebase");
        const snapshot = await getDocs(collection(db, "campaigns"));
        const fsCamps: Campaña[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fsCamps.push({
            id: docSnap.id,
            reservaId: data.reservaId || "",
            clienteNombre: data.clienteNombre || "",
            nombre: data.nombre || "",
            screenId: data.screenId || "",
            screenNombre: data.screenNombre || "",
            fechaInicio: data.fechaInicio || "",
            fechaFin: data.fechaFin || "",
            progreso: Number(data.progreso) || 0,
            estado: data.estado || "Planificada",
          });
        });
        if (fsCamps.length > 0) {
          setCampanas(fsCamps);
        }
      } catch (err) {
        console.warn("[DashboardView] Firestore campaigns load failed, using local mock data:", err);
      }
    };
    loadCampaignsFromFirestore();
  }, []);

  // 2. Whenever campanas state changes, sync the latest elements to Firestore
  useEffect(() => {
    const syncCampaignsToFirestore = async () => {
      if (campanas === INITIAL_CAMPAÑAS) return;
      try {
        const { doc, setDoc } = await import("firebase/firestore");
        const { db } = await import("../lib/firebase");
        
        for (const c of campanas) {
          await setDoc(doc(db, "campaigns", c.id), {
            id: c.id,
            reservaId: c.reservaId || "",
            clienteNombre: c.clienteNombre || "",
            nombre: c.nombre || "",
            screenId: c.screenId || "",
            screenNombre: c.screenNombre || "",
            fechaInicio: c.fechaInicio || "",
            fechaFin: c.fechaFin || "",
            progreso: Number(c.progreso) || 0,
            estado: c.estado || "Planificada",
          }, { merge: true });
        }
      } catch (err) {
        console.warn("[DashboardView] Firestore campaigns sync failed:", err);
      }
    };
    syncCampaignsToFirestore();
  }, [campanas]);

  // DB-Connected Changelog Logger
  const addLog = useCallback(async (action: string) => {
    if (!token) return;
    const userLabel = userRole === "admin" ? "Administrador" : userRole === "comercial_dir" ? "Director Comercial" : "Comercial Ejec.";
    const newLog = {
      id: `lg-gen-${Date.now()}`,
      user: userLabel,
      action,
      date: "Justo ahora",
    };

    try {
      const res = await safeFetchJson<{ success: boolean; data: ChangeLog }>("/api/changelogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newLog),
      });
      if (res.data?.success && res.data.data) {
        setLogs((prev) => [res.data!.data, ...prev]);
      }
    } catch (err) {
      setLogs((prev) => [newLog, ...prev]);
    }
  }, [token, userRole]);

  // --- CRUD HANDLERS CONNECTED TO POSTGRESQL ---

  // Inventory Screen Add
  const handleAddScreen = useCallback(async (screen: DoohScreen) => {
    // 1. Save to Firebase Firestore directly for immediate centralized updates
    let fsAdded = false;
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      const { db } = await import("../lib/firebase");
      await setDoc(doc(db, "screens", screen.id), screen);
      fsAdded = true;
    } catch (fsErr) {
      console.warn("Direct Firestore screen save failed:", fsErr);
    }

    if (!token) {
      if (fsAdded) {
        setScreens((prev) => {
          const next = [...prev.filter(s => s.id !== screen.id), screen];
          setCmsScreens(next);
          return next;
        });
        addLog(`Agregó un nuevo soporte al catálogo comercial: ${screen.nombre}`);
        toast.success(`Soporte "${screen.nombre}" agregado correctamente.`);
      } else {
        toast.error("No hay token disponible ni se pudo conectar a Firestore.");
      }
      return;
    }

    try {
      const res = await safeFetchJson<{ success: boolean; data: DoohScreen; error?: string }>("/api/screens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-User-Role": userRole
        },
        body: JSON.stringify(screen),
      });
      if (res.data?.success && res.data.data) {
        const added = res.data.data;
        setScreens((prev) => {
          const next = [...prev.filter(s => s.id !== added.id), added];
          setCmsScreens(next);
          return next;
        });
        addLog(`Agregó un nuevo soporte al catálogo comercial: ${screen.nombre}`);
        toast.success(`Soporte "${screen.nombre}" agregado correctamente.`);
      } else {
        // If PostgreSQL API fails, keep the Firestore version if it succeeded!
        if (fsAdded) {
          setScreens((prev) => {
            const next = [...prev.filter(s => s.id !== screen.id), screen];
            setCmsScreens(next);
            return next;
          });
          addLog(`Agregó un nuevo soporte al catálogo comercial: ${screen.nombre}`);
          toast.success(`Soporte "${screen.nombre}" agregado correctamente.`);
        } else {
          toast.error(res.data?.error || res.error || "No se pudo agregar el soporte comercial.");
        }
      }
    } catch (err) {
      if (fsAdded) {
        setScreens((prev) => {
          const next = [...prev.filter(s => s.id !== screen.id), screen];
          setCmsScreens(next);
          return next;
        });
        addLog(`Agregó un nuevo soporte al catálogo comercial: ${screen.nombre}`);
        toast.success(`Soporte "${screen.nombre}" agregado correctamente.`);
      } else {
        toast.error("Error de red al intentar agregar el soporte.");
      }
    }
  }, [token, userRole, setCmsScreens, addLog, toast]);

  // Inventory Screen Update
  const handleUpdateScreen = useCallback(async (id: string, updatedFields: Partial<DoohScreen>) => {
    let fsUpdated = false;
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const { db } = await import("../lib/firebase");
      await updateDoc(doc(db, "screens", id), updatedFields);
      fsUpdated = true;
    } catch (fsErr) {
      console.warn("Direct Firestore screen update failed:", fsErr);
    }

    const screenName = screens.find((s) => s.id === id)?.nombre || id;

    if (!token) {
      if (fsUpdated) {
        setScreens((prev) => {
          const next = prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
          setCmsScreens(next);
          return next;
        });
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
        toast.error("No hay token disponible ni se pudo conectar a Firestore.");
      }
      return;
    }

    try {
      const res = await safeFetchJson<{ success: boolean; data: DoohScreen; error?: string }>(`/api/screens/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-User-Role": userRole
        },
        body: JSON.stringify(updatedFields),
      });
      if (res.data?.success && res.data.data) {
        const updated = res.data.data;
        setScreens((prev) => {
          const next = prev.map((s) => (s.id === id ? updated : s));
          setCmsScreens(next);
          return next;
        });
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
        if (fsUpdated) {
          setScreens((prev) => {
            const next = prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
            setCmsScreens(next);
            return next;
          });
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
          toast.error(res.data?.error || res.error || "No se pudo actualizar el soporte comercial.");
        }
      }
    } catch (err) {
      if (fsUpdated) {
        setScreens((prev) => {
          const next = prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
          setCmsScreens(next);
          return next;
        });
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
        toast.error("Error de red al intentar actualizar el soporte.");
      }
    }
  }, [token, userRole, screens, setCmsScreens, addLog, toast]);

  // Inventory Screen Delete
  const handleDeleteScreen = useCallback(async (id: string) => {
    let fsDeleted = false;
    try {
      const { doc, deleteDoc } = await import("firebase/firestore");
      const { db } = await import("../lib/firebase");
      await deleteDoc(doc(db, "screens", id));
      fsDeleted = true;
    } catch (fsErr) {
      console.warn("Direct Firestore screen delete failed:", fsErr);
    }

    const screenName = screens.find((s) => s.id === id)?.nombre || id;

    if (!token) {
      if (fsDeleted) {
        setScreens((prev) => {
          const next = prev.filter((s) => s.id !== id);
          setCmsScreens(next);
          return next;
        });
        addLog(`Eliminó de manera permanente el soporte comercial: ${screenName}`);
        toast.success(`Soporte "${screenName}" eliminado definitivamente.`);
      } else {
        toast.error("No hay token disponible ni se pudo conectar a Firestore.");
      }
      return;
    }

    try {
      const res = await safeFetchJson<{ success: boolean; error?: string }>(`/api/screens/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-User-Role": userRole
        },
      });
      if (res.data?.success) {
        setScreens((prev) => {
          const next = prev.filter((s) => s.id !== id);
          setCmsScreens(next);
          return next;
        });
        addLog(`Eliminó de manera permanente el soporte comercial: ${screenName}`);
        toast.success(`Soporte "${screenName}" eliminado definitivamente.`);
      } else {
        if (fsDeleted) {
          setScreens((prev) => {
            const next = prev.filter((s) => s.id !== id);
            setCmsScreens(next);
            return next;
          });
          addLog(`Eliminó de manera permanente el soporte comercial: ${screenName}`);
          toast.success(`Soporte "${screenName}" eliminado definitivamente.`);
        } else {
          toast.error(`Error de permisos: ${res.data?.error || res.error || "No tienes privilegios para realizar esta acción."}`);
        }
      }
    } catch (err: any) {
      if (fsDeleted) {
        setScreens((prev) => {
          const next = prev.filter((s) => s.id !== id);
          setCmsScreens(next);
          return next;
        });
        addLog(`Eliminó de manera permanente el soporte comercial: ${screenName}`);
        toast.success(`Soporte "${screenName}" eliminado definitivamente.`);
      } else {
        toast.error("Error de conexión al intentar eliminar el soporte.");
      }
    }
  }, [token, userRole, screens, setCmsScreens, addLog, toast]);

  // Clients CRM Add
  const handleAddCliente = useCallback(async (cliente: Cliente) => {
    if (!token) return;
    try {
      const res = await safeFetchJson<{ success: boolean; data: Cliente; error?: string }>("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(cliente),
      });
      if (res.data?.success && res.data.data) {
        setClientes((prev) => [...prev, res.data!.data]);
        addLog(`Registró un nuevo cliente en el CRM: ${cliente.empresa}`);
        toast.success(`Cliente "${cliente.empresa}" registrado con éxito.`);
      } else {
        toast.error(res.data?.error || res.error || "No se pudo registrar el cliente.");
      }
    } catch (err) {
      toast.error("Error de conexión al intentar registrar el cliente.");
    }
  }, [token, addLog, toast]);

  // Clients CRM Update
  const handleUpdateCliente = useCallback(async (id: string, updatedFields: Partial<Cliente>) => {
    if (!token) return;
    try {
      const res = await safeFetchJson<{ success: boolean; data: Cliente; error?: string }>(`/api/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      if (res.data?.success && res.data.data) {
        setClientes((prev) => prev.map((c) => (c.id === id ? res.data!.data : c)));
        addLog(`Actualizó el perfil/estado del cliente CRM: ${res.data.data.empresa}`);
        toast.success(`Cliente "${res.data.data.empresa}" actualizado.`);
      } else {
        toast.error(res.data?.error || res.error || "No se pudo actualizar el cliente.");
      }
    } catch (err) {
      toast.error("Error de conexión al intentar actualizar el cliente.");
    }
  }, [token, addLog, toast]);

  // MediaKit Creator
  const handleAddMediaKit = useCallback(async (mk: MediaKit) => {
    if (!token) return;
    try {
      const res = await safeFetchJson<{ success: boolean; data: MediaKit; error?: string }>("/api/mediakits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(mk),
      });
      if (res.data?.success && res.data.data) {
        setMediaKits((prev) => [res.data!.data, ...prev]);
        addLog(`Creó la propuesta MediaKit: ${mk.nombre}`);
        toast.success(`Propuesta MediaKit "${mk.nombre}" guardada con éxito.`);
      } else {
        toast.error(res.data?.error || res.error || "No se pudo guardar la propuesta.");
      }
    } catch (err) {
      toast.error("Error de conexión al guardar el MediaKit.");
    }
  }, [token, addLog, toast]);

  // MediaKit Updater
  const handleUpdateMediaKit = useCallback(async (id: string, updatedFields: Partial<MediaKit>) => {
    if (!token) return;
    try {
      const res = await safeFetchJson<{ success: boolean; data: MediaKit; error?: string }>(`/api/mediakits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      if (res.data?.success && res.data.data) {
        setMediaKits((prev) => prev.map((m) => (m.id === id ? res.data!.data : m)));
        toast.success("MediaKit actualizado.");
      } else {
        toast.error(res.data?.error || res.error || "No se pudo actualizar la propuesta.");
      }
    } catch (err) {
      toast.error("Error de conexión al actualizar el MediaKit.");
    }
  }, [token, toast]);

  // MediaKit Deleter
  const handleDeleteMediaKit = useCallback(async (id: string) => {
    if (!token) return;
    try {
      const res = await safeFetchJson<{ success: boolean; error?: string }>(`/api/mediakits/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (res.data?.success) {
        setMediaKits((prev) => prev.filter((m) => m.id !== id));
        addLog(`Eliminó propuesta MediaKit id: ${id}`);
        toast.success("Propuesta eliminada correctamente.");
      } else {
        toast.error(res.data?.error || res.error || "No se pudo eliminar la propuesta.");
      }
    } catch (err) {
      toast.error("Error de conexión al eliminar el MediaKit.");
    }
  }, [token, addLog, toast]);

  // Workflow Transition: Generate Quote from MediaKit
  const handleGenerateQuoteFromMediaKit = useCallback(async (mkId: string) => {
    const mk = mediaKits.find((m) => m.id === mkId);
    if (!mk) return;

    const baseCost = mk.soportesEdicionInline.reduce((sum, item) => {
      const scr = screens.find((s) => s.id === item.id);
      return sum + (scr?.precio || 0) * item.duracionSem;
    }, 0);

    const qtId = `qt-gen-${Date.now()}`;
    await handleUpdateMediaKit(mkId, { estado: "Cotizando" });
    addLog(`Generó Cotización #${qtId} (Total: $${baseCost.toLocaleString()}) a partir de propuesta MediaKit: ${mk.nombre}`);
  }, [mediaKits, screens, handleUpdateMediaKit, addLog]);

  // Interactive UI workflows: Approval bookings
  const handleApproveReserva = useCallback((id: string) => {
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: "Confirmada" } : r))
    );
    addLog(`Aprobó y reservó de forma permanente la reserva comercial #${id}`);
  }, [addLog]);

  // Interactive UI workflows: Approval quotations
  const handleApproveCotizacion = useCallback((id: string) => {
    setCotizaciones((prev) =>
      prev.map((q) => (q.id === id ? { ...q, estado: "Aceptada" } : q))
    );
    addLog(`Aprobó propuesta de tarifa comercial en Cotización #${id}`);
  }, [addLog]);

  const handleNavigateToTab = useCallback((tabId: string) => {
    const matchedTab = NavItems.find(item => item.id === tabId);
    if (matchedTab) navigate(matchedTab.path);
  }, [navigate]);

  // Active route header metadata
  const currentRouteMeta = useMemo(() => {
    const matched = NavItems.find((n) => n.path === location.pathname) || NavItems[0];
    return {
      title: matched?.label || "Consola de Gestión",
      desc: matched?.desc || "Consola general de administración comercial DOOH.",
    };
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center font-sans">
        <Loader className="h-8 w-8 animate-spin text-[#06434a]" />
        <p className="mt-3 text-xs font-bold text-stone-500 uppercase tracking-widest">Sincronizando con PostgreSQL...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF9F5] text-stone-800 font-sans">
      
      {/* 1. Sidebar Panel */}
      <aside className={`border-r border-stone-200 bg-white flex flex-col justify-between transition-all duration-300 relative shrink-0 z-50 shadow-2xs ${
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
          <nav className="p-4 flex-1 space-y-4">
            {NavGroups.map((group) => (
              <div key={group.groupName} className="space-y-1">
                {!sidebarCollapsed && (
                  <span className="block px-2 text-[9px] font-black tracking-widest text-stone-400 uppercase font-mono mb-1.5">
                    {group.groupName}
                  </span>
                )}
                {group.items.map((item) => {
                  const active = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/dashboard/");
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={`w-full p-2 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-all ${
                        active 
                          ? "bg-[#06434a] text-white font-bold shadow-xs" 
                          : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-amber-300 animate-pulse" : ""}`} />
                      {!sidebarCollapsed && (
                        <div className="min-w-0 text-left">
                          <span className="text-xs leading-none">{item.label}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Return to Public Website section */}
          <div className="p-4 border-t border-stone-100">
            <button
              onClick={() => {
                setActiveView("landing");
                navigate("/");
              }}
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
        <DashboardHeader
          userRole={userRole}
          setUserRole={setUserRole}
          title={currentRouteMeta.title}
          description={currentRouteMeta.desc}
        />

        {/* Sub-view router container */}
        <div className="flex-1 overflow-y-auto relative bg-[#FAF9F5]">
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
                  onNavigateToTab={handleNavigateToTab}
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
                  isLoading={loadingScreens}
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

            <Route
              path="/sync"
              element={
                <SlidesSyncModule
                  token={token}
                  onRefreshInventory={fetchDashboardData}
                />
              }
            />

            <Route
              path="/gmail"
              element={
                <GmailModule
                  token={token}
                />
              }
            />

            <Route
              path="/admin"
              element={
                <AdministrationModule
                  logs={logs}
                  userRole={userRole}
                  screens={screens}
                  onUpdateScreen={handleUpdateScreen}
                  addLog={addLog}
                />
              }
            />

            <Route
              path="/leads"
              element={
                <LeadsModule />
              }
            />

            <Route
              path="/locations"
              element={
                <LocationsModule />
              }
            />

            <Route
              path="/reports"
              element={
                <ReportsModule />
              }
            />

            {/* Fallback inside dashboard routing */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>

    </div>
  );
};

