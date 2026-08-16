import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import InventoryMap from '../components/map/InventoryMap';
import { MediakitPanel } from '../components/map/MediakitPanel';
import { fixedLocations, mobileRoutes } from '../data/inventory';
import { Plaza, TipoSoporte, Disponibilidad, InventoryItem } from '../types';
import { MapFilterPanel } from '../components/map/MapFilterPanel';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSelection } from '../context/SelectionContext';

type DisponibilidadFilter = Disponibilidad | 'todos';

const allItems: InventoryItem[] = [...fixedLocations, ...mobileRoutes];

function InventarioContent() {
  const [searchParams, setSearchParams] = useSearchParams();

  const plazaParam = searchParams.get('plaza') as Plaza | 'todos' | null;
  const tipoParam = searchParams.get('tipo') as TipoSoporte | 'todos' | null;

  const [selectedPlaza, setSelectedPlaza] = useState<Plaza | 'todos'>(plazaParam || 'todos');
  const [selectedTipo, setSelectedTipo] = useState<TipoSoporte | 'todos'>(tipoParam || 'todos');
  const [selectedDisponibilidad, setSelectedDisponibilidad] = useState<DisponibilidadFilter>('todos');
  const [searchText, setSearchText] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMediakitOpen, setIsMediakitOpen] = useState(searchParams.get('mediakit') === '1');

  const { getSelectedItems } = useSelection();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedPlaza !== 'todos') params.set('plaza', selectedPlaza);
    else params.delete('plaza');
    if (selectedTipo !== 'todos') params.set('tipo', selectedTipo);
    else params.delete('tipo');
    setSearchParams(params, { replace: true });
  }, [selectedPlaza, selectedTipo]);

  useEffect(() => {
    setIsMediakitOpen(searchParams.get('mediakit') === '1');
  }, [searchParams]);

  useEffect(() => {
    if (plazaParam && plazaParam !== selectedPlaza) setSelectedPlaza(plazaParam);
    if (tipoParam && tipoParam !== selectedTipo) setSelectedTipo(tipoParam);
  }, [plazaParam, tipoParam]);

  const query = searchText.trim().toLowerCase();

  const matchesSearch = (item: InventoryItem) => {
    if (!query) return true;
    const haystack = [item.name, item.canonical_id, item.tipo_soporte, item.ciudad, 'address' in item ? item.address : ''].join(' ').toLowerCase();
    return haystack.includes(query);
  };

  const matchesDisponibilidad = (item: InventoryItem) => {
    if (selectedDisponibilidad === 'todos') return true;
    return (item.disponibilidad ?? 'disponible') === selectedDisponibilidad;
  };

  const filteredLocations = fixedLocations.filter(loc =>
    (selectedPlaza === 'todos' || loc.ciudad === selectedPlaza) &&
    (selectedTipo === 'todos' || loc.tipo_soporte === selectedTipo) &&
    matchesDisponibilidad(loc) && matchesSearch(loc)
  );

  const filteredRoutes = mobileRoutes.filter(route =>
    (selectedPlaza === 'todos' || route.ciudad === selectedPlaza) &&
    (selectedTipo === 'todos' || route.tipo_soporte === selectedTipo) &&
    matchesDisponibilidad(route) && matchesSearch(route)
  );

  const selectedItems = getSelectedItems(allItems);

  const openMediakit = () => {
    const params = new URLSearchParams(searchParams);
    params.set('mediakit', '1');
    setSearchParams(params, { replace: true });
    setIsMediakitOpen(true);
    setIsMobileFiltersOpen(false);
  };

  const closeMediakit = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('mediakit');
    setSearchParams(params, { replace: true });
    setIsMediakitOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] relative overflow-hidden">
      <div className="md:hidden absolute top-4 left-4 z-[500]">
        <button onClick={() => setIsMobileFiltersOpen(true)} className="bg-white text-black px-4 py-2.5 rounded-full font-bold shadow-lg border border-gray-100 flex items-center gap-2 text-sm">
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {(selectedPlaza !== 'todos' || selectedTipo !== 'todos' || selectedDisponibilidad !== 'todos' || searchText) && <span className="w-2 h-2 rounded-full bg-red-500 absolute top-0 right-0 m-2" />}
        </button>
      </div>

      <div className={cn('absolute md:relative inset-0 md:inset-auto z-[2000] md:z-10 bg-black/40 md:bg-transparent transition-opacity duration-300 md:opacity-100 md:block', isMobileFiltersOpen ? 'opacity-100 block' : 'opacity-0 hidden')}>
        <div className="absolute md:relative inset-y-0 left-0 w-[85%] max-w-sm md:w-80 h-full bg-white flex flex-col shadow-2xl md:shadow-none border-r border-gray-200">
          <div className="md:hidden p-4 flex justify-between items-center border-b border-gray-100">
            <span className="font-bold text-lg">Filtros</span>
            <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-grow overflow-y-auto">
            <MapFilterPanel
              selectedPlaza={selectedPlaza}
              setSelectedPlaza={setSelectedPlaza}
              selectedTipo={selectedTipo}
              setSelectedTipo={setSelectedTipo}
              selectedDisponibilidad={selectedDisponibilidad}
              setSelectedDisponibilidad={setSelectedDisponibilidad}
              searchText={searchText}
              setSearchText={setSearchText}
              resultsCount={filteredLocations.length + filteredRoutes.length}
              onOpenMediakit={openMediakit}
            />
          </div>
        </div>
      </div>

      <div className="flex-grow h-full relative z-0">
        <InventoryMap locations={filteredLocations} routes={filteredRoutes} onOpenMediakit={openMediakit} />
        {isMediakitOpen && (
          <MediakitPanel selectedItems={selectedItems} onClose={closeMediakit} onGoToInventory={closeMediakit} />
        )}
      </div>
    </div>
  );
}

export default function Inventario() {
  return <InventarioContent />;
}
