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
  // Specific for LED Móvil route visualization on the map
  routePoints?: RoutePoint[];
  // For Media Kit & technical specifications
  refPoints?: string[]; // nearby reference points (e.g. "Cerca de Terminal", "Frente a Shopping")
  contactsCount?: string; // Estimated monthly views/contacts
  resolution?: string; // Resolution if digital/LED
  orientation?: string; // Orientation if applicable
  illumination?: string; // Lighting type
  audio?: string; // Audio capabilities
}

export interface SelectedSupport {
  id: string;
  support: Support;
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
  // For export structure
  slidesLayout?: string; // presentation style choice
  campaignStartDate?: string;
  campaignEndDate?: string;
}

export interface UserSession {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
}
