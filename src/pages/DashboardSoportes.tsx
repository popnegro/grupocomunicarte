import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { Badge } from '../components/ui/Badge';
import { inventory } from '../data/inventory';
import { getDisponibilidad, type Disponibilidad, type InventoryItem } from '../types';

export default function DashboardSoportes() {
  const [query, setQuery] = useState('');
  const [availability, setAvailability] = useState<'todos' | Disponibilidad>('todos');
  const [plaza, setPlaza] = useState<'todas' | InventoryItem['ciudad']>('todas');

  const items = useMemo(() => inventory.filter((item) => {
    const haystack = `${item.name} ${item.address ?? ''} ${item.ciudad} ${item.tipo_soporte}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase().trim());
    const matchesAvailability = availability === 'todos' || getDisponibilidad(item) === availability;
    const matchesPlaza = plaza === 'todas' || item.ciudad === plaza;
    return matchesQuery && matchesAvailability && matchesPlaza;
  }), [query, availability, plaza]);

  return (
    <DashboardShell>
      <section className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#049A41]">Inventario</p>
            <h1 className="mt-1 text-2xl font-extrabold">Soportes</h1>
            <p className="mt-1 text-sm text-[#64748B]">Consulta y supervisión del inventario publicable.</p>
          </div>
          <Link to="/inventario" className="inline-flex w-fit items-center rounded-xl bg-[#082028] px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#16333C]">Abrir inventario público</Link>
        </header>

        <div className="rounded-2xl border border-[#DCE4DF] bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <label className="relative block">
              <span className="sr-only">Buscar soporte</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar soporte, dirección o plaza" className="h-11 w-full rounded-xl border border-[#DCE4DF] bg-white pl-10 pr-3 text-sm font-medium outline-none transition focus:border-[#049A41] focus:ring-2 focus:ring-[#049A41]/10" />
            </label>
            <label className="flex h-11 items-center gap-2 rounded-xl border border-[#DCE4DF] px-3 text-xs font-bold text-[#40515A]">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Disponibilidad</span>
              <select value={availability} onChange={(e) => setAvailability(e.target.value as typeof availability)} className="bg-transparent outline-none">
                <option value="todos">Todas</option>
                <option value="disponible">Disponibles</option>
                <option value="reservado">Reservados</option>
              </select>
            </label>
            <select value={plaza} onChange={(e) => setPlaza(e.target.value as typeof plaza)} className="h-11 rounded-xl border border-[#DCE4DF] bg-white px-3 text-xs font-bold text-[#40515A] outline-none focus:border-[#049A41]">
              <option value="todas">Todas las plazas</option>
              <option value="mendoza">Mendoza</option>
              <option value="buenos-aires">Buenos Aires</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#DCE4DF] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DCE4DF] px-4 py-3">
            <p className="text-xs font-extrabold text-[#40515A]">{items.length} soportes</p>
            <p className="text-[10px] font-semibold text-[#64748B]">Vista administrativa</p>
          </div>
          <div className="divide-y divide-[#DCE4DF]">
            {items.map((item) => {
              const state = getDisponibilidad(item);
              return (
                <article key={item.canonical_id} className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-sm font-extrabold text-[#082028]">{item.name}</h2>
                      <Badge variant={state === 'disponible' ? 'green' : 'outline'}>{state === 'disponible' ? 'Disponible' : 'Reservado'}</Badge>
                    </div>
                    <p className="mt-1 text-xs font-medium text-[#64748B]">{item.ciudad === 'mendoza' ? 'Mendoza' : 'Buenos Aires'} · {item.tipo_soporte}</p>
                  </div>
                  <p className="text-xs font-semibold text-[#64748B]">{item.address || 'Sin dirección'}</p>
                  <Link to={`/inventario?location=${encodeURIComponent(item.canonical_id)}`} className="text-xs font-extrabold text-[#049A41] hover:underline">Ver soporte</Link>
                </article>
              );
            })}
            {!items.length && <div className="px-4 py-12 text-center text-sm font-semibold text-[#64748B]">No hay soportes que coincidan con los filtros.</div>}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
