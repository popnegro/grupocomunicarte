import { BarChart3, ExternalLink, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F9F7] text-[#082028]">
      <header className="sticky top-0 z-40 border-b border-[#DCE4DF] bg-white/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold tracking-tight">Grupo Comunicarte</span>
            <span className="hidden rounded-full bg-[#E8F0E4] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider sm:inline-flex">Portal administrativo</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/')} className="hidden items-center gap-1.5 rounded-xl border border-[#DCE4DF] px-3 py-2 text-xs font-bold text-[#40515A] transition hover:bg-[#F7F9F7] sm:inline-flex">
              <ExternalLink className="h-3.5 w-3.5" /> Sitio público
            </button>
            <button type="button" onClick={() => navigate('/')} className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100">
              <LogOut className="h-3.5 w-3.5" /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
        <aside className="w-full shrink-0 border-b border-[#DCE4DF] bg-white p-3 md:w-60 md:border-b-0 md:border-r md:p-4">
          <div className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">Navegación</div>
          <nav>
            <NavLink to="/dashboard" end className={({ isActive }) => `flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-xs font-extrabold transition ${isActive ? 'bg-[#082028] text-white shadow-sm' : 'text-[#40515A] hover:bg-[#F7F9F7] hover:text-[#082028]'}`}>
              {({ isActive }) => <><BarChart3 className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#049A41]' : ''}`} /><span>Dashboard</span></>}
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
