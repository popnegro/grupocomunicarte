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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleViewOnMap = () => {
    setActiveSupportId(support.id);
    if (onFocusOnMap) {
      onFocusOnMap();
    } else {
      const mapEl = document.getElementById('interactive-map') || document.getElementById('inventory-grid');
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay - ONLY visible on mobile (< lg) */}
      <div 
        className="lg:hidden fixed inset-0 bg-[#082028]/30 backdrop-blur-xs z-40"
        onClick={onClose}
      />

      {/* Contextual Right Panel - No backdrop on Desktop */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed right-0 top-16 bottom-0 w-full sm:w-[380px] lg:w-[400px] xl:w-[420px] bg-white shadow-2xl overflow-hidden flex flex-col border-l border-[#DCE4DF] z-40"
      >
        {/* Header Panel */}
        <div className="bg-[#082028] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#7C3AED]/30 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-[#7C3AED] tracking-wider block">
              Ficha Técnica
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white">DETALLE DEL SOPORTE</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar panel de detalle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Preview Section */}
        <div className="relative w-full h-48 sm:h-52 bg-[#082028] shrink-0">
          {support.videoUrl ? (
            <video
              src={support.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <SupportImage
              src={support.imageUrl}
              alt={support.name}
              supportName={support.name}
              supportType={support.type}
              className="w-full h-full object-cover opacity-95"
            />
          )}

          {support.videoUrl && (
            <div className="absolute top-3 left-3 bg-[#7C3AED] text-white text-[9px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Play className="w-2.5 h-2.5 fill-white" />
              Loop Simulación
            </div>
          )}

          {/* Estado Badge - VERDE para Disponible, NARANJA para Reservado */}
          <div className="absolute top-3 right-3">
            <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full border shadow-sm ${
              support.status === 'available'
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-amber-500 text-white border-amber-400'
            }`}>
              {support.status === 'available' ? 'Disponible' : 'En reserva'}
            </span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#082028] via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="text-[#7C3AED] text-[10px] uppercase font-extrabold tracking-wider block">{support.plaza}</span>
            <h2 className="text-white text-sm sm:text-base font-extrabold leading-tight">{support.name}</h2>
          </div>
        </div>

        {/* Body Details Content (Internal Scroll) */}
        <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto bg-white">
          {/* Error Notice */}
          {selectionError && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{selectionError}</span>
              </div>
              <button onClick={clearSelectionError} className="p-1 hover:bg-amber-100 rounded text-amber-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Ubicación & Tipo */}
          <div className="bg-[#F7F9F7] p-3.5 rounded-xl border border-[#DCE4DF] space-y-2">
            <div className="flex items-center space-x-2 text-xs text-[#082028]">
              <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0" />
              <span className="font-extrabold leading-snug">{support.address}</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-[#DCE4DF]">
              <span className="text-[10px] uppercase font-extrabold bg-[#082028] text-white px-2.5 py-0.5 rounded-md">
                {support.type}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#40515A]">
                Plaza {support.plaza}
              </span>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <h4 className="text-[#40515A] text-[10px] uppercase font-extrabold tracking-wider mb-2">Especificaciones Técnicas</h4>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#F7F9F7] p-2.5 sm:p-3 rounded-xl border border-[#DCE4DF] flex items-center space-x-2.5">
                <div className="p-2 bg-purple-100 text-[#7C3AED] rounded-lg shrink-0">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[#64748B] text-[9px] uppercase font-extrabold">Dimensiones</p>
                  <p className="text-[#082028] text-xs font-extrabold truncate">{support.size}</p>
                </div>
              </div>

              <div className="bg-[#F7F9F7] p-2.5 sm:p-3 rounded-xl border border-[#DCE4DF] flex items-center space-x-2.5">
                <div className="p-2 bg-purple-100 text-[#7C3AED] rounded-lg shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[#64748B] text-[9px] uppercase font-extrabold">Tráfico Est.</p>
                  <p className="text-[#082028] text-xs font-extrabold truncate">{support.contactsCount || 'Ver métricas'}</p>
                </div>
              </div>

              <div className="bg-[#F7F9F7] p-2.5 sm:p-3 rounded-xl border border-[#DCE4DF] flex items-center space-x-2.5">
                <div className="p-2 bg-purple-100 text-[#7C3AED] rounded-lg shrink-0">
                  <Monitor className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[#64748B] text-[9px] uppercase font-extrabold">Resolución</p>
                  <p className="text-[#082028] text-xs font-extrabold truncate">
                    {support.resolution || (support.type.includes('LED') ? '1920x1080 (HD)' : 'Impresión Lona 300DPI')}
                  </p>
                </div>
              </div>

              <div className="bg-[#F7F9F7] p-2.5 sm:p-3 rounded-xl border border-[#DCE4DF] flex items-center space-x-2.5">
                <div className="p-2 bg-purple-100 text-[#7C3AED] rounded-lg shrink-0">
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[#64748B] text-[9px] uppercase font-extrabold">Iluminación</p>
                  <p className="text-[#082028] text-xs font-extrabold truncate">
                    {support.illumination || (support.type.includes('LED') ? 'LED Backlight 24/7' : 'Backlight Halógeno')}
                  </p>
                </div>
              </div>

              <div className="bg-[#F7F9F7] p-2.5 sm:p-3 rounded-xl border border-[#DCE4DF] flex items-center space-x-2.5">
                <div className="p-2 bg-purple-100 text-[#7C3AED] rounded-lg shrink-0">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[#64748B] text-[9px] uppercase font-extrabold">Orientación</p>
                  <p className="text-[#082028] text-xs font-extrabold truncate">
                    {support.orientation || 'Frontal a Tráfico Principal'}
                  </p>
                </div>
              </div>

              <div className="bg-[#F7F9F7] p-2.5 sm:p-3 rounded-xl border border-[#DCE4DF] flex items-center space-x-2.5">
                <div className="p-2 bg-purple-100 text-[#7C3AED] rounded-lg shrink-0">
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[#64748B] text-[9px] uppercase font-extrabold">Audio</p>
                  <p className="text-[#082028] text-xs font-extrabold truncate">
                    {support.audio || 'Sin Audio (Normativa OOH)'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-[#40515A] text-[10px] uppercase font-extrabold tracking-wider mb-1">Descripción</h4>
            <p className="text-[#082028] text-xs leading-relaxed bg-[#F7F9F7] p-3 rounded-xl border border-[#DCE4DF]">
              {support.description}
            </p>
          </div>

          {/* Ref Points */}
          {support.refPoints && support.refPoints.length > 0 && (
            <div>
              <h4 className="text-[#40515A] text-[10px] uppercase font-extrabold tracking-wider mb-1">Puntos de Referencia</h4>
              <div className="flex flex-wrap gap-1.5">
                {support.refPoints.map((p, i) => (
                  <span key={i} className="bg-[#F7F9F7] border border-[#DCE4DF] text-[#082028] text-[10px] px-2.5 py-1 rounded-lg font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons in Footer */}
        <div className="p-4 bg-white border-t border-[#DCE4DF] space-y-2 shrink-0">
          <button
            onClick={handleViewOnMap}
            className="w-full py-2.5 bg-[#F7F9F7] hover:bg-purple-50 text-[#082028] hover:text-[#7C3AED] border border-[#DCE4DF] text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-[#7C3AED]" />
            <span>Ver en el mapa</span>
          </button>

          <button
            onClick={() => toggleSupportSelection(support)}
            className={`w-full py-3 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
              isSelected
                ? 'bg-[#082028] text-white'
                : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white'
            }`}
          >
            {isSelected ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Soporte Seleccionado</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                <span>Seleccionar soporte</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
}
