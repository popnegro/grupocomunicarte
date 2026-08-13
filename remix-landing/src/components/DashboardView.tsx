import { useState, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import { Support, MediaKit, SupportPlaza, SupportType, SupportStatus } from '../types';
import { 
  LogOut, Plus, Edit, Trash2, CheckCircle2, AlertCircle, 
  BarChart3, Database, FolderOpen, Mail, 
  Building, Phone, Download, ExternalLink, User,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { SupportImage } from './SupportImage';

export function DashboardView() {
  const { 
    user, logout, supports, leads, mediaKits, currentDashboardTab, setDashboardTab, setView,
    addSupport, updateSupport, deleteSupport, updateLeadStatus, createMediaKit, deleteMediaKit
  } = useApp();

  const [activeEditingSupport, setActiveEditingSupport] = useState<Support | null>(null);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [showMediaKitForm, setShowMediaKitForm] = useState(false);

  // Search and Filter States for Inventory / Soportes
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryPlaza, setInventoryPlaza] = useState<'Todas' | SupportPlaza>('Todas');
  const [inventoryType, setInventoryType] = useState<'Todas' | SupportType>('Todas');

  // Search and Filter States for Leads
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'pending' | 'contacted' | 'archived'>('all');

  // Form States for Support CRUD
  const [supportFormData, setSupportFormData] = useState({
    name: '',
    plaza: 'Mendoza' as SupportPlaza,
    type: 'Pantallas LED' as SupportType,
    address: '',
    latitude: 0,
    longitude: 0,
    description: '',
    imageUrl: '',
    videoUrl: '',
    size: '',
    refPoints: '',
    contactsCount: ''
  });

  // Form States for Media Kit Generation
  const [mediaKitFormData, setMediaKitFormData] = useState({
    title: '',
    clientName: '',
    plaza: 'Mendoza' as SupportPlaza,
    comments: '',
    selectedSupportIds: [] as string[],
    slidesLayout: 'Modern Pitch'
  });

  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper to pre-populate Support form on Edit
  const handleEditClick = (s: Support) => {
    setActiveEditingSupport(s);
    setSupportFormData({
      name: s.name,
      plaza: s.plaza,
      type: s.type,
      address: s.address,
      latitude: s.latitude,
      longitude: s.longitude,
      description: s.description,
      imageUrl: s.imageUrl,
      videoUrl: s.videoUrl || '',
      size: s.size,
      refPoints: s.refPoints ? s.refPoints.join(', ') : '',
      contactsCount: s.contactsCount || ''
    });
    setFormMsg(null);
    setShowSupportForm(true);
  };

  // Helper to open empty Support Form on Create
  const handleCreateClick = () => {
    setActiveEditingSupport(null);
    setSupportFormData({
      name: '',
      plaza: 'Mendoza',
      type: 'Pantallas LED',
      address: '',
      latitude: -32.8894,
      longitude: -68.8458,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1572945281861-68b291979922?w=800&auto=format&fit=crop&q=60',
      videoUrl: '',
      size: '10x4m',
      refPoints: '',
      contactsCount: '1M visualizaciones/mes'
    });
    setFormMsg(null);
    setShowSupportForm(true);
  };

  const handleSupportFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    const refPointsArray = supportFormData.refPoints
      ? supportFormData.refPoints.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const payload = {
      name: supportFormData.name,
      plaza: supportFormData.plaza,
      type: supportFormData.type,
      address: supportFormData.address,
      latitude: Number(supportFormData.latitude),
      longitude: Number(supportFormData.longitude),
      description: supportFormData.description,
      imageUrl: supportFormData.imageUrl,
      videoUrl: supportFormData.videoUrl || undefined,
      size: supportFormData.size,
      status: 'available' as SupportStatus,
      refPoints: refPointsArray,
      contactsCount: supportFormData.contactsCount
    };

    let success = false;
    if (activeEditingSupport) {
      success = await updateSupport(activeEditingSupport.id, payload);
    } else {
      success = await addSupport(payload);
    }

    if (success) {
      setFormMsg({ type: 'success', text: activeEditingSupport ? 'Soporte actualizado con éxito.' : 'Nuevo soporte añadido con éxito.' });
      setTimeout(() => {
        setShowSupportForm(false);
        setActiveEditingSupport(null);
        setFormMsg(null);
      }, 1500);
    } else {
      setFormMsg({ type: 'error', text: 'Ocurrió un error al guardar los cambios en el servidor.' });
    }
  };

  const handleMediaKitSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    if (mediaKitFormData.selectedSupportIds.length === 0) {
      setFormMsg({ type: 'error', text: 'Debe seleccionar al menos un soporte publicitario para el Media Kit.' });
      return;
}

    const payload = {
      title: mediaKitFormData.title,
      clientName: mediaKitFormData.clientName,
      plaza: mediaKitFormData.plaza,
      comments: mediaKitFormData.comments || undefined,
      supportIds: mediaKitFormData.selectedSupportIds,
      slidesLayout: mediaKitFormData.slidesLayout
    };

    const success = await createMediaKit(payload);
    if (success) {
      setFormMsg({ type: 'success', text: 'Media Kit comercial guardado con éxito.' });
      setTimeout(() => {
        setShowMediaKitForm(false);
        setMediaKitFormData({
          title: '',
          clientName: '',
          plaza: 'Mendoza',
          comments: '',
          selectedSupportIds: [],
          slidesLayout: 'Modern Pitch'
        });
        setFormMsg(null);
      }, 1500);
    } else {
      setFormMsg({ type: 'error', text: 'Error al registrar el Media Kit.' });
    }
  };

  // Download Media Kit as structured Google Slides compatible JSON
  const handleExportJSON = (mediakit: MediaKit) => {
    const screens = mediakit.supportIds
      .map(id => supports.find(s => s.id === id))
      .filter((s): s is Support => s !== undefined);

    const slidesPresentation = {
      presentationTitle: mediakit.title,
      clientTarget: mediakit.clientName,
      createdDate: new Date(mediakit.createdAt).toLocaleDateString('es-AR'),
      marketRegion: mediakit.plaza,
      slidesStyle: mediakit.slidesLayout || 'Corporate Pitch',
      integrationPlatform: 'Google Slides API Presentation Structure',
      slidesCount: screens.length + 2, // Intro, Screens, Outro
      slides: [
        {
          slideIndex: 1,
          type: 'TITLE_SLIDE',
          title: `PROPUESTA COBRANZA Y PUBLICIDAD - ${mediakit.title.toUpperCase()}`,
          subtitle: `Preparado exclusivamente para: ${mediakit.clientName}\nPlaza comercial: ${mediakit.plaza}\nGrupo Comunicarte S.A.`,
          backgroundHex: '#0f172a'
        },
        ...screens.map((screen, index) => ({
          slideIndex: index + 2,
          type: 'SUPPORT_DETAIL',
          screenId: screen.id,
          screenName: screen.name,
          category: screen.type,
          address: screen.address,
          dimensions: screen.size,
          reachEstimate: screen.contactsCount || 'Consultar',
          keyPoints: screen.refPoints || [],
          visualSource: screen.imageUrl,
          pricingPolicy: 'Tarifa bajo cotización'
        })),
        {
          slideIndex: screens.length + 2,
          type: 'CONTACT_OUTRO',
          header: 'Grupo Comunicarte S.A.',
          ctaText: 'Solicite el tarifario formal a su ejecutivo comercial.',
          contactInfo: 'comercial@grupocomunicarte.com | Mendoza - Buenos Aires'
        }
      ]
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(slidesPresentation, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `comunicarte_mediakit_${mediakit.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered Supports for Inventory Tab
  const filteredSupports = supports.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(inventorySearch.toLowerCase()) || 
                          s.address.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesPlaza = inventoryPlaza === 'Todas' || s.plaza === inventoryPlaza;
    const matchesType = inventoryType === 'Todas' || s.type === inventoryType;
    return matchesSearch && matchesPlaza && matchesType;
  });

  // Filtered Leads for Leads Tab
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
                          (l.company && l.company.toLowerCase().includes(leadSearch.toLowerCase())) ||
                          l.email.toLowerCase().includes(leadSearch.toLowerCase());
    const matchesStatus = leadStatusFilter === 'all' || l.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F7F9F7] flex flex-col" id="dashboard-wrapper">
      {/* Upper Navigation Bar */}
      <header className="bg-[#082028] text-white px-4 md:px-6 py-3.5 flex flex-wrap justify-between items-center border-b border-[#049A41]/30 gap-3 sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <BrandLogo size="sm" variant="full" />
          <span className="hidden sm:inline-block text-[10px] font-extrabold bg-[#E8F0E4] text-[#082028] px-2.5 py-1 rounded-full uppercase tracking-wider">
            Portal Administrativo
          </span>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition-all border border-white/10"
            title="Volver a la Landing del Sitio Público"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#049A41]" />
            <span className="hidden sm:inline">Sitio Público</span>
          </button>

          <div className="text-right hidden md:block border-l border-white/10 pl-4">
            <p className="text-xs font-extrabold text-white">{user?.name || 'Administrador'}</p>
            <p className="text-[10px] text-slate-300">{user?.email || 'admin@grupocomunicarte.com'}</p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white text-xs font-bold rounded-xl transition-all border border-red-500/30"
            title="Cerrar Sesión"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Tabs Controls */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#DCE4DF] p-3 md:p-4 space-y-1 shrink-0">
          <div className="px-3 py-1 mb-2 text-[10px] font-extrabold text-[#40515A] uppercase tracking-wider flex items-center justify-between">
            <span>Navegación Admin</span>
            <span className="text-[9px] text-[#049A41] bg-[#E8F0E4] px-1.5 py-0.5 rounded font-mono">/dashboard</span>
          </div>

          {/* Nav Items List */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5 md:gap-1">
            <button
              onClick={() => setDashboardTab('metrics')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                currentDashboardTab === 'metrics'
                  ? 'bg-[#082028] text-white shadow-2xs border-l-4 border-[#049A41]'
                  : 'text-[#40515A] hover:bg-[#F7F9F7] hover:text-[#082028]'
              }`}
            >
              <BarChart3 className={`w-4 h-4 shrink-0 ${currentDashboardTab === 'metrics' ? 'text-[#049A41]' : ''}`} />
              <div className="flex flex-col items-start text-left">
                <span>Dashboard</span>
                <span className="text-[9px] font-mono opacity-60">/dashboard</span>
              </div>
            </button>

            <button
              onClick={() => setDashboardTab('inventory')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                currentDashboardTab === 'inventory'
                  ? 'bg-[#082028] text-white shadow-2xs border-l-4 border-[#049A41]'
                  : 'text-[#40515A] hover:bg-[#F7F9F7] hover:text-[#082028]'
              }`}
            >
              <Database className={`w-4 h-4 shrink-0 ${currentDashboardTab === 'inventory' ? 'text-[#049A41]' : ''}`} />
              <div className="flex flex-col items-start text-left">
                <span>Soportes</span>
                <span className="text-[9px] font-mono opacity-60">/dashboard/soportes</span>
              </div>
            </button>

            <button
              onClick={() => setDashboardTab('leads')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                currentDashboardTab === 'leads'
                  ? 'bg-[#082028] text-white shadow-2xs border-l-4 border-[#049A41]'
                  : 'text-[#40515A] hover:bg-[#F7F9F7] hover:text-[#082028]'
              }`}
            >
              <Mail className={`w-4 h-4 shrink-0 ${currentDashboardTab === 'leads' ? 'text-[#049A41]' : ''}`} />
              <div className="flex flex-col items-start text-left flex-1 min-w-0">
                <div className="flex items-center justify-between w-full">
                  <span>Leads</span>
                  {leads.filter(l => l.status === 'pending').length > 0 && (
                    <span className="bg-[#049A41] text-[#082028] text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ml-1">
                      {leads.filter(l => l.status === 'pending').length}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-mono opacity-60">/dashboard/leads</span>
              </div>
            </button>

            <button
              onClick={() => setDashboardTab('mediakits')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                currentDashboardTab === 'mediakits'
                  ? 'bg-[#082028] text-white shadow-2xs border-l-4 border-[#049A41]'
                  : 'text-[#40515A] hover:bg-[#F7F9F7] hover:text-[#082028]'
              }`}
            >
              <FolderOpen className={`w-4 h-4 shrink-0 ${currentDashboardTab === 'mediakits' ? 'text-[#049A41]' : ''}`} />
              <div className="flex flex-col items-start text-left">
                <span>Solicitudes</span>
                <span className="text-[9px] font-mono opacity-60">/dashboard/solicitudes</span>
              </div>
            </button>
          </div>

          <div className="pt-4 mt-4 border-t border-[#DCE4DF] hidden md:block">
            <button
              onClick={() => setView('landing')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#F7F9F7] hover:bg-[#E8F0E4] text-[#082028] border border-[#DCE4DF] text-xs font-extrabold rounded-xl transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#049A41]" />
              <span>Volver a la Landing</span>
            </button>
          </div>
        </aside>

        {/* Dashboard Main Interactive Workspace */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {/* TAB 1: METRICS */}
          {currentDashboardTab === 'metrics' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-slate-800">Resumen Operativo S.A.</h2>
              </div>

              {/* Status Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Soportes Publicitarios</span>
                  <p className="text-3xl font-extrabold text-slate-900 mt-2">{supports.length}</p>
                  <p className="text-xs text-slate-500 mt-1">Soportes cargados en Mendoza y Buenos Aires</p>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leads Recibidos</span>
                  <p className="text-3xl font-extrabold text-slate-900 mt-2">{leads.length}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-slate-500">{leads.filter(l => l.status === 'pending').length} pendientes</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-emerald-600 font-semibold">{leads.filter(l => l.status === 'contacted').length} contactados</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Media Kits Registrados</span>
                  <p className="text-3xl font-extrabold text-slate-900 mt-2">{mediaKits.length}</p>
                  <p className="text-xs text-slate-500 mt-1">Campañas planificadas con clientes activos</p>
                </div>
              </div>

              {/* Quick Info Block */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1 max-w-xl">
                  <h4 className="text-sm font-bold text-slate-800">¿Cómo funciona la integración con Google Slides?</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Los Media Kits comerciales generados recopilan las fichas técnicas completas de las pantallas seleccionadas. El módulo exporta un archivo en formato estructurado JSON compatible con la API de Google Slides. Para automatizar la creación de la presentación en la nube de Google, el sistema está diseñado para integrarse mediante un webhook serverless conectando la API de Google Drive y Slides, que lee el archivo JSON y genera el deck comercial de forma 100% automatizada.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl shrink-0 w-full md:w-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conector de Salida</span>
                  <p className="text-xs text-slate-700 font-semibold mt-1">Google Slides API V1</p>
                  <p className="text-[10px] text-cyan-600 font-bold mt-0.5">Listo para Integrar Webhook</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY CRUD */}
          {currentDashboardTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DCE4DF] pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-[#082028]">Gestión de Soportes</h2>
                  <p className="text-xs text-[#40515A]">Catálogo completo de pantallas, ubicaciones, formatos e imágenes comerciales.</p>
                </div>
                <button
                  onClick={handleCreateClick}
                  className="px-4 py-2.5 bg-[#049A41] hover:bg-[#038537] text-[#082028] text-xs font-extrabold rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-all self-start"
                >
                  <Plus className="w-4 h-4" />
                  Añadir Soporte
                </button>
              </div>

              {/* Filters Bar */}
              <div className="bg-white border border-[#DCE4DF] p-4 rounded-2xl shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Buscar soporte por nombre o dirección..."
                    className="w-full pl-10 pr-4 py-2 bg-[#F7F9F7] border border-[#DCE4DF] focus:border-[#049A41] rounded-xl text-xs font-bold text-[#082028] outline-none transition-all"
                  />
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <select
                    value={inventoryPlaza}
                    onChange={(e) => setInventoryPlaza(e.target.value as any)}
                    className="bg-[#F7F9F7] border border-[#DCE4DF] px-3 py-2 rounded-xl text-xs font-extrabold text-[#082028] outline-none focus:border-[#049A41]"
                  >
                    <option value="Todas">Todas las Plazas</option>
                    <option value="Mendoza">Mendoza</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                  </select>

                  <select
                    value={inventoryType}
                    onChange={(e) => setInventoryType(e.target.value as any)}
                    className="bg-[#F7F9F7] border border-[#DCE4DF] px-3 py-2 rounded-xl text-xs font-extrabold text-[#082028] outline-none focus:border-[#049A41]"
                  >
                    <option value="Todas">Todas las Categorías</option>
                    <option value="Pantallas LED">Pantallas LED</option>
                    <option value="Soportes Tradicionales">Soportes Tradicionales</option>
                    <option value="LED Móvil">LED Móvil</option>
                  </select>
                </div>
              </div>

              {/* Inventory Table / List */}
              {filteredSupports.length === 0 ? (
                <div className="bg-white border border-[#DCE4DF] rounded-2xl p-12 text-center text-[#40515A]">
                  <Database className="w-10 h-10 text-[#64748B] mx-auto mb-3" />
                  <p className="text-sm font-extrabold text-[#082028]">No se encontraron soportes que coincidan con la búsqueda.</p>
                  <p className="text-xs text-[#40515A] mt-1">Pruebe ajustando los filtros de plaza o categoría.</p>
                </div>
              ) : (
                <div className="bg-white border border-[#DCE4DF] rounded-2xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F7F9F7] border-b border-[#DCE4DF] text-[#40515A] font-extrabold text-[10px] uppercase tracking-wider">
                          <th className="px-5 py-3">Soporte / Detalle</th>
                          <th className="px-5 py-3">Plaza</th>
                          <th className="px-5 py-3">Categoría</th>
                          <th className="px-5 py-3">Formato</th>
                          <th className="px-5 py-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE4DF] text-xs text-[#082028]">
                        {filteredSupports.map(s => (
                          <tr key={s.id} className="hover:bg-[#F7F9F7]/80 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center space-x-3">
                                <SupportImage
                                  src={s.imageUrl}
                                  alt={s.name}
                                  supportName={s.name}
                                  supportType={s.type}
                                  className="w-12 h-12 object-cover rounded-xl border border-[#DCE4DF] shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-extrabold text-[#082028] truncate max-w-xs">{s.name}</p>
                                  <p className="text-[10px] text-[#40515A] truncate max-w-xs">{s.address}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-bold text-[#082028]">{s.plaza}</td>
                            <td className="px-5 py-3.5">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#E8F0E4] text-[#049A41] border border-[#049A41]/20">
                                {s.type}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 font-bold text-[#40515A]">{s.size}</td>
                            <td className="px-5 py-3.5 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => handleEditClick(s)}
                                className="p-1.5 text-[#40515A] hover:text-[#082028] hover:bg-[#E8F0E4] rounded-lg transition-colors inline-flex"
                                title="Editar Soporte"
                              >
                                <Edit className="w-4 h-4 text-[#049A41]" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (user?.role !== 'SúperAdmin') {
                                    alert('Permisos insuficientes: Solo la cuenta SúperAdmin puede eliminar soportes publicitarios.');
                                    return;
                                  }
                                  if (confirm(`¿Está seguro de que desea eliminar el soporte "${s.name}"?`)) {
                                    const success = await deleteSupport(s.id);
                                    if (!success) alert('Error al eliminar soporte.');
                                  }
                                }}
                                disabled={user?.role !== 'SúperAdmin'}
                                className={`p-1.5 rounded-lg transition-colors inline-flex ${
                                  user?.role === 'SúperAdmin'
                                    ? 'text-[#64748B] hover:text-red-600 hover:bg-red-50'
                                    : 'text-slate-300 cursor-not-allowed'
                                }`}
                                title={user?.role === 'SúperAdmin' ? 'Eliminar Soporte' : 'Eliminar (Solo SúperAdmin)'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LEADS INBOX */}
          {currentDashboardTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DCE4DF] pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-[#082028]">Inbox de Leads Comerciales</h2>
                  <p className="text-xs text-[#40515A]">Solicitudes de cotización recibidas directamente desde el sitio público.</p>
                </div>
              </div>

              {/* Filters Bar for Leads */}
              <div className="bg-white border border-[#DCE4DF] p-4 rounded-2xl shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Buscar lead por nombre, empresa o correo..."
                    className="w-full pl-10 pr-4 py-2 bg-[#F7F9F7] border border-[#DCE4DF] focus:border-[#049A41] rounded-xl text-xs font-bold text-[#082028] outline-none transition-all"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value as any)}
                    className="bg-[#F7F9F7] border border-[#DCE4DF] px-3 py-2 rounded-xl text-xs font-extrabold text-[#082028] outline-none focus:border-[#049A41]"
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="pending">Pendientes</option>
                    <option value="contacted">Contactados</option>
                    <option value="archived">Archivados</option>
                  </select>
                </div>
              </div>

              {/* Leads List */}
              {filteredLeads.length === 0 ? (
                <div className="bg-white border border-[#DCE4DF] rounded-2xl p-12 text-center text-[#40515A]">
                  <Mail className="w-10 h-10 text-[#64748B] mx-auto mb-3" />
                  <p className="text-sm font-extrabold text-[#082028]">No hay consultas registradas aún.</p>
                  <p className="text-xs text-[#40515A] mt-1">Las solicitudes enviadas desde la landing page aparecerán aquí en tiempo real.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLeads.map(lead => (
                    <div key={lead.id} className="bg-white border border-[#DCE4DF] rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row justify-between items-start gap-6">
                      <div className="space-y-4 flex-1">
                        {/* Header Lead */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            lead.status === 'pending' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                            lead.status === 'contacted' ? 'bg-[#E8F0E4] text-[#049A41] border border-[#049A41]/20' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {lead.status === 'pending' ? 'Pendiente' : lead.status === 'contacted' ? 'Contactado' : 'Archivado'}
                          </span>
                          <span className="text-[10px] text-[#40515A] font-extrabold">
                            {new Date(lead.createdAt).toLocaleString('es-AR')}
                          </span>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#082028]">
                          <div className="space-y-1">
                            <p className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-[#049A41]" /><strong className="text-[#082028]">{lead.name}</strong></p>
                            {lead.company && <p className="flex items-center gap-2"><Building className="w-3.5 h-3.5 text-[#64748B]" /><span className="text-[#40515A]">{lead.company}</span></p>}
                          </div>
                          <div className="space-y-1">
                            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#64748B]" /><span className="text-[#40515A]">{lead.email}</span></p>
                            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#64748B]" /><span className="text-[#40515A]">{lead.phone}</span></p>
                          </div>
                        </div>

                        {/* Message */}
                        {lead.message && (
                          <div className="bg-[#F7F9F7] p-3 rounded-xl border border-[#DCE4DF] text-xs text-[#082028]">
                            <p className="font-extrabold text-[#40515A] text-[10px] uppercase mb-0.5">Mensaje del cliente:</p>
                            <p className="italic">"{lead.message}"</p>
                          </div>
                        )}

                        {/* Selected Screens */}
                        <div className="space-y-1.5 border-t border-[#DCE4DF] pt-3">
                          <p className="text-[10px] font-extrabold text-[#40515A] uppercase tracking-wider">
                            Soportes de Interés ({lead.selectedSupportIds.length})
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {lead.selectedSupportIds.map(id => {
                              const s = supports.find(sup => sup.id === id);
                              return (
                                <span key={id} className="bg-[#E8F0E4] border border-[#049A41]/20 text-[#082028] text-[10px] px-2.5 py-1 rounded-lg font-bold">
                                  {s ? s.name : `Pantalla ID: ${id}`}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="w-full md:w-48 shrink-0 md:border-l md:border-[#DCE4DF] md:pl-5 space-y-3 self-stretch flex flex-col justify-between">
                        <div>
                          <label className="block text-[10px] font-extrabold text-[#40515A] uppercase tracking-wider mb-1">Estado del Lead</label>
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                            className="w-full bg-[#F7F9F7] border border-[#DCE4DF] focus:border-[#049A41] px-3 py-2 rounded-xl text-xs font-extrabold text-[#082028] outline-none"
                          >
                            <option value="pending">Pendiente</option>
                            <option value="contacted">Contactado</option>
                            <option value="archived">Archivado</option>
                          </select>
                        </div>

                        <div className="bg-[#E8F0E4] text-[#082028] text-[10px] p-2 rounded-xl border border-[#049A41]/20 font-bold text-center">
                          Cotización Personalizada
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MEDIA KITS / SOLICITUDES */}
          {currentDashboardTab === 'mediakits' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DCE4DF] pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-[#082028]">Solicitudes y Media Kits</h2>
                  <p className="text-xs text-[#40515A]">Propuestas comerciales armadas para clientes y exportables a Google Slides.</p>
                </div>
                <button
                  onClick={() => setShowMediaKitForm(true)}
                  className="px-4 py-2.5 bg-[#049A41] hover:bg-[#038537] text-[#082028] text-xs font-extrabold rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-all self-start"
                >
                  <Plus className="w-4 h-4" />
                  Crear Media Kit
                </button>
              </div>

              {/* Media Kits Grid */}
              {mediaKits.length === 0 ? (
                <div className="bg-white border border-[#DCE4DF] rounded-2xl p-12 text-center text-[#40515A]">
                  <FolderOpen className="w-10 h-10 text-[#64748B] mx-auto mb-3" />
                  <p className="text-sm font-extrabold text-[#082028]">No hay solicitudes ni Media Kits generados.</p>
                  <p className="text-xs text-[#40515A] mt-1">Cree presupuestos integrales de pantallas desde aquí.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {mediaKits.map(m => (
                    <div key={m.id} className="bg-white border border-[#DCE4DF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Cliente / Propuesta</span>
                            <h3 className="text-sm font-bold text-slate-800 mt-0.5">{m.title}</h3>
                            <p className="text-xs text-slate-500 font-medium">Para: {m.clientName}</p>
                          </div>
                          <span className="text-xs font-bold text-cyan-600 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded-full">{m.plaza}</span>
                        </div>

                        {m.comments && (
                          <p className="text-xs text-slate-500 italic">"{m.comments}"</p>
                        )}

                        {/* List of screens in this mediakit */}
                        <div className="space-y-2 border-t border-slate-100 pt-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detalle del Mix de Medios ({m.supportIds.length})</p>
                          <div className="max-h-24 overflow-y-auto space-y-1">
                            {m.supportIds.map(id => {
                              const s = supports.find(sup => sup.id === id);
                              return (
                                <div key={id} className="text-[10px] flex justify-between text-slate-600 bg-slate-50 border border-slate-100 p-1.5 rounded-lg font-medium">
                                  <span className="truncate pr-4">{s ? s.name : `Soporte ID: ${id}`}</span>
                                  <span className="shrink-0 text-slate-400">{s ? s.size : ''}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Export buttons */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                        <button
                          onClick={() => handleExportJSON(m)}
                          className="flex-1 py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Exportar JSON Slides
                        </button>
                        <button
                          onClick={async () => {
                            if (user?.role !== 'SúperAdmin') {
                              alert('Solo la cuenta SúperAdmin puede eliminar propuestas comerciales.');
                              return;
                            }
                            if (confirm('¿Está seguro de que desea eliminar este Media Kit comercial?')) {
                              await deleteMediaKit(m.id);
                            }
                          }}
                          disabled={user?.role !== 'SúperAdmin'}
                          className={`p-2 border rounded-xl transition-all ${
                            user?.role === 'SúperAdmin'
                              ? 'border-slate-200 text-slate-500 hover:text-red-500 hover:bg-slate-50'
                              : 'border-slate-100 text-slate-200 cursor-not-allowed'
                          }`}
                          title="Eliminar propuesta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL OVERLAY 1: Support CRUD form */}
      {showSupportForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold">{activeEditingSupport ? 'Editar Soporte publicitario' : 'Añadir Nuevo Soporte'}</h3>
              <button onClick={() => setShowSupportForm(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>

            <form onSubmit={handleSupportFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formMsg && (
                <div className={`p-3 text-xs rounded-xl flex items-start gap-2 ${
                  formMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {formMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  <span>{formMsg.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    value={supportFormData.name}
                    onChange={(e) => setSupportFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Gran Pantalla LED Costanera"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  />
                </div>

                {/* Plaza */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Plaza *</label>
                  <select
                    value={supportFormData.plaza}
                    onChange={(e) => setSupportFormData(prev => ({ ...prev, plaza: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  >
                    <option value="Mendoza">Mendoza</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Categoría *</label>
                  <select
                    value={supportFormData.type}
                    onChange={(e) => setSupportFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  >
                    <option value="Soportes Tradicionales">Soportes Tradicionales</option>
                    <option value="Pantallas LED">Pantallas LED</option>
                    <option value="LED Móvil">LED Móvil</option>
                  </select>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Dirección Física *</label>
                  <input
                    type="text"
                    required
                    value={supportFormData.address}
                    onChange={(e) => setSupportFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Calle, Altura, Departamento o Cruce Vial"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  />
                </div>

                {/* Coordinates */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Latitud *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={supportFormData.latitude}
                    onChange={(e) => setSupportFormData(prev => ({ ...prev, latitude: Number(e.target.value) }))}
                    placeholder="-32.8894"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Longitud *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={supportFormData.longitude}
                    onChange={(e) => setSupportFormData(prev => ({ ...prev, longitude: Number(e.target.value) }))}
                    placeholder="-68.8458"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Tamaño / Dimensiones *</label>
                  <input
                    type="text"
                    required
                    value={supportFormData.size}
                    onChange={(e) => setSupportFormData(prev => ({ ...prev, size: e.target.value }))}
                    placeholder="Ej: 12x4m"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  />
                </div>

                {/* Contacts Count */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Alcance / Contactos Mensuales</label>
                  <input
                    type="text"
                    value={supportFormData.contactsCount}
                    onChange={(e) => setSupportFormData(prev => ({ ...prev, contactsCount: e.target.value }))}
                    placeholder="Ej: 1.5M visualizaciones/mes"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Descripción Comercial *</label>
                  <textarea
                    required
                    rows={3}
                    value={supportFormData.description}
                    onChange={(e) => setSupportFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describa el punto de visibilidad, características de tráfico, iluminación..."
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 outline-none resize-none focus:bg-white transition-all"
                  />
                </div>

                {/* Image URL */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">URL de Imagen de Portada *</label>
                  <input
                    type="url"
                    required
                    value={supportFormData.imageUrl}
                    onChange={(e) => setSupportFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  />
                </div>

                {/* Video URL */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">URL de Video de Simulación (Opcional)</label>
                  <input
                    type="url"
                    value={supportFormData.videoUrl}
                    onChange={(e) => setSupportFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://ejemplo.com/recorrido.mp4"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  />
                </div>

                {/* Reference Points */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Puntos de Referencia (Separados por coma)</label>
                  <input
                    type="text"
                    value={supportFormData.refPoints}
                    onChange={(e) => setSupportFormData(prev => ({ ...prev, refPoints: e.target.value }))}
                    placeholder="Ej: Cerca de Terminal, Frente a Estación de Servicio, Zona Comercial"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowSupportForm(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  {activeEditingSupport ? 'Guardar Cambios' : 'Añadir Soporte'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL OVERLAY 2: Create Media Kit */}
      {showMediaKitForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold">Generar Nueva Propuesta Media Kit</h3>
              <button onClick={() => setShowMediaKitForm(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>

            <form onSubmit={handleMediaKitSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formMsg && (
                <div className={`p-3 text-xs rounded-xl flex items-start gap-2 ${
                  formMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {formMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  <span>{formMsg.text}</span>
                </div>
              )}

              <div className="space-y-3.5">
                {/* Title */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Título de Propuesta *</label>
                  <input
                    type="text"
                    required
                    value={mediaKitFormData.title}
                    onChange={(e) => setMediaKitFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: Campaña Primavera Coca-Cola"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  />
                </div>

                {/* Client */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Nombre del Cliente / Marca *</label>
                  <input
                    type="text"
                    required
                    value={mediaKitFormData.clientName}
                    onChange={(e) => setMediaKitFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Ej: Coca-Cola Argentina S.A."
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  />
                </div>

                {/* Plaza */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Plaza del Plan de Medios *</label>
                  <select
                    value={mediaKitFormData.plaza}
                    onChange={(e) => setMediaKitFormData(prev => ({ ...prev, plaza: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  >
                    <option value="Mendoza">Mendoza</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                  </select>
                </div>

                {/* Slides Design */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Estilo de Presentación (Google Slides)</label>
                  <select
                    value={mediaKitFormData.slidesLayout}
                    onChange={(e) => setMediaKitFormData(prev => ({ ...prev, slidesLayout: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs text-slate-700 outline-none focus:bg-white transition-all"
                  >
                    <option value="Modern Pitch">Modern Pitch (Fondo Oscuro Neon)</option>
                    <option value="Executive Light">Executive Light (Minimalista Corporativo)</option>
                    <option value="Tech Neon">Tech Neon (Estilo LED)</option>
                  </select>
                </div>

                {/* Select Screens from Inventory */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Añadir Pantallas al Mix de Medios ({mediaKitFormData.selectedSupportIds.length} seleccionadas)</label>
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-40 overflow-y-auto bg-slate-50/50 p-1.5 space-y-1">
                    {supports
                      .filter(s => s.plaza === mediaKitFormData.plaza)
                      .map(s => {
                        const isSelected = mediaKitFormData.selectedSupportIds.includes(s.id);
                        return (
                          <button
                            type="button"
                            key={s.id}
                            onClick={() => {
                              setMediaKitFormData(prev => {
                                const list = prev.selectedSupportIds.includes(s.id)
                                  ? prev.selectedSupportIds.filter(id => id !== s.id)
                                  : [...prev.selectedSupportIds, s.id];
                                return { ...prev, selectedSupportIds: list };
                              });
                            }}
                            className={`w-full text-left p-2 rounded-lg text-[11px] flex justify-between items-center transition-all ${
                              isSelected
                                ? 'bg-cyan-50 border border-cyan-200 text-cyan-800 font-bold'
                                : 'bg-white border border-transparent text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span className="truncate pr-4">{s.name} ({s.size})</span>
                            <span className="text-[9px] text-slate-400">{s.type}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Comentarios Comerciales</label>
                  <textarea
                    rows={2}
                    value={mediaKitFormData.comments}
                    onChange={(e) => setMediaKitFormData(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Instrucciones comerciales adicionales..."
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 outline-none resize-none focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowMediaKitForm(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  Generar Media Kit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
