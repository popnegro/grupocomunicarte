import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Support, SupportPlaza } from '../types';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from './InteractiveMap';
import { SpecsOverlay } from './SpecsOverlay';
import { SupportImage } from './SupportImage';
import { ExplorerInventorySkeleton } from './ExplorerSkeleton';
import { SelectionBar } from './SelectionBar';
import { Search, X, Map as MapIcon, List as ListIcon, RotateCcw, AlertCircle, Eye, Circle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

export function ExplorerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialFilters = useMemo(() => location.state?.filters || {}, [location.state]);
  const { selectedSupports, toggleSupportSelection } = useApp();

  const [supports, setSupports] = useState<Support[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSupport, setActiveSupport] = useState<Support | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPlaza, setCurrentPlaza] = useState<'Todas' | SupportPlaza>('Todas');
  const [currentType, setCurrentType] = useState<'Todos' | 'Soportes Tradicionales' | 'Pantallas LED' | 'LED Móvil'>('Todos');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  useEffect(() => {
    if (initialFilters.type) setCurrentType(initialFilters.type);
  }, [initialFilters]);

  useEffect(() => {
    let isCancelled = false;
    const fetchSupports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/inventory');
        if (!response.ok) throw new Error(`Error HTTP ${response.status}: No se pudo obtener el inventario.`);
        const data: Support[] = await response.json();
        if (!isCancelled) setSupports(data);
      } catch (err) {
        if (!isCancelled) setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
    void fetchSupports();
    return () => { isCancelled = true; };
  }, []);

  const filteredSupports = useMemo(() => supports.filter((s) => {
    const matchesPlaza = currentPlaza === 'Todas' || s.plaza === currentPlaza;
    const matchesType = currentType === 'Todos' || s.type === currentType;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || s.name.toLowerCase().includes(query) || s.address.toLowerCase().includes(query);
    return matchesPlaza && matchesType && matchesSearch;
  }), [searchQuery, currentPlaza, currentType, supports]);

  const resetFilters = () => {
    setSearchQuery('');
    setCurrentPlaza('Todas');
    setCurrentType('Todos');
  };

  const openQuote = () => navigate('/mediakit');

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[#DCE4DF] bg-white/95 p-4 backdrop-blur-md">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 pb-28 sm:px-6" id="inventory-grid">
        <div className="space-y-4 rounded-2xl border border-[#DCE4DF] bg-white p-5 shadow-2xs">
          <div className="flex flex-col justify-between gap-4 border-b border-[#DCE4DF] pb-4 md:flex-row md:items-center">
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#049A41]">Cobertura territorial</span>
              <h1 className="text-xl font-extrabold text-[#082028]">Explorador de soportes</h1>
              <p className="mt-1 text-xs text-slate-500">Encontrá ubicaciones, revisá sus características y armá tu selección.</p>
            </div>
            <div className="flex items-center self-start space-x-1 rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] p-1 md:self-auto">
              <button type="button" onClick={() => setViewMode('map')} className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-extrabold transition-all ${viewMode === 'map' ? 'bg-[#049A41] text-white' : 'text-[#40515A]'}`}><MapIcon className="h-3.5 w-3.5" /> Mapa</button>
              <button type="button" onClick={() => setViewMode('list')} className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-extrabold transition-all ${viewMode === 'list' ? 'bg-[#049A41] text-white' : 'text-[#40515A]'}`}><ListIcon className="h-3.5 w-3.5" /> Listado</button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#40515A]" />
            <input type="text" placeholder="Buscar por nombre o dirección..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] py-2.5 pl-10 pr-8 text-xs text-[#082028] outline-none transition-colors focus:border-[#049A41] focus:bg-white focus:ring-2 focus:ring-[#049A41]/10" aria-label="Buscar soportes por nombre o dirección" />
            {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-slate-100" aria-label="Limpiar búsqueda"><X className="h-4 w-4" /></button>}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1 rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] p-1">
                {(['Todas', 'Mendoza', 'Buenos Aires'] as const).map((p) => <button type="button" key={p} onClick={() => setCurrentPlaza(p)} className={`rounded-lg px-3 py-1 text-[11px] font-extrabold transition-colors ${currentPlaza === p ? 'bg-[#082028] text-white' : 'text-[#40515A] hover:bg-white'}`}>{p}</button>)}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {(['Todos', 'Soportes Tradicionales', 'Pantallas LED', 'LED Móvil'] as const).map((type) => <button type="button" key={type} onClick={() => setCurrentType(type)} className={`rounded-xl border px-3 py-1 text-[10px] font-extrabold transition-colors ${currentType === type ? 'border-[#049A41] bg-[#E8F0E4] text-[#082028]' : 'border-[#DCE4DF] bg-white text-[#40515A] hover:border-[#049A41]/40'}`}>{type}</button>)}
              </div>
            </div>
            <button type="button" onClick={resetFilters} className="flex items-center gap-1 text-xs font-bold text-[#049A41] hover:underline"><RotateCcw className="h-3 w-3" /> Limpiar filtros</button>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-[#DCE4DF] pt-3 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="text-[#64748B]">Disponibilidad</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Disponible</span>
            <span className="inline-flex items-center gap-1.5 text-amber-700"><span className="h-2 w-2 rounded-full bg-amber-500" /> Reservado</span>
          </div>
        </div>

        {isLoading ? (
          <ExplorerInventorySkeleton />
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 py-12 text-center"><AlertCircle className="mx-auto h-12 w-12 text-red-400" /><h3 className="mt-2 text-sm font-medium text-red-900">Error al cargar los datos</h3><p className="mt-1 text-sm text-red-600">{error}</p></div>
        ) : filteredSupports.length === 0 ? (
          <div className="py-12 text-center"><AlertCircle className="mx-auto h-12 w-12 text-gray-300" /><h3 className="mt-2 text-sm font-medium text-gray-900">Sin resultados</h3><p className="mt-1 text-sm text-gray-500">Intentá ajustar tu búsqueda o filtros.</p><button type="button" onClick={resetFilters} className="mt-4 rounded-xl bg-[#049A41] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#038537]">Restablecer filtros</button></div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
            <div className={`lg:col-span-5 ${viewMode === 'list' ? 'lg:col-span-12' : ''}`}>
              <div className="max-h-150 space-y-2 overflow-y-auto pr-1">
                {filteredSupports.map((s) => {
                  const isSelected = selectedSupports.some((sel) => sel.id === s.id);
                  const isReserved = s.status === 'reserved';
                  return (
                    <div key={s.id} onClick={() => setActiveSupport(s)} className={`cursor-pointer rounded-xl border bg-white p-3 transition-colors hover:border-[#049A41]/60 ${isSelected ? 'border-[#049A41] ring-1 ring-[#049A41]/20' : 'border-[#DCE4DF]'}`}>
                      <div className="flex items-center space-x-3">
                        <SupportImage src={s.imageUrl} alt={s.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="truncate text-sm font-bold text-[#082028]">{s.name}</h4>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${isReserved ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{isReserved ? 'Reservado' : 'Disponible'}</span>
                          </div>
                          <p className="truncate text-xs text-gray-500">{s.address}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold">{s.plaza}</span>
                            <span className="rounded bg-[#E8F0E4] px-2 py-0.5 text-[10px] font-bold text-[#082028]">{s.type}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <button type="button" onClick={(e) => { e.stopPropagation(); setActiveSupport(s); }} className="rounded-full bg-gray-100 p-2 hover:bg-[#E8F0E4]" aria-label={`Ver detalle de ${s.name}`}><Eye className="h-4 w-4 text-[#049A41]" /></button>
                          <button type="button" disabled={isReserved} onClick={(e) => { e.stopPropagation(); toggleSupportSelection(s); }} className={`rounded-full p-2 ${isReserved ? 'cursor-not-allowed bg-amber-50 text-amber-500' : isSelected ? 'bg-[#049A41] text-white' : 'bg-gray-100'}`} aria-label={isReserved ? `${s.name} está reservado` : isSelected ? `Quitar ${s.name} de la selección` : `Seleccionar ${s.name}`} title={isReserved ? 'Este soporte está reservado' : undefined}>{isReserved ? <span className="block h-4 w-4 text-[9px] leading-4">R</span> : isSelected ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {viewMode === 'map' && <div className="sticky top-24 h-150 lg:col-span-7"><InteractiveMap filteredSupportsList={filteredSupports} onOpenSpecs={setActiveSupport} /></div>}
          </div>
        )}
      </main>

      <SelectionBar onOpenReview={openQuote} onOpenMediaKit={openQuote} />
      <AnimatePresence>{activeSupport && <SpecsOverlay support={activeSupport} onClose={() => setActiveSupport(null)} />}</AnimatePresence>
    </>
  );
}
