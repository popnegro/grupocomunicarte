// Define frontend-specific interfaces (DTOs) that mirror the API response shapes.
// These should be independent of Prisma's client types.
interface Client {
  id: string;
  name: string;
  contact: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Lead {
  id: string;
  status: string;
  notes: string | null;
  clientId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  client?: { id: string; name: string }; // Include relations as returned by API
  user?: { id: string; firstName: string; lastName: string };
}

interface Quote {
  id: string;
  status: 'REQUESTED' | 'QUOTED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  quotedPrice: number | null;
  validUntil: string | null; // ISO Date String
  leadId: string | null;
  userId: string;
  createdAt: string; // ISO Date String
  lead?: {
    id: string;
    name: string;
  };
}

interface MediaKit {
  id: string;
  name: string;
  // Add other relevant fields as returned by the API
}

interface Screen {
  id: string;
  name: string;
  ruta: string; // Assuming 'ruta' is a string as per InteractiveMap audit
  // Add other relevant fields as returned by the API
}

interface Changelog {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  // Add other relevant fields as returned by the API
}

/**
 * A custom error class for API-related issues.
 * This helps in distinguishing API errors from other runtime errors.
 */
class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * A generic request handler that centralizes fetch logic, authentication, and error handling.
 * @param endpoint The API endpoint to call (e.g., '/api/v1/clients').
 * @param options Standard fetch options.
 * @returns A promise that resolves with the JSON response.
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // In a real Clerk application, the token would be retrieved from the session.
  // This is a placeholder for how that logic would be integrated.
  // const token = await window.Clerk.session?.getToken();
  // if (token) {
  //   defaultHeaders['Authorization'] = `Bearer ${token}`;
  // }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(endpoint, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new ApiError(errorData.message || `HTTP error! status: ${response.status}`, response.status);
  }

  return response.json();
}

/**
 * A collection of type-safe methods for interacting with the application's API.
 */
export const apiClient = {
  // V1 Endpoints
  getClients: (): Promise<Client[]> => {
    return request<Client[]>('/api/v1/clients');
  },

  getLeads: (): Promise<Lead[]> => {
    return request<Lead[]>('/api/v1/leads');
  },

  getQuotes: (): Promise<Quote[]> => {
    return request<Quote[]>('/api/v1/quotes');
  },

  // Legacy Endpoints (to be migrated)
  getMediaKits: (): Promise<MediaKit[]> => {
    return request<MediaKit[]>('/api/mediakits');
  },

  getScreens: (): Promise<Screen[]> => {
    return request<Screen[]>('/api/screens');
  },

  getChangelogs: (): Promise<Changelog[]> => {
    return request<Changelog[]>('/api/changelogs');
  },

  // Example of a POST request if needed in the future
  // createClient: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
  //   return request<Client>('/api/v1/clients', { method: 'POST', body: JSON.stringify(data) });
  // }
};