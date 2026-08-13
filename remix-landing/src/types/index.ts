export type AppView =
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'mediakit'
  | 'nosotros'
  | 'soportes'
  | 'soportes-led'
  | 'soportes-tradicional'
  | 'soportes-led-movil'
  | 'soluciones';

export type UserRole = 'SúperAdmin' | 'Admin';
export type SupportType = 'Soportes Tradicionales' | 'Pantallas LED' | 'LED Móvil';
export type SupportPlaza = 'Mendoza' | 'Buenos Aires';
export type SupportPlazaFilter = 'Todas' | SupportPlaza;
export type SupportStatus = 'available' | 'reserved';
export type AvailabilityStatus = 'available' | 'reserved' | 'unavailable' | 'checking';
export type MediaKitAudience = 'B2B' | 'B2C';

export type ExplorerViewMode = 'map' | 'list';

export interface CampaignDateRange {
  startDate: string | null;
  endDate: string | null;
}

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface Support {
  id: string;
  name: string;
  plaza: SupportPlaza;
  type: SupportType;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  status: SupportStatus;
  size: string;
  routePoints?: RoutePoint[];
  refPoints?: string[];
  contactsCount?: string;
  resolution?: string;
  orientation?: string;
  illumination?: string;
  audio?: string;
  reservedFrom?: string;
  reservedUntil?: string;
}

export interface SelectedSupport {
  id: string;
  support: Support;
}

export interface SupportReservation {
  id: string;
  supportId: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: 'reserved' | 'confirmed' | 'cancelled';
  notes?: string;
}

export interface SupportAvailabilityResult {
  supportId: string;
  status: 'available' | 'reserved' | 'conflict';
  conflicts: SupportReservation[];
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message?: string;
  selectedSupportIds: string[];
  createdAt: string;
  status: 'pending' | 'contacted' | 'archived';
  plazaContext?: string;
  campaignStartDate?: string;
  campaignEndDate?: string;
}

export interface MediaKit {
  id: string;
  title: string;
  clientName: string;
  plaza: SupportPlaza;
  createdAt: string;
  comments?: string;
  supportIds: string[];
  slidesLayout?: MediaKitAudience;
  audience?: MediaKitAudience;
  campaignStartDate?: string;
  campaignEndDate?: string;
}

export interface UserSession {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
}
