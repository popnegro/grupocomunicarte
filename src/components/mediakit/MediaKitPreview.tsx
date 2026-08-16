import type { InventoryItem } from '../../types';
import type { MediaKitRequest } from '../../lib/media-kit-repository';
import { createMediaKitDocumentModel } from '../../lib/media-kit/document-model';
import { exportMediaKitPdf, exportMediaKitPptx } from '../../lib/media-kit/exporters';
import { MediaKitDocument } from './MediaKitDocument';

type Props = {
  request: MediaKitRequest;
  supports: InventoryItem[];
  onClose?: () => void;
};

export function MediaKitPreview({ request, supports, onClose }: Props) {
  const document = createMediaKitDocumentModel(request, supports);

  return (
    <section aria-label="Vista previa del Media Kit" className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#049A41]">Vista previa</p>
          <h2 className="mt-1 text-lg font-extrabold text-[#082028]">Media Kit</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => exportMediaKitPdf(document)} className="rounded-xl border border-[#DCE4DF] px-3 py-2 text-xs font-extrabold text-[#40515A] transition hover:bg-[#F7F9F8]">Descargar PDF</button>
          <button type="button" onClick={() => void exportMediaKitPptx(document)} className="rounded-xl bg-[#082028] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#16333C]">Descargar PPTX</button>
          {onClose && <button type="button" onClick={onClose} className="rounded-xl border border-[#DCE4DF] px-3 py-2 text-xs font-extrabold text-[#40515A] transition hover:bg-[#F7F9F8]">Volver</button>}
        </div>
      </header>
      <MediaKitDocument request={request} supports={supports} />
    </section>
  );
}
