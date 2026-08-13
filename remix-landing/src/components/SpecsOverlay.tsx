import { useEffect } from 'react';
import { Support } from '../types';
import { useApp } from '../context/AppContext';
import { X, Play, Eye, Maximize2, CheckCircle2, Circle, Navigation, MapPin, AlertCircle, Compass, Sun, Volume2, Monitor } from 'lucide-react';
import { motion } from 'motion/react';
import { SupportImage } from './SupportImage';

interface SpecsOverlayProps {
  support: Support;
  onClose: () => void;
  onFocusOnMap?: () => void;
}

export function SpecsOverlay({ support, onClose, onFocusOnMap }: SpecsOverlayProps) {
  const { selectedSupports, toggleSupportSelection, selectionError, clearSelectionError, setActiveSupportId } = useApp();
  const isSelected = selectedSupports.some(s => s.id === support.id);
  const isReserved = support.status === 'reserved';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleViewOnMap = () => {
    setActiveSupportId(support.id);
    if (onFocusOnMap) onFocusOnMap();
    else document.getElementById('interactive-map')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#082028]/30 backdrop-blur-xs lg:hidden" onClick={onClose} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 220 }} className="fixed right-0 top-16 bottom-0 z-40 flex w-full flex-col overflow-hidden border-l border-[#DCE4DF] bg-white shadow-2xl sm:w-[380px] lg:w-[400px] xl:w-[420px]">
        <div className="flex shrink-0 items-center justify-between border-b border-[#DCE4DF] bg-[#082028] p-4 text-white sm:p-5">
          <div><span className="block text-[10px] uppercase font-extrabold tracking-wider text-[#8FE3B1]">Ficha Técnica</span><h3 className="text-base font-extrabold text-white sm:text-lg">DETALLE DEL SOPORTE</h3></div>
          <button onClick={onClose} className="cursor-pointer rounded-full p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white" aria-label="Cerrar panel de detalle"><X className="h-5 w-5" /></button>
        </div>

        <div className="relative h-48 w-full shrink-0 bg-[#082028] sm:h-52">
          {support.videoUrl ? <video src={support.videoUrl} autoPlay loop muted playsInline className="h-full w-full object-cover opacity-90" /> : <SupportImage src={support.imageUrl} alt={support.name} supportName={support.name} supportType={support.type} className="h-full w-full object-cover opacity-95" />}
          {support.videoUrl && <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#082028]/85 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-md"><Play className="h-2.5 w-2.5 fill-white" /> Loop Simulación</div>}
          <div className="absolute right-3 top-3"><span className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase shadow-sm ${isReserved ? 'border-amber-300 bg-amber-500 text-white' : 'border-emerald-300 bg-emerald-500 text-white'}`}>{isReserved ? 'Reservado' : 'Disponible'}</span></div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#082028] via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-white"><span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#8FE3B1]">{support.plaza}</span><h2 className="text-sm font-extrabold leading-tight text-white sm:text-base">{support.name}</h2></div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-white p-4 sm:p-5">
          {selectionError && <div className="flex items-start justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800"><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><span>{selectionError}</span></div><button onClick={clearSelectionError} className="rounded p-1 text-amber-700 hover:bg-amber-100"><X className="h-3.5 w-3.5" /></button></div>}

          {isReserved && <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><div><p className="font-extrabold">Soporte reservado</p><p className="mt-0.5 leading-5">Esta ubicación sigue visible en el inventario, pero no está disponible para selección en este momento.</p></div></div>}

          <div className="space-y-2 rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] p-3.5">
            <div className="flex items-center space-x-2 text-xs text-[#082028]"><MapPin className="h-4 w-4 shrink-0 text-[#049A41]" /><span className="font-extrabold leading-snug">{support.address}</span></div>
            <div className="flex items-center gap-2 border-t border-[#DCE4DF] pt-1"><span className="rounded-md bg-[#082028] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-white">{support.type}</span><span className="font-mono text-[10px] font-bold text-[#40515A]">Plaza {support.plaza}</span><span className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${isReserved ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{isReserved ? 'Reservado' : 'Disponible'}</span></div>
          </div>

          <div><h4 className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-[#40515A]">Especificaciones Técnicas</h4><div className="grid grid-cols-2 gap-2.5">
            {[['Dimensiones', support.size, Maximize2], ['Tráfico Est.', support.contactsCount || 'Ver métricas', Eye], ['Resolución', support.resolution || (support.type.includes('LED') ? '1920x1080 (HD)' : 'Impresión Lona 300DPI'), Monitor], ['Iluminación', support.illumination || (support.type.includes('LED') ? 'LED Backlight 24/7' : 'Backlight Halógeno'), Sun], ['Orientación', support.orientation || 'Frontal a Tráfico Principal', Compass], ['Audio', support.audio || 'Sin Audio (Normativa OOH)', Volume2]].map(([label, value, Icon]) => { const IconComponent = Icon; return <div key={label as string} className="flex items-center space-x-2.5 rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] p-2.5 sm:p-3"><div className="shrink-0 rounded-lg bg-[#E8F0E4] p-2 text-[#049A41]"><IconComponent className="h-3.5 w-3.5" /></div><div className="min-w-0"><p className="text-[9px] font-extrabold uppercase text-[#64748B]">{label}</p><p className="truncate text-xs font-extrabold text-[#082028]">{value}</p></div></div>; })}
          </div></div>

          <div><h4 className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-[#40515A]">Descripción</h4><p className="rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] p-3 text-xs leading-relaxed text-[#082028]">{support.description}</p></div>

          {support.refPoints && support.refPoints.length > 0 && <div><h4 className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-[#40515A]">Puntos de Referencia</h4><div className="flex flex-wrap gap-1.5">{support.refPoints.map((p, i) => <span key={i} className="rounded-lg border border-[#DCE4DF] bg-[#F7F9F7] px-2.5 py-1 text-[10px] font-medium text-[#082028]">{p}</span>)}</div></div>}
        </div>

        <div className="shrink-0 space-y-2 border-t border-[#DCE4DF] bg-white p-4">
          <button onClick={handleViewOnMap} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] py-2.5 text-xs font-extrabold text-[#082028] transition-all hover:border-[#049A41] hover:text-[#049A41]"><Navigation className="h-4 w-4 text-[#049A41]" /><span>Ver en el mapa</span></button>
          <button disabled={isReserved} onClick={() => toggleSupportSelection(support)} className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-extrabold shadow-md transition-all ${isReserved ? 'cursor-not-allowed bg-amber-100 text-amber-800' : isSelected ? 'bg-[#082028] text-white' : 'cursor-pointer bg-[#049A41] text-white hover:bg-[#038537]'}`}>
            {isReserved ? <><AlertCircle className="h-4 w-4" /><span>Soporte reservado</span></> : isSelected ? <><CheckCircle2 className="h-4 w-4 text-emerald-400" /><span>Soporte seleccionado</span></> : <><Circle className="h-4 w-4" /><span>Seleccionar soporte</span></>}
          </button>
        </div>
      </motion.div>
    </>
  );
}
