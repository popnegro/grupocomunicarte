import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Support, SupportPlaza } from '../types';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from './InteractiveMap';
import { SpecsOverlay } from './SpecsOverlay';
import { SupportImage } from './SupportImage';
import { Search, X, Map as MapIcon, List as ListIcon, RotateCcw, AlertCircle, Eye, Circle, CheckCircle2, ArrowLeft, LoaderCircle } from 'lucide-react';
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
    if (initialFilters.type) {
      setCurrentType(initialFilters.type);
    }
  }, [initialFilters]);

  useEffect(() => {
    let isCancelled = false;

    const fetchSupports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/inventory');
        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}: No se pudo obtener el inventario.`);
        }
        const data: Support[] = await response.json();
        if (!isCancelled) {
          setSupports(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchSupports();

    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredSupports = useMemo(() => {
    return supports.filter((s) => {
      const matchesPlaza = currentPlaza === 'Todas' || s.plaza === currentPlaza;
      const matchesType = currentType === 'Todos' || s.type === currentType;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query ||
        s.name.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query);
      return matchesPlaza && matchesType && matchesSearch;
    });
  }, [searchQuery, currentPlaza, currentType, supports]);

  const resetFilters = () => {
    setSearchQuery('');
    setCurrentPlaza('Todas');
    setCurrentType('Todos');
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-[#DCE4DF] p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </header>

      <main className="px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full space-y-5" id="inventory-grid">
        <div className="bg-white border border-[#DCE4DF] p-5 rounded-2xl space-y-4 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE4DF] pb-4">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-[#7C3AED] tracking-wider block">
                Cobertura territorial
              </span>
              <h1 className="text-xl font-extrabold text-[#082028]">Explorador de soportes</h1>
            </div>
            <div className="flex items-center space-x-1 p-1 bg-[#F7F9F7] rounded-xl border border-[#DCE4DF] self-start md:self-auto">
              <button onClick={() => setViewMode('map')} className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${viewMode === 'map' ? 'bg-[#049A41] text-white' : 'text-[#40515A]'}`}>
                <MapIcon className="w-3.5 h-3.5" /> Mapa
              </button>
              <button onClick={() => setViewMode('list')} className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${viewMode === 'list' ? 'bg-[#049A41] text-white' : 'text-[#40515A]'}`}>
                <ListIcon className="w-3.5 h-3.5" /> Listado
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#40515A]" />
            <input
              type="text"
              placeholder="Buscar por nombre o dirección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-[#F7F9F7] border border-[#DCE4DF] rounded-xl text-xs"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Limpiar búsqueda">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1 bg-[#F7F9F7] p-1 rounded-xl border border-[#DCE4DF]">
                {(['Todas', 'Mendoza', 'Buenos Aires'] as const).map((p) => (
                  <button key={p} onClick={() => setCurrentPlaza(p)} className={`px-3 py-1 rounded-lg text-[11px] font-extrabold ${currentPlaza === p ? 'bg-[#082028] text-white' : 'text-[#40515A]'}`}>
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {(['Todos', 'Soportes Tradicionales', 'Pantallas LED', 'LED Móvil'] as const).map((type) => (
                  <button key={type} onClick={() => setCurrentType(type)} className={`px-3 py-1 rounded-xl text-[10px] font-extrabold border ${currentType === type ? 'bg-[#7C3AED] text-white' : 'bg-white text-[#40515A]'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={resetFilters} className="text-xs font-bold text-purple-600 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Limpiar filtros
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <LoaderCircle className="mx-auto w-12 h-12 text-gray-300 animate-spin" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Cargando inventario...</h3>
            <p className="mt-1 text-sm text-gray-500">Por favor, espera un momento.</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="mx-auto w-12 h-12 text-red-400" />
            <h3 className="mt-2 text-sm font-medium text-red-900">Error al cargar los datos</h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        ) : filteredSupports.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto w-12 h-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Sin resultados</h3>
            <p className="mt-1 text-sm text-gray-500">Intenta ajustar tu búsqueda o filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className={`lg:col-span-5 ${viewMode === 'list' ? 'lg:col-span-12' : ''}`}>
              <div className="max-h-150 overflow-y-auto space-y-2 pr-1">
                {filteredSupports.map((s) => {
                  const isSelected = selectedSupports.some((sel) => sel.id === s.id);
                  return (
                    <div key={s.id} onClick={() => setActiveSupport(s)} className={`p-3 rounded-xl border bg-white hover:border-purple-400 cursor-pointer ${isSelected ? 'border-[#049A41] ring-1 ring-[#049A41]/20' : 'border-[#DCE4DF]'}`}>
                      <div className="flex items-center space-x-3">
                        <SupportImage src={s.imageUrl} alt={s.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold truncate">{s.name}</h4>
                          <p className="text-xs text-gray-500 truncate">{s.address}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded">{s.plaza}</span>
                            <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">{s.type}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setActiveSupport(s); }} className="p-2 bg-gray-100 rounded-full hover:bg-purple-100" aria-label={`Ver detalle de ${s.name}`}>
                            <Eye className="w-4 h-4 text-purple-600" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); toggleSupportSelection(s); }} className={`p-2 rounded-full ${isSelected ? 'bg-[#049A41] text-white' : 'bg-gray-100'}`} aria-label={isSelected ? `Quitar ${s.name} de la selección` : `Seleccionar ${s.name}`}>
                            {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {viewMode === 'map' && (
              <div className="lg:col-span-7 h-[600px] sticky top-24">
                <InteractiveMap
                  filteredSupportsList={filteredSupports}
                  onOpenSpecs={setActiveSupport}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {activeSupport && (
          <SpecsOverlay
            support={activeSupport}
            onClose={() => setActiveSupport(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
