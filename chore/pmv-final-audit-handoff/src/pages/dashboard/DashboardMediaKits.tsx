import { FileText } from 'lucide-react';
import { DashboardShell } from '../../components/dashboard/DashboardShell';

export default function DashboardMediaKits() {
  return (
    <DashboardShell>
      <section className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-600">Gestión</p>
            <h1 className="mt-1 text-2xl font-extrabold">Media Kits</h1>
            <p className="mt-1 text-sm text-muted-foreground">Solicitudes de cotización y armado de Media Kits.</p>
          </div>
        </header>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="px-4 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-extrabold text-foreground">Próximamente</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Esta sección requiere integración con el backend para visualizar y gestionar las solicitudes de los clientes.
            </p>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
