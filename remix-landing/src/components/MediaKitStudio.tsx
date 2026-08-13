import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { CalendarDays, CheckCircle2, FileText, Presentation, AlertCircle, MapPin, UserRound } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Lead, MediaKit, Support } from '../types';
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';

interface ConflictResult {
  supportId: string;
  status: 'available' | 'reserved' | 'conflict';
  reason?: string;
}

interface LocalDateMetadata {
  campaignStartDate: string;
  campaignEndDate: string;
}

const MEDIA_KIT_DATES_KEY = 'gc_mediakit_dates';

const toDate = (value: string) => new Date(`${value}T00:00:00`);

const overlaps = (start: string, end: string, otherStart?: string, otherEnd?: string) => {
  if (!otherStart || !otherEnd) return false;
  return start <= otherEnd && end >= otherStart;
};

const formatDate = (value?: string) => value
  ? new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(toDate(value))
  : '—';

const readLocalDates = (): Record<string, LocalDateMetadata> => {
  try {
    const raw = localStorage.getItem(MEDIA_KIT_DATES_KEY);
    return raw ? JSON.parse(raw) as Record<string, LocalDateMetadata> : {};
  } catch {
    return {};
  }
};

export function MediaKitStudio() {
  const { user, token, supports, mediaKits, leads } = useApp();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [slidesLayout, setSlidesLayout] = useState('Modern Pitch');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [savedKit, setSavedKit] = useState<MediaKit | null>(null);
  const [localDateMetadata, setLocalDateMetadata] = useState<Record<string, LocalDateMetadata>>(() => readLocalDates());
  const [prefilledLeadId, setPrefilledLeadId] = useState<string | null>(null);

  const leadId = searchParams.get('lead');

  const selectedLead = useMemo<Lead | null>(
    () => leadId ? leads.find((lead) => lead.id === leadId) || null : null,
    [leadId, leads]
  );

  useEffect(() => {
    if (!selectedLead || prefilledLeadId === selectedLead.id) return;

    setClientName(selectedLead.company?.trim() || selectedLead.name.trim());
    setTitle(`Media Kit · ${selectedLead.company?.trim() || selectedLead.name.trim()}`);
    setStartDate(selectedLead.campaignStartDate || '');
    setEndDate(selectedLead.campaignEndDate || '');
    setSelectedIds(selectedLead.selectedSupportIds || []);
    setComments(selectedLead.message?.trim() || '');
    setPrefilledLeadId(selectedLead.id);
    setStatusMessage(`Datos del lead “${selectedLead.name}” precargados.`);
  }, [prefilledLeadId, selectedLead]);

  const datedMediaKits = useMemo(
    () => mediaKits.map((kit) => {
      const metadata = localDateMetadata[kit.id];
      return metadata
        ? { ...kit, campaignStartDate: metadata.campaignStartDate, campaignEndDate: metadata.campaignEndDate }
        : kit;
    }),
    [localDateMetadata, mediaKits]
  );

  const selectedSupports = useMemo(
    () => selectedIds.map((id) => supports.find((support) => support.id === id)).filter((support): support is Support => Boolean(support)),
    [selectedIds, supports]
  );

  const availability = useMemo<ConflictResult[]>(() => {
    if (!startDate || !endDate || startDate > endDate) return [];
    return selectedSupports.map((support) => {
      if (support.status === 'reserved') {
        return { supportId: support.id, status: 'reserved', reason: 'El soporte está marcado como RESERVADO.' };
      }
      const conflictingKit = datedMediaKits.find((kit) =>
        kit.id !== savedKit?.id &&
        kit.supportIds.includes(support.id) &&
        overlaps(startDate, endDate, kit.campaignStartDate, kit.campaignEndDate)
      );
      if (conflictingKit) {
        return {
          supportId: support.id,
          status: 'conflict',
          reason: `Se solapa con el Media Kit “${conflictingKit.title}” (${formatDate(conflictingKit.campaignStartDate)} → ${formatDate(conflictingKit.campaignEndDate)}).`
        };
      }
      return { supportId: support.id, status: 'available' };
    });
  }, [datedMediaKits, endDate, savedKit?.id, selectedSupports, startDate]);

  const hasValidDates = Boolean(startDate && endDate && startDate <= endDate);
  const hasConflicts = availability.some((item) => item.status !== 'available');

  const toggleSupport = (support: Support) => {
    if (support.status === 'reserved') return;
    setSelectedIds((current) => current.includes(support.id)
      ? current.filter((id) => id !== support.id)
      : [...current, support.id]
    );
  };

  const buildKit = (): MediaKit => ({
    id: savedKit?.id || `preview-${Date.now()}`,
    title: title.trim(),
    clientName: clientName.trim(),
    plaza: selectedSupports[0]?.plaza || 'Mendoza',
    createdAt: savedKit?.createdAt || new Date().toISOString(),
    comments: comments.trim() || undefined,
    supportIds: selectedIds,
    slidesLayout,
    campaignStartDate: startDate,
    campaignEndDate: endDate,
  });

  const persist = async (event?: FormEvent) => {
    event?.preventDefault();
    setStatusMessage(null);

    if (!token || !user) {
      setStatusMessage('Sesión administrativa no disponible.');
      return;
    }
    if (!title.trim() || !clientName.trim()) {
      setStatusMessage('Completá título y cliente.');
      return;
    }
    if (!hasValidDates) {
      setStatusMessage('Seleccioná un rango de fechas válido.');
      return;
    }
    if (selectedIds.length === 0) {
      setStatusMessage('Seleccioná al menos un soporte.');
      return;
    }
    if (hasConflicts) {
      setStatusMessage('Hay soportes no disponibles para el período seleccionado. Revisá el detalle.');
      return;
    }

    try {
      const res = await fetch('/api/mediakits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          clientName: clientName.trim(),
          plaza: selectedSupports[0]?.plaza || 'Mendoza',
          comments: comments.trim() || undefined,
          supportIds: selectedIds,
          slidesLayout,
          campaignStartDate: startDate,
          campaignEndDate: endDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMessage(data.error || 'No se pudo guardar el Media Kit.');
        return;
      }

      const persistedKit = { ...data as MediaKit, campaignStartDate: startDate, campaignEndDate: endDate };
      const nextMetadata = {
        ...localDateMetadata,
        [persistedKit.id]: { campaignStartDate: startDate, campaignEndDate: endDate },
      };
      localStorage.setItem(MEDIA_KIT_DATES_KEY, JSON.stringify(nextMetadata));
      setLocalDateMetadata(nextMetadata);
      setSavedKit(persistedKit);
      setStatusMessage('Media Kit guardado correctamente. Las fechas de campaña quedaron asociadas al documento.');
    } catch {
      setStatusMessage('No se pudo conectar con el servidor.');
    }
  };

  const exportPdf = () => {
    const kit = buildKit();
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const margin = 16;
    let y = 20;

    pdf.setFontSize(22);
    pdf.setTextColor(8, 32, 40);
    pdf.text(kit.title || 'Media Kit Comercial', margin, y);
    y += 10;
    pdf.setFontSize(11);
    pdf.text(`Cliente: ${kit.clientName || '—'}`, margin, y);
    y += 6;
    pdf.text(`Plaza: ${kit.plaza}`, margin, y);
    y += 6;
    pdf.text(`Campaña: ${formatDate(kit.campaignStartDate)} → ${formatDate(kit.campaignEndDate)}`, margin, y);
    y += 12;

    for (const [index, support] of selectedSupports.entries()) {
      if (y > 255) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFontSize(14);
      pdf.text(`${index + 1}. ${support.name}`, margin, y);
      y += 7;
      pdf.setFontSize(9);
      const lines = pdf.splitTextToSize(
        `${support.type} · ${support.address}\n${support.size} · ${support.contactsCount || 'Bajo cotización'}\nTarifa bajo cotización`,
        175
      );
      pdf.text(lines, margin, y);
      y += lines.length * 4.5 + 5;
    }

    if (kit.comments) {
      if (y > 250) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFontSize(12);
      pdf.text('Observaciones', margin, y);
      y += 7;
      pdf.setFontSize(9);
      pdf.text(pdf.splitTextToSize(kit.comments, 175), margin, y);
    }

    pdf.save(`grupo-comunicarte-${kit.id}.pdf`);
  };

  const exportPptx = async () => {
    const kit = buildKit();
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'Grupo Comunicarte S.A.';
    pptx.subject = 'Media Kit Comercial';
    pptx.title = kit.title;
    pptx.company = 'Grupo Comunicarte S.A.';

    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: '082028' };
    titleSlide.addText(kit.title || 'Media Kit Comercial', { x: 0.6, y: 1.2, w: 12, h: 0.6, fontSize: 28, bold: true, color: 'FFFFFF' });
    titleSlide.addText(`Cliente: ${kit.clientName || '—'}\nPlaza: ${kit.plaza}\nCampaña: ${formatDate(kit.campaignStartDate)} → ${formatDate(kit.campaignEndDate)}`, { x: 0.6, y: 2.1, w: 11, h: 1.4, fontSize: 16, color: 'DCE4DF' });

    for (const support of selectedSupports) {
      const slide = pptx.addSlide();
      slide.addText(support.name, { x: 0.6, y: 0.45, w: 12, h: 0.45, fontSize: 22, bold: true, color: '082028' });
      slide.addText(`${support.type} · ${support.plaza}`, { x: 0.6, y: 1.0, w: 11.5, h: 0.3, fontSize: 11, color: '049A41', bold: true });
      slide.addText(`${support.address}\n${support.size}\n${support.contactsCount || 'Bajo cotización'}\nTarifa bajo cotización`, { x: 0.6, y: 1.55, w: 5.3, h: 2.1, fontSize: 14, color: '40515A' });
      if (support.imageUrl) {
        try {
          const imageResponse = await fetch(support.imageUrl);
          if (imageResponse.ok) {
            const blob = await imageResponse.blob();
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            slide.addImage({ data: dataUrl, x: 6.2, y: 1.25, w: 6.2, h: 4.1 });
          }
        } catch {
          // Remote images are optional; keep the slide usable when CORS blocks an image.
        }
      }
    }

    const outro = pptx.addSlide();
    outro.background = { color: '082028' };
    outro.addText('Grupo Comunicarte S.A.', { x: 0.7, y: 2.0, w: 11.5, h: 0.6, fontSize: 28, bold: true, color: 'FFFFFF' });
    outro.addText('Solicite el tarifario formal a su ejecutivo comercial.\nMendoza · Buenos Aires', { x: 0.7, y: 2.9, w: 11, h: 1, fontSize: 17, color: 'DCE4DF' });

    await pptx.writeFile({ fileName: `grupo-comunicarte-${kit.id}.pptx` });
  };

  return (
    <section className="space-y-6">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#049A41]">Dashboard · Media Kit Studio</p>
          {selectedLead && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F0E4] px-2.5 py-1 text-[9px] font-extrabold text-[#049A41]"><UserRound className="h-3 w-3" /> Lead precargado</span>}
        </div>
        <h1 className="mt-1 text-2xl font-extrabold text-[#082028]">Generar Media Kit comercial</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#64748B]">Fechas, disponibilidad, vista previa y exportación desde el mismo flujo comercial.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={persist} className="rounded-2xl border border-[#DCE4DF] bg-white p-5 shadow-sm">
          <div className="space-y-4">
            <label className="block"><span className="mb-1 block text-[10px] font-extrabold uppercase text-[#40515A]">Título</span><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-[#DCE4DF] px-3 py-2.5 text-sm outline-none focus:border-[#049A41]" placeholder="Campaña Primavera 2026" /></label>
            <label className="block"><span className="mb-1 block text-[10px] font-extrabold uppercase text-[#40515A]">Cliente</span><input value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full rounded-xl border border-[#DCE4DF] px-3 py-2.5 text-sm outline-none focus:border-[#049A41]" placeholder="Empresa / Marca" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label><span className="mb-1 flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#40515A]"><CalendarDays className="h-3.5 w-3.5" /> Inicio</span><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-xl border border-[#DCE4DF] px-3 py-2.5 text-sm outline-none focus:border-[#049A41]" /></label>
              <label><span className="mb-1 flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#40515A]"><CalendarDays className="h-3.5 w-3.5" /> Fin</span><input type="date" value={endDate} min={startDate || undefined} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-xl border border-[#DCE4DF] px-3 py-2.5 text-sm outline-none focus:border-[#049A41]" /></label>
            </div>
            <label className="block"><span className="mb-1 block text-[10px] font-extrabold uppercase text-[#40515A]">Estilo de presentación</span><select value={slidesLayout} onChange={(e) => setSlidesLayout(e.target.value)} className="w-full rounded-xl border border-[#DCE4DF] bg-white px-3 py-2.5 text-sm"><option>Modern Pitch</option><option>Corporate</option><option>Minimal</option></select></label>

            <div>
              <div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-extrabold uppercase text-[#40515A]">Soportes</span><span className="text-[10px] font-bold text-[#049A41]">{selectedIds.length} seleccionados</span></div>
              <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-[#DCE4DF] p-2">
                {supports.map((support) => {
                  const selected = selectedIds.includes(support.id);
                  const disabled = support.status === 'reserved';
                  return <button key={support.id} type="button" disabled={disabled} onClick={() => toggleSupport(support)} className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition ${disabled ? 'cursor-not-allowed border-amber-200 bg-amber-50 opacity-70' : selected ? 'border-[#049A41] bg-[#E8F0E4]' : 'border-[#DCE4DF] bg-white hover:bg-[#F7F9F7]'}`}><span className="min-w-0 pr-3"><span className="block truncate text-xs font-extrabold text-[#082028]">{support.name}</span><span className="block truncate text-[10px] text-[#64748B]"><MapPin className="mr-1 inline h-3 w-3" />{support.plaza} · {support.type}</span></span>{disabled ? <span className="text-[9px] font-extrabold text-amber-700">RESERVADO</span> : selected ? <CheckCircle2 className="h-4 w-4 text-[#049A41]" /> : null}</button>;
                })}
              </div>
            </div>

            <label className="block"><span className="mb-1 block text-[10px] font-extrabold uppercase text-[#40515A]">Observaciones</span><textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={4} className="w-full rounded-xl border border-[#DCE4DF] px-3 py-2.5 text-sm outline-none focus:border-[#049A41]" placeholder="Notas comerciales, alcance, condiciones..." /></label>

            {hasValidDates && selectedIds.length > 0 && (
              <div className="rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] p-3">
                <div className="mb-2 text-[10px] font-extrabold uppercase text-[#40515A]">Disponibilidad para la campaña</div>
                <div className="space-y-2">
                  {availability.map((item) => {
                    const support = supports.find((entry) => entry.id === item.supportId);
                    return <div key={item.supportId} className="flex items-start gap-2 text-xs"><span className="mt-0.5">{item.status === 'available' ? <CheckCircle2 className="h-4 w-4 text-[#049A41]" /> : <AlertCircle className="h-4 w-4 text-amber-600" />}</span><div><p className="font-bold text-[#082028]">{support?.name}</p><p className="text-[10px] text-[#64748B]">{item.reason || 'Disponible para el período seleccionado.'}</p></div></div>;
                  })}
                </div>
              </div>
            )}

            {statusMessage && <div className="rounded-xl border border-[#DCE4DF] bg-white p-3 text-xs font-bold text-[#40515A]">{statusMessage}</div>}
            <button type="submit" className="w-full rounded-xl bg-[#049A41] px-4 py-3 text-xs font-extrabold text-white shadow-sm hover:bg-[#037d34]">Guardar Media Kit</button>
          </div>
        </form>

        <section className="rounded-2xl border border-[#DCE4DF] bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-2 border-b border-[#DCE4DF] pb-4 md:flex-row md:items-center md:justify-between">
            <div><p className="text-[10px] font-extrabold uppercase tracking-wider text-[#049A41]">Vista previa</p><h2 className="text-lg font-extrabold text-[#082028]">{title || 'Media Kit comercial'}</h2></div>
            <div className="flex gap-2"><button type="button" onClick={exportPdf} disabled={!selectedSupports.length} className="inline-flex items-center gap-2 rounded-xl border border-[#DCE4DF] px-3 py-2 text-xs font-extrabold text-[#082028] disabled:opacity-40"><FileText className="h-4 w-4" /> PDF</button><button type="button" onClick={exportPptx} disabled={!selectedSupports.length} className="inline-flex items-center gap-2 rounded-xl bg-[#082028] px-3 py-2 text-xs font-extrabold text-white disabled:opacity-40"><Presentation className="h-4 w-4" /> PPTX</button></div>
          </div>

          <div className="rounded-2xl bg-[#082028] p-7 text-white">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#7FD59F]">Grupo Comunicarte S.A.</p>
            <h3 className="mt-3 text-3xl font-extrabold leading-tight">{title || 'Campaña publicitaria'}</h3>
            <p className="mt-3 text-sm text-slate-200">{clientName || 'Nombre del cliente'}</p>
            <p className="mt-1 text-xs text-slate-300">{formatDate(startDate)} → {formatDate(endDate)} · {selectedSupports[0]?.plaza || 'Mendoza'}</p>
          </div>

          <div className="mt-5 space-y-3">
            {selectedSupports.map((support, index) => <article key={support.id} className="overflow-hidden rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] md:flex"><div className="h-36 w-full overflow-hidden md:h-auto md:w-56"><img src={support.imageUrl} alt={support.name} className="h-full w-full object-cover" /></div><div className="flex-1 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-extrabold uppercase tracking-wider text-[#049A41]">Soporte {index + 1}</p><h4 className="mt-1 text-sm font-extrabold text-[#082028]">{support.name}</h4></div><span className="rounded-full bg-white px-2 py-1 text-[9px] font-extrabold text-[#049A41]">{support.status === 'available' ? 'DISPONIBLE' : 'RESERVADO'}</span></div><p className="mt-2 text-xs text-[#64748B]">{support.address}</p><div className="mt-3 grid grid-cols-2 gap-2 text-[10px]"><span><strong>Formato:</strong> {support.size}</span><span><strong>Alcance:</strong> {support.contactsCount || 'Bajo cotización'}</span></div></div></article>)}
            {!selectedSupports.length && <div className="rounded-xl border border-dashed border-[#DCE4DF] p-10 text-center text-sm text-[#64748B]">Seleccioná soportes para construir la vista previa.</div>}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-[#DCE4DF] bg-white p-4 text-xs text-[#40515A]"><span className="font-extrabold">Política comercial:</span><span>Tarifa bajo cotización</span><span>·</span><span>{slidesLayout}</span><span>·</span><span>{selectedSupports.length} soportes</span></div>
        </section>
      </div>
    </section>
  );
}
