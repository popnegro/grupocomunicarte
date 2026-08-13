import { useMemo, useState } from 'react';
import { Building2, CalendarDays, ChevronDown, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { MediaKit } from '../types';

interface ClientHistory {
  name: string;
  kits: MediaKit[];
}

export function DashboardClientsPage() {
  const { mediaKits, supports } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const clients = useMemo<ClientHistory[]>(() => {
    const grouped = new Map<string, MediaKit[]>();
    mediaKits.forEach((kit) => {
      const key = kit.clientName.trim() || 'Sin cliente';
      grouped.set(key, [...(grouped.get(key) || []), kit]);
    });
    return [...grouped.entries()]
      .map(([name, kits]) => ({ name, kits: kits.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) }))
      .filter((client) => client.name.toLowerCase().includes(query.trim().toLowerCase()));
  }, [mediaKits, query]);

  return (
    <section className="space-y-6">
      <header>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#049A41]">CRM comercial</p>
        <h1 className="mt-1 text-2xl font-extrabold text-[#082028]">Clientes</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#64748B]">Historial de clientes a los que se generaron Media Kits.</p>
      </header>

      <div className="rounded-2xl border border-[#DCE4DF] bg-white p-4">
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">Buscar cliente</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre del cliente..."
            className="w-full rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] px-3.5 py-2.5 text-xs font-bold outline-none transition focus:border-[#049A41] focus:bg-white"
          />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {clients.map((client) => {
          const isOpen = expanded === client.name;
          const lastKit = client.kits[0];
          const totalSupports = new Set(client.kits.flatMap((kit) => kit.supportIds)).size;

          return (
            <article key={client.name} className="rounded-2xl border border-[#DCE4DF] bg-white p-5 shadow-sm">
              <button
                onClick={() => setExpanded(isOpen ? null : client.name)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F0E4] text-[#049A41]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-extrabold text-[#082028]">{client.name}</h2>
                    <p className="mt-0.5 text-[10px] font-semibold text-[#64748B]">
                      {client.kits.length} Media Kit{client.kits.length === 1 ? '' : 's'} · {totalSupports} soportes distintos
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 shrink-0 text-[#64748B] transition ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded-xl bg-[#F7F9F7] p-3">
                  <p className="font-extrabold uppercase tracking-wider text-[#64748B]">Último Media Kit</p>
                  <p className="mt-1 truncate font-extrabold text-[#082028]">{lastKit?.title || '—'}</p>
                </div>
                <div className="rounded-xl bg-[#F7F9F7] p-3">
                  <p className="font-extrabold uppercase tracking-wider text-[#64748B]">Última fecha</p>
                  <p className="mt-1 font-extrabold text-[#082028]">
                    {lastKit?.createdAt ? new Date(lastKit.createdAt).toLocaleDateString('es-AR') : '—'}
                  </p>
                </div>
              </div>

              {isOpen && (
                <div className="mt-4 space-y-2 border-t border-[#DCE4DF] pt-4">
                  {client.kits.map((kit) => (
                    <div key={kit.id} className="rounded-xl border border-[#DCE4DF] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-extrabold text-[#082028]">{kit.title}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-[#64748B]">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {kit.campaignStartDate || '—'} → {kit.campaignEndDate || '—'}
                          </p>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#E8F0E4] px-2 py-1 text-[9px] font-extrabold text-[#049A41]">
                          <FileText className="h-3 w-3" />
                          {kit.supportIds.filter((id) => supports.some((support) => support.id === id)).length} soportes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}

        {clients.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#DCE4DF] bg-white px-6 py-16 text-center text-sm font-semibold text-[#94A3B8] lg:col-span-2">
            Todavía no hay clientes derivados de Media Kits.
          </div>
        )}
      </div>
    </section>
  );
}
