import { useEffect, useMemo, useState } from 'react';
import InventoryMap from '../components/map/InventoryMap';
import StickySelectionBar from '../components/map/StickySelectionBar';
import MediakitPanel from '../components/map/MediakitPanel';
import { useSelection, type InventoryItem } from '../context/SelectionContext';

const FALLBACK_INVENTORY: InventoryItem[] = [
  { canonical_id: 'mza-trad-01', name: 'Cartel Nudo Vial', ciudad: 'mendoza', tipo_soporte: 'tradicional', lat: -32.895, lng: -68.825, address: 'Acceso Este y Costanera', description: 'Cartel espectacular sobre principal acceso a la Ciudad.', disponibilidad: 'disponible' },
  { canonical_id: 'mza-trad-02', name: 'Soporte Arístides', ciudad: 'mendoza', tipo_soporte: 'tradicional', lat: -32.892, lng: -68.855, address: 'Av. Arístides Villanueva 200', description: 'Zona gastronómica y comercial de alta concurrencia.', disponibilidad: 'disponible' },
  { canonical_id: 'mza-led-01', name: 'Pantalla Centro', ciudad: 'mendoza', tipo_soporte: 'led', lat: -32.889, lng: -68.84, address: 'Av. San Martín y Garibaldi', description: 'Ubicación premium en intersección céntrica.', disponibilidad: 'disponible' },
  { canonical_id: 'mza-trad-16', name: 'Las Heras Centro', ciudad: 'mendoza', tipo_soporte: 'tradicional', lat: -32.85, lng: -68.835, address: 'Plaza Marcos Burgos', description: 'Principal plaza de Las Heras.', disponibilidad: 'reservado' },
  { canonical_id: 'bue-trad-01', name: 'Av. San Juan 1981', ciudad: 'buenos-aires', tipo_soporte: 'tradicional', lat: -34.6247, lng: -58.3966, address: 'Av. San Juan 1981 - San Cristóbal', description: 'A 8 cuadras de Av. 9 de Julio.', disponibilidad: 'disponible' },
];

type PublicScreen = {
  id: string;
  nombre?: string;
  ciudad?: string;
  tipo?: string;
  categoria?: string;
  lat?: number;
  lng?: number;
  zona?: string;
  nota?: string;
  status?: string;
};

function normalizeScreen(screen: PublicScreen): InventoryItem | null {
  const ciudad = String(screen.ciudad || '').toLowerCase().includes('buenos') ? 'buenos-aires' : 'mendoza';
  const rawType = String(screen.categoria || screen.tipo || '').toLowerCase();
  const tipo_soporte: InventoryItem['tipo_soporte'] = rawType.includes('móvil') || rawType.includes('movil')
    ? 'led_movil'
    : rawType.includes('led') || rawType.includes('pantalla')
      ? 'led'
      : 'tradicional';
  if (!screen.id || typeof screen.lat !== 'number' || typeof screen.lng !== 'number') return null;

  return {
    canonical_id: screen.id,
    name: screen.nombre || 'Soporte publicitario',
    ciudad,
    tipo_soporte,
    lat: screen.lat,
    lng: screen.lng,
    address: screen.zona || 'Ubicación disponible a confirmar',
    description: screen.nota || 'Soporte disponible para consulta comercial.',
    disponibilidad: String(screen.status || '').toLowerCase() === 'reservado' ? 'reservado' : 'disponible',
  };
}

