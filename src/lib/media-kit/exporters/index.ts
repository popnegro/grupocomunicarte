import type { MediaKitDocumentModel } from '../document-model';

export type MediaKitExportFormat = 'pdf' | 'pptx';

/**
 * Opens the current Media Kit document in the browser print flow.
 * The browser's "Save as PDF" destination produces a PDF without adding
 * a renderer dependency to the application bundle.
 */
export function exportMediaKitPdf(_document: MediaKitDocumentModel): void {
  if (typeof window === 'undefined') return;
  window.print();
}

/**
 * Explicit boundary for the editable presentation exporter.
 * Kept separate from the document model so a PPTX renderer can be added
 * without coupling presentation generation to the UI or business domain.
 */
export async function exportMediaKitPptx(_document: MediaKitDocumentModel): Promise<void> {
  throw new Error('PPTX exporter is not configured yet. Add the approved PPTX renderer before enabling this action.');
}
