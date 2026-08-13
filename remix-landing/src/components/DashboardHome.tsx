import { BarChart3, CalendarDays, FileText, MonitorSmartphone, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardHomeSkeleton } from './DashboardSkeleton';

export function DashboardHome() {
  const {
    supports,
    leads,
    mediaKits,
    isLoading: supportsLoading,
    leadsLoading,
    mediaKitsLoading,
  } = useApp();

  const dashboardLoading = supportsLoading || leadsLoading || mediaKitsLoading;

  const metrics = useMemo(() => ({
    totalSupports: supports.length,
    available: supports.filter((support) => support.status === 'available').length,
    reserved: supports.filter((support) => support.status === 'reserved').length,
    pendingLeads: leads.filter((lead) => lead.status === 'pending').length,
    totalMediaKits: mediaKits.length,
  }), [supports, leads, mediaKits]);

  if (dashboardLoading) {
    return <DashboardHomeSkeleton />;
  }

  const cards = [
    { label: 'Soportes', value: metrics.totalSupports, helper: `${metrics.available} disponibles · ${metrics.reserved} reservados`, icon: MonitorSmartphone },
    { label: 'Leads pendientes', value: metrics.pendingLeads, helper: 'Solicitudes que requieren seguimiento', icon: Users },
    { label: 'Media Kits', value: metrics.totalMediaKits, helper: 'Propuestas generadas', icon: FileText },
  ];

  return (
    <section className="space-y-6">
      <header>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#049A41]">Portal administrativo</p>
        <h1 className="mt-1 text-2xl font-extrabold text-[#082028]">Dashboard</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#64748B]">Resumen operativo del inventario y actividad comercial de Grupo Comunicarte.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ label, value, helper, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-[#DCE4DF] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">{label}</p>
                <p className="mt-2 text-3xl font-extrabold text-[#082028]">{value}</p>
                <p className="mt-1 text-[10px] font-semibold text-[#64748B]">{helper}</p>
              </div>
              <div className="rounded-xl bg-[#E8F0E4] p-3 text-[#049A41]"><Icon className="h-5 w-5" /></div>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-[#DCE4DF] bg-white p-5">
          <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#049A41]" /><h2 className="text-sm font-extrabold">Estado comercial</h2></div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-[#F7F9F7] p-4"><p className="text-[9px] font-extrabold uppercase text-[#64748B]">Pendientes</p><p className="mt-1 text-xl font-extrabold text-[#082028]">{leads.filter((lead) => lead.status === 'pending').length}</p></div>
            <div className="rounded-xl bg-[#F7F9F7] p-4"><p className="text-[9px] font-extrabold uppercase text-[#64748B]">Contactados</p><p className="mt-1 text-xl font-extrabold text-[#082028]">{leads.filter((lead) => lead.status === 'contacted').length}</p></div>
            <div className="rounded-xl bg-[#F7F9F7] p-4"><p className="text-[9px] font-extrabold uppercase text-[#64748B]">Archivados</p><p className="mt-1 text-xl font-extrabold text-[#082028]">{leads.filter((lead) => lead.status === 'archived').length}</p></div>
          </div>
        </article>

        <article className="rounded-2xl border border-[#DCE4DF] bg-white p-5">
          <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#049A41]" /><h2 className="text-sm font-extrabold">Accesos rápidos</h2></div>
          <div className="mt-4 grid gap-2">
            <a href="/dashboard/soportes" className="rounded-xl border border-[#DCE4DF] px-3 py-2.5 text-xs font-extrabold text-[#40515A] hover:bg-[#F7F9F7]">Gestionar soportes</a>
            <a href="/dashboard/leads" className="rounded-xl border border-[#DCE4DF] px-3 py-2.5 text-xs font-extrabold text-[#40515A] hover:bg-[#F7F9F7]">Abrir Kanban de leads</a>
            <a href="/dashboard/mediakits" className="rounded-xl border border-[#DCE4DF] px-3 py-2.5 text-xs font-extrabold text-[#40515A] hover:bg-[#F7F9F7]">Abrir Media Kit Studio</a>
          </div>
        </article>
      </div>
    </section>
  );
}
