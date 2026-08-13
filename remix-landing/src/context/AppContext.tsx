import React, { createContext, useContext, useState, useEffect } from 'react';
import { Support, Lead, MediaKit, UserSession, SupportType, SupportPlaza, SupportPlazaFilter, SupportStatus, ExplorerViewMode, AppView } from '../types';

interface AppContextType {
  currentView: AppView;
  setView: (view: AppView) => void;
  navigateToExplorerWithType: (type: SupportType | 'Todos') => void;
  currentDashboardTab: 'metrics' | 'inventory' | 'leads' | 'mediakits';
  setDashboardTab: (tab: 'metrics' | 'inventory' | 'leads' | 'mediakits') => void;

  campaignStartDate: string | null;
  campaignEndDate: string | null;
  setCampaignDates: (start: string | null, end: string | null) => void;

  user: UserSession | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  supports: Support[];
  leads: Lead[];
  mediaKits: MediaKit[];
  isLoading: boolean;
  errorMsg: string | null;

  selectedSupports: Support[];
  toggleSupportSelection: (support: Support) => void;
  clearSelection: () => void;
  selectionError: string | null;
  clearSelectionError: () => void;
  MAX_SELECTION_LIMIT: number;
  isSubmittingLead: boolean;
  submitLead: (leadData: { name: string; company: string; email: string; phone: string; message?: string }) => Promise<boolean>;

  currentPlaza: SupportPlazaFilter;
  setCurrentPlaza: (plaza: SupportPlazaFilter) => void;
  currentType: SupportType | 'Todos';
  setCurrentType: (type: SupportType | 'Todos') => void;
  currentStatus: SupportStatus | 'Todos';
  setCurrentStatus: (status: SupportStatus | 'Todos') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  explorerViewMode: ExplorerViewMode;
  setExplorerViewMode: (mode: ExplorerViewMode) => void;
  activeSupportId: string | null;
  setActiveSupportId: (id: string | null) => void;
  resetExplorerFilters: () => void;

  addSupport: (support: Omit<Support, 'id'>) => Promise<boolean>;
  updateSupport: (id: string, support: Partial<Support>) => Promise<boolean>;
  deleteSupport: (id: string) => Promise<boolean>;
  updateLeadStatus: (id: string, status: 'pending' | 'contacted' | 'archived') => Promise<boolean>;
  createMediaKit: (mediaKitData: { title: string; clientName: string; plaza: SupportPlaza; comments?: string; supportIds: string[]; slidesLayout?: string }) => Promise<boolean>;
  deleteMediaKit: (id: string) => Promise<boolean>;

  refreshAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const PUBLIC_SELECTION_STORAGE_KEY = 'gc_public_selection';

interface PersistedSelectionState {
  selectedSupports: Support[];
  campaignStartDate: string | null;
  campaignEndDate: string | null;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setView] = useState<AppView>('landing');
  const [currentDashboardTab, setDashboardTab] = useState<'metrics' | 'inventory' | 'leads' | 'mediakits'>('metrics');

