import type { InventoryItem } from '../../types';
import type { MediaKitRequest } from '../../lib/media-kit-repository';
import { MediaKitDocument } from './MediaKitDocument';

type Props = {
  request: MediaKitRequest;
  supports: InventoryItem[];
  onClose?: () => void;
};

export function MediaKitPreview({ request, supports, onClose }: Props) {
  return (
    <section aria-label="Vista previa del Media Kit" className="space-y-4">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#049A41]">Vista previa</p>
          <h2 className="mt-1 text-lg font-extrabold text-[#082028]">Media Kit</h2>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-xl border border-[#DCE4DF] px-3 py-2 text-xs font-extrabold text-[#40515A] transition hover:bg-[#F7F9F8]">
            Volver
          </button>
        )}
      </header>
      <MediaKitDocument request={request} supports={supports} />
    </section>
  );
}
