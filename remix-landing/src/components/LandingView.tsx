import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Support } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { ContactForm } from './ContactForm';
import { SpecsOverlay } from './SpecsOverlay';
import { MediaKitView } from './MediaKitView';
import { SelectionBar } from './SelectionBar';
import { SelectionReviewPanel } from './SelectionReviewPanel';
import { BrandLogo } from './BrandLogo';
import { CampaignDateSelector } from './CampaignDateSelector';
import { SupportImage } from './SupportImage';
import { 
  MapPin, CheckCircle2, Circle, Eye, Play, 
  ChevronLeft, ChevronRight, Sparkles, LogIn, FileText, Menu, X, ArrowRight, ShieldCheck, Activity,
  Search, Map as MapIcon, List as ListIcon, RotateCcw, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function LandingView() {
  const { 
    supports, currentPlaza, setCurrentPlaza, currentType, setCurrentType, 
    currentStatus, setCurrentStatus, searchQuery, setSearchQuery,
    explorerViewMode, setExplorerViewMode, activeSupportId, setActiveSupportId,
    resetExplorerFilters, selectedSupports, toggleSupportSelection, currentView, setView 
  } = useApp();

  const [activeSpecsSupport, setActiveSpecsSupport] = useState<Support | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
}
  };

  // Unified Filtered Supports logic
  const filteredSupports = supports.filter(s => {
    const matchesPlaza = currentPlaza === 'Todas' || s.plaza === currentPlaza;
    const matchesType = currentType === 'Todos' || s.type === currentType;
    const matchesStatus = currentStatus === 'Todos' || s.status === currentStatus;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      s.name.toLowerCase().includes(query) ||
      s.address.toLowerCase().includes(query) ||
      s.plaza.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.id.toLowerCase().includes(query);

    return matchesPlaza && matchesType && matchesStatus && matchesSearch;
  });

  // Featured locations subset (top 10 supports for single-row carousel)
  const featuredSupports = supports.slice(0, 10);

  const hasActiveFilters = currentPlaza !== 'Todas' || currentType !== 'Todos' || currentStatus !== 'Todos' || searchQuery.trim() !== '';

  return (
    <div className="min-h-screen bg-[#F7F9F7] flex flex-col font-sans text-[#082028]" id="landing-wrapper">
      {/* Header / Navbar */}
      <nav className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-[#DCE4DF] px-4 sm:px-8 py-3.5 flex justify-between items-center z-40 max-w-7xl mx-auto w-full rounded-b-2xl shadow-2xs">
        <div className="flex items-center space-x-3">
          <BrandLogo size="md" variant="full" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="#inventory-grid"
            className="text-xs font-extrabold text-[#40515A] hover:text-[#082028] transition-colors"
          >
            Explorar Soportes
          </a>

          {selectedSupports.length > 0 && (
            <button
              onClick={() => setView('mediakit')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E8F0E4] hover:bg-[#d8e6d3] text-[#049A41] text-xs font-extrabold rounded-xl transition-all border border-[#049A41]/30 shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" />
              Ver Media Kit ({selectedSupports.length})
            </button>
          )}

          <button
            onClick={() => setView('login')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#082028] hover:bg-[#06181f] text-white text-xs font-extrabold rounded-xl transition-all shadow-2xs"
          >
            <LogIn className="w-3.5 h-3.5 text-[#049A41]" />
            Acceso Panel
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          {selectedSupports.length > 0 && (
            <button
              onClick={() => setView('mediakit')}
              className="p-2 bg-[#E8F0E4] text-[#049A41] rounded-xl text-xs font-extrabold flex items-center gap-1 border border-[#049A41]/30"
            >
              <FileText className="w-4 h-4" />
              <span>({selectedSupports.length})</span>
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#082028] hover:bg-[#E8F0E4] rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-[#DCE4DF] px-6 py-4 space-y-3 z-30 shadow-md"
          >
            <a
              href="#inventory-grid"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-extrabold text-[#082028] py-2 border-b border-[#DCE4DF]"
            >
              Explorar Soportes
            </a>
            {selectedSupports.length > 0 && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setView('mediakit');
                }}
                className="w-full text-left flex items-center justify-between text-xs font-extrabold text-[#049A41] py-2 border-b border-[#DCE4DF]"
              >
                <span>Generar Media Kit</span>
                <span className="bg-[#E8F0E4] px-2 py-0.5 rounded-full text-[10px]">{selectedSupports.length} seleccionados</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setView('login');
              }}
              className="w-full py-2.5 bg-[#082028] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5 text-[#049A41]" />
              Acceso Panel Corporativo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Presentation Banner */}
      <section className="px-6 pt-12 pb-8 text-center max-w-5xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 bg-[#E8F0E4] text-[#049A41] text-[10px] uppercase font-extrabold tracking-widest px-3.5 py-1.5 rounded-full border border-[#049A41]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#049A41]" />
          <span>Vía Pública & Circuito Digital de Alta Definición</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#082028] max-w-3xl mx-auto leading-tight">
          Impacto visual estratégico en los puntos de mayor tráfico urbano
        </h1>
        
        <p className="text-[#40515A] text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Mendoza y Buenos Aires: Soportes monumentales, circuito de pantallas LED de alta definición y unidades LED Móviles con ruteo inteligente de alto alcance.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#inventory-grid"
            className="px-6 py-3 bg-[#049A41] hover:bg-[#038537] text-[#082028] text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            Explorar Soportes
            <ArrowRight className="w-4 h-4" />
          </a>
          <button
            onClick={() => setView('mediakit')}
            className="px-6 py-3 bg-white hover:bg-[#E8F0E4] text-[#082028] border border-[#DCE4DF] text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shadow-2xs"
          >
            <FileText className="w-4 h-4 text-[#049A41]" />
            Generar Media Kit Interactivo
          </button>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto border-t border-[#DCE4DF]">
          <div className="p-3 bg-white rounded-xl border border-[#DCE4DF]">
            <p className="text-xl font-extrabold text-[#082028]">2 Plazas</p>
            <p className="text-[10px] uppercase font-extrabold text-[#40515A]">Mendoza & CABA</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#DCE4DF]">
            <p className="text-xl font-extrabold text-[#049A41]">15M+</p>
            <p className="text-[10px] uppercase font-extrabold text-[#40515A]">Contactos Mensuales</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#DCE4DF]">
            <p className="text-xl font-extrabold text-[#082028]">LED P3/P4</p>
            <p className="text-[10px] uppercase font-extrabold text-[#40515A]">High Refresh Sync</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#DCE4DF]">
            <p className="text-xl font-extrabold text-[#049A41]">100%</p>
            <p className="text-[10px] uppercase font-extrabold text-[#40515A]">Monitoreo en Vivo</p>
          </div>
        </div>
      </section>

      {/* 1. PERÍODO DE CAMPAÑA */}
      <section className="px-4 sm:px-6 pt-4 pb-2 max-w-7xl mx-auto w-full">
        <CampaignDateSelector />
      </section>

      {/* 2. UBICACIONES DESTACADAS - CARRUSEL HORIZONTAL DE UNA SOLA FILA */}
      <section className="px-4 sm:px-6 py-4 max-w-7xl mx-auto w-full space-y-3">
        <div className="flex items-center justify-between border-b border-[#DCE4DF] pb-3">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-[#7C3AED] tracking-wider block">
              Selección Exclusiva
            </span>
            <h2 className="text-lg font-extrabold text-[#082028]">Ubicaciones Destacadas</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#40515A] font-extrabold hidden sm:inline mr-1">
              Carrusel de Inventario
            </span>
            <button
              onClick={() => scrollCarousel('left')}
              className="p-2 bg-white border border-[#DCE4DF] hover:bg-purple-50 text-[#082028] hover:text-[#7C3AED] rounded-xl shadow-2xs transition-all flex items-center justify-center"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-2 bg-white border border-[#DCE4DF] hover:bg-purple-50 text-[#082028] hover:text-[#7C3AED] rounded-xl shadow-2xs transition-all flex items-center justify-center"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Outer Carousel Container with Flanking Left/Right Arrows */}
        <div className="relative flex items-center group">
          <button
            onClick={() => scrollCarousel('left')}
            className="absolute -left-3 z-20 p-2.5 bg-white/95 border border-[#DCE4DF] hover:bg-[#7C3AED] hover:text-white text-[#082028] rounded-full shadow-lg transition-all hidden md:flex items-center justify-center backdrop-blur-xs"
            aria-label="Desplazar a la izquierda"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div 
            ref={carouselRef}
            className="flex items-stretch gap-3.5 overflow-x-auto scroll-smooth py-1 px-1 w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredSupports.map(s => {
              const isSelected = selectedSupports.some(sel => sel.id === s.id);
              return (
                <div 
                  key={`featured-${s.id}`} 
                  className="w-[200px] sm:w-[210px] md:w-[220px] lg:w-[225px] xl:w-[230px] shrink-0 bg-white border border-[#DCE4DF] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group h-full"
                >
                  <div 
                    onClick={() => {
                      setActiveSupportId(s.id);
                      setActiveSpecsSupport(s);
                    }}
                    className="relative h-36 bg-[#082028] cursor-pointer shrink-0"
                  >
                    <SupportImage
                      src={s.imageUrl}
                      alt={s.name}
                      supportName={s.name}
                      supportType={s.type}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Estado Badge */}
                    <div className={`absolute top-2 left-2 text-[8px] uppercase font-extrabold px-2 py-0.5 rounded-full border shadow-2xs ${
                      s.status === 'available'
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : 'bg-amber-500 text-white border-amber-400'
                    }`}>
                      {s.status === 'available' ? 'Disponible' : 'Reservado'}
                    </div>

                    {/* Medida / Size Badge */}
                    <div className="absolute top-2 right-2 bg-[#082028]/90 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border border-[#DCE4DF]/20">
                      {s.size}
                    </div>

                    {s.videoUrl && (
                      <div className="absolute bottom-2 left-2 bg-[#049A41] text-[#082028] text-[8px] uppercase font-extrabold tracking-widest px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Play className="w-2 h-2 fill-[#082028]" />
                        Loop
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#082028] via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-1.5 left-2 right-2">
                      <span className="text-[#049A41] text-[9px] uppercase font-extrabold tracking-wider block">{s.plaza}</span>
                    </div>
                  </div>

                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h3 className="text-xs font-extrabold text-[#082028] leading-tight line-clamp-1">{s.name}</h3>
                      <div className="flex items-center space-x-1 text-[10px] text-[#64748B] mt-1">
                        <MapPin className="w-3 h-3 shrink-0 text-[#049A41]" />
                        <span className="truncate">{s.address}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#DCE4DF] flex items-center justify-between gap-1">
                      <button
                        onClick={() => setActiveSpecsSupport(s)}
                        className="text-[#082028] hover:text-[#7C3AED] font-extrabold text-[10px] flex items-center gap-1 uppercase tracking-wider transition-colors shrink-0"
                      >
                        <Eye className="w-3 h-3" />
                        Ficha
                      </button>

                      {/* Primary PURPLE action button */}
                      <button
                        onClick={() => toggleSupportSelection(s)}
                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center gap-1 transition-all shrink-0 ${
                          isSelected
                            ? 'bg-[#082028] text-white shadow-2xs'
                            : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-2xs'
                        }`}
                      >
                        {isSelected ? <CheckCircle2 className="w-3 h-3 text-[#049A41]" /> : <Circle className="w-3 h-3" />}
                        <span>{isSelected ? 'Añadido' : 'Añadir'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => scrollCarousel('right')}
            className="absolute -right-3 z-20 p-2.5 bg-white/95 border border-[#DCE4DF] hover:bg-[#7C3AED] hover:text-white text-[#082028] rounded-full shadow-lg transition-all hidden md:flex items-center justify-center backdrop-blur-xs"
            aria-label="Desplazar a la derecha"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* 3. EXPLORADOR UNIFICADO DE COBERTURA */}
      <section className="px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full space-y-5" id="inventory-grid">
        <div className="bg-white border border-[#DCE4DF] p-5 rounded-2xl space-y-4 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE4DF] pb-4">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-[#7C3AED] tracking-wider block">
                Cobertura Territorial Inteligente
              </span>
              <h2 className="text-xl font-extrabold text-[#082028]">EXPLORADOR UNIFICADO DE COBERTURA</h2>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center space-x-1 p-1 bg-[#F7F9F7] rounded-xl border border-[#DCE4DF] self-start md:self-auto">
              <button
                onClick={() => setExplorerViewMode('map')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  explorerViewMode === 'map'
                    ? 'bg-[#082028] text-white shadow-2xs'
                    : 'text-[#40515A] hover:text-[#082028]'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Mapa ({filteredSupports.length})</span>
              </button>
              <button
                onClick={() => setExplorerViewMode('list')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  explorerViewMode === 'list'
                    ? 'bg-[#082028] text-white shadow-2xs'
                    : 'text-[#40515A] hover:text-[#082028]'
                }`}
              >
                <ListIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Listado ({filteredSupports.length})</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#40515A]" />
            <input
              type="text"
              placeholder="Buscar por nombre, dirección, código, plaza o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-[#F7F9F7] border border-[#DCE4DF] focus:border-[#7C3AED] focus:bg-white rounded-xl text-xs font-extrabold text-[#082028] outline-none transition-all placeholder:text-[#64748B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#40515A] hover:text-[#082028] p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Plaza Filter */}
              <div className="flex items-center space-x-1 bg-[#F7F9F7] p-1 rounded-xl border border-[#DCE4DF]">
                {(['Todas', 'Mendoza', 'Buenos Aires'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPlaza(p)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                      currentPlaza === p
                        ? 'bg-[#082028] text-white shadow-2xs'
                        : 'text-[#40515A] hover:text-[#082028]'
                    }`}
                  >
                    {p === 'Todas' ? 'Todas las Plazas' : p}
                  </button>
                ))}
              </div>

              {/* Type Filter */}
              <div className="flex flex-wrap items-center gap-1">
                {(['Todos', 'Soportes Tradicionales', 'Pantallas LED', 'LED Móvil'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setCurrentType(type)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-extrabold border transition-all ${
                      currentType === type
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                        : 'bg-white text-[#40515A] border-[#DCE4DF] hover:bg-[#F7F9F7]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1 bg-[#F7F9F7] p-1 rounded-xl border border-[#DCE4DF]">
                {(['Todos', 'available', 'reserved'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setCurrentStatus(st)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                      currentStatus === st
                        ? 'bg-[#082028] text-white shadow-2xs'
                        : 'text-[#40515A] hover:text-[#082028]'
                    }`}
                  >
                    {st === 'Todos' ? 'Todos Estados' : st === 'available' ? 'Disponible' : 'En reserva'}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetExplorerFilters}
                className="px-3 py-1.5 text-[11px] font-extrabold text-[#7C3AED] hover:text-[#6D28D9] bg-purple-50 hover:bg-purple-100 rounded-xl border border-[#7C3AED]/30 transition-all flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Más filtros / Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* View Content Display */}
        {filteredSupports.length === 0 ? (
          <div className="bg-white border border-[#DCE4DF] rounded-2xl p-12 text-center text-[#64748B] space-y-3">
            <AlertCircle className="w-12 h-12 text-[#DCE4DF] mx-auto" />
            <p className="text-sm font-extrabold text-[#082028]">No se encontraron soportes que coincidan con la búsqueda o los filtros aplicados.</p>
            <p className="text-xs text-[#40515A]">Pruebe cambiando las palabras clave o haciendo clic en "Limpiar filtros".</p>
            <button
              onClick={resetExplorerFilters}
              className="px-4 py-2 bg-[#7C3AED] text-white text-xs font-extrabold rounded-xl transition-all shadow-2xs"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : explorerViewMode === 'map' ? (
          /* COMBINED LISTA + MAPA LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Compact Visual List */}
            <div className="lg:col-span-5 bg-white border border-[#DCE4DF] rounded-2xl p-4 space-y-3 shadow-2xs">
              <div className="flex justify-between items-center px-1 pb-2 border-b border-[#DCE4DF]">
                <span className="text-xs font-extrabold text-[#082028]">
                  Lista Comercial ({filteredSupports.length})
                </span>
                <span className="text-[10px] font-extrabold text-[#7C3AED] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Lista Comercial
                </span>
              </div>

              <div className="max-h-[580px] overflow-y-auto space-y-2.5 pr-1">
                {filteredSupports.map(s => {
                  const isSelected = selectedSupports.some(sel => sel.id === s.id);
                  const isActive = activeSupportId === s.id;

                  return (
                    <div
                      key={s.id}
                      id={`support-card-${s.id}`}
                      onClick={() => {
                        setActiveSupportId(s.id);
                        setActiveSpecsSupport(s);
                      }}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isActive
                          ? 'bg-purple-50 border-[#7C3AED] shadow-xs'
                          : 'bg-white border-[#DCE4DF] hover:border-[#7C3AED]/50 hover:bg-[#F7F9F7]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <SupportImage
                          src={s.imageUrl}
                          alt={s.name}
                          supportName={s.name}
                          supportType={s.type}
                          className="w-14 h-14 object-cover rounded-xl border border-[#DCE4DF] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                            <span className="text-[9px] uppercase font-extrabold bg-[#082028] text-white px-1.5 py-0.5 rounded">
                              {s.plaza}
                            </span>
                            <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                              s.status === 'available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {s.status === 'available' ? 'Disponible' : 'En reserva'}
                            </span>
                            <span className="text-[9px] text-[#40515A] font-mono">{s.size}</span>
                          </div>

                          <h3 className="text-xs font-extrabold text-[#082028] truncate">{s.name}</h3>
                          <p className="text-[10px] text-[#40515A] truncate">{s.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSpecsSupport(s);
                          }}
                          className="p-1.5 bg-[#F7F9F7] hover:bg-purple-50 text-[#082028] border border-[#DCE4DF] rounded-lg transition-all"
                          title="Ver Ficha"
                          aria-label="Ver Ficha Técnica"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#7C3AED]" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSupportSelection(s);
                          }}
                          className={`px-2.5 py-1.5 text-[10px] font-extrabold rounded-lg transition-all flex items-center gap-1 ${
                            isSelected
                              ? 'bg-[#082028] text-white'
                              : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-2xs'
                          }`}
                        >
                          {isSelected ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Circle className="w-3 h-3" />}
                          <span>{isSelected ? 'Añadido' : 'Añadir'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Interactive Map */}
            <div className="lg:col-span-7">
              <InteractiveMap 
                filteredSupportsList={filteredSupports} 
                onOpenSpecs={(s) => setActiveSpecsSupport(s)} 
              />
            </div>
          </div>
        ) : (
          /* FULL LIST VIEW Mode */
          <div className="bg-white border border-[#DCE4DF] rounded-2xl p-4 space-y-3 shadow-2xs">
            <div className="flex justify-between items-center px-2 pb-2 border-b border-[#DCE4DF]">
              <span className="text-xs font-extrabold text-[#082028]">
                Catálogo de Ubicaciones ({filteredSupports.length})
              </span>
              <span className="text-[10px] font-extrabold text-[#7C3AED] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Lista Completa Comercial
              </span>
            </div>

            <div className="max-h-[650px] overflow-y-auto space-y-2.5 pr-1">
              {filteredSupports.map(s => {
                const isSelected = selectedSupports.some(sel => sel.id === s.id);
                const isActive = activeSupportId === s.id;

                return (
                  <div
                    key={s.id}
                    id={`support-card-${s.id}`}
                    onClick={() => {
                      setActiveSupportId(s.id);
                      setActiveSpecsSupport(s);
                    }}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer ${
                      isActive
                        ? 'bg-purple-50 border-[#7C3AED] shadow-xs'
                        : 'bg-white border-[#DCE4DF] hover:border-[#7C3AED]/50 hover:bg-[#F7F9F7]'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                      <SupportImage
                        src={s.imageUrl}
                        alt={s.name}
                        supportName={s.name}
                        supportType={s.type}
                        className="w-16 h-16 object-cover rounded-xl border border-[#DCE4DF] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-[9px] uppercase font-extrabold bg-[#082028] text-white px-2 py-0.5 rounded-md">
                            {s.plaza}
                          </span>
                          <span className="text-[9px] uppercase font-extrabold bg-purple-50 text-[#7C3AED] border border-purple-200 px-2 py-0.5 rounded-md">
                            {s.type}
                          </span>
                          <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
                            s.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {s.status === 'available' ? 'Disponible' : 'En reserva'}
                          </span>
                          <span className="text-[10px] text-[#40515A] font-mono">{s.size}</span>
                        </div>

                        <h3 className="text-xs font-extrabold text-[#082028] truncate">{s.name}</h3>
                        <p className="text-[11px] text-[#40515A] truncate mt-0.5">{s.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSpecsSupport(s);
                        }}
                        className="px-3 py-1.5 bg-[#F7F9F7] hover:bg-purple-50 text-[#082028] border border-[#DCE4DF] text-xs font-extrabold rounded-xl transition-all flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span>Ficha</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSupportSelection(s);
                        }}
                        className={`px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#082028] text-white'
                            : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-2xs'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Seleccionado</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5" />
                            <span>Seleccionar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Split Interactive Checkout / Contact section */}
      <section className="px-4 sm:px-6 py-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-[#DCE4DF] mt-8">
        <div className="lg:col-span-5 space-y-5">
          <span className="text-[10px] uppercase font-extrabold text-[#049A41] tracking-wider block bg-[#E8F0E4] px-3 py-1 rounded-full w-fit border border-[#049A41]/30">
            Campañas Estratégicas 2026
          </span>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#082028] leading-tight">
            ¿Por qué elegir los circuitos de Grupo Comunicarte?
          </h2>
          
          <p className="text-[#40515A] text-xs sm:text-sm leading-relaxed">
            Nuestra cobertura ofrece un mix estratégico de alto impacto visual. Combinamos el anclaje físico de vallas tradicionales monumentales con el dinamismo de pantallas LED inteligentes de alto brillo, y el ruteo móvil localizado (LED Móvil) que traslada su mensaje directamente al corazón de los centros comerciales de mayor densidad.
          </p>

          <div className="bg-white border border-[#DCE4DF] p-4 rounded-2xl space-y-3">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#049A41] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-extrabold text-[#082028]">Certificación y Transparencia</p>
                <p className="text-[11px] text-[#40515A] mt-0.5">Reportes de emisión fotográficos y métricas de alcance auditadas por plaza.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 pt-2 border-t border-[#DCE4DF]">
              <Activity className="w-5 h-5 text-[#049A41] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-extrabold text-[#082028]">Media Kits Instantáneos</p>
                <p className="text-[11px] text-[#40515A] mt-0.5">Generación automática de propuesta en PDF o Google Slides para agencias y anunciantes.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7" id="checkout-form-anchor">
          <ContactForm />
        </div>
      </section>

      {/* Floating Selection Bar */}
      <SelectionBar
        onOpenReview={() => setIsReviewOpen(true)}
        onOpenMediaKit={() => setView('mediakit')}
      />

      {/* Selection Detailed Review Drawer / Panel */}
      <AnimatePresence>
        {isReviewOpen && (
          <SelectionReviewPanel
            onClose={() => setIsReviewOpen(false)}
            onProceedToMediaKit={() => setView('mediakit')}
          />
        )}
      </AnimatePresence>

      {/* Technical Specifications Overlay Dialog */}
      <AnimatePresence>
        {activeSpecsSupport && (
          <SpecsOverlay 
            support={activeSpecsSupport} 
            onClose={() => setActiveSpecsSupport(null)} 
          />
        )}
      </AnimatePresence>

      {/* Media Kit Interactive Presentation Overlay */}
      <AnimatePresence>
        {currentView === 'mediakit' && (
          <MediaKitView 
            onClose={() => setView('landing')} 
            onNavigateToQuote={() => {
              setView('landing');
              setTimeout(() => {
                const el = document.getElementById('checkout-form-anchor');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }, 120);
            }} 
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#082028] text-slate-300 text-xs py-8 px-6 border-t border-[#049A41]/20 mt-12 w-full rounded-t-2xl max-w-7xl mx-auto shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <BrandLogo size="sm" variant="full" />
          </div>
          <div className="text-center md:text-right text-[11px] text-slate-400 space-y-1">
            <p className="font-extrabold text-white">Grupo Comunicarte S.A. © 2026</p>
            <p>Mendoza - Buenos Aires, República Argentina • Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
