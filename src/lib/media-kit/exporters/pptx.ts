import pptxgen from 'pptxgenjs';
import type { MediaKitDocumentModel } from '../document-model';

const GREEN = '049A41';
const INK = '082028';
const MUTED = '64748B';
const BORDER = 'DCE4DF';
const LIGHT = 'F7F9F8';

function addHeader(slide: pptxgen.Slide, title: string, subtitle?: string) {
  slide.addText('GRUPO COMUNICARTE', { x: 0.55, y: 0.42, w: 3.8, h: 0.22, fontFace: 'Arial', fontSize: 8, bold: true, color: GREEN, charSpacing: 1.5, margin: 0 });
  slide.addText(title, { x: 0.55, y: 0.72, w: 8.7, h: 0.42, fontFace: 'Arial', fontSize: 23, bold: true, color: INK, margin: 0 });
  if (subtitle) slide.addText(subtitle, { x: 0.55, y: 1.2, w: 8.7, h: 0.28, fontFace: 'Arial', fontSize: 10, color: MUTED, margin: 0 });
}

export async function exportMediaKitPptx(document: MediaKitDocumentModel): Promise<void> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Grupo Comunicarte';
  pptx.subject = 'Media Kit';
  pptx.title = `Media Kit ${document.requestId}`;
  pptx.company = 'Grupo Comunicarte';
  pptx.lang = 'es-AR';

  const cover = pptx.addSlide();
  cover.background = { color: 'FFFFFF' };
  cover.addText('GRUPO COMUNICARTE', { x: 0.65, y: 0.7, w: 4, h: 0.25, fontFace: 'Arial', fontSize: 9, bold: true, color: GREEN, charSpacing: 1.8, margin: 0 });
  cover.addText('Media Kit', { x: 0.65, y: 2.25, w: 8, h: 0.7, fontFace: 'Arial', fontSize: 36, bold: true, color: INK, margin: 0 });
  cover.addText(`${document.campaign.start} — ${document.campaign.end}`, { x: 0.65, y: 3.08, w: 6.8, h: 0.35, fontFace: 'Arial', fontSize: 15, color: MUTED, margin: 0 });
  cover.addShape(pptx.ShapeType.line, { x: 0.65, y: 3.7, w: 2.2, h: 0, line: { color: GREEN, width: 2 } });
  cover.addText(document.contact.company || document.contact.name || 'Solicitud de campaña', { x: 0.65, y: 4.0, w: 7.2, h: 0.35, fontFace: 'Arial', fontSize: 13, bold: true, color: INK, margin: 0 });

  const summary = pptx.addSlide();
  addHeader(summary, 'Resumen de campaña', 'Solicitud de Media Kit');
  const rows = [
    ['Solicitante', document.contact.name || 'Sin especificar'],
    ['Empresa', document.contact.company || 'Sin especificar'],
    ['Email', document.contact.email || 'Sin especificar'],
    ['Teléfono', document.contact.phone || 'Sin especificar'],
    ['Período', `${document.campaign.start} — ${document.campaign.end}`],
    ['Soportes', String(document.supports.length)],
  ];
  rows.forEach(([label, value], index) => {
    const y = 1.8 + index * 0.65;
    summary.addText(label.toUpperCase(), { x: 0.65, y, w: 1.7, h: 0.2, fontFace: 'Arial', fontSize: 7, bold: true, color: MUTED, charSpacing: 0.8, margin: 0 });
    summary.addText(value, { x: 2.35, y: y - 0.02, w: 7.2, h: 0.25, fontFace: 'Arial', fontSize: 11, bold: true, color: INK, margin: 0 });
    summary.addShape(pptx.ShapeType.line, { x: 0.65, y: y + 0.35, w: 8.9, h: 0, line: { color: BORDER, width: 0.7 } });
  });

  document.supports.forEach((support, index) => {
    const slide = pptx.addSlide();
    addHeader(slide, support.name, `${support.city} · ${support.type}`);
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 1.75, w: 4.75, h: 4.45, rectRadius: 0.08, fill: { color: LIGHT }, line: { color: BORDER, width: 1 } });
    const image = support.images[0];
    if (image) slide.addImage({ path: image, x: 0.65, y: 1.85, w: 4.55, h: 4.25, sizingContain: false });
    slide.addText('UBICACIÓN', { x: 5.7, y: 1.85, w: 2, h: 0.2, fontFace: 'Arial', fontSize: 7, bold: true, color: MUTED, charSpacing: 0.8, margin: 0 });
    slide.addText(support.address, { x: 5.7, y: 2.15, w: 3.3, h: 0.7, fontFace: 'Arial', fontSize: 16, bold: true, color: INK, margin: 0, breakLine: false });
    slide.addText('TIPO DE SOPORTE', { x: 5.7, y: 3.15, w: 2.2, h: 0.2, fontFace: 'Arial', fontSize: 7, bold: true, color: MUTED, charSpacing: 0.8, margin: 0 });
    slide.addText(support.type, { x: 5.7, y: 3.45, w: 3.3, h: 0.3, fontFace: 'Arial', fontSize: 12, bold: true, color: INK, margin: 0 });
    slide.addShape(pptx.ShapeType.line, { x: 5.7, y: 4.05, w: 3.3, h: 0, line: { color: BORDER, width: 0.8 } });
    slide.addText(`Soporte ${index + 1} de ${document.supports.length}`, { x: 5.7, y: 4.35, w: 3.3, h: 0.25, fontFace: 'Arial', fontSize: 9, bold: true, color: GREEN, margin: 0 });
  });

  const closing = pptx.addSlide();
  closing.background = { color: INK };
  closing.addText('GRUPO COMUNICARTE', { x: 0.7, y: 1.1, w: 4, h: 0.25, fontFace: 'Arial', fontSize: 9, bold: true, color: GREEN, charSpacing: 1.8, margin: 0 });
  closing.addText('Gracias por considerar\nnuestros soportes.', { x: 0.7, y: 2.1, w: 8, h: 1.35, fontFace: 'Arial', fontSize: 28, bold: true, color: 'FFFFFF', margin: 0, breakLine: false });
  closing.addText(document.contact.email || 'Contacto comercial', { x: 0.7, y: 4.35, w: 7, h: 0.3, fontFace: 'Arial', fontSize: 12, color: 'FFFFFF', margin: 0 });

  await pptx.writeFile({ fileName: `media-kit-${document.requestId.slice(0, 8)}.pptx` });
}
