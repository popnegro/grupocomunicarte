import { BarChart3, ExternalLink, LogOut, FileText, MonitorSmartphone } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold tracking-tight">Grupo Comunicarte</span>
            <span className="hidden rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-800 sm:inline-flex">
              Portal administrativo
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/')} className="hidden items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-bold text-muted-foreground transition hover:bg-muted sm:inline-flex">
              <ExternalLink className="h-3.5 w-3.5" /> Sitio público
            </button>
            <button type="button" onClick={() => navigate('/')} className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100">
              <LogOut className="h-3.5 w-3.5" /> Salir
            </button>
          </div>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
        <aside className="w-full shrink-0 border-b border-border bg-surface p-3 md:w-60 md:border-b-0 md:border-r md:p-4">
          <div className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Navegación</div>
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible scrollbar-hide">
            <NavLink to="/dashboard" end className={({ isActive }) => `flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-xs font-extrabold transition whitespace-nowrap ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              {({ isActive }) => <><BarChart3 className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-500' : ''}`} /><span>Dashboard</span></>}
            </NavLink>
            <NavLink to="/dashboard/soportes" className={({ isActive }) => `flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-xs font-extrabold transition whitespace-nowrap ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              {({ isActive }) => <><MonitorSmartphone className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-500' : ''}`} /><span>Soportes</span></>}
            </NavLink>
            <NavLink to="/dashboard/mediakits" className={({ isActive }) => `flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-xs font-extrabold transition whitespace-nowrap ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              {({ isActive }) => <><FileText className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-500' : ''}`} /><span>Media Kits</span></>}
            </NavLink>
          </nav>
        </aside>
        <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
