import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { SupportStatus } from '../types';
import { CheckCircle2, Search, ShieldAlert } from 'lucide-react';

export function DashboardInventoryStatus() {
  const { supports, updateSupport } = useApp();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SupportStatus>('all');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredSupports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return supports.filter((support) => {
      const matchesQuery = !normalizedQuery ||
        support.name.toLowerCase().includes(normalizedQuery) ||
        support.address.toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === 'all' || support.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter, supports]);

  const availableCount = supports.filter((support) => support.status === 'available').length;
  const reservedCount = supports.filter((support) => support.status === 'reserved').length;

  const handleStatusChange = async (id: string, status: SupportStatus) => {
    setSavingId(id);
    setFeedback(null);
    const success = await updateSupport(id, { status });
    setFeedback(success ? 'Estado actualizado correctamente.' : 'No se pudo actualizar el estado.');
    setSavingId(null);
  };

  return (
    <section className="space-y-5 rounded-2xl border border-[#DCE4DF] bg-white p-5 shadow-2xs">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#049A41]">Disponibilidad comercial</p>
          <h2 className="mt-1 text-lg font-extrabold text-[#082028]">Estado de los soportes</h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-[#40515A]">Gestioná qué ubicaciones pueden ofrecerse al cliente y cuáles deben permanecer visibles como reservadas.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
            <p className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700">Disponibles</p>
            <p className="mt-0.5 text-lg font-extrabold text-emerald-900">{availableCount}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5">
            <p className="text-[9px] font-extrabold uppercase tracking-wider text-amber-700">Reservados</p>
            <p className="mt-0.5 text-lg font-extrabold text-amber-900">{reservedCount}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre o dirección..."
            className="w-full rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] py-2.5 pl-10 pr-4 text-xs font-bold text-[#082028] outline-none transition-colors focus:border-[#049A41] focus:bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'all' | SupportStatus)}
          className="rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] px-3 py-2.5 text-xs font-extrabold text-[#082028] outline-none focus:border-[#049A41]"
          aria-label="Filtrar soportes por disponibilidad"
        >
          <option value="all">Todos los estados</option>
          <option value="available">Disponible</option>
          <option value="reserved">Reservado</option>
        </select>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] px-3 py-2 text-xs font-bold text-[#40515A]">
          <CheckCircle2 className="h-4 w-4 text-[#049A41]" />
          {feedback}
        </div>
      )}

      <div className="space-y-2">
        {filteredSupports.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#DCE4DF] bg-[#F7F9F7] px-5 py-10 text-center text-xs font-semibold text-[#64748B]">
            No hay soportes que coincidan con el filtro.
          </div>
        ) : (
          filteredSupports.map((support) => {
            const isReserved = support.status === 'reserved';
            return (
              <div key={support.id} className="flex flex-col gap-3 rounded-xl border border-[#DCE4DF] bg-white p-3.5 transition-colors hover:border-[#049A41]/40 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-extrabold text-[#082028]">{support.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${isReserved ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {isReserved ? 'Reservado' : 'Disponible'}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-[#64748B]">{support.address} · {support.plaza}</p>
                </div>
                <div className="flex items-center gap-2 md:w-56">
                  <select
                    value={support.status}
                    disabled={savingId === support.id}
                    onChange={(event) => void handleStatusChange(support.id, event.target.value as SupportStatus)}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-extrabold outline-none focus:border-[#049A41] ${isReserved ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}
                    aria-label={`Estado de ${support.name}`}
                  >
                    <option value="available">Disponible</option>
                    <option value="reserved">Reservado</option>
                  </select>
                  {isReserved && <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