export default function Inventario() {
  const [inventory, setInventory] = useState<InventoryItem[]>(FALLBACK_INVENTORY);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<'todos' | InventoryItem['ciudad']>('todos');
  const [type, setType] = useState<'todos' | InventoryItem['tipo_soporte']>('todos');
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [isMediaKitOpen, setIsMediaKitOpen] = useState(false);
  const { selectedCount, isSelected, toggleSelect, clearSelection, selectedIds, reconcileSelection } = useSelection();

  useEffect(() => {
    let cancelled = false;

    fetch('/api/public/screens')
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const normalized = Array.isArray(payload?.data)
          ? payload.data.map(normalizeScreen).filter(Boolean) as InventoryItem[]
          : [];
        if (!cancelled) {
          if (normalized.length > 0) {
            setInventory(normalized);
            reconcileSelection(normalized);
          } else {
            reconcileSelection(FALLBACK_INVENTORY);
          }
        }
      })
      .catch(() => {
        // Keep the PMV fallback inventory available when the public database is unavailable.
        reconcileSelection(FALLBACK_INVENTORY);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [reconcileSelection]);

  const items = useMemo(
    () => inventory.filter((item) => (city === 'todos' || item.ciudad === city) && (type === 'todos' || item.tipo_soporte === type)),
    [inventory, city, type]
  );

  const selectedItems = useMemo(
    () => inventory.filter((item) => selectedIds.has(item.canonical_id) && item.disponibilidad === 'disponible'),
    [inventory, selectedIds]
  );

  const openMediaKit = () => {
    if (selectedItems.length > 0) setIsMediaKitOpen(true);
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8 pb-28 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-600">Inventario</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Explorá nuestros soportes</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">Filtrá plazas y soportes, consultá disponibilidad y armá tu selección para solicitar el Media Kit.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select aria-label="Filtrar por plaza" value={city} onChange={(e) => setCity(e.target.value as typeof city)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <option value="todos">Todas las plazas</option><option value="mendoza">Mendoza</option><option value="buenos-aires">Buenos Aires</option>
            </select>
            <select aria-label="Filtrar por tipo de soporte" value={type} onChange={(e) => setType(e.target.value as typeof type)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <option value="todos">Todos los soportes</option><option value="tradicional">Tradicional</option><option value="led">LED</option><option value="led_movil">LED móvil</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs">
          <span>{loading ? 'Actualizando inventario…' : `${items.length} soporte(s) en esta vista`}</span>
          {selectedCount > 0 && <button type="button" onClick={clearSelection} className="font-bold underline">{selectedCount} seleccionado(s) · Limpiar</button>}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <InventoryMap items={items} onSelect={setSelected} />
          <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">Soportes ({items.length})</h2>
              {selectedCount > 0 && <button type="button" onClick={clearSelection} className="text-xs text-gray-500 underline">Limpiar ({selectedCount})</button>}
            </div>
            <div className="space-y-3">
              {items.map((item) => {
                const reserved = item.disponibilidad !== 'disponible';
                return <div key={item.canonical_id} className={`rounded-xl border p-4 transition ${selected?.canonical_id === item.canonical_id ? 'border-black' : 'border-gray-100'}`}>
                  <button type="button" onClick={() => setSelected(item)} className="w-full text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="font-semibold">{item.name}</p><p className="mt-1 text-xs text-gray-500">{item.address}</p></div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${reserved ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700'}`}>{reserved ? 'reservado' : 'disponible'}</span>
                    </div>
                  </button>
                  <button type="button" disabled={reserved} onClick={() => toggleSelect(item)} className="mt-3 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-200">
                    {isSelected(item.canonical_id) ? 'Soporte seleccionado' : reserved ? 'Consultar disponibilidad' : 'Agregar a mi selección'}
                  </button>
                </div>;
              })}
            </div>
            {selected && <div className="mt-5 rounded-xl bg-gray-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-gray-400">Detalle</p><h3 className="mt-1 font-bold">{selected.name}</h3><p className="mt-2 text-sm text-gray-600">{selected.description}</p></div>}
          </aside>
        </div>
      </div>

      <StickySelectionBar onRequestMediaKit={openMediaKit} />
      {isMediaKitOpen && <MediakitPanel selectedItems={selectedItems} onClose={() => setIsMediaKitOpen(false)} />}
    </main>
  );
}
