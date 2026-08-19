import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { Badge } from '../../components/ui/Badge';
import { listInventory } from '../../lib/dashboard-utils';
import { getDisponibilidad, type Disponibilidad, type InventoryItem } from '../../types';

function getAddress(item: InventoryItem) {
  return 'address' in item ? item.address : item.waypoints?.map((point) => point.name).join(' · ');
}

export default function DashboardSoportes() {
  const [query, setQuery] = useState('');
  const [availability, setAvailability] = useState<'todos' | Disponibilidad>('todos');
  const [plaza, setPlaza] = useState<'todas' | InventoryItem['ciudad']>('todas');
  
  const items = useMemo(() => {
    return listInventory({ query, availability, plaza });
  }, [query, availability, plaza]);

  const countLabel = useMemo(() => `${items.length} soporte${items.length === 1 ? '' : 's'}`, [items.length]);

  return (
    <DashboardShell>
      <section className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-600">Inventario</p>
            <h1 className="mt-1 text-2xl font-extrabold">Soportes</h1>
            <p className="mt-1 text-sm text-muted-foreground">Consulta y supervisión del inventario publicable.</p>
          </div>
          <Link to="/inventario" className="inline-flex w-fit items-center rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-primary-foreground transition hover:bg-gray-800">
            Abrir inventario público
          </Link>
        </header>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <label className="relative block">
              <span className="sr-only">Buscar soporte</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar soporte, dirección o plaza"
                className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
              />
            </label>
            <label className="flex h-11 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Disponibilidad</span>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as typeof availability)}
                className="bg-transparent outline-none"
              >
                <option value="todos">Todas</option>
                <option value="disponible">Disponibles</option>
                <option value="reservado">Reservados</option>
              </select>
            </label>
            <select
              value={plaza}
              onChange={(e) => setPlaza(e.target.value as typeof plaza)}
              className="h-11 rounded-xl border border-border bg-surface px-3 text-xs font-bold text-muted-foreground outline-none focus:border-emerald-600"
            >
              <option value="todas">Todas las plazas</option>
              <option value="mendoza">Mendoza</option>
              <option value="buenos-aires">Buenos Aires</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-xs font-extrabold text-muted-foreground">{countLabel}</p>
            <p className="text-[10px] font-semibold text-muted-foreground">Vista administrativa</p>
          </div>
          
          <div className="divide-y divide-border">
            {items.map((item) => {
              const state = getDisponibilidad(item);
              return (
                <article key={item.canonical_id} className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-sm font-extrabold text-foreground">{item.name}</h2>
                      <Badge variant={state === 'disponible' ? 'green' : 'outline'}>
                        {state === 'disponible' ? 'Disponible' : 'Reservado'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      {item.ciudad === 'mendoza' ? 'Mendoza' : 'Buenos Aires'} · {item.tipo_soporte}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">{getAddress(item) || 'Sin dirección'}</p>
                  <Link to={`/inventario?location=${encodeURIComponent(item.canonical_id)}`} className="text-xs font-extrabold text-emerald-600 hover:underline">
                    Ver soporte
                  </Link>
                </article>
              );
            })}
            
            {!items.length && (
              <div className="px-4 py-12 text-center text-sm font-semibold text-muted-foreground">
                No hay soportes que coincidan con los filtros.
              </div>
            )}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
