import { DoohScreen } from "../../types";

export type Role = "admin" | "comercial_dir" | "comercial_exec" | "ops" | "viewer";

export interface MediaKitSupport {
  id: string;
  notas: string;
  prioridad: "Alta" | "Media" | "Baja";
  duracionSem: number;
}

export interface MediaKit {
  id: string;
  nombre: string;
  clienteId: string;
  clienteNombre: string;
  ciudad: "Mendoza" | "Buenos Aires";
  screenIds: string[];
  version: number;
  estado: "Borrador" | "Nuevo" | "En revisión" | "Cotizando" | "Negociación" | "Aceptado" | "Rechazado" | "Convertido" | "Archivado";
  comentarios: { id: string; user: string; text: string; date: string }[];
  historial: { id: string; action: string; date: string; user: string }[];
  fecha: string;
  presupuesto?: number;
  objetivo?: string;
  soportesEdicionInline: MediaKitSupport[];
}

export interface Cotizacion {
  id: string;
  mediakitId: string;
  mediakitNombre: string;
  clienteNombre: string;
  descuentoPercent: number;
  validez: string;
  condiciones: string;
  total: number;
  estado: "Pendiente" | "Enviada" | "Aceptada" | "Vencida";
}

export interface Reserva {
  id: string;
  mediakitId: string;
  clienteNombre: string;
  screenId: string;
  screenNombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: "Confirmada" | "Pendiente" | "Cancelada";
  conflictiva?: boolean;
}

export interface Campaña {
  id: string;
  reservaId: string;
  clienteNombre: string;
  nombre: string;
  screenId: string;
  screenNombre: string;
  fechaInicio: string;
  fechaFin: string;
  progreso: number; // 0 - 100
  estado: "Activa" | "Planificada" | "Finalizada";
}

export interface Interaction {
  id: string;
  tipo: "Llamada" | "Reunión" | "Email" | "Propuesta" | "Nota";
  detalle: string;
  fecha: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  categoria: "Directo" | "Agencia" | "Corporativo";
  campañasActivas: number;
  totalInversión: number;
  estado?: "contactado" | "negociando" | "cerrado";
  notas?: string;
  historialInteracciones?: Interaction[];
}

export interface ChangeLog {
  id: string;
  user: string;
  action: string;
  date: string;
}

export interface LedVehicle {
  id: string;
  patente: string;
  chofer: string;
  rutaActiva: string;
  bateria: string;
  velocidad: string;
  gpsStatus: "Online" | "Offline";
  estado: "En ruta" | "En mantenimiento" | "Disponible" | "Fuera de servicio";
}