  const navigateToExplorerWithType = (type: SupportType | 'Todos') => {
    setCurrentType(type);
    setView('landing');
    setTimeout(() => {
      const el = document.getElementById('inventory-grid');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const [campaignStartDate, setCampaignStartDate] = useState<string | null>(null);
  const [campaignEndDate, setCampaignEndDate] = useState<string | null>(null);

  const setCampaignDates = (start: string | null, end: string | null) => {
    setCampaignStartDate(start);
    setCampaignEndDate(end);
  };

  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [supports, setSupports] = useState<Support[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [mediaKits, setMediaKits] = useState<MediaKit[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [currentPlaza, setCurrentPlaza] = useState<SupportPlazaFilter>('Todas');
  const [currentType, setCurrentType] = useState<SupportType | 'Todos'>('Todos');
  const [currentStatus, setCurrentStatus] = useState<SupportStatus | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [explorerViewMode, setExplorerViewMode] = useState<ExplorerViewMode>('map');
  const [activeSupportId, setActiveSupportId] = useState<string | null>(null);

  const resetExplorerFilters = () => {
    setCurrentPlaza('Todas');
    setCurrentType('Todos');
    setCurrentStatus('Todos');
    setSearchQuery('');
  };

  const [selectedSupports, setSelectedSupports] = useState<Support[]>([]);

  useEffect(() => {
    try {
      const rawSelection = localStorage.getItem(PUBLIC_SELECTION_STORAGE_KEY);
      if (rawSelection) {
        const persisted = JSON.parse(rawSelection) as Partial<PersistedSelectionState>;
        if (Array.isArray(persisted.selectedSupports)) {
          setSelectedSupports(persisted.selectedSupports.slice(0, 50));
        }
        if (typeof persisted.campaignStartDate === 'string' || persisted.campaignStartDate === null) {
          setCampaignStartDate(persisted.campaignStartDate ?? null);
        }
        if (typeof persisted.campaignEndDate === 'string' || persisted.campaignEndDate === null) {
          setCampaignEndDate(persisted.campaignEndDate ?? null);
        }
      }
    } catch (error) {
      console.warn('No se pudo restaurar la selección pública guardada.', error);
      localStorage.removeItem(PUBLIC_SELECTION_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const persistedState: PersistedSelectionState = {
      selectedSupports,
      campaignStartDate,
      campaignEndDate,
    };

    try {
      localStorage.setItem(PUBLIC_SELECTION_STORAGE_KEY, JSON.stringify(persistedState));
    } catch (error) {
      console.warn('No se pudo persistir la selección pública.', error);
    }
  }, [selectedSupports, campaignStartDate, campaignEndDate]);

  useEffect(() => {
    const savedToken = localStorage.getItem('gc_token');
    const savedUser = localStorage.getItem('gc_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
    fetchSupports();
  }, []);

  useEffect(() => {
    if (token) {
      fetchLeads();
      fetchMediaKits();
    }
  }, [token]);

  const fetchSupports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/inventory');
      if (!res.ok) throw new Error('Error al cargar soportes.');
      const data = await res.json();
      setSupports(data);
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : 'Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeads = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/leads', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setLeads(await res.json());
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchMediaKits = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/mediakits', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setMediaKits(await res.json());
    } catch (error) {
      console.error('Error fetching mediakits:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Fallo de autenticación.' };
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('gc_token', data.token);
      localStorage.setItem('gc_user', JSON.stringify(data.user));
      setView('dashboard');
      return { success: true };
    } catch {
      return { success: false, error: 'No se pudo conectar con el servidor de autenticación.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('gc_token');
    localStorage.removeItem('gc_user');
    setView('landing');
  };

  const MAX_SELECTION_LIMIT = 50;
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [isSubmittingLead, setIsSubmittingLead] = useState<boolean>(false);

  const clearSelectionError = () => setSelectionError(null);

  const toggleSupportSelection = (support: Support) => {
    setSelectionError(null);
    setSelectedSupports(prev => {
      const isSelected = prev.some(s => s.id === support.id);
      if (isSelected) return prev.filter(s => s.id !== support.id);
      if (prev.length >= MAX_SELECTION_LIMIT) {
        setSelectionError(`Has alcanzado el límite máximo de ${MAX_SELECTION_LIMIT} soportes seleccionados para tu campaña.`);
        return prev;
      }
      return [...prev, support];
    });
  };

  const clearSelection = () => {
    setSelectedSupports([]);
    setCampaignStartDate(null);
    setCampaignEndDate(null);
    setSelectionError(null);
  };

  const submitLead = async (leadData: { name: string; company: string; email: string; phone: string; message?: string }) => {
    if (isSubmittingLead) return false;
    setIsSubmittingLead(true);
    try {
      const body = {
        ...leadData,
        selectedSupportIds: selectedSupports.map(s => s.id),
        plazaContext: currentPlaza,
        campaignStartDate,
        campaignEndDate
      };
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        clearSelection();
        if (token) fetchLeads();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error submitting lead:', error);
      return false;
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const addSupport = async (support: Omit<Support, 'id'>) => {
    if (!token) return false;
    try {
      const res = await fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(support) });
      if (res.ok) { await fetchSupports(); return true; }
      return false;
    } catch (error) { console.error('Error adding support:', error); return false; }
  };

  const updateSupport = async (id: string, support: Partial<Support>) => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(support) });
      if (res.ok) { await fetchSupports(); return true; }
      return false;
    } catch (error) { console.error('Error updating support:', error); return false; }
  };

  const deleteSupport = async (id: string) => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { await fetchSupports(); return true; }
      return false;
    } catch (error) { console.error('Error deleting support:', error); return false; }
  };

  const updateLeadStatus = async (id: string, status: 'pending' | 'contacted' | 'archived') => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ status }) });
      if (res.ok) { await fetchLeads(); return true; }
      return false;
    } catch (error) { console.error('Error updating lead status:', error); return false; }
  };

  const createMediaKit = async (mediaKitData: { title: string; clientName: string; plaza: SupportPlaza; comments?: string; supportIds: string[]; slidesLayout?: string }) => {
    if (!token) return false;
    try {
      const res = await fetch('/api/mediakits', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(mediaKitData) });
      if (res.ok) { await fetchMediaKits(); return true; }
      return false;
    } catch (error) { console.error('Error creating media kit:', error); return false; }
  };

  const deleteMediaKit = async (id: string) => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/mediakits/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { await fetchMediaKits(); return true; }
      return false;
    } catch (error) { console.error('Error deleting media kit:', error); return false; }
  };

  const refreshAllData = () => {
    fetchSupports();
    if (token) {
      fetchLeads();
      fetchMediaKits();
    }
  };

  return (
    <AppContext.Provider value={{
      currentView, setView,
      navigateToExplorerWithType,
      currentDashboardTab, setDashboardTab,
      campaignStartDate, campaignEndDate, setCampaignDates,
      user, token, login, logout,
      supports, leads, mediaKits, isLoading, errorMsg,
      selectedSupports, toggleSupportSelection, clearSelection, selectionError, clearSelectionError, MAX_SELECTION_LIMIT, isSubmittingLead, submitLead,
      currentPlaza, setCurrentPlaza, currentType, setCurrentType,
      currentStatus, setCurrentStatus, searchQuery, setSearchQuery,
      explorerViewMode, setExplorerViewMode, activeSupportId, setActiveSupportId, resetExplorerFilters,
      addSupport, updateSupport, deleteSupport, updateLeadStatus,
      createMediaKit, deleteMediaKit, refreshAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};
