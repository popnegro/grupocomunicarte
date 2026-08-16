import { useState, FormEvent } from 'react';
import { X, MapPin, CheckCircle2, Image as ImageIcon, CalendarDays } from 'lucide-react';
import { InventoryItem, isMobileRoute } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input, Textarea, Label } from '../ui/Input';
import { useSelection } from '../../context/SelectionContext';

interface MediakitPanelProps {
  selectedItems: InventoryItem[];
  onClose: () => void;
  onGoToInventory: () => void;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function MediakitPanel({ selectedItems, onClose, onGoToInventory }: MediakitPanelProps) {
  const { removeSelected, clearSelection } = useSelection();
  const [submitted, setSubmitted] = useState(false);
  const [campaignStart, setCampaignStart] = useState('');
  const [campaignEnd, setCampaignEnd] = useState('');
  const [dateError, setDateError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!campaignStart || !campaignEnd) {
      setDateError('Seleccioná el inicio y el fin de la campaña.');
      return;
    }
    if (campaignEnd < campaignStart) {
      setDateError('La fecha de finalización debe ser posterior al inicio.');
      return;
    }
    setDateError('');
    setSubmitted(true);
  };

  const handleClose = () => {
    if (submitted) clearSelection();
    onClose();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 md:bottom-auto md:top-4 md:left-auto md:right-4 md:w-[420px] bg-white rounded-t-3xl md:rounded-2xl shadow-2xl md:shadow-xl z-[1500] md:border border-gray-100 overflow-hidden flex flex-col max-h-[85vh]">
      <div className="p-4 bg-white md:bg-gray-50 flex justify-between items-center border-b border-gray-100 shrink-0">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Solicitud de Mediakit</span>
        <button onClick={handleClose} className="p-1.5 bg-gray-50 md:bg-white rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition-colors shadow-sm" aria-label="Cerrar">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 md:p-6 overflow-y-auto">
        {submitted ? (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Solicitud enviada</h3>
            <p className="text-sm text-gray-500 mb-8 max-w-xs">Recibimos tu solicitud de Mediakit para {selectedItems.length} {selectedItems.length === 1 ? 'soporte' : 'soportes'}.</p>
            <Button onClick={handleClose}>Cerrar</Button>
          </div>
        ) : selectedItems.length === 0 ? (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5"><ImageIcon className="w-7 h-7 text-gray-300" /></div>
            <h3 className="text-lg font-bold mb-2">Todavía no seleccionaste soportes</h3>
            <p className="text-sm text-gray-500 mb-8 max-w-xs">Elegí uno o más soportes disponibles en el mapa para solicitar su Mediakit.</p>
            <Button onClick={onGoToInventory}>Ir al inventario</Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Soportes seleccionados ({selectedItems.length})</h4>
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div key={item.canonical_id} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-3">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p><Badge variant="neutral" className="mt-1 uppercase tracking-wider">{isMobileRoute(item) ? 'led movil' : item.tipo_soporte.replace('_', ' ')}</Badge></div>
                    <button type="button" onClick={() => removeSelected(item.canonical_id)} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors shrink-0" aria-label={`Quitar ${item.name} de la selección`}><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="mb-2 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-emerald-600" /><Label htmlFor="mk-start">Período de campaña</Label></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label htmlFor="mk-start">Inicio</Label><Input id="mk-start" name="campaignStart" type="date" required min={todayISO()} value={campaignStart} onChange={(e) => setCampaignStart(e.target.value)} /></div>
                  <div><Label htmlFor="mk-end">Fin</Label><Input id="mk-end" name="campaignEnd" type="date" required min={campaignStart || todayISO()} value={campaignEnd} onChange={(e) => setCampaignEnd(e.target.value)} /></div>
                </div>
                {dateError && <p className="mt-2 text-xs font-semibold text-red-600" role="alert">{dateError}</p>}
                <p className="mt-2 text-[11px] text-gray-500">Seleccioná las fechas desde el calendario. El período se incorporará al Mediakit.</p>
              </div>
              <div><Label htmlFor="mk-name">Nombre</Label><Input id="mk-name" name="name" required placeholder="Tu nombre" /></div>
              <div><Label htmlFor="mk-company">Empresa</Label><Input id="mk-company" name="company" placeholder="Nombre de tu empresa (opcional)" /></div>
              <div><Label htmlFor="mk-email">Email</Label><Input id="mk-email" name="email" type="email" required placeholder="tu@empresa.com" /></div>
              <div><Label htmlFor="mk-phone">Teléfono</Label><Input id="mk-phone" name="phone" type="tel" placeholder="Opcional" /></div>
              <div><Label htmlFor="mk-message">Observaciones</Label><Textarea id="mk-message" name="message" rows={3} placeholder="Contanos sobre tu campaña (opcional)" /></div>
              <Button type="submit" className="w-full">Solicitar Mediakit ({selectedItems.length})</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
