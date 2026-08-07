import React, { useState, useMemo } from "react";
import { DoohScreen } from "../../types";
import { ChangeLog, Role } from "./types";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Users,
  Layers,
  MapPin,
  Clock,
  AlertOctagon,
  HardDrive,
  Globe,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  RefreshCw,
  Eye,
  X,
  Search,
  UploadCloud,
  FileText,
  Image,
  Video,
  ExternalLink,
  Sliders,
  ChevronRight,
  Database
} from "lucide-react";
import { useToast } from "../ui/Toast";

interface AdministrationModuleProps {
  logs: ChangeLog[];
  userRole: Role;
  screens: DoohScreen[];
  onUpdateScreen: (id: string, data: Partial<DoohScreen>) => void;
  addLog: (action: string) => Promise<void> | void;
}

// Interfaces for our state
interface AdminUser {
  id: string;
  nombre: string;
  email: string;
  role: Role;
  estado: "Activo" | "Inactivo" | "Suspendido";
  fechaCreado: string;
}

interface StorageAsset {
  id: string;
  nombre: string;
  tipo: "Imagen" | "Video" | "Documento";
  tamano: string;
  resolucion?: string;
  fechaSubido: string;
  url: string;
}

interface SystemError {
  id: string;
  codigo: string;
  mensaje: string;
  modulo: string;
  timestamp: string;
  severidad: "Baja" | "Media" | "Crítica";
}

