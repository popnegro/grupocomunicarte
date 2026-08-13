import { useMemo, useState } from 'react';
import { CalendarDays, FileText, Search, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MediaKitHistorySkeleton } from './DashboardSkeleton';

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export function MediaKitHistory() {
  const { mediaKits, supports, mediaKitsLoading } = useApp();
  const [query, setQuery] = useState('');

  const filteredKits = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...mediaKits]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((kit) => {
        if (!normalized) return true;
        return [kit.title, kit.clientName, kit.plaza]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalized));
      });
  }, [mediaKits, query]);

  const clientCount = new Set(
    mediaKits.map((kit) => kit.clientName.trim()).filter(Boolean),
  ).size;

  if (mediaKitsLoading) {
    return <MediaKitHistorySkeleton />;
  }

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#049A41]">CRM comercial</p>
          <h2 className="mt-1 text-xl font-extrabold text-[#082028]">Historial de Media Kits</h2>
          <p className="mt-1 text-sm text-[#64748B]">Registro de propuestas generadas y asociadas a clientes.</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[10px] font-extrabold text-[#40515A] ring-1 ring-[#DCE4DF]">
          <Users className="h-3.5 w-3.5 text-[#049A41]" />
          {clientCount} clientes · {mediaKits.length} Media Kits
        </div>
      </header>

      <div className="rounded-2xl border border-[#DCE4DF] bg-white p-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por cliente, campaña o plaza..."
            className="w-full rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] py-2.5 pl-9 pr-3 text-xs font-semibold outline-none transition focus:border-[#049A41] focus:bg-white"
          />
        </label>
      </div>

      <div className="space-y-3">
        {filteredKits.map((kit) => {
          const supportCount = kit.supportIds.filter((id) => supports.some((support) => support.id === id)).length;

          return (
            <article key={kit.id} className="rounded-2xl border border-[#DCE4DF] bg-white p-4 shadow-sm md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8F0E4] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#049A41]">
                      <FileText className="h-3 w-3" />
                      Media Kit
                    </span>
                    <span className="rounded-lg bg-[#F7F9F7] px-2 py-1 text-[9px] font-extrabold text-[#64748B]">{kit.plaza}</span>
                  </div>

                  <h3 className="mt-2 truncate text-sm font-extrabold text-[#082028]">{kit.title}</h3>
                  <p className="mt-1 text-xs font-semibold text-[#40515A]">{kit.clientName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] md:min-w-[360px]">
                  <div className="rounded-xl bg-[#F7F9F7] p-3">
                    <p className="font-extrabold uppercase tracking-wider text-[#64748B]">Campaña</p>
                    <p className="mt-1 flex items-center gap-1.5 font-extrabold text-[#082028]">
                      <CalendarDays className="h-3.5 w-3.5 text-[#049A41]" />
                      {formatDate(kit.campaignStartDate)} → {formatDate(kit.campaignEndDate)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#F7F9F7] p-3">
                    <p className="font-extrabold uppercase tracking-wider text-[#64748B]">Contenido</p>
                    <p className="mt-1 font-extrabold text-[#082028]">{supportCount} soportes · {new Date(kit.createdAt).toLocaleDateString('es-AR')}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {filteredKits.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#DCE4DF] bg-white px-6 py-16 text-center text-sm font-semibold text-[#94A3B8]">
            No hay Media Kits que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </section>
  );
}
