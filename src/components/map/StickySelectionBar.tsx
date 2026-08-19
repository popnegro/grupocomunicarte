import { Trash2 } from 'lucide-react';
import { useSelection } from '../../context/SelectionContext';

interface StickySelectionBarProps {
  onRequestMediaKit: () => void;
}

export default function StickySelectionBar({ onRequestMediaKit }: StickySelectionBarProps) {
  const { selectedCount, clearSelection } = useSelection();

  if (selectedCount === 0) return null;

  return (
    <div className="fixed inset-x-3 bottom-4 z-[1100] mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-2xl backdrop-blur md:inset-x-auto md:right-6 md:w-[440px]">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900">
            {selectedCount} {selectedCount === 1 ? 'soporte seleccionado' : 'soportes seleccionados'}
          </p>
          <p className="text-xs text-gray-500">Listos para solicitar el Media Kit</p>
        </div>
        <button type="button" onClick={clearSelection} className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black" aria-label="Vaciar selección" title="Vaciar selección">
          <Trash2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={onRequestMediaKit} className="rounded-xl bg-black px-4 py-3 text-xs font-bold text-white transition hover:bg-gray-800">
          Solicitar Media Kit
        </button>
      </div>
    </div>
  );
}
