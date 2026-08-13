import { Link } from 'react-router-dom';
import { Check, MapPin, Plus } from 'lucide-react';
import type { Support } from '../types';

interface FeaturedSupportCardProps {
  support: Support;
  selected?: boolean;
  onAdd?: (support: Support) => void;
  preview?: boolean;
}

export function FeaturedSupportCard({ support, selected = false, onAdd, preview = false }: FeaturedSupportCardProps) {
  const canAdd = support.status === 'available' && Boolean(onAdd);

  return (
    <article className={`group overflow-hidden rounded-2xl border border-[#DCE4DF] bg-white shadow-sm transition-all ${preview ? '' : 'hover:-translate-y-0.5 hover:border-[#049A41] hover:shadow-md'}`}>
      <div className="relative h-52 overflow-hidden bg-[#082028]">
        {support.videoUrl ? (
          <video
            src={support.videoUrl}
            poster={support.imageUrl}
            muted
            loop
            playsInline
            autoPlay
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={support.imageUrl}
            alt={support.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#082028]/85 via-[#082028]/15 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
          <span className="rounded-full bg-[#049A41] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
            Destacado
          </span>
          <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase shadow-sm ${support.status === 'available' ? 'bg-white/95 text-[#049A41]' : 'bg-amber-100 text-amber-800'}`}>
            {support.status === 'available' ? 'Disponible' : 'Reservado'}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8FE3B1]">
            {support.plaza} · {support.type}
          </p>
          <h3 className="mt-1 line-clamp-2 text-lg font-extrabold leading-tight">
            {support.name}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-2 text-xs text-[#40515A]">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#049A41]" />
          <span className="line-clamp-2">{support.address}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
          <div className="rounded-xl bg-[#F7F9F7] p-3">
            <p className="font-extrabold uppercase tracking-wider text-[#64748B]">Formato</p>
            <p className="mt-1 font-extrabold text-[#082028]">{support.size || 'Consultar'}</p>
          </div>
          <div className="rounded-xl bg-[#F7F9F7] p-3">
            <p className="font-extrabold uppercase tracking-wider text-[#64748B]">Alcance</p>
            <p className="mt-1 font-extrabold text-[#082028]">{support.contactsCount || 'Consultar'}</p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-xs leading-5 text-[#64748B]">
          {support.description}
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            to={`/explorer?support=${encodeURIComponent(support.id)}`}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#DCE4DF] px-3 py-2.5 text-xs font-extrabold text-[#082028] transition hover:border-[#049A41] hover:bg-[#F7F9F7]"
          >
            Ver en el mapa
          </Link>

          <button
            type="button"
            disabled={!canAdd || selected}
            onClick={() => onAdd?.(support)}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-extrabold text-white transition ${selected ? 'cursor-default bg-[#64748B]' : canAdd ? 'bg-[#049A41] hover:bg-[#038537]' : 'cursor-not-allowed bg-slate-300'}`}
          >
            {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {selected ? 'Agregado' : 'Agregar soporte'}
          </button>
        </div>
      </div>
    </article>
  );
}
