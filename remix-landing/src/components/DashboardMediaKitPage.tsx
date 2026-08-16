import { CalendarDays, Layers3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MediaKitAudienceSelector } from './MediaKitAudienceSelector';
import { MediaKitStudio } from './MediaKitStudio';
import { MediaKitHistory } from './MediaKitHistory';
import './dashboard-media-kit.css';

const formatDate = (value: string | null) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

/**
 * Media Kit Studio, audience context and persistent history inside the
 * shared Dashboard shell.
 *
 * The selection summary deliberately consumes AppContext rather than creating
 * a second selection state. This keeps the Experiment UX pattern inside the
 * existing Remix architecture.
 */
export function DashboardMediaKitPage() {
  const { selectedSupports, campaignStartDate, campaignEndDate } = useApp();
  const campaignRange = campaignStartDate && campaignEndDate
    ? `${formatDate(campaignStartDate)} → ${formatDate(campaignEndDate)}`
    : null;

  return (
    <div className="dashboard-media-kit-embedded space-y-8">
      <header className="rounded-2xl border border-[#DCE4DF] bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#049A41]">
              Selección de campaña
            </p>
            <h2 className="mt-1 text-base font-extrabold text-[#082028]">
              Prepará el Media Kit desde el inventario seleccionado
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-bold text-[#40515A]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F9F7] px-3 py-1.5">
              <Layers3 className="h-3.5 w-3.5 text-[#049A41]" aria-hidden="true" />
              {selectedSupports.length} soporte{selectedSupports.length === 1 ? '' : 's'}
            </span>
            {campaignRange && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F9F7] px-3 py-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-[#049A41]" aria-hidden="true" />
                {campaignRange}
              </span>
            )}
          </div>
        </div>
      </header>

      <MediaKitAudienceSelector />
      <MediaKitStudio />
      <MediaKitHistory />
    </div>
  );
}
