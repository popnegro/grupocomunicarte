import React, { useState } from "react";
import { useCms } from "../CmsContext";
import { MediaKit, Cotizacion, Reserva, Campaña, Cliente, Role } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles, 
  TrendingUp, 
  Percent, 
  Layers, 
  Briefcase, 
  Users,
  Plus,
  Tv,
  FileText,
  Bookmark,
  X,
  MapPin,
  DollarSign,
  Bell,
  ChevronRight,
  ArrowRight,
  Sparkle,
  Info
} from "lucide-react";

interface DashboardHomeProps {
  mediaKits: MediaKit[];
  cotizaciones: Cotizacion[];
  reservas: Reserva[];
  campañas: Campaña[];
  clientes: Cliente[];
  userRole: Role;
  onNavigateToTab: (tab: string) => void;
  onApproveReserva: (id: string) => void;
  onApproveCotizacion: (id: string) => void;
  setCampañas?: React.Dispatch<React.SetStateAction<Campaña[]>>;
  setClientes?: React.Dispatch<React.SetStateAction<Cliente[]>>;
  setCotizaciones?: React.Dispatch<React.SetStateAction<Cotizacion[]>>;
  setReservas?: React.Dispatch<React.SetStateAction<Reserva[]>>;
  addLog?: (action: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  mediaKits,
  cotizaciones,
  reservas,
  campañas,
  clientes,
  userRole,
  onNavigateToTab,
  onApproveReserva,
  onApproveCotizacion,
  setCampañas,
  setClientes,
  setCotizaciones,
  setReservas,
  addLog,
}) => {
  const { screens, setScreens } = useCms();
  const [showToast, setShowToast] = useState<string | null>(null);
  
  // Quick Actions modal states
  const [activeModal, setActiveModal] = useState<"campaña" | "soporte" | "cliente" | "cotizacion" | "reserva" | null>(null);

  // Form States for interactive item creation
  const [campForm, setCampForm] = useState({
    nombre: "",
    clienteNombre: "",
    screenId: "",
    fechaInicio: "2026-08-01",
    fechaFin: "2026-08-28",
    progreso: 0,
    estado: "Planificada" as const
  });

  const [soporteForm, setSoporteForm] = useState({
    nombre: "",
    zona: "Centro",
    tipo: "Peatonal" as const,
    categoria: "Pantallas LED" as const,
    ciudad: "Mendoza" as const,
    impactos: 15000,
    precio: 95000,
    status: "Disponible" as const,
    lat: -32.8895,
    lng: -68.8450,
    dimensiones: "4.0m x 3.0m",
    brillo: "6,000 nits",
    refreshRate: "3,840 Hz",
    formato: "MP4, JPG"
  });

  const [clienteForm, setClienteForm] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    categoria: "Corporativo" as const,
    campañasActivas: 0,
    totalInversión: 0
  });

  const [cotizacionForm, setCotizacionForm] = useState({
    mediakitNombre: "",
    clienteNombre: "",
    descuentoPercent: 0,
    validez: "2026-08-15",
    condiciones: "Pago 50% al reservar y 50% al iniciar pauta.",
    total: 1200000,
    estado: "Enviada" as const
  });

  const [reservaForm, setReservaForm] = useState({
    clienteNombre: "",
    screenId: "",
    fechaInicio: "2026-08-05",
    fechaFin: "2026-08-19",
    estado: "Pendiente" as const
  });

  // Calendar interactive state (default selected event)
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(4);

  // Helper to trigger nice system toasts
  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 4000);
  };

  // Compute Dynamic Metrics
  const activeCampCount = campañas.filter(c => c.estado === "Activa").length;
  
  // Real dynamic screens metrics from useCms
  const totalScreensCount = screens.length;
  const occupiedScreensCount = screens.filter(s => s.status === "Activo" || s.status === "No disponible").length;
  const availableScreensCount = screens.filter(s => s.status === "Disponible" || s.status === "Activo").length; // active/dispo
  const maintScreensCount = screens.filter(s => s.status === "Pausado" || s.status === "No disponible").length;

  const occupancyRate = totalScreensCount 
    ? Math.round((screens.filter(s => s.status === "Activo" || s.status === "No disponible").length / totalScreensCount) * 100) 
    : 81;

  const totalClientsCount = clientes.length;

  // Real projected revenue: SUM of active quotes totals + base valuation
  const baseRevenue = 3850000;
  const dynamicQuotesTotal = cotizaciones.reduce((sum, q) => sum + (q.estado === "Aceptada" ? q.total : q.total * 0.3), 0);
  const projectedRevenue = baseRevenue + dynamicQuotesTotal;

  // Quick Action Submissions
  const handleCreateCampaña = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campForm.nombre || !campForm.clienteNombre || !campForm.screenId) {
      triggerToast("⚠️ Por favor completa los campos requeridos.");
      return;
    }
    
    const matchedScreen = screens.find(s => s.id === campForm.screenId);
    const newCamp: Campaña = {
      id: `cp-usr-${Date.now()}`,
      reservaId: `rv-usr-${Date.now()}`,
      clienteNombre: campForm.clienteNombre,
      nombre: campForm.nombre,
      screenId: campForm.screenId,
      screenNombre: matchedScreen?.nombre || "Pantalla Seleccionada",
      fechaInicio: campForm.fechaInicio,
      fechaFin: campForm.fechaFin,
      progreso: campForm.progreso,
      estado: campForm.estado
    };

    if (setCampañas) {
      setCampañas(prev => [newCamp, ...prev]);
    }
    if (addLog) {
      addLog(`Creó la campaña comercial: "${newCamp.nombre}" para ${newCamp.clienteNombre}`);
    }
    setActiveModal(null);
    triggerToast(`🎉 Campaña "${newCamp.nombre}" creada y registrada con éxito!`);
    
    // Reset
    setCampForm({
      nombre: "",
      clienteNombre: "",
      screenId: "",
      fechaInicio: "2026-08-01",
      fechaFin: "2026-08-28",
      progreso: 0,
      estado: "Planificada"
    });
  };

  const handleCreateSoporte = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soporteForm.nombre) {
      triggerToast("⚠️ El nombre del soporte es obligatorio.");
      return;
    }

    const newScreen = {
      id: `sc-usr-${Date.now()}`,
      nombre: soporteForm.nombre,
      zona: soporteForm.zona,
      tipo: soporteForm.tipo,
      categoria: soporteForm.categoria,
      ciudad: soporteForm.ciudad,
      impactos: Number(soporteForm.impactos),
      precio: Number(soporteForm.precio),
      status: soporteForm.status,
      lat: soporteForm.lat,
      lng: soporteForm.lng,
      dimensiones: soporteForm.dimensiones,
      brillo: soporteForm.brillo,
      refreshRate: soporteForm.refreshRate,
      formato: soporteForm.formato,
      cobertura: "Alta densidad e impactos continuos"
    };

    setScreens(prev => [...prev, newScreen]);
    if (addLog) {
      addLog(`Agregó un soporte DOOH al catálogo comercial: ${newScreen.nombre} (${newScreen.ciudad})`);
    }
    setActiveModal(null);
    triggerToast(`📺 Soporte DOOH "${newScreen.nombre}" incorporado al catálogo.`);

    setSoporteForm({
      nombre: "",
      zona: "Centro",
      tipo: "Peatonal",
      categoria: "Pantallas LED",
      ciudad: "Mendoza",
      impactos: 15000,
      precio: 95000,
      status: "Disponible",
      lat: -32.8895,
      lng: -68.8450,
      dimensiones: "4.0m x 3.0m",
      brillo: "6,000 nits",
      refreshRate: "3,840 Hz",
      formato: "MP4, JPG"
    });
  };

  const handleCreateCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteForm.nombre || !clienteForm.empresa) {
      triggerToast("⚠️ Completa el nombre y la empresa.");
      return;
    }

    const newClient: Cliente = {
      id: `cl-usr-${Date.now()}`,
      nombre: clienteForm.nombre,
      empresa: clienteForm.empresa,
      email: clienteForm.email || `${clienteForm.nombre.toLowerCase().replace(" ", "")}@empresa.com`,
      telefono: clienteForm.telefono || "+54 261 400-0000",
      categoria: clienteForm.categoria,
      campañasActivas: Number(clienteForm.campañasActivas),
      totalInversión: Number(clienteForm.totalInversión)
    };

    if (setClientes) {
      setClientes(prev => [newClient, ...prev]);
    }
    if (addLog) {
      addLog(`Registró un nuevo cliente CRM: ${newClient.nombre} de la firma ${newClient.empresa}`);
    }
    setActiveModal(null);
    triggerToast(`👥 Cliente "${newClient.nombre}" registrado en el CRM.`);

    setClienteForm({
      nombre: "",
      empresa: "",
      email: "",
      telefono: "",
      categoria: "Corporativo",
      campañasActivas: 0,
      totalInversión: 0
    });
  };

  const handleCreateCotizacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cotizacionForm.mediakitNombre || !cotizacionForm.clienteNombre) {
      triggerToast("⚠️ Completa los datos requeridos de la cotización.");
      return;
    }

    const newQuote: Cotizacion = {
      id: `qt-usr-${Date.now()}`,
      mediakitId: `mk-usr-${Date.now()}`,
      mediakitNombre: cotizacionForm.mediakitNombre,
      clienteNombre: cotizacionForm.clienteNombre,
      descuentoPercent: Number(cotizacionForm.descuentoPercent),
      validez: cotizacionForm.validez,
      condiciones: cotizacionForm.condiciones,
      total: Number(cotizacionForm.total),
      estado: cotizacionForm.estado
    };

    if (setCotizaciones) {
      setCotizaciones(prev => [newQuote, ...prev]);
    }
    if (addLog) {
      addLog(`Emitió la cotización comercial #${newQuote.id} para ${newQuote.clienteNombre}`);
    }
    setActiveModal(null);
    triggerToast(`📄 Cotización por $${newQuote.total.toLocaleString()} enviada al cliente.`);

    setCotizacionForm({
      mediakitNombre: "",
      clienteNombre: "",
      descuentoPercent: 0,
      validez: "2026-08-15",
      condiciones: "Pago 50% al reservar y 50% al iniciar pauta.",
      total: 1200000,
      estado: "Enviada"
    });
  };

  const handleCreateReserva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservaForm.clienteNombre || !reservaForm.screenId) {
      triggerToast("⚠️ Por favor selecciona el cliente y el soporte.");
      return;
    }

    const matchedScreen = screens.find(s => s.id === reservaForm.screenId);
    const newRes: Reserva = {
      id: `rv-usr-${Date.now()}`,
      mediakitId: `mk-usr-${Date.now()}`,
      clienteNombre: reservaForm.clienteNombre,
      screenId: reservaForm.screenId,
      screenNombre: matchedScreen?.nombre || "Pantalla Seleccionada",
      fechaInicio: reservaForm.fechaInicio,
      fechaFin: reservaForm.fechaFin,
      estado: reservaForm.estado,
      conflictiva: false
    };

    if (setReservas) {
      setReservas(prev => [newRes, ...prev]);
    }
    if (addLog) {
      addLog(`Estableció una Reserva comercial de pantalla para ${newRes.clienteNombre}`);
    }
    setActiveModal(null);
    triggerToast(`🔖 Reserva generada para el soporte "${newRes.screenNombre}".`);

    setReservaForm({
      clienteNombre: "",
      screenId: "",
      fechaInicio: "2026-08-05",
      fechaFin: "2026-08-19",
      estado: "Pendiente"
    });
  };

  // Campaign/Contract Instant Renewal Action
  const handleRenewCampaign = (campId: string) => {
    if (setCampañas) {
      setCampañas(prev => 
        prev.map(c => {
          if (c.id === campId) {
            triggerToast(`🔄 Campaña "${c.nombre}" renovada por 4 semanas adicionales.`);
            if (addLog) {
              addLog(`Renovación comercial: Extendió el período de la campaña "${c.nombre}"`);
            }
            return {
              ...c,
              fechaFin: "2026-09-20", // Extend
              progreso: 0,
              estado: "Planificada" as const
            };
          }
          return c;
        })
      );
    }
  };

  // Calendar Dummy Agenda Items (Interactive click)
  const getCalendarEventsForDay = (day: number) => {
    switch (day) {
      case 1: return { title: "Inicio de Campaña - Café Central", desc: "Inicio de vuelo DOOH en Sarmiento y 9 de Julio", type: "launch" };
      case 4: return { title: "Auditoría Técnica - Mendoza Peatonal", desc: "Inspección de nits y calibración lumínica automática", type: "maint" };
      case 5: return { title: "Lanzamiento - Toyota Hilux 2026", desc: "Arranque coordinado en 3 soportes premium", type: "launch" };
      case 10: return { title: "Fin de Contrato - Cencosud S.A.", desc: "Liberación física de soporte Sarmiento de 10:00 hs", type: "end" };
      case 15: return { title: "Carga de Contenidos - JWT Argentina", desc: "Recepción de piezas en formato MP4 Flicker-Free", type: "ops" };
      case 22: return { title: "Rotación Creativa - McDonald's", desc: "Actualización de piezas por campaña estacional", type: "ops" };
      default: return null;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto font-sans bg-[#FAF9F5]/40 min-h-screen">
      
      {/* Dynamic Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-bold py-3.5 px-5 rounded-xl shadow-xl border border-stone-800 flex items-center gap-3"
          >
            <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkle className="h-3.5 w-3.5 animate-spin" />
            </div>
            <span>{showToast}</span>
            <button onClick={() => setShowToast(null)} className="text-stone-400 hover:text-white ml-2">
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HEADER: EXECUTIVE SUMMARY & ORGANIZATION BANNER */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 bg-white border border-stone-200/80 rounded-[32px] p-5 md:p-6 shadow-2xs">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-[#06434a] bg-[#06434a]/8 border border-[#06434a]/15 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {userRole === "comercial_dir" ? "Director Comercial" : "Consola Operativa"}
            </span>
            <span className="text-stone-400 text-xs">•</span>
            <span className="text-xs text-stone-500 font-bold flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-stone-400" />
              Viernes, 31 de Julio de 2026
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-black tracking-tight text-stone-900">
            ¡Buenas tardes, Luis!
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <strong>{activeCampCount}</strong> campañas en vuelo hoy
            </span>
            <span className="text-stone-300">|</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <strong>{reservas.filter(r => r.estado === "Pendiente").length}</strong> contratos por revisar
            </span>
            <span className="text-stone-300">|</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <strong>{screens.filter(s => s.status === "Disponible").length}</strong> soportes libres
            </span>
          </div>
        </div>

        {/* Global Organizations and Notifications Selector */}
        <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
          <div className="bg-stone-50 border border-stone-200 p-1 rounded-xl md:rounded-lg flex items-center shadow-inner">
            <span className="text-[11px] font-extrabold text-stone-600 px-3 py-1 bg-white border border-stone-200/60 rounded-lg md:rounded-md shadow-2xs">
              Mendoza Plaza Lider
            </span>
            <button 
              onClick={() => triggerToast("Cambiando vista de organización a Plaza Buenos Aires...")} 
              className="text-[11px] font-bold text-stone-400 hover:text-stone-700 px-3 py-1 cursor-pointer"
            >
              Buenos Aires
            </button>
          </div>
          <div className="relative">
            <button 
              onClick={() => triggerToast("🔔 Tienes 2 notificaciones operativas sin leer.")}
              className="h-10 w-10 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 flex items-center justify-center transition-all relative cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. ACCIONES RÁPIDAS (Interactive Controls) */}
      <div className="space-y-3">
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block text-left">
          Lanzadores Rápidos / Acciones de Operación
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[
            { id: "campaña", label: "Nueva Campaña", icon: Briefcase, color: "hover:border-blue-300 hover:bg-blue-50/10 hover:text-blue-900" },
            { id: "soporte", label: "Nuevo Soporte OOH", icon: Tv, color: "hover:border-emerald-300 hover:bg-emerald-50/10 hover:text-emerald-950" },
            { id: "cliente", label: "Nuevo Cliente CRM", icon: Users, color: "hover:border-amber-300 hover:bg-amber-50/10 hover:text-amber-950" },
            { id: "cotizacion", label: "Nueva Cotización", icon: FileText, color: "hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900" },
            { id: "reserva", label: "Crear Reserva", icon: Bookmark, color: "hover:border-[#06434a] hover:bg-[#06434a]/5 hover:text-[#06434a]" }
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setActiveModal(action.id as any)}
                className={`bg-white border border-stone-200/80 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all hover:shadow-xs group ${action.color}`}
              >
                <div className="h-8 w-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-500 group-hover:scale-105 transition-all">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-[11px] font-extrabold tracking-tight block">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. KPIS PRINCIPALES (4 Premium Cards with visual sparklines) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Facturación Proyectada */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 hover:border-stone-300 transition-all shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
              Ingresos Proyectados
            </span>
            <div className="inline-flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold">
              <ArrowUpRight className="h-3 w-3" />
              <span>+12.4%</span>
            </div>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-2xl font-display font-black tracking-tight text-stone-900">
              ${projectedRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="block text-[10px] text-stone-400 font-bold uppercase">
              Facturación Estimada Mensual
            </span>
          </div>
          {/* Sparkline Visual SVG */}
          <div className="h-10 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,18 C10,12 20,16 30,8 C40,11 50,5 60,12 C70,4 80,8 100,2" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
              <path d="M0,18 C10,12 20,16 30,8 C40,11 50,5 60,12 C70,4 80,8 100,2 L100,20 L0,20 Z" fill="url(#revenueGrad)"/>
            </svg>
          </div>
        </div>

        {/* KPI 2: Ocupación Global */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 hover:border-stone-300 transition-all shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
              Ocupación Global
            </span>
            <div className="inline-flex items-center gap-0.5 text-[#06434a] bg-[#06434a]/5 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold">
              <ArrowUpRight className="h-3 w-3" />
              <span>+3.1%</span>
            </div>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-2xl font-display font-black tracking-tight text-stone-900">
              {occupancyRate}%
            </span>
            <span className="block text-[10px] text-stone-400 font-bold uppercase">
              {occupiedScreensCount} de {totalScreensCount} Soportes Activos
            </span>
          </div>
          {/* Circular/Progress line visual */}
          <div className="space-y-1 pt-2">
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#06434a] h-full rounded-full transition-all duration-1000" style={{ width: `${occupancyRate}%` }} />
            </div>
            <span className="text-[9px] text-stone-400 block text-right font-semibold">Tasa objetivo: 85%</span>
          </div>
        </div>

        {/* KPI 3: Campañas Activas */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 hover:border-stone-300 transition-all shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
              Campañas en Vuelo
            </span>
            <div className="inline-flex items-center gap-0.5 text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold">
              <ArrowUpRight className="h-3 w-3" />
              <span>+8.3%</span>
            </div>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-2xl font-display font-black tracking-tight text-stone-900">
              {activeCampCount}
            </span>
            <span className="block text-[10px] text-stone-400 font-bold uppercase">
              {campañas.length} Totales Planificadas
            </span>
          </div>
          {/* Sparkline Visual SVG */}
          <div className="h-10 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
              <defs>
                <linearGradient id="campGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,15 C10,5 20,18 30,12 C40,4 50,15 60,6 C70,14 80,2 100,8" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
              <path d="M0,15 C10,5 20,18 30,12 C40,4 50,15 60,6 C70,14 80,2 100,8 L100,20 L0,20 Z" fill="url(#campGrad)"/>
            </svg>
          </div>
        </div>

        {/* KPI 4: Clientes Activos */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 hover:border-stone-300 transition-all shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
              Clientes en CRM
            </span>
            <div className="inline-flex items-center gap-0.5 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold">
              <ArrowDownRight className="h-3 w-3" />
              <span>-1.2%</span>
            </div>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-2xl font-display font-black tracking-tight text-stone-900">
              {totalClientsCount}
            </span>
            <span className="block text-[10px] text-stone-400 font-bold uppercase">
              Anunciantes y Agencias B2B
            </span>
          </div>
          {/* Sparkline Visual SVG */}
          <div className="h-10 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
              <defs>
                <linearGradient id="clientGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,3 C10,8 20,4 30,12 C40,9 50,6 60,14 C70,11 80,15 100,16" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
              <path d="M0,3 C10,8 20,4 30,12 C40,9 50,6 60,14 C70,11 80,15 100,16 L100,20 L0,20 Z" fill="url(#clientGrad)"/>
            </svg>
          </div>
        </div>

      </div>

      {/* 4. MAIN BENTO GRID ARCHITECTURE (Left col-span-8, Right col-span-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN MODULES */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* A. DISPONIBILIDAD OOH COMPACT */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#06434a]" />
                <h3 className="text-xs font-extrabold text-stone-800 uppercase tracking-widest font-mono">
                  Matriz de Ocupación & Disponibilidad OOH
                </h3>
              </div>
              <span className="text-[10px] text-stone-400 font-extrabold uppercase">
                {totalScreensCount} Soportes en Catálogo
              </span>
            </div>

            {/* Availability Visual Bar */}
            <div className="space-y-4">
              <div className="w-full flex h-5 rounded-lg overflow-hidden border border-stone-100 shadow-inner">
                <div className="bg-[#06434a] flex items-center justify-center text-[10px] text-white font-black font-mono transition-all" style={{ width: `${occupancyRate}%` }} title="Ocupados">
                  {occupancyRate}%
                </div>
                <div className="bg-emerald-500 flex items-center justify-center text-[10px] text-white font-black font-mono transition-all" style={{ width: `${100 - occupancyRate - 5}%` }} title="Disponibles">
                  {Math.max(0, 100 - occupancyRate - 5)}%
                </div>
                <div className="bg-amber-400 flex items-center justify-center text-[10px] text-white font-black font-mono transition-all" style={{ width: `5%` }} title="Mantenimiento">
                  5%
                </div>
              </div>

              {/* Grid Legend and Count Chips */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/60 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#06434a]" />
                    <span className="text-[10px] text-stone-500 font-bold uppercase">Ocupados</span>
                  </div>
                  <span className="text-sm font-black block mt-1 text-stone-900 font-mono">{occupiedScreensCount}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/60 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-stone-500 font-bold uppercase">Disponibles</span>
                  </div>
                  <span className="text-sm font-black block mt-1 text-stone-900 font-mono">{screens.filter(s => s.status === "Disponible").length}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/60 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-[10px] text-stone-500 font-bold uppercase">En Mantenimiento</span>
                  </div>
                  <span className="text-sm font-black block mt-1 text-stone-900 font-mono">{screens.filter(s => s.status === "Pausado").length}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/60 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-stone-300" />
                    <span className="text-[10px] text-stone-500 font-bold uppercase">No Disponible</span>
                  </div>
                  <span className="text-sm font-black block mt-1 text-stone-900 font-mono">{screens.filter(s => s.status === "No disponible").length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* B. CALENDARIO COMERCIAL & AGENDA SEMANAL */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#06434a]" />
                <h3 className="text-xs font-extrabold text-stone-800 uppercase tracking-widest font-mono">
                  Agenda Comercial & Plan de Vuelo (Agosto 2026)
                </h3>
              </div>
              <span className="text-[10px] text-stone-400 font-extrabold uppercase">
                {campañas.length} Lanzamientos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Day slots list */}
              <div className="md:col-span-8 space-y-1">
                <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider block text-left mb-1.5">
                  Selecciona un día con eventos registrados
                </span>
                <div className="grid grid-cols-7 gap-1 bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                  {/* Calendar header initials */}
                  {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                    <div key={i} className="text-[9px] font-black text-stone-400 uppercase text-center py-1">{d}</div>
                  ))}
                  
                  {/* Fill empty days for layout alignment */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={`empty-${i}`} className="text-center p-2 text-stone-300 text-[10px] select-none" />
                  ))}

                  {/* Calendar Days */}
                  {Array.from({ length: 25 }).map((_, i) => {
                    const day = i + 1;
                    const hasEvent = getCalendarEventsForDay(day);
                    const isSelected = selectedCalendarDay === day;

                    return (
                      <button
                        key={day}
                        onClick={() => {
                          if (hasEvent) {
                            setSelectedCalendarDay(day);
                          } else {
                            triggerToast(`No hay lanzamientos u operaciones críticas agendadas para el día ${day} de agosto.`);
                          }
                        }}
                        className={`text-center p-1.5 rounded-lg text-[11px] font-bold transition-all relative flex flex-col items-center justify-center aspect-square ${
                          isSelected 
                            ? "bg-[#06434a] text-white font-black shadow-xs scale-105" 
                            : hasEvent 
                              ? "bg-[#06434a]/10 text-[#06434a] hover:bg-[#06434a]/20 cursor-pointer font-extrabold"
                              : "text-stone-600 hover:bg-stone-100 cursor-pointer"
                        }`}
                      >
                        <span>{day}</span>
                        {hasEvent && !isSelected && (
                          <span className="absolute bottom-1 h-1 w-1 bg-amber-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Event card details */}
              <div className="md:col-span-4 flex flex-col justify-between p-4 bg-stone-50/80 rounded-lg border border-stone-200/40 text-left">
                {selectedCalendarDay && getCalendarEventsForDay(selectedCalendarDay) ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] bg-amber-500/10 text-amber-700 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Agosto {selectedCalendarDay}
                      </span>
                      <span className="text-[8px] bg-[#06434a]/10 text-[#06434a] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Operaciones
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-stone-900 leading-snug">
                        {getCalendarEventsForDay(selectedCalendarDay)?.title}
                      </h4>
                      <p className="text-[10px] text-stone-500 leading-relaxed font-medium">
                        {getCalendarEventsForDay(selectedCalendarDay)?.desc}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-2 h-full">
                    <Info className="h-5 w-5 text-stone-300" />
                    <p className="text-[10px] text-stone-400 font-bold">Selecciona un día sombreado en el calendario para ver detalles.</p>
                  </div>
                )}
                
                {selectedCalendarDay && (
                  <button 
                    onClick={() => onNavigateToTab("calendario")}
                    className="w-full mt-3 py-1.5 text-center bg-white border border-stone-200 rounded-lg text-[10px] font-bold text-[#06434a] hover:bg-[#06434a] hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Ver Cronograma Completo</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* C. RANKING COMERCIAL & RENDIMIENTO (OOH Performance Lists) */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#06434a]" />
                <h3 className="text-xs font-extrabold text-stone-800 uppercase tracking-widest font-mono">
                  Rendimiento Comercial & Ranking
                </h3>
              </div>
              <span className="text-[10px] text-[#06434a] font-extrabold">
                Últimos 30 Días
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              
              {/* 1. Soportes Líderes */}
              <div className="space-y-3">
                <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider block border-b border-stone-100 pb-1">
                  Soportes más vendidos
                </span>
                <div className="space-y-2.5">
                  {[
                    { name: "Sarmiento y 9 de Julio", count: "12 pautas", price: "$95K/sem", val: 100 },
                    { name: "Palmares Open Mall", count: "9 pautas", price: "$145K/sem", val: 80 },
                    { name: "Av. Arístides frente Parque", count: "6 pautas", price: "$185K/sem", val: 55 }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                        <span className="truncate max-w-[120px]">{item.name}</span>
                        <span className="font-mono text-[10px] text-stone-500">{item.count}</span>
                      </div>
                      <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#06434a] h-full rounded-full" style={{ width: `${item.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Clientes con Mayor Inversión */}
              <div className="space-y-3">
                <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider block border-b border-stone-100 pb-1">
                  Top Anunciantes / Inversión
                </span>
                <div className="space-y-2.5">
                  {clientes.slice(0, 3).map((item, idx) => (
                    <div key={item.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                        <span className="truncate max-w-[120px]">{item.empresa}</span>
                        <span className="font-mono text-[10px] text-stone-500">${(item.totalInversión / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${100 - (idx * 20)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Formatos Estrella */}
              <div className="space-y-3">
                <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider block border-b border-stone-100 pb-1">
                  Formatos Preferidos
                </span>
                <div className="space-y-2.5">
                  {[
                    { format: "Pantallas LED (Digital)", share: "62% de inversión", val: 62, color: "bg-[#06434a]" },
                    { format: "Tradicionales (Estático)", share: "28% de inversión", val: 28, color: "bg-blue-500" },
                    { format: "LED Móvil (GPS)", share: "10% de inversión", val: 10, color: "bg-amber-400" }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                        <span>{item.format}</span>
                        <span className="font-mono text-[10px] text-stone-500">{item.val}%</span>
                      </div>
                      <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                        <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN MODULES */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* A. SMART SUGGESTIONS (Gemini Revenue Optimization) */}
          <div className="bg-gradient-to-b from-[#FAF9F5] to-stone-50 border border-stone-200/80 rounded-[28px] p-5 space-y-4 shadow-2xs text-left">
            <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                <h4 className="text-[11px] font-extrabold text-stone-800 uppercase tracking-wider font-mono">
                  Sugerencias de Revenue IA
                </h4>
              </div>
              <span className="text-[8px] bg-amber-500/10 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">Smart Advisor</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-stone-200/60 space-y-1.5 shadow-3xs hover:border-[#06434a]/30 transition-all">
                <span className="text-[8px] bg-emerald-500/10 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Sugerencia de Precios
                </span>
                <p className="text-[10px] text-stone-600 leading-relaxed font-medium">
                  Mendoza centro registra <strong className="text-stone-900 font-black">92% de ocupación</strong> sostenida en LED Peatonal. Sugerimos incrementar tarifas un <strong className="text-stone-900 font-black">12% global</strong> para contratos nuevos.
                </p>
                <button 
                  onClick={() => {
                    onNavigateToTab("revenue");
                    triggerToast("Abriendo optimizador de tarifas Revenue IA...");
                  }}
                  className="text-[9px] font-black text-[#06434a] hover:underline flex items-center gap-0.5"
                >
                  <span>Calibrar Tarifas</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200/60 space-y-1.5 shadow-3xs hover:border-blue-300 transition-all">
                <span className="text-[8px] bg-blue-500/10 text-blue-700 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Soporte Ocioso
                </span>
                <p className="text-[10px] text-stone-600 leading-relaxed font-medium">
                  La pantalla <strong className="text-stone-900 font-black">Las Heras y Mitre (sc-03)</strong> tiene disponibilidad vacante las próximas 3 semanas. Generar descuento de preventa del <strong className="text-stone-900 font-black">25%</strong>.
                </p>
                <button 
                  onClick={() => {
                    onNavigateToTab("inventario");
                    triggerToast("Filtrando soportes ociosos en el inventario...");
                  }}
                  className="text-[9px] font-black text-blue-700 hover:underline flex items-center gap-0.5"
                >
                  <span>Revisar Soporte</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* B. PRÓXIMOS VENCIMIENTOS (Active Campaigns expiring soon) */}
          <div className="bg-white border border-stone-200/80 rounded-[28px] p-5 shadow-2xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-stone-500" />
                <h4 className="text-xs font-extrabold text-stone-800 uppercase tracking-widest font-mono">
                  Próximos Vencimientos
                </h4>
              </div>
              <span className="text-[10px] text-stone-400 font-bold">Próximos 10 días</span>
            </div>

            <div className="space-y-3">
              {campañas.length > 0 ? (
                campañas.map((camp) => (
                  <div key={camp.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200/40 space-y-2 hover:bg-stone-50/50 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[8px] bg-stone-200 text-stone-600 font-extrabold px-1.5 py-0.5 rounded uppercase">
                          ID: {camp.id}
                        </span>
                        <h5 className="text-[11px] font-black text-stone-950 font-display truncate max-w-[160px] mt-1">
                          {camp.nombre}
                        </h5>
                        <p className="text-[10px] text-stone-400 font-bold flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" />
                          {camp.screenNombre}
                        </p>
                      </div>
                      <span className="text-[9px] text-amber-600 font-mono font-bold shrink-0">
                        Vence: {camp.fechaFin.split("-").reverse().slice(0, 2).join("/")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-1 border-t border-stone-200/20">
                      <span className="text-[10px] text-stone-500 font-extrabold">
                        {camp.clienteNombre}
                      </span>
                      <button
                        onClick={() => handleRenewCampaign(camp.id)}
                        className="px-2 py-1 bg-[#06434a] hover:bg-[#0b5e67] text-white text-[9px] font-extrabold uppercase rounded-md cursor-pointer transition-colors shadow-3xs"
                      >
                        Renovar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-stone-400 text-xs">
                  No hay campañas próximas a vencer.
                </div>
              )}
            </div>
          </div>

          {/* C. ACTIVIDAD RECIENTE (Real-time Audit logs) */}
          <div className="bg-white border border-stone-200/80 rounded-[28px] p-5 shadow-2xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <h4 className="text-xs font-extrabold text-stone-800 uppercase tracking-widest font-mono">
                  Actividad Reciente / Auditoría
                </h4>
              </div>
              <span className="text-[10px] text-stone-400 font-bold">Tiempo Real</span>
            </div>

            <div className="relative pl-4 border-l border-stone-100 space-y-5">
              {[
                { user: "Luis (Director)", action: "Aprobó Cotización #QT-102 para Café Central", time: "Hoy, 12:45" },
                { user: "Andrés (Comercial)", action: "Creó MediaKit #MK-201 Lanzamiento Hilux", time: "Hoy, 10:20" },
                { user: "Sistema", action: "Recalibración de brillo lumínico automatizada en Mendoza", time: "Hoy, 06:00" },
                { user: "Gisela (Ops)", action: "Sometió soporte Las Heras LED a chequeo preventivo", time: "Ayer, 16:30" }
              ].map((log, idx) => (
                <div key={idx} className="relative space-y-1">
                  {/* Circle indicator */}
                  <span className="absolute -left-[20.5px] top-1 h-2 w-2 rounded-full bg-[#06434a] border border-white" />
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold">
                    <span>{log.user}</span>
                    <span className="font-mono">{log.time}</span>
                  </div>
                  <p className="text-[10px] text-stone-600 leading-normal font-medium">
                    {log.action}
                  </p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigateToTab("administracion")}
              className="w-full text-center py-1 bg-stone-50 hover:bg-stone-100 rounded-lg text-[10px] text-stone-500 font-bold border border-stone-200/60 transition-all cursor-pointer block"
            >
              Ver Logs de Auditoría Completos
            </button>
          </div>

        </div>

      </div>

      {/* 5. INTERACTIVE OVERLAY MODALS (Real data entries, full state validation) */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden text-left"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                <div className="space-y-0.5">
                  <span className="text-[8px] bg-[#06434a]/8 text-[#06434a] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Lanzador de Acción
                  </span>
                  <h3 className="text-sm font-black text-stone-900 font-display uppercase tracking-tight">
                    {activeModal === "campaña" && "Crear Nueva Campaña DOOH"}
                    {activeModal === "soporte" && "Incorporar Nuevo Soporte OOH"}
                    {activeModal === "cliente" && "Registrar Nuevo Cliente CRM"}
                    {activeModal === "cotizacion" && "Emitir Nueva Cotización"}
                    {activeModal === "reserva" && "Crear Nueva Reserva de Pantalla"}
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="h-7 w-7 rounded-lg hover:bg-stone-200 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Forms */}
              <div className="p-6">
                
                {/* A. NUEVA CAMPAÑA FORM */}
                {activeModal === "campaña" && (
                  <form onSubmit={handleCreateCampaña} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Nombre de Campaña *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej: Promo Verano Toyota Hilux"
                        value={campForm.nombre}
                        onChange={(e) => setCampForm({...campForm, nombre: e.target.value})}
                        className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] focus:ring-1 focus:ring-[#06434a]/10 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Nombre del Anunciante / Cliente *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej: Toyota Mendoza S.A."
                        value={campForm.clienteNombre}
                        onChange={(e) => setCampForm({...campForm, clienteNombre: e.target.value})}
                        className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] focus:ring-1 focus:ring-[#06434a]/10 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Asignar Pantalla / Soporte *</label>
                      <select 
                        required
                        value={campForm.screenId}
                        onChange={(e) => setCampForm({...campForm, screenId: e.target.value})}
                        className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] focus:ring-1 focus:ring-[#06434a]/10 outline-none bg-white"
                      >
                        <option value="">Selecciona un soporte</option>
                        {screens.map(s => (
                          <option key={s.id} value={s.id}>{s.nombre} ({s.ciudad})</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Fecha Inicio</label>
                        <input 
                          type="date" 
                          value={campForm.fechaInicio}
                          onChange={(e) => setCampForm({...campForm, fechaInicio: e.target.value})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] focus:ring-1 focus:ring-[#06434a]/10 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Fecha Vencimiento</label>
                        <input 
                          type="date" 
                          value={campForm.fechaFin}
                          onChange={(e) => setCampForm({...campForm, fechaFin: e.target.value})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] focus:ring-1 focus:ring-[#06434a]/10 outline-none"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full h-11 bg-[#06434a] hover:bg-[#0b5e67] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer mt-2 shadow-xs">
                      Crear Campaña y Agendar Vuelo
                    </button>
                  </form>
                )}

                {/* B. NUEVO SOPORTE FORM */}
                {activeModal === "soporte" && (
                  <form onSubmit={handleCreateSoporte} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Nombre del Soporte / Ubicación *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej: Av. Colón e Italia"
                        value={soporteForm.nombre}
                        onChange={(e) => setSoporteForm({...soporteForm, nombre: e.target.value})}
                        className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] focus:ring-1 focus:ring-[#06434a]/10 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Plaza / Ciudad</label>
                        <select 
                          value={soporteForm.ciudad}
                          onChange={(e) => setSoporteForm({...soporteForm, ciudad: e.target.value as any})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none bg-white"
                        >
                          <option value="Mendoza">Mendoza</option>
                          <option value="Buenos Aires">Buenos Aires</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Categoría</label>
                        <select 
                          value={soporteForm.categoria}
                          onChange={(e) => setSoporteForm({...soporteForm, categoria: e.target.value as any})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none bg-white"
                        >
                          <option value="Pantallas LED">Pantallas LED</option>
                          <option value="Tradicionales">Tradicionales</option>
                          <option value="LED Móvil">LED Móvil</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Tarifa Semanal ($)</label>
                        <input 
                          type="number" 
                          value={soporteForm.precio}
                          onChange={(e) => setSoporteForm({...soporteForm, precio: Number(e.target.value)})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Impactos Semanales</label>
                        <input 
                          type="number" 
                          value={soporteForm.impactos}
                          onChange={(e) => setSoporteForm({...soporteForm, impactos: Number(e.target.value)})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Dimensiones</label>
                        <input 
                          type="text" 
                          value={soporteForm.dimensiones}
                          onChange={(e) => setSoporteForm({...soporteForm, dimensiones: e.target.value})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Formatos Admitidos</label>
                        <input 
                          type="text" 
                          value={soporteForm.formato}
                          onChange={(e) => setSoporteForm({...soporteForm, formato: e.target.value})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full h-11 bg-[#06434a] hover:bg-[#0b5e67] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer mt-3 shadow-xs">
                      Incorporar Soporte OOH
                    </button>
                  </form>
                )}

                {/* C. NUEVO CLIENTE CRM FORM */}
                {activeModal === "cliente" && (
                  <form onSubmit={handleCreateCliente} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Nombre del Contacto *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej: Marcelo Gallardo"
                        value={clienteForm.nombre}
                        onChange={(e) => setClienteForm({...clienteForm, nombre: e.target.value})}
                        className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Razón Social / Empresa *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej: McDonald's Mendoza"
                        value={clienteForm.empresa}
                        onChange={(e) => setClienteForm({...clienteForm, empresa: e.target.value})}
                        className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Email Comercial</label>
                        <input 
                          type="email" 
                          placeholder="contacto@empresa.com"
                          value={clienteForm.email}
                          onChange={(e) => setClienteForm({...clienteForm, email: e.target.value})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Teléfono de Enlace</label>
                        <input 
                          type="text" 
                          placeholder="+54 261 411-2222"
                          value={clienteForm.telefono}
                          onChange={(e) => setClienteForm({...clienteForm, telefono: e.target.value})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Categoría B2B</label>
                        <select 
                          value={clienteForm.categoria}
                          onChange={(e) => setClienteForm({...clienteForm, categoria: e.target.value as any})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none bg-white"
                        >
                          <option value="Corporativo">Corporativo</option>
                          <option value="Agencia">Agencia</option>
                          <option value="Directo">Directo</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Inversión Inicial ($)</label>
                        <input 
                          type="number" 
                          placeholder="0"
                          value={clienteForm.totalInversión || ""}
                          onChange={(e) => setClienteForm({...clienteForm, totalInversión: Number(e.target.value)})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full h-11 bg-[#06434a] hover:bg-[#0b5e67] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer mt-2 shadow-xs">
                      Registrar en CRM
                    </button>
                  </form>
                )}

                {/* D. NUEVA COTIZACIÓN FORM */}
                {activeModal === "cotizacion" && (
                  <form onSubmit={handleCreateCotizacion} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Proyecto / Nombre MediaKit *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej: Pauta Primavera Shopping"
                        value={cotizacionForm.mediakitNombre}
                        onChange={(e) => setCotizacionForm({...cotizacionForm, mediakitNombre: e.target.value})}
                        className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Cliente / Cuenta CRM *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej: Cencosud S.A."
                        value={cotizacionForm.clienteNombre}
                        onChange={(e) => setCotizacionForm({...cotizacionForm, clienteNombre: e.target.value})}
                        className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Importe Total ($) *</label>
                        <input 
                          type="number" 
                          required
                          value={cotizacionForm.total}
                          onChange={(e) => setCotizacionForm({...cotizacionForm, total: Number(e.target.value)})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Descuento (%)</label>
                        <input 
                          type="number" 
                          value={cotizacionForm.descuentoPercent}
                          onChange={(e) => setCotizacionForm({...cotizacionForm, descuentoPercent: Number(e.target.value)})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Condiciones de Cobro</label>
                      <input 
                        type="text" 
                        value={cotizacionForm.condiciones}
                        onChange={(e) => setCotizacionForm({...cotizacionForm, condiciones: e.target.value})}
                        className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                      />
                    </div>
                    <button type="submit" className="w-full h-11 bg-[#06434a] hover:bg-[#0b5e67] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer mt-2 shadow-xs">
                      Emitir y Enviar Cotización B2B
                    </button>
                  </form>
                )}

                {/* E. CREAR RESERVA FORM */}
                {activeModal === "reserva" && (
                  <form onSubmit={handleCreateReserva} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Cliente de Cuenta *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej: Coca Cola Femsa"
                        value={reservaForm.clienteNombre}
                        onChange={(e) => setReservaForm({...reservaForm, clienteNombre: e.target.value})}
                        className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Seleccionar Soporte OOH *</label>
                      <select 
                        required
                        value={reservaForm.screenId}
                        onChange={(e) => setReservaForm({...reservaForm, screenId: e.target.value})}
                        className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none bg-white"
                      >
                        <option value="">Selecciona soporte...</option>
                        {screens.map(s => (
                          <option key={s.id} value={s.id}>{s.nombre} ({s.ciudad})</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Fecha de Reserva (Desde)</label>
                        <input 
                          type="date" 
                          value={reservaForm.fechaInicio}
                          onChange={(e) => setReservaForm({...reservaForm, fechaInicio: e.target.value})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-black uppercase tracking-wider">Fecha de Reserva (Hasta)</label>
                        <input 
                          type="date" 
                          value={reservaForm.fechaFin}
                          onChange={(e) => setReservaForm({...reservaForm, fechaFin: e.target.value})}
                          className="w-full h-10 px-3 border border-stone-200 rounded-xl text-xs font-bold focus:border-[#06434a] outline-none"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full h-11 bg-[#06434a] hover:bg-[#0b5e67] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer mt-2 shadow-xs">
                      Bloquear Soporte y Registrar Reserva
                    </button>
                  </form>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
