import type { MediaKitDocumentModel } from '../document-model';
import { exportMediaKitPptx as exportPptx } from './pptx';

export type MediaKitExportFormat = 'pdf' | 'pptx';

/** Opens the current Media Kit document in the browser print flow. */
export function exportMediaKitPdf(_document: MediaKitDocumentModel): void {
  if (typeof window === 'undefined') return;
  window.print();
}

/** Generates an editable PowerPoint presentation from the shared document model. */
export function exportMediaKitPptx(document: MediaKitDocumentModel): Promise<void> {
  return exportPptx(document);
}
