import { useMemo, useState } from 'react';
import { Copy, Edit3, Eye, Search, Trash2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Support, SupportStatus } from '../types';

const todayISO = () => new Date().toISOString().slice(0, 10);

export function DashboardSupportsPage() {
  const { supports, updateSupport, addSupport, deleteSupport } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SupportStatus>('all');
  const [editing, setEditing] = useState<Support | null>(null);
  const [reservationStart, setReservationStart] = useState('');
  const [reservationEnd, setReservationEnd] = useState('');
  const [clientName, setClientName] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const filteredSupports = useMemo(() => {
    const q = query.trim().toLowerCase();
    return supports.filter((support) => {
      const matchesText = !q || support.name.toLowerCase().includes(q) || support.address.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || support.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [query, statusFilter, supports]);

  const openEdit = (support: Support) => {
    setEditing(support);
    setReservationStart(support.reservedFrom || '');
    setReservationEnd(support.reservedUntil || '');
    setClientName('');
    setMessage(null);
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (!reservationStart && !reservationEnd) {
      const success = await updateSupport(editing.id, { status: 'available', reservedFrom: undefined, reservedUntil: undefined });
      setMessage(success ? 'Soporte actualizado.' : 'No se pudo actualizar el soporte.');
      if (success) setEditing(null);
      return;
    }
    if (!reservationStart || !reservationEnd || reservationStart > reservationEnd) {
      setMessage('Ingresá un rango de fechas válido.');
      return;
    }
    const today = todayISO();
    const active = reservationStart <= today && reservationEnd >= today;
    const success = await updateSupport(editing.id, {
      reservedFrom: reservationStart,
      reservedUntil: reservationEnd,
      status: active ? 'reserved' : 'available',
    });
    setMessage(success ? 'Soporte actualizado.' : 'No se pudo actualizar el soporte.');
    if (success) setEditing(null);
  };

  const duplicateSupport = async (support: Support) => {
    const { id: _id, reservedFrom: _from, reservedUntil: _until, status: _status, ...copy } = support;
    const success = await addSupport({ ...copy, status: 'available' });
    setMessage(success ? `“${support.name}” duplicado correctamente.` : 'No se pudo duplicar el soporte.');
  };

  const handleDelete = async (support: Support) => {
    const confirmed = window.confirm(`¿Borrar “${support.name}”? Esta acción no se puede deshacer.`);
    if (!confirmed) return;
    const success = await deleteSupport(support.id);
    setMessage(success ? 'Soporte eliminado.' : 'No se pudo eliminar el soporte.');
  };

  const handleView = (support: Support) => {
    navigate(`/explorer?support=${encodeURIComponent(support.id)}`);
  };

  return (
    <section className="space-y-5">
      <header>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#049A41]">Inventario comercial</p>
        <h1 className="mt-1 text-2xl font-extrabold text-[#082028]">Soportes</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#64748B]">Gestioná inventario, disponibilidad y acciones sobre cada soporte.</p>
      </header>

      {message && <div className="rounded-xl border border-[#DCE4DF] bg-white px-4 py-3 text-xs font-bold text-[#40515A]">{message}</div>}

      <div className="flex flex-col gap-3 rounded-2xl border border-[#DCE4DF] bg-white p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar soporte o dirección..." className="w-full rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] py-2.5 pl-10 pr-3 text-xs font-bold outline-none focus:border-[#049A41] focus:bg-white" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | SupportStatus)} className="rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] px-3 py-2.5 text-xs font-extrabold">
          <option value="all">Todos</option>
          <option value="available">Disponible</option>
          <option value="reserved">Reservado</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#DCE4DF] bg-white">
        <div className="hidden grid-cols-[1fr_140px_180px_150px] gap-4 border-b border-[#DCE4DF] bg-[#F7F9F7] px-5 py-3 text-[9px] font-extrabold uppercase tracking-wider text-[#64748B] md:grid">
          <span>Soporte</span><span>Estado</span><span>Reserva</span><span className="text-right">Acciones</span>
        </div>
        <div className="divide-y divide-[#DCE4DF]">
          {filteredSupports.map((support) => (
            <div key={support.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_140px_180px_150px] md:items-center md:gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-[#082028]">{support.name}</p>
                <p className="mt-0.5 truncate text-[11px] text-[#64748B]">{support.plaza} · {support.address}</p>
              </div>
              <span className={`w-fit rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase ${support.status === 'reserved' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {support.status === 'reserved' ? 'Reservado' : 'Disponible'}
              </span>
              <div className="text-[11px] font-semibold text-[#40515A]">
                {support.reservedFrom && support.reservedUntil ? `${support.reservedFrom} → ${support.reservedUntil}` : 'Sin reserva'}
              </div>
              <div className="flex justify-start gap-1.5 md:justify-end">
                <button onClick={() => openEdit(support)} title="Editar" aria-label={`Editar ${support.name}`} className="rounded-lg border border-[#DCE4DF] p-2 text-[#40515A] hover:border-[#049A41] hover:bg-[#F7F9F7] hover:text-[#049A41]"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => void duplicateSupport(support)} title="Duplicar" aria-label={`Duplicar ${support.name}`} className="rounded-lg border border-[#DCE4DF] p-2 text-[#40515A] hover:border-[#049A41] hover:bg-[#F7F9F7] hover:text-[#049A41]"><Copy className="h-4 w-4" /></button>
                <button onClick={() => void handleDelete(support)} title="Borrar" aria-label={`Borrar ${support.name}`} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                <button onClick={() => handleView(support)} title="Ver" aria-label={`Ver ${support.name}`} className="rounded-lg border border-[#DCE4DF] p-2 text-[#40515A] hover:border-[#049A41] hover:bg-[#F7F9F7] hover:text-[#049A41]"><Eye className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#082028]/40 p-4 md:items-center">
          <div className="w-full max-w-xl rounded-2xl border border-[#DCE4DF] bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#049A41]">Editar soporte</p>
                <h2 className="mt-1 text-lg font-extrabold text-[#082028]">{editing.name}</h2>
              </div>
              <button onClick={() => setEditing(null)} title="Cerrar" aria-label="Cerrar" className="rounded-lg p-2 text-[#64748B] hover:bg-[#F7F9F7]"><X className="h-4 w-4" /></button>
            </div>

            <div className="mt-5 rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#40515A]">Disponibilidad / reserva</p>
                  <p className="mt-1 text-xs text-[#64748B]">Cuando la fecha actual está dentro del rango, el estado se muestra como RESERVADO.</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase ${editing.status === 'reserved' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{editing.status === 'reserved' ? 'Reservado' : 'Disponible'}</span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label><span className="mb-1 block text-[10px] font-extrabold uppercase text-[#64748B]">Fecha de reserva · inicio</span><input type="date" value={reservationStart} onChange={(e) => setReservationStart(e.target.value)} className="w-full rounded-xl border border-[#DCE4DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#049A41]" /></label>
                <label><span className="mb-1 block text-[10px] font-extrabold uppercase text-[#64748B]">Fecha de reserva · fin</span><input type="date" min={reservationStart || undefined} value={reservationEnd} onChange={(e) => setReservationEnd(e.target.value)} className="w-full rounded-xl border border-[#DCE4DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#049A41]" /></label>
              </div>

              <label className="mt-3 block"><span className="mb-1 block text-[10px] font-extrabold uppercase text-[#64748B]">Cliente / campaña (opcional)</span><input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Cliente" className="w-full rounded-xl border border-[#DCE4DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#049A41]" /></label>

              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={async () => { setReservationStart(''); setReservationEnd(''); await updateSupport(editing.id, { reservedFrom: undefined, reservedUntil: undefined, status: 'available' }); setEditing(null); }} className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700">Liberar reserva</button>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-xl border border-[#DCE4DF] px-4 py-2.5 text-xs font-extrabold text-[#40515A]">Cancelar</button>
              <button onClick={() => void saveEdit()} className="inline-flex items-center gap-1.5 rounded-xl bg-[#049A41] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#037d34]"><Save className="h-3.5 w-3.5" /> Guardar cambios</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
