import { Lead } from "../../../types";
import { MediaKit, Cotizacion, Reserva, Campaña, Role } from "../types";

export interface DashboardHomeProps {
  mediaKits: MediaKit[];
  cotizaciones: Cotizacion[];
  reservas: Reserva[];
  campañas: Campaña[];
  leads: Lead[];
  userRole: Role;
  loading: boolean;
  error: Error | null;
  onNavigateToTab: (tab: string) => void;
  onApproveReserva: (id: string) => void;
  onApproveCotizacion: (id: string) => void;
}

export interface CardProps {
  loading: boolean;
}