export const AdministrationModule: React.FC<AdministrationModuleProps> = ({
  logs,
  userRole,
  screens,
  onUpdateScreen,
  addLog,
}) => {
  const { toast } = useToast();

  // Selected Active Admin Tab
  const [activeAdminTab, setActiveAdminTab] = useState<
    "usuarios" | "ciudades" | "auditoria" | "storage" | "seo"
  >("usuarios");

  // --- STATE 1: USERS & RBAC ---
  const [usersList, setUsersList] = useState<AdminUser[]>([
    {
      id: "usr-01",
      nombre: "Luis Grasso",
      email: "grasso.luis@gmail.com",
      role: "admin",
      estado: "Activo",
      fechaCreado: "2026-01-15",
    },
    {
      id: "usr-02",
      nombre: "Sofía Martínez",
      email: "s.martinez@comunicarte.com",
      role: "comercial_dir",
      estado: "Activo",
      fechaCreado: "2026-02-10",
    },
    {
      id: "usr-03",
      nombre: "Juan Perez",
      email: "j.perez@comunicarte.com",
      role: "comercial_exec",
      estado: "Activo",
      fechaCreado: "2026-03-01",
    },
    {
      id: "usr-04",
      nombre: "Gisela Oro",
      email: "g.oro@comunicarte.com",
      role: "ops",
      estado: "Activo",
      fechaCreado: "2026-04-12",
    },
    {
      id: "usr-05",
      nombre: "Auditor Externo",
      email: "auditor@agency.com",
      role: "viewer",
      estado: "Inactivo",
      fechaCreado: "2026-05-20",
    },
  ]);

  const [userForm, setUserForm] = useState({
    nombre: "",
    email: "",
    role: "comercial_exec" as Role,
    estado: "Activo" as "Activo" | "Inactivo" | "Suspendido",
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // RBAC Permission Grid State
  const [rolePermissions, setRolePermissions] = useState<
    Record<Role, Record<string, boolean>>
  >({
    admin: {
      editInventory: true,
      manageClients: true,
      manageMediaKits: true,
      syncSlides: true,
      manageStorage: true,
      manageConfig: true,
      viewAuditLogs: true,
    },
    comercial_dir: {
      editInventory: true,
      manageClients: true,
      manageMediaKits: true,
      syncSlides: true,
      manageStorage: true,
      manageConfig: false,
      viewAuditLogs: true,
    },
    comercial_exec: {
      editInventory: false,
      manageClients: true,
      manageMediaKits: true,
      syncSlides: false,
      manageStorage: false,
      manageConfig: false,
      viewAuditLogs: false,
    },
    ops: {
      editInventory: true,
      manageClients: false,
      manageMediaKits: false,
      syncSlides: true,
      manageStorage: true,
      manageConfig: false,
      viewAuditLogs: true,
    },
    viewer: {
      editInventory: false,
      manageClients: false,
      manageMediaKits: false,
      syncSlides: false,
      manageStorage: false,
      manageConfig: false,
      viewAuditLogs: false,
    },
  });

  const permissionLabels: Record<string, { label: string; desc: string }> = {
    editInventory: {
      label: "Modificar Inventario",
      desc: "Crear, duplicar, archivar o editar pantallas y soportes publicitarios",
    },
    manageClients: {
      label: "Gestión CRM de Clientes",
      desc: "Agregar nuevos contactos de agencias y actualizar su historial",
    },
    manageMediaKits: {
      label: "Generar Propuestas & MediaKits",
      desc: "Crear, editar tarifas personalizadas y exportar PDFs comerciales",
    },
    syncSlides: {
      label: "Sincronizar Google Slides",
      desc: "Ejecutar la ingesta automática ETL desde archivos de Google Drive",
    },
    manageStorage: {
      label: "Almacenamiento de Multimedia",
      desc: "Subir y purgar imágenes, videos o documentos comerciales en Storage",
    },
    manageConfig: {
      label: "Configuración Global & SEO",
      desc: "Modificar plantillas meta-tag SEO, vaciar caché y alternar modo mantenimiento",
    },
    viewAuditLogs: {
      label: "Ver Auditoría & Logs",
      desc: "Inspeccionar bitácoras de actividades de usuario y trazas de error",
    },
  };

  // --- STATE 2: CITIES & CATEGORIES ---
  const [citiesList, setCitiesList] = useState([
    { id: "cit-1", nombre: "Mendoza", lat: -32.8894, lng: -68.8458, desc: "Sede principal del centro oeste" },
    { id: "cit-2", nombre: "Buenos Aires", lat: -34.6037, lng: -58.3816, desc: "Eje estratégico de alta densidad" },
    { id: "cit-3", nombre: "Córdoba", lat: -31.4201, lng: -64.1888, desc: "Gran cobertura vehicular" },
    { id: "cit-4", nombre: "Rosario", lat: -32.9468, lng: -60.6393, desc: "Plaza portuaria y corredor comercial" },
  ]);

  const [categoriesList, setCategoriesList] = useState([
    "Pantallas LED",
    "Tradicionales",
    "LED Móvil",
    "Vallas Séxtuples",
    "Tótems Digitales",
  ]);

  const [newCityForm, setNewCityForm] = useState({ nombre: "", lat: 0, lng: 0, desc: "" });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCityModal, setShowAddCityModal] = useState(false);

  // --- STATE 3: AUDITING (LOGS & ERRORS) ---
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [rollbackTarget, setRollbackTarget] = useState<ChangeLog | null>(null);

  // Error tracking log
  const [systemErrors, setSystemErrors] = useState<SystemError[]>([
    {
      id: "err-01",
      codigo: "OAuth 401",
      mensaje: "Fallo de handshake OAuth con la API de Google Slides. Credenciales expiradas.",
      modulo: "GoogleSlidesSync",
      timestamp: "Hace 15 minutos",
      severidad: "Crítica",
    },
    {
      id: "err-02",
      codigo: "Storage 403",
      mensaje: "Acceso denegado al intentar subir archivo 'pauta-san-martin.mp4'. Permiso insuficiente.",
      modulo: "FirebaseStorage",
      timestamp: "Hace 1 hora",
      severidad: "Media",
    },
    {
      id: "err-03",
      codigo: "DB 500",
      mensaje: "Tiempo de espera agotado al consultar métricas de pauta activa en base de datos PostgreSQL.",
      modulo: "DashboardAnalytics",
      timestamp: "Hace 4 horas",
      severidad: "Baja",
    },
  ]);
  const [errorSearchQuery, setErrorSearchQuery] = useState("");

  // --- STATE 4: STORAGE MANAGER ---
  const [storageAssets, setStorageAssets] = useState<StorageAsset[]>([
    {
      id: "ast-01",
      nombre: "mendoza_peatonal_banner.jpg",
      tipo: "Imagen",
      tamano: "2.4 MB",
      resolucion: "1920 x 1080",
      fechaSubido: "2026-07-28",
      url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
    },
    {
      id: "ast-02",
      nombre: "pauta_led_mendoza_buenos_aires.mp4",
      tipo: "Video",
      tamano: "15.8 MB",
      resolucion: "3840 x 2160 (4K)",
      fechaSubido: "2026-07-30",
      url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4",
    },
    {
      id: "ast-03",
      nombre: "ficha_tecnica_tradicionales.pdf",
      tipo: "Documento",
      tamano: "1.2 MB",
      fechaSubido: "2026-08-01",
      url: "https://grupocomunicarte.com/mediakit/ficha.pdf",
    },
  ]);
  const [uploadingProgress, setUploadingProgress] = useState<number | null>(null);
  const [previewAsset, setPreviewAsset] = useState<StorageAsset | null>(null);
  const [storageSearchQuery, setStorageSearchQuery] = useState("");

  // --- STATE 5: SEO ENGINE & SYSTEM CONFIG ---
  const [seoForm, setSeoForm] = useState({
    titleTemplate: "Grupo Comunicarte | %s",
    metaDescription: "SaaS de Publicidad Exterior (OOH & DOOH) inteligente. Gestiona inventarios de pantallas LED, planifica campañas mediante IA y automatiza la ingesta comercial.",
    faviconUrl: "/favicon.ico",
    robotsTxt: "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /dashboard/",
    sitemapUrl: "https://grupocomunicarte.com/sitemap.xml",
  });

  const [cacheClearing, setCacheClearing] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // --- HANDLERS ---

  // RBAC Permission toggle (Authorized for admin)
  const handleTogglePermission = (role: Role, permKey: string) => {
    if (userRole !== "admin") {
      toast.error("Error: Solo el Administrador Global puede reconfigurar las directivas de acceso (RBAC).");
      return;
    }
    setRolePermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permKey]: !prev[role][permKey],
      },
    }));
    toast.success(`Directiva de seguridad actualizada para el rol "${role}".`);
    addLog(`Modificó políticas de acceso (RBAC) para el rol ${role.toUpperCase()}: ${permKey}`);
  };

  // Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.nombre || !userForm.email) {
      toast.error("Por favor completa los campos requeridos.");
      return;
    }
    const newUser: AdminUser = {
      id: `usr-new-${Date.now()}`,
      nombre: userForm.nombre,
      email: userForm.email,
      role: userForm.role,
      estado: userForm.estado,
      fechaCreado: new Date().toISOString().split("T")[0],
    };
    setUsersList((prev) => [...prev, newUser]);
    setShowAddUserModal(false);
    toast.success(`Usuario "${newUser.nombre}" creado exitosamente.`);
    addLog(`Creó el nuevo perfil de usuario: ${newUser.nombre} (${newUser.role.toUpperCase()})`);
    setUserForm({ nombre: "", email: "", role: "comercial_exec", estado: "Activo" });
  };

  // Delete User
  const handleDeleteUser = (id: string, name: string) => {
    if (userRole !== "admin") {
      toast.error("Privilegios insuficientes para eliminar usuarios.");
      return;
    }
    setUsersList((prev) => prev.filter((u) => u.id !== id));
    toast.success(`Usuario "${name}" eliminado del sistema.`);
    addLog(`Eliminó de forma definitiva el perfil de usuario: ${name}`);
  };

  // Toggle User Status
  const handleToggleUserStatus = (id: string, currentStatus: "Activo" | "Inactivo" | "Suspendido") => {
    const nextStatus = currentStatus === "Activo" ? "Suspendido" : "Activo";
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, estado: nextStatus } : u))
    );
    toast.info(`Estado de usuario cambiado a ${nextStatus}.`);
    const userName = usersList.find((u) => u.id === id)?.nombre || "Usuario";
    addLog(`Modificó el estado del usuario "${userName}" a ${nextStatus}`);
  };

  // Add City
  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityForm.nombre || !newCityForm.lat || !newCityForm.lng) {
      toast.error("Por favor ingresa nombre y coordenadas.");
      return;
    }
    const newCity = {
      id: `cit-${Date.now()}`,
      nombre: newCityForm.nombre,
      lat: Number(newCityForm.lat),
      lng: Number(newCityForm.lng),
      desc: newCityForm.desc || "Nueva plaza comercial agregada",
    };
    setCitiesList((prev) => [...prev, newCity]);
    setShowAddCityModal(false);
    toast.success(`Plaza comercial "${newCity.nombre}" agregada.`);
    addLog(`Agregó una nueva plaza geográfica al catálogo: ${newCity.nombre}`);
    setNewCityForm({ nombre: "", lat: 0, lng: 0, desc: "" });
  };

  // Delete City
  const handleDeleteCity = (id: string, name: string) => {
    // Check if there are active screens in this city
    const screensInCity = screens.filter((s) => s.ciudad === name);
    if (screensInCity.length > 0) {
      toast.error(`No es posible eliminar "${name}". Tiene ${screensInCity.length} pantallas vinculadas en el inventario.`);
      return;
    }
    setCitiesList((prev) => prev.filter((c) => c.id !== id));
    toast.success(`Plaza "${name}" removida.`);
    addLog(`Eliminó la plaza geográfica del catálogo: ${name}`);
  };

  // Add Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (categoriesList.includes(newCategoryName.trim())) {
      toast.error("La categoría ya existe.");
      return;
    }
    setCategoriesList((prev) => [...prev, newCategoryName.trim()]);
    toast.success(`Categoría "${newCategoryName}" agregada.`);
    addLog(`Agregó la categoría de soporte técnico: ${newCategoryName}`);
    setNewCategoryName("");
  };

  // Delete Category
  const handleDeleteCategory = (catName: string) => {
    const screensWithCat = screens.filter((s) => s.categoria === catName);
    if (screensWithCat.length > 0) {
      toast.error(`No es posible eliminar. Hay ${screensWithCat.length} soportes asociados en el inventario.`);
      return;
    }
    setCategoriesList((prev) => prev.filter((c) => c !== catName));
    toast.success(`Categoría "${catName}" eliminada.`);
    addLog(`Eliminó la categoría de soporte: ${catName}`);
  };

  // Simulated File Drop / Upload Handler
  const handleFileUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProgress(10);
    const interval = setInterval(() => {
      setUploadingProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const isImage = file.type.startsWith("image/");
            const isVideo = file.type.startsWith("video/");
            const newAsset: StorageAsset = {
              id: `ast-${Date.now()}`,
              nombre: file.name,
              tipo: isImage ? "Imagen" : isVideo ? "Video" : "Documento",
              tamano: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              resolucion: isImage ? "1920 x 1200" : isVideo ? "1920 x 1080" : undefined,
              fechaSubido: new Date().toISOString().split("T")[0],
              url: isImage
                ? URL.createObjectURL(file)
                : "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4",
            };
            setStorageAssets((prevAssets) => [newAsset, ...prevAssets]);
            setUploadingProgress(null);
            toast.success(`Archivo "${file.name}" subido a Firebase Storage correctamente.`);
            addLog(`Subió un nuevo recurso a Storage: ${file.name}`);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  // Delete Storage Asset
  const handleDeleteAsset = (id: string, name: string) => {
    setStorageAssets((prev) => prev.filter((a) => a.id !== id));
    toast.success(`Archivo "${name}" eliminado de Storage.`);
    addLog(`Eliminó de forma permanente el recurso multimedia de Storage: ${name}`);
  };

  // Simulated Rollback Function
  const handleExecuteRollback = () => {
    if (!rollbackTarget) return;
    toast.success(`Reversión (Rollback) exitosa. Cambios deshechos.`);
    addLog(`Ejecutó ROLLBACK (Deshacer) de la acción de auditoría ID: ${rollbackTarget.id}`);
    setRollbackTarget(null);
  };

  // Simulates appending a new random server error
  const handleSimulateServerError = () => {
    const randomErrors = [
      {
        codigo: "Vite 502",
        mensaje: "Error de Hot Module Replacement (HMR) - WebSocket de desarrollo desconectado temporalmente.",
        modulo: "ViteServerDev",
        severidad: "Baja" as const,
      },
      {
        codigo: "Gemini 429",
        mensaje: "Límite de cuota excedido para llamadas a modelos inteligentes Gemini Flash en el generador de MediaKits.",
        modulo: "GeminiPlannerAI",
        severidad: "Media" as const,
      },
      {
        codigo: "CORS 400",
        mensaje: "Error de cabecera de origen cruzado detectado al intentar inyectar slides públicos de Google Drive.",
        modulo: "GoogleDriveClient",
        severidad: "Crítica" as const,
      },
    ];
    const picked = randomErrors[Math.floor(Math.random() * randomErrors.length)];
    const newErr: SystemError = {
      id: `err-${Date.now()}`,
      codigo: picked.codigo,
      mensaje: picked.mensaje,
      modulo: picked.modulo,
      timestamp: "Justo ahora",
      severidad: picked.severidad,
    };
    setSystemErrors((prev) => [newErr, ...prev]);
    toast.error(`Nuevo error registrado en el servidor: ${picked.codigo}`);
  };

  // Clear system errors
  const handleClearErrorLogs = () => {
    setSystemErrors([]);
    toast.success("Logs de error de sistema vaciados.");
  };

  // Cache clearing simulation
  const handleClearCache = () => {
    setCacheClearing(true);
    setTimeout(() => {
      setCacheClearing(false);
      toast.success("Caché de consultas de PostgreSQL purgado en memoria de forma exitosa.");
    }, 1500);
  };

  // Save SEO Configuration
  const handleSaveSeoConfig = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Configuración SEO guardada y sitemap XML actualizado.");
    addLog("Actualizó la meta-configuración SEO general del sistema.");
  };

  // --- FILTERS & COMPUTATIONS ---

  // Filter users list
  const filteredUsers = useMemo(() => {
    return usersList.filter(
      (u) =>
        u.nombre.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
  }, [usersList, userSearchQuery]);

  // Filter activity log
  const filteredLogs = useMemo(() => {
    return logs.filter(
      (l) =>
        (l.action || "").toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        (l.user || "").toLowerCase().includes(logSearchQuery.toLowerCase())
    );
  }, [logs, logSearchQuery]);

  // Filter errors
  const filteredErrors = useMemo(() => {
    return systemErrors.filter(
      (e) =>
        e.mensaje.toLowerCase().includes(errorSearchQuery.toLowerCase()) ||
        e.codigo.toLowerCase().includes(errorSearchQuery.toLowerCase()) ||
        e.modulo.toLowerCase().includes(errorSearchQuery.toLowerCase())
    );
  }, [systemErrors, errorSearchQuery]);

  // Filter storage
  const filteredStorage = useMemo(() => {
    return storageAssets.filter((a) =>
      a.nombre.toLowerCase().includes(storageSearchQuery.toLowerCase())
    );
  }, [storageAssets, storageSearchQuery]);

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans space-y-8 text-left bg-[#FAF9F5] min-h-full">
      {/* Header and Context Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="text-left">
          <span className="text-[10px] bg-[#06434a]/10 border border-[#06434a]/20 text-[#06434a] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            Consola Administrativa
          </span>
          <h2 className="text-xl font-bold text-stone-950 font-display mt-2">
            Panel de Control y Gobernanza Comercial
          </h2>
          <p className="text-[11px] text-stone-500 mt-1">
            Supervisión integral de usuarios, políticas RBAC de seguridad, almacenamiento multimedia y SEO técnico.
          </p>
        </div>

        {/* Global Statistics */}
        <div className="flex items-center gap-6 bg-white border border-stone-200 p-4 rounded-2xl shadow-2xs">
          <div className="text-left">
            <span className="block text-[8px] text-stone-400 font-extrabold uppercase tracking-widest">
              Soportes en Mapa
            </span>
            <span className="text-sm font-black text-stone-900 font-mono">
              {screens.length}
            </span>
          </div>
          <div className="h-8 w-px bg-stone-200" />
          <div className="text-left">
            <span className="block text-[8px] text-stone-400 font-extrabold uppercase tracking-widest">
              Regiones Activas
            </span>
            <span className="text-sm font-black text-stone-900 font-mono">
              {citiesList.length}
            </span>
          </div>
          <div className="h-8 w-px bg-stone-200" />
          <div className="text-left">
            <span className="block text-[8px] text-stone-400 font-extrabold uppercase tracking-widest">
              Rol de Auditoría
            </span>
            <span className="text-xs font-black text-[#06434a] uppercase">
              {userRole === "admin" ? "Admin" : "Comercial"}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-modules Navigation Bar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-200/60 pb-1">
        {([
          { id: "usuarios", label: "Usuarios y Roles", icon: Users },
          { id: "ciudades", label: "Ciudades y Categorías", icon: MapPin },
          { id: "auditoria", label: "Auditoría y Errores", icon: Clock },
          { id: "storage", label: "Almacenamiento (Storage)", icon: HardDrive },
          { id: "seo", label: "SEO y Preferencias", icon: Globe },
        ] as const).map((tab) => {
          const ActiveIcon = tab.icon;
          const active = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id)}
              className={`py-2 px-4 rounded-t-xl text-xs font-extrabold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                active
                  ? "border-[#06434a] text-[#06434a] bg-white font-black shadow-3xs"
                  : "border-transparent text-stone-400 hover:text-stone-600 hover:bg-stone-50"
              }`}
            >
              <ActiveIcon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENT AREA */}
      <div className="space-y-6">
        {/* TAB 1: USERS & RBAC PERMISSION MATRIX */}
        {activeAdminTab === "usuarios" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Users list CRUD */}
            <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="text-left">
                  <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono">
                    Directorio de Colaboradores
                  </h3>
                  <p className="text-[10px] text-stone-500 font-semibold">
                    Cuentas de usuario autorizadas con accesos basados en roles.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase px-3.5 py-2 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Nuevo Usuario</span>
                </button>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar usuario por nombre o correo electrónico..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200/80 rounded-xl focus:outline-none focus:border-[#06434a] bg-stone-50/30"
                />
              </div>

              {/* Users table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-100 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      <th className="pb-2.5">Usuario</th>
                      <th className="pb-2.5">Rol</th>
                      <th className="pb-2.5">Estado</th>
                      <th className="pb-2.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3">
                          <div className="text-stone-900 font-extrabold">{user.nombre}</div>
                          <div className="text-[10px] text-stone-400 font-semibold">{user.email}</div>
                        </td>
                        <td className="py-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                            user.role === "admin"
                              ? "bg-purple-50 text-purple-700 border-purple-100"
                              : user.role === "comercial_dir"
                              ? "bg-[#06434a]/5 text-[#06434a] border-[#06434a]/10"
                              : "bg-stone-50 text-stone-600 border-stone-200"
                          }`}>
                            {user.role.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.estado)}
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider cursor-pointer ${
                              user.estado === "Activo"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : user.estado === "Inactivo"
                                ? "bg-stone-100 text-stone-500 border border-stone-200"
                                : "bg-red-50 text-red-700 border border-red-100"
                            }`}
                          >
                            {user.estado}
                          </button>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                toast.info(`Editar usuario "${user.nombre}" listo.`);
                              }}
                              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-500 cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              disabled={user.email === "grasso.luis@gmail.com"}
                              onClick={() => handleDeleteUser(user.id, user.nombre)}
                              className={`p-1.5 rounded-lg border border-red-100 bg-red-50/50 hover:bg-red-50 text-red-600 cursor-pointer ${
                                user.email === "grasso.luis@gmail.com" ? "opacity-30 cursor-not-allowed" : ""
                              }`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-stone-400 text-xs font-semibold">
                          No se encontraron usuarios que coincidan con la búsqueda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Permissions Matrix (RBAC grid) */}
            <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono">
                  Matriz de Accesos de Seguridad (RBAC)
                </h3>
                <p className="text-[10px] text-stone-500 font-semibold leading-relaxed">
                  Establece qué módulos y acciones del sistema pueden operar cada rol de forma predeterminada.
                </p>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {Object.keys(permissionLabels).map((permKey) => {
                  const perm = permissionLabels[permKey];
                  return (
                    <div key={permKey} className="p-3.5 bg-stone-50/50 border border-stone-150 rounded-2xl space-y-2 text-left">
                      <div>
                        <span className="block text-[11px] font-bold text-stone-850">{perm.label}</span>
                        <span className="block text-[9px] text-stone-400 font-semibold mt-0.5 leading-snug">{perm.desc}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-stone-150/50">
                        {(["admin", "comercial_dir", "comercial_exec", "ops"] as Role[]).map((r) => {
                          const active = rolePermissions[r][permKey];
                          return (
                            <button
                              key={r}
                              onClick={() => handleTogglePermission(r, permKey)}
                              className={`text-[8px] font-black uppercase px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer border ${
                                active
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-150 shadow-3xs"
                                  : "bg-white text-stone-400 border-stone-200 hover:border-stone-300"
                              }`}
                            >
                              {active ? <Unlock className="h-2 w-2" /> : <Lock className="h-2 w-2" />}
                              <span>{r === "comercial_dir" ? "Director" : r === "comercial_exec" ? "Ejecutivo" : r}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CITIES & CATEGORIES */}
        {activeAdminTab === "ciudades" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Plazas y Geografía */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="text-left">
                  <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono">
                    Plazas Geográficas Comerciales
                  </h3>
                  <p className="text-[10px] text-stone-500 font-semibold">
                    Zonas urbanas y ciudades con presencia publicitaria.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCityModal(true)}
                  className="bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <span>Agregar Plaza</span>
                </button>
              </div>

              <div className="space-y-3">
                {citiesList.map((city) => {
                  const screenCountInCity = screens.filter((s) => s.ciudad === city.nombre).length;
                  return (
                    <div key={city.id} className="p-4 bg-stone-50 border border-stone-150 rounded-2xl flex items-center justify-between text-left">
                      <div className="space-y-1.5 pr-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#06434a]" />
                          <span className="font-extrabold text-stone-900 text-xs">{city.nombre}</span>
                          <span className="text-[8px] bg-[#06434a]/10 text-[#06434a] px-2 py-0.5 rounded-full font-bold">
                            {screenCountInCity} soportes
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 font-semibold">{city.desc}</p>
                        <span className="block text-[8px] text-stone-400 font-mono font-bold leading-none">
                          LAT: {city.lat} • LNG: {city.lng}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteCity(city.id, city.nombre)}
                        className="p-2 rounded-lg border border-stone-200 hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Categorías del Catálogo */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono">
                  Soportes y Tipos de Pantalla
                </h3>
                <p className="text-[10px] text-stone-500 font-semibold">
                  Categorías principales del inventario comercial y pauta.
                </p>
              </div>

              {/* Add category form */}
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: Carapantalla LED, Medianeras..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#06434a]"
                />
                <button
                  type="submit"
                  className="bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase px-4 rounded-xl cursor-pointer"
                >
                  Agregar
                </button>
              </form>

              <div className="divide-y divide-stone-100 pt-1">
                {categoriesList.map((cat) => {
                  const count = screens.filter((s) => s.categoria === cat).length;
                  return (
                    <div key={cat} className="py-3 flex items-center justify-between text-left">
                      <div className="space-y-0.5">
                        <span className="text-xs font-extrabold text-stone-850 block">{cat}</span>
                        <span className="block text-[9px] text-stone-400 font-semibold">
                          {count} pantallas registradas bajo esta categoría
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-1.5 rounded-lg border border-stone-100 hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDITING (LOGS & ERRORS) */}
        {activeAdminTab === "auditoria" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* User activity logs */}
            <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="border-b border-stone-100 pb-3 text-left">
                <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#06434a]" />
                  Bitácora de Auditoría Global (Activity Logs)
                </h3>
                <p className="text-[10px] text-stone-500 font-semibold leading-relaxed">
                  Registro cronológico permanente de mutaciones y accesos de datos.
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar logs por acción, usuario o módulo..."
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#06434a] bg-stone-50/20"
                />
              </div>

              <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="p-3.5 bg-stone-50/50 border border-stone-150 rounded-2xl space-y-2 text-left">
                    <div className="flex items-center justify-between text-[8px] font-bold text-stone-400 uppercase tracking-wider font-mono leading-none">
                      <span>{log.user}</span>
                      <span>{log.date}</span>
                    </div>
                    <p className="text-[11px] text-stone-800 font-semibold leading-snug">
                      {log.action}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-150/40">
                      <span className="text-[8px] text-stone-400 font-mono font-extrabold uppercase">Log ID: {log.id}</span>
                      <button
                        onClick={() => setRollbackTarget(log)}
                        className="text-[9px] font-extrabold text-[#06434a] hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer uppercase tracking-wider leading-none"
                      >
                        <RefreshCw className="h-2.5 w-2.5" />
                        Deshacer (Rollback)
                      </button>
                    </div>
                  </div>
                ))}

                {filteredLogs.length === 0 && (
                  <div className="text-center py-12 text-stone-400 font-semibold text-xs">
                    Ninguna acción de auditoría coincide con los términos de búsqueda.
                  </div>
                )}
              </div>
            </div>

            {/* Error tracking tracker */}
            <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="text-left">
                  <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <AlertOctagon className="h-4.5 w-4.5 text-red-600 animate-pulse" />
                    Tracker de Errores (System Errors)
                  </h3>
                  <p className="text-[10px] text-stone-500 font-semibold">
                    Monitoreo en tiempo real de excepciones del servidor y fallos de API.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSimulateServerError}
                    title="Simular excepción de servidor"
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleClearErrorLogs}
                    title="Vaciar logs de error"
                    className="p-1.5 rounded-lg border border-red-100 bg-red-50 text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filtrar errores por código o módulo..."
                  value={errorSearchQuery}
                  onChange={(e) => setErrorSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#06434a] bg-stone-50/20"
                />
              </div>

              <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                {filteredErrors.map((err) => (
                  <div key={err.id} className="p-3.5 border border-red-100 bg-red-50/20 rounded-2xl space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                        <span className="text-xs font-black text-red-950 font-mono">{err.codigo}</span>
                      </div>
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase ${
                        err.severidad === "Crítica"
                          ? "bg-red-100 text-red-800"
                          : err.severidad === "Media"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {err.severidad}
                      </span>
                    </div>

                    <p className="text-[10px] font-semibold text-stone-750 leading-relaxed">
                      {err.mensaje}
                    </p>

                    <div className="flex items-center justify-between text-[8px] font-bold text-stone-400 uppercase tracking-wider font-mono pt-1">
                      <span>Módulo: {err.modulo}</span>
                      <span>{err.timestamp}</span>
                    </div>
                  </div>
                ))}

                {filteredErrors.length === 0 && (
                  <div className="text-center py-16 text-stone-400 font-semibold text-xs space-y-1">
                    <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                    <p>¡Servidor operativo y saludable!</p>
                    <p className="text-[10px] text-stone-400 font-normal">No se han registrado fallas en la cola.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STORAGE MANAGER */}
        {activeAdminTab === "storage" && (
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="border-b border-stone-100 pb-3 text-left">
              <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono flex items-center gap-2">
                <HardDrive className="h-4.5 w-4.5 text-[#06434a]" />
                Gestión de Recursos Multimedia (Firebase Storage)
              </h3>
              <p className="text-[10px] text-stone-500 font-semibold leading-relaxed">
                Repasatorio centralizado de activos publicitarios, fotos de pantallas, mapas, drone clips y fichas en PDF.
              </p>
            </div>

            {/* Drag & Drop simulated uploader */}
            <div className="relative group border-2 border-dashed border-stone-200/80 hover:border-[#06434a]/60 bg-stone-50/50 hover:bg-[#06434a]/3 rounded-2xl p-6 transition-all">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUploadSimulated}
                disabled={uploadingProgress !== null}
              />
              <div className="flex flex-col items-center justify-center space-y-2 text-center pointer-events-none">
                <UploadCloud className="h-10 w-10 text-stone-400 group-hover:text-[#06434a]/80 transition-colors" />
                <div>
                  <span className="block text-xs font-extrabold text-stone-750">Arrastra y suelta archivos publicitarios aquí</span>
                  <span className="block text-[10px] text-stone-400 mt-1 font-semibold">O haz clic para explorar en el almacenamiento local</span>
                </div>
                <span className="block text-[8px] text-stone-400 uppercase tracking-wider font-bold">Formatos permitidos: JPG, PNG, MP4, PDF • Máx: 25MB</span>
              </div>

              {uploadingProgress !== null && (
                <div className="absolute inset-0 bg-white/90 rounded-2xl flex flex-col items-center justify-center space-y-3 z-10 px-6">
                  <div className="w-full max-w-xs bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#06434a] h-full transition-all duration-200"
                      style={{ width: `${uploadingProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest leading-none">
                    Subiendo pauta a Firebase Storage... {uploadingProgress}%
                  </span>
                </div>
              )}
            </div>

            {/* Storage Assets List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider text-left">
                  Archivos Almacenados ({filteredStorage.length})
                </span>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar archivos..."
                    value={storageSearchQuery}
                    onChange={(e) => setStorageSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 text-xs border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStorage.map((asset) => {
                  const isImage = asset.tipo === "Imagen";
                  const isVideo = asset.tipo === "Video";
                  return (
                    <div key={asset.id} className="p-4 bg-stone-50/50 border border-stone-200 rounded-2xl flex items-start gap-3.5 text-left">
                      <div className="h-12 w-12 rounded-xl bg-white border border-stone-150 flex items-center justify-center shrink-0 shadow-3xs overflow-hidden relative">
                        {isImage ? (
                          <img src={asset.url} alt={asset.nombre} className="h-full w-full object-cover" />
                        ) : isVideo ? (
                          <Video className="h-5 w-5 text-amber-600" />
                        ) : (
                          <FileText className="h-5 w-5 text-blue-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="block text-xs font-extrabold text-stone-900 truncate leading-tight" title={asset.nombre}>
                          {asset.nombre}
                        </span>
                        <div className="flex flex-wrap items-center gap-x-2 text-[9px] text-stone-400 font-semibold leading-none">
                          <span>{asset.tamano}</span>
                          {asset.resolucion && (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                              <span>{asset.resolucion}</span>
                            </>
                          )}
                        </div>
                        <span className="block text-[8px] text-stone-400 uppercase font-bold leading-none pt-1">
                          Subido: {asset.fechaSubido}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => setPreviewAsset(asset)}
                          className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-500 cursor-pointer"
                          title="Vista Previa"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id, asset.nombre)}
                          className="p-1.5 rounded-lg border border-red-100 bg-red-50/40 hover:bg-red-50 text-red-600 cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM CONFIG & SEO */}
        {activeAdminTab === "seo" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Meta SEO details */}
            <form onSubmit={handleSaveSeoConfig} className="lg:col-span-6 bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-5 text-left">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Globe className="h-4.5 w-4.5 text-[#06434a]" />
                  Gobernanza SEO & Metadata
                </h3>
                <p className="text-[10px] text-stone-500 font-semibold">
                  Administra las plantillas de visualización del sitio y sitemaps.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Estructura del Título (Title Template)</label>
                  <input
                    type="text"
                    required
                    value={seoForm.titleTemplate}
                    onChange={(e) => setSeoForm({ ...seoForm, titleTemplate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#06434a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Meta Descripción del Sitio (Meta Description)</label>
                  <textarea
                    rows={3}
                    required
                    value={seoForm.metaDescription}
                    onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#06434a] leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Directivas Robots.txt</label>
                  <textarea
                    rows={4}
                    required
                    value={seoForm.robotsTxt}
                    onChange={(e) => setSeoForm({ ...seoForm, robotsTxt: e.target.value })}
                    className="w-full px-3 py-2 text-[10px] font-mono border border-stone-200 rounded-xl focus:outline-none focus:border-[#06434a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Favicon URL</label>
                    <input
                      type="text"
                      required
                      value={seoForm.faviconUrl}
                      onChange={(e) => setSeoForm({ ...seoForm, faviconUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Sitemap Index XML</label>
                    <input
                      type="text"
                      required
                      value={seoForm.sitemapUrl}
                      onChange={(e) => setSeoForm({ ...seoForm, sitemapUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase px-5 py-2.5 rounded-full cursor-pointer shadow-xs transition-colors"
                >
                  Guardar Cambios SEO
                </button>
              </div>
            </form>

            {/* Previews & Performance */}
            <div className="lg:col-span-6 space-y-6">
              {/* Google Snippet preview */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-4 text-left">
                <div className="border-b border-stone-100 pb-2">
                  <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-widest block font-mono">Vista Previa Real-Time</span>
                  <h4 className="text-xs font-black text-stone-800 uppercase mt-0.5 tracking-wider">Snippet en Buscador Google</h4>
                </div>

                <div className="p-4 bg-white border border-stone-100 rounded-2xl space-y-1 text-left font-sans select-none">
                  <span className="text-[11px] text-stone-500 leading-none block font-normal flex items-center gap-1">
                    https://grupocomunicarte.com
                    <span className="text-[8px] text-stone-300 font-bold">▼</span>
                  </span>
                  <span className="text-sm text-blue-800 font-semibold hover:underline block leading-snug cursor-pointer font-sans">
                    {seoForm.titleTemplate.replace("%s", "Pantallas LED Mendoza")}
                  </span>
                  <p className="text-[11px] text-stone-600 leading-relaxed font-sans font-normal">
                    {seoForm.metaDescription.length > 155
                      ? `${seoForm.metaDescription.substring(0, 155)}...`
                      : seoForm.metaDescription}
                  </p>
                </div>
              </div>

              {/* General app preferences */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-4 text-left">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono">
                    Preferencias de Rendimiento & Estado
                  </h3>
                </div>

                <div className="space-y-4 pt-1">
                  {/* Caching control */}
                  <div className="p-4 bg-stone-50/50 border border-stone-150 rounded-2xl flex items-center justify-between">
                    <div className="text-left pr-4">
                      <span className="block text-[11px] font-bold text-stone-850">Caché de Consultas PostgreSQL</span>
                      <span className="block text-[9px] text-stone-400 font-semibold mt-0.5 leading-snug">
                        Purga consultas de métricas en vuelo guardadas en memoria para refrescar instantáneamente.
                      </span>
                    </div>

                    <button
                      onClick={handleClearCache}
                      disabled={cacheClearing}
                      className="px-4 py-2 border border-[#06434a]/20 bg-white hover:bg-[#06434a]/5 text-[#06434a] text-[10px] font-extrabold uppercase rounded-full cursor-pointer flex items-center gap-1 transition-all shrink-0"
                    >
                      <RefreshCw className={`h-3 w-3 ${cacheClearing ? "animate-spin" : ""}`} />
                      <span>{cacheClearing ? "Vaciando..." : "Vaciar Caché"}</span>
                    </button>
                  </div>

                  {/* Maintenance mode */}
                  <div className="p-4 bg-stone-50/50 border border-stone-150 rounded-2xl flex items-center justify-between">
                    <div className="text-left pr-4">
                      <span className="block text-[11px] font-bold text-stone-850">Modo de Mantenimiento</span>
                      <span className="block text-[9px] text-stone-400 font-semibold mt-0.5 leading-snug">
                        Suspende temporalmente el acceso público al catálogo de soportes para operaciones técnicas.
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setMaintenanceMode(!maintenanceMode);
                        toast.info(
                          maintenanceMode
                            ? "Plataforma puesta de nuevo en línea."
                            : "Modo mantenimiento activado de forma preventiva."
                        );
                      }}
                      className={`px-4 py-2 border text-[10px] font-extrabold uppercase rounded-full cursor-pointer transition-all shrink-0 ${
                        maintenanceMode
                          ? "bg-amber-100 border-amber-200 text-amber-800 font-black shadow-xs"
                          : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      {maintenanceMode ? "Activo" : "Inactivo"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- FLOATING MODALS --- */}

      {/* Modal: Add User */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-3xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-left"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono">
                  Nuevo Perfil de Colaborador
                </h4>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-1.5 hover:bg-stone-50 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Sofía Martínez"
                    value={userForm.nombre}
                    onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none bg-stone-50/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Correo Electrónico Corporativo *</label>
                  <input
                    type="email"
                    required
                    placeholder="s.martinez@comunicarte.com"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none bg-stone-50/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Rol Asignado (RBAC)</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value as Role })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 font-bold cursor-pointer"
                    >
                      <option value="admin">Administrador</option>
                      <option value="comercial_dir">Director Comercial</option>
                      <option value="comercial_exec">Ejecutivo Comercial</option>
                      <option value="ops">Operaciones</option>
                      <option value="viewer">Lector (Viewer)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Estado Inicial</label>
                    <select
                      value={userForm.estado}
                      onChange={(e) => setUserForm({ ...userForm, estado: e.target.value as any })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 font-bold cursor-pointer"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 border border-stone-200 text-[10px] font-extrabold uppercase rounded-full cursor-pointer text-stone-600 hover:bg-stone-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase rounded-full cursor-pointer shadow-sm"
                  >
                    Crear Usuario
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Add City */}
      <AnimatePresence>
        {showAddCityModal && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-3xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-left"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono">
                  Nueva Plaza Geográfica
                </h4>
                <button
                  onClick={() => setShowAddCityModal(false)}
                  className="p-1.5 hover:bg-stone-50 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddCity} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Nombre de la Ciudad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Rosario"
                    value={newCityForm.nombre}
                    onChange={(e) => setNewCityForm({ ...newCityForm, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none bg-stone-50/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Latitud *</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      placeholder="-32.9468"
                      value={newCityForm.lat || ""}
                      onChange={(e) => setNewCityForm({ ...newCityForm, lat: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none bg-stone-50/20 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Longitud *</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      placeholder="-60.6393"
                      value={newCityForm.lng || ""}
                      onChange={(e) => setNewCityForm({ ...newCityForm, lng: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none bg-stone-50/20 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Breve descripción del mercado</label>
                  <input
                    type="text"
                    placeholder="Ej: Corredor agrícola e industrial clave..."
                    value={newCityForm.desc}
                    onChange={(e) => setNewCityForm({ ...newCityForm, desc: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none bg-stone-50/20"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddCityModal(false)}
                    className="px-4 py-2 border border-stone-200 text-[10px] font-extrabold uppercase rounded-full cursor-pointer text-stone-600 hover:bg-stone-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase rounded-full cursor-pointer shadow-sm"
                  >
                    Agregar Plaza
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Rollback Change Log Confirmation */}
      <AnimatePresence>
        {rollbackTarget && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-3xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-left"
            >
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono">
                  Confirmar Reversión (Rollback)
                </h4>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                Estás a punto de desarmar y revertir de forma segura los efectos de la siguiente acción en PostgreSQL:
              </p>

              <div className="p-3.5 bg-stone-50 border border-stone-150 rounded-2xl text-[11px] leading-relaxed space-y-1.5">
                <div className="flex items-center justify-between text-[8px] font-bold text-stone-400 uppercase tracking-wider font-mono">
                  <span>Log ID: {rollbackTarget?.id}</span>
                  <span>{rollbackTarget?.date}</span>
                </div>
                <div className="font-extrabold text-stone-800">{rollbackTarget?.action}</div>
                <div className="text-stone-400 font-semibold uppercase text-[8px]">Autor: {rollbackTarget?.user}</div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-[10px] text-amber-800 leading-relaxed font-semibold">
                ¡Atención! La reversión alterará temporalmente el estado en base de datos. Se generará un registro especial de auditoría de rollback.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRollbackTarget(null)}
                  className="px-4 py-2 border border-stone-200 text-[10px] font-extrabold uppercase rounded-full cursor-pointer text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExecuteRollback}
                  className="px-5 py-2 bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase rounded-full cursor-pointer shadow-sm"
                >
                  Ejecutar Deshacer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Asset Preview */}
      <AnimatePresence>
        {previewAsset && (
          <div className="fixed inset-0 bg-stone-900/65 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-stone-200 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 text-left relative"
            >
              <button
                onClick={() => setPreviewAsset(null)}
                className="absolute top-4 right-4 p-1.5 bg-white border border-stone-200 rounded-full hover:bg-stone-50 text-stone-500 cursor-pointer z-10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col text-left space-y-1">
                <span className="text-[8px] text-stone-400 font-bold uppercase tracking-wider font-mono">
                  Asset ID: {previewAsset.id}
                </span>
                <h4 className="text-xs font-black text-stone-950 font-display truncate pr-8">
                  {previewAsset.nombre}
                </h4>
              </div>

              {/* Visual media preview frame */}
              <div className="bg-stone-100 rounded-2xl h-80 w-full overflow-hidden border border-stone-200 flex items-center justify-center relative">
                {previewAsset.tipo === "Imagen" ? (
                  <img src={previewAsset.url} alt={previewAsset.nombre} className="h-full w-full object-cover" />
                ) : previewAsset.tipo === "Video" ? (
                  <video src={previewAsset.url} controls autoPlay muted loop className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2 text-stone-500">
                    <FileText className="h-10 w-10 text-[#06434a]/80" />
                    <span className="text-xs font-extrabold text-stone-750">Ficha en Formato PDF Comercial</span>
                    <a
                      href={previewAsset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] bg-[#06434a] hover:bg-[#0b5e67] text-white px-3 py-1.5 rounded-full font-extrabold uppercase transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Abrir Documento</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 border-t border-stone-100 pt-3">
                <div className="space-y-0.5">
                  <span className="block text-[8px] text-stone-400 font-bold uppercase">Tamaño</span>
                  <span>{previewAsset.tamano}</span>
                </div>
                {previewAsset.resolucion && (
                  <div className="space-y-0.5">
                    <span className="block text-[8px] text-stone-400 font-bold uppercase">Resolución</span>
                    <span>{previewAsset.resolucion}</span>
                  </div>
                )}
                <div className="space-y-0.5 text-right">
                  <span className="block text-[8px] text-stone-400 font-bold uppercase">Publicado</span>
                  <span>{previewAsset.fechaSubido}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
