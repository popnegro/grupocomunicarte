import { useMemo, useState } from 'react';
import { FileText, Mail, Phone, CalendarDays, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LeadsKanbanSkeleton } from './DashboardSkeleton';
import type { Lead } from '../types';

type Column = Lead['status'];

const columns: Array<{ key: Column; label: string }> = [
  { key: 'pending', label: 'Pendiente' },
  { key: 'contacted', label: 'Contactado' },
  { key: 'archived', label: 'Archivado' },
];

export function DashboardLeadsPage() {
  const { leads, updateLeadStatus, supports, leadsLoading } = useApp();
  const navigate = useNavigate();
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const grouped = useMemo(() => columns.reduce<Record<Column, Lead[]>>((acc, column) => {
    acc[column.key] = leads.filter((lead) => lead.status === column.key);
    return acc;
  }, { pending: [], contacted: [], archived: [] }), [leads]);

  const moveLead = async (id: string, status: Column) => {
    await updateLeadStatus(id, status);
    setDraggingId(null);
  };

  const openMediaKit = (lead: Lead) => {
    const params = new URLSearchParams({ lead: lead.id });
    navigate(`/dashboard/mediakits?${params.toString()}`);
  };

  return (
    <section className="space-y-6">
      <header>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#049A41]">CRM comercial</p>
        <h1 className="mt-1 text-2xl font-extrabold text-[#082028]">Leads</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#64748B]">Gestioná las solicitudes desde el primer contacto hasta el archivo.</p>
      </header>

      {leadsLoading ? (
        <LeadsKanbanSkeleton />
      ) : (
        <>
          <div className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="grid min-w-[960px] grid-cols-3 gap-4 lg:min-w-0">
              {columns.map((column) => (
                <div
                  key={column.key}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => draggingId && void moveLead(draggingId, column.key)}
                  className="min-h-[520px] rounded-2xl border border-[#DCE4DF] bg-white p-3"
                >
                  <div className="mb-3 flex items-center justify-between px-2 py-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${column.key === 'pending' ? 'bg-amber-400' : column.key === 'contacted' ? 'bg-sky-500' : 'bg-slate-400'}`} />
                      <h2 className="text-sm font-extrabold text-[#082028]">{column.label}</h2>
                    </div>
                    <span className="rounded-full bg-[#F7F9F7] px-2 py-1 text-[10px] font-extrabold text-[#64748B]">{grouped[column.key].length}</span>
                  </div>

                  <div className="space-y-3">
                    {grouped[column.key].map((lead) => {
                      const supportCount = lead.selectedSupportIds?.filter((id) => supports.some((support) => support.id === id)).length || 0;
                      return (
                        <article
                          key={lead.id}
                          draggable
                          onDragStart={() => setDraggingId(lead.id)}
                          className="cursor-grab rounded-xl border border-[#DCE4DF] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-extrabold text-[#082028]">{lead.name}</p>
                              <p className="mt-0.5 truncate text-xs font-semibold text-[#40515A]">{lead.company || 'Sin empresa'}</p>
                            </div>
                            <span className="shrink-0 rounded-lg bg-[#E8F0E4] px-2 py-1 text-[9px] font-extrabold text-[#049A41]">{supportCount} soportes</span>
                          </div>

                          <div className="mt-3 space-y-1.5 text-[10px] font-semibold text-[#64748B]">
                            <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{lead.email}</div>
                            <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{lead.phone}</div>
                            <div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" />{lead.plazaContext || 'Mendoza'}</div>
                            {lead.campaignStartDate && lead.campaignEndDate && (
                              <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />{lead.campaignStartDate} → {lead.campaignEndDate}</div>
                            )}
                          </div>

                          <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                            {columns.filter((item) => item.key !== column.key).map((item) => (
                              <button
                                key={item.key}
                                type="button"
                                onClick={() => void moveLead(lead.id, item.key)}
                                className="rounded-lg border border-[#DCE4DF] px-2 py-1.5 text-[9px] font-extrabold hover:bg-[#F7F9F7]"
                              >
                                → {item.label}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => openMediaKit(lead)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#049A41] px-2 py-1.5 text-[9px] font-extrabold text-white hover:bg-[#037d34] sm:col-span-3"
                            >
                              <FileText className="h-3 w-3" />
                              Generar Media Kit
                            </button>
                          </div>
                        </article>
                      );
                    })}

                    {grouped[column.key].length === 0 && (
                      <div className="rounded-xl border border-dashed border-[#DCE4DF] px-4 py-10 text-center text-xs font-semibold text-[#94A3B8]">
                        No hay leads en esta etapa.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] font-semibold text-[#94A3B8] lg:hidden">Deslizá horizontalmente para ver todas las etapas.</p>
        </>
      )}
    </section>
  );
}
