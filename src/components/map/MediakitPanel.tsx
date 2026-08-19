import { FormEvent, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Loader2, RefreshCw, X } from 'lucide-react';
import { useSelection, type InventoryItem } from '../../context/SelectionContext';

interface MediakitPanelProps {
  selectedItems: InventoryItem[];
  onClose: () => void;
}

type SubmissionState = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

type AvailabilityConflict = {
  status?: string;
  message?: string;
  unavailableIds?: string[];
};

export default function MediakitPanel({ selectedItems, onClose }: MediakitPanelProps) {
  const { removeSelected, clearSelection } = useSelection();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [state, setState] = useState<SubmissionState>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [requestId, setRequestId] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const grouped = useMemo(() => ({
    mendoza: selectedItems.filter((item) => item.ciudad === 'mendoza').length,
    buenosAires: selectedItems.filter((item) => item.ciudad === 'buenos-aires').length,
  }), [selectedItems]);

  const validate = () => {
    const next: { name?: string; email?: string } = {};
    if (name.trim().length < 2) next.name = 'Ingresá tu nombre completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Ingresá un correo electrónico válido.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (state === 'LOADING' || !validate() || selectedItems.length === 0) return;

    setState('LOADING');
    setErrorMessage('');

    try {
      const response = await fetch('/api/mediakit/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: {
            name: name.trim(),
            company: company.trim(),
            email: email.trim(),
            phone: phone.trim(),
            message: message.trim(),
          },
          selectedIds: selectedItems.map((item) => item.canonical_id),
        }),
      });

      const payload = await response.json().catch(() => null) as AvailabilityConflict | null;

      if (!response.ok) {
        if (payload?.status === 'availability_conflict') {
          const unavailableIds = Array.isArray(payload.unavailableIds) ? payload.unavailableIds : [];
          unavailableIds.forEach(removeSelected);
          setErrorMessage(
            unavailableIds.length > 0
              ? 'Uno o más soportes cambiaron de disponibilidad. Los retiramos de tu selección; revisá el listado antes de volver a enviar.'
              : 'La disponibilidad de uno o más soportes cambió. Revisá el listado antes de volver a enviar.'
          );
        } else {
          setErrorMessage(payload?.message || 'No pudimos enviar tu solicitud. Intentá nuevamente.');
        }
        setState('ERROR');
        return;
      }

      setRequestId(payload?.requestId || 'REQ-CONFIRMADA');
      setState('SUCCESS');
    } catch {
      setErrorMessage('No pudimos enviar tu solicitud. Verificá tu conexión e intentá nuevamente.');
      setState('ERROR');
    }
  };

  const finish = () => {
    clearSelection();
    onClose();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[1500] flex max-h-[90vh] flex-col overflow-hidden rounded-t-3xl border border-gray-100 bg-white shadow-2xl md:inset-x-auto md:right-4 md:top-4 md:bottom-auto md:w-[440px] md:rounded-2xl">
      <header className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">Solicitud de Media Kit</h2>
          {state !== 'SUCCESS' && <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white">{selectedItems.length}</span>}
        </div>
        <button type="button" onClick={state === 'SUCCESS' ? finish : onClose} className="rounded-full p-2 text-gray-500 hover:bg-white hover:text-black" aria-label="Cerrar panel">
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="overflow-y-auto p-5 md:p-6">
        {state === 'SUCCESS' ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 className="mb-4 h-14 w-14 rounded-full bg-emerald-50 p-3 text-emerald-600" />
            <h3 className="text-xl font-bold text-gray-900">Solicitud recibida</h3>
            <div className="my-3 rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 font-mono text-xs font-bold">Código: {requestId}</div>
            <p className="mb-6 text-sm text-gray-600">Registramos tu pedido para {selectedItems.length} {selectedItems.length === 1 ? 'soporte' : 'soportes'}.</p>
            <button type="button" onClick={finish} className="w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white">Volver al inventario</button>
          </div>
        ) : selectedItems.length === 0 ? (
          <div className="py-8 text-center">
            <h3 className="text-lg font-bold">Todavía no seleccionaste soportes</h3>
            <p className="mt-2 text-sm text-gray-500">Elegí uno o más soportes disponibles para solicitar su Media Kit.</p>
          </div>
        ) : (
          <>
            <section className="mb-5 rounded-xl border border-gray-100 bg-gray-50/80 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-gray-700">{selectedItems.length} {selectedItems.length === 1 ? 'soporte seleccionado' : 'soportes seleccionados'}</p>
                  {selectedItems.length > 3 && <p className="mt-0.5 text-[11px] text-gray-500">{grouped.mendoza > 0 && `Mendoza (${grouped.mendoza})`}{grouped.mendoza > 0 && grouped.buenosAires > 0 && ' · '}{grouped.buenosAires > 0 && `Buenos Aires (${grouped.buenosAires})`}</p>}
                </div>
                {selectedItems.length > 3 && <button type="button" onClick={() => setExpanded((value) => !value)} className="flex items-center gap-1 rounded-md p-1 text-xs font-semibold text-gray-600 hover:bg-gray-200/60 hover:text-black">{expanded ? 'Ocultar' : 'Ver lista'}{expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}</button>}
              </div>
              {(selectedItems.length <= 3 || expanded) && <div className="mt-2.5 max-h-36 space-y-1.5 overflow-y-auto pr-1">
                {selectedItems.map((item) => <div key={item.canonical_id} className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-white px-2.5 py-1.5 text-xs">
                  <span className="min-w-0 flex-1 truncate font-semibold">{item.name}</span>
                  <button type="button" onClick={() => removeSelected(item.canonical_id)} disabled={state === 'LOADING'} className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-black" aria-label={`Quitar ${item.name}`}><X className="h-3.5 w-3.5" /></button>
                </div>)}
              </div>}
            </section>

            {state === 'ERROR' && <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{errorMessage}</span></div>}

            <form onSubmit={submit} className="space-y-3.5">
              <label className="block text-xs font-semibold text-gray-700">Nombre completo *<input value={name} onChange={(e) => setName(e.target.value)} disabled={state === 'LOADING'} className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none ${errors.name ? 'border-red-500' : 'border-gray-200'}`} placeholder="Tu nombre y apellido" /></label>
              {errors.name && <p className="-mt-2 text-xs text-red-600">{errors.name}</p>}
              <label className="block text-xs font-semibold text-gray-700">Email *<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={state === 'LOADING'} className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none ${errors.email ? 'border-red-500' : 'border-gray-200'}`} placeholder="nombre@empresa.com" /></label>
              {errors.email && <p className="-mt-2 text-xs text-red-600">{errors.email}</p>}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-gray-700">Empresa<input value={company} onChange={(e) => setCompany(e.target.value)} disabled={state === 'LOADING'} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none" placeholder="Tu empresa" /></label>
                <label className="block text-xs font-semibold text-gray-700">Teléfono<input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={state === 'LOADING'} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none" placeholder="+54 9..." /></label>
              </div>
              <label className="block text-xs font-semibold text-gray-700">Observaciones<textarea value={message} onChange={(e) => setMessage(e.target.value)} disabled={state === 'LOADING'} rows={2} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none" placeholder="Fechas estimadas o requerimientos especiales" /></label>
              <button type="submit" disabled={state === 'LOADING'} className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white disabled:bg-gray-300">
                {state === 'LOADING' ? <><Loader2 className="h-4 w-4 animate-spin" />Enviando solicitud...</> : state === 'ERROR' ? <><RefreshCw className="h-4 w-4" />Reintentar envío ({selectedItems.length})</> : `Enviar solicitud (${selectedItems.length})`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
