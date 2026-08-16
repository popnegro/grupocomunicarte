import type { InventoryItem, MediaKitRequest } from '../../types';

type Props = {
  request: MediaKitRequest;
  supports: InventoryItem[];
};

export function MediaKitDocument({ request, supports }: Props) {
  const formatDate = (value: string) => new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`));

  return (
    <article className="mx-auto w-full max-w-[820px] overflow-hidden rounded-2xl border border-[#DCE4DF] bg-white text-[#082028] shadow-sm">
      <header className="border-b border-[#DCE4DF] px-8 py-7 sm:px-10">
        <div className="flex items-start justify-between gap-6">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#049A41]">Grupo Comunicarte</p><h1 className="mt-2 text-2xl font-extrabold tracking-tight">Media Kit</h1><p className="mt-1 text-sm font-medium text-[#64748B]">Propuesta de soportes para campaña</p></div>
          <div className="text-right text-xs font-semibold text-[#64748B]"><p>Solicitud</p><p className="mt-1 font-extrabold text-[#082028]">{request.id.slice(0, 8).toUpperCase()}</p></div>
        </div>
      </header>
      <section className="grid gap-6 border-b border-[#DCE4DF] px-8 py-6 sm:grid-cols-2 sm:px-10">
        <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#64748B]">Solicitante</p><p className="mt-2 text-sm font-bold">{request.name || 'Sin especificar'}</p><p className="mt-1 text-xs font-medium text-[#64748B]">{request.company || 'Particular'} · {request.email}</p></div>
        <div className="sm:text-right"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#64748B]">Período de campaña</p><p className="mt-2 text-sm font-bold">{formatDate(request.campaignStart)} — {formatDate(request.campaignEnd)}</p><p className="mt-1 text-xs font-medium text-[#64748B]">Emitido {formatDate(request.createdAt.slice(0, 10))}</p></div>
      </section>
      <section className="px-8 py-6 sm:px-10">
        <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#049A41]">Inventario seleccionado</p><h2 className="mt-1 text-lg font-extrabold">Soportes de campaña</h2></div><p className="text-xs font-bold text-[#64748B]">{supports.length} soporte{supports.length === 1 ? '' : 's'}</p></div>
        <div className="divide-y divide-[#DCE4DF] border-y border-[#DCE4DF]">{supports.map((support) => <div key={support.canonical_id} className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-start"><div><h3 className="text-sm font-extrabold">{support.name}</h3><p className="mt-1 text-xs font-medium text-[#64748B]">{support.address || 'Ubicación no especificada'}</p><p className="mt-2 text-xs font-semibold text-[#40515A]">{support.tipo_soporte}</p></div><div className="text-left sm:text-right"><p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#64748B]">Estado</p><p className="mt-1 text-xs font-extrabold text-[#049A41]">Disponible para solicitud</p></div></div>)}</div>
      </section>
      <footer className="flex flex-col gap-2 border-t border-[#DCE4DF] bg-[#F7F9F8] px-8 py-5 text-[10px] font-semibold text-[#64748B] sm:flex-row sm:items-center sm:justify-between sm:px-10"><span>Grupo Comunicarte · Media Kit</span><span>Documento de solicitud — sujeto a confirmación comercial</span></footer>
    </article>
  );
}
