import { BarChart3, FileText, MonitorSmartphone, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { inventory } from '../data/inventory';

export default function Dashboard() {
  const total = inventory.length;
  const available = inventory.filter((item) => item.disponibilidad !== 'no_disponible' && item.disponibilidad !== 'reservado').length;
  const reserved = inventory.filter((item) => item.disponibilidad === 'reservado').length;

  return (
    <DashboardShell>
      <section className="space-y-6">
        <header>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#049A41]">Portal administrativo</p>
          <h1 className="mt-1 text-2xl font-extrabold">Dashboard</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#64748B]">Resumen operativo del inventario y actividad comercial de Grupo Comunicarte.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Soportes" value={total} helper={`${available} disponibles · ${reserved} reservados`} icon={MonitorSmartphone} />
          <Metric label="Solicitudes" value="—" helper="Pendientes de integrar con backend" icon={Users} />
          <Metric label="Media Kits" value="—" helper="Pendientes de integrar con backend" icon={FileText} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <article className="rounded-2xl border border-[#DCE4DF] bg-white p-5">
            <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#049A41]" /><h2 className="text-sm font-extrabold">Estado del inventario</h2></div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Stat label="Total" value={total} />
              <Stat label="Disponibles" value={available} />
              <Stat label="Reservados" value={reserved} />
            </div>
          </article>

          <article className="rounded-2xl border border-[#DCE4DF] bg-white p-5">
            <h2 className="text-sm font-extrabold">Accesos rápidos</h2>
            <div className="mt-4 grid gap-2">
              <Link to="/inventario" className="rounded-xl border border-[#DCE4DF] px-3 py-2.5 text-xs font-extrabold text-[#40515A] hover:bg-[#F7F9F7]">Ver inventario público</Link>
              <Link to="/inventario" className="rounded-xl border border-[#DCE4DF] px-3 py-2.5 text-xs font-extrabold text-[#40515A] hover:bg-[#F7F9F7]">Gestionar selección</Link>
            </div>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}

function Metric({ label, value, helper, icon: Icon }: { label: string; value: number | string; helper: string; icon: typeof MonitorSmartphone }) {
  return (
    <article className="rounded-2xl border border-[#DCE4DF] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">{label}</p>
          <p className="mt-2 text-3xl font-extrabold">{value}</p>
          <p className="mt-1 text-[10px] font-semibold text-[#64748B]">{helper}</p>
        </div>
        <div className="rounded-xl bg-[#E8F0E4] p-3 text-[#049A41]"><Icon className="h-5 w-5" /></div>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl bg-[#F7F9F7] p-4"><p className="text-[9px] font-extrabold uppercase text-[#64748B]">{label}</p><p className="mt-1 text-xl font-extrabold">{value}</p></div>;
}
