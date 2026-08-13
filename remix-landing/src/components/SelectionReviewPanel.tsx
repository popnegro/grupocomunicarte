import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Calendar, FileText, ArrowRight, AlertCircle, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { SupportImage } from './SupportImage';

interface SelectionReviewPanelProps {
  onClose: () => void;
  onProceedToMediaKit: () => void;
}

export const SelectionReviewPanel: React.FC<SelectionReviewPanelProps> = ({
  onClose,
  onProceedToMediaKit
}) => {
  const { 
    selectedSupports, 
    toggleSupportSelection, 
    clearSelection, 
    campaignStartDate, 
    campaignEndDate,
    MAX_SELECTION_LIMIT
  } = useApp();

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

  const formatDateShort = (d: string | null) => {
    if (!d) return null;
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const startFormatted = formatDateShort(campaignStartDate);
  const endFormatted = formatDateShort(campaignEndDate);
  const isLimitReached = selectedSupports.length >= MAX_SELECTION_LIMIT;

  return (
    <div 
      className="fixed inset-0 bg-[#082028]/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#DCE4DF]"
      >
        {/* Header */}
        <div className="bg-[#082028] text-white p-5 flex items-center justify-between border-b border-[#049A41]/30">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-[#049A41] tracking-wider block">
              Planificación de Campaña
            </span>
            <h3 className="text-lg font-extrabold flex items-center gap-2">
              <span>Soportes Seleccionados</span>
              <span className="text-xs bg-[#049A41] text-[#082028] font-bold px-2.5 py-0.5 rounded-full">
                {selectedSupports.length} / {MAX_SELECTION_LIMIT}
              </span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors"
            aria-label="Cerrar panel de revisión"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campaign Dates Context Header */}
        <div className="p-4 bg-[#F7F9F7] border-b border-[#DCE4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-[#082028]">
            <Calendar className="w-4 h-4 text-[#049A41] shrink-0" />
            <div>
              <span className="font-extrabold text-[#40515A] text-[10px] uppercase block">Período Seleccionado:</span>
              {startFormatted && endFormatted ? (
                <span className="font-extrabold text-xs text-[#082028]">
                  {startFormatted} al {endFormatted}
                </span>
              ) : (
                <span className="font-extrabold text-xs text-amber-700">
                  Sin período asignado (Se solicitará al enviar el formulario)
                </span>
              )}
            </div>
          </div>

          {selectedSupports.length > 0 && (
            <button
              onClick={clearSelection}
              className="text-xs font-extrabold text-red-600 hover:text-red-700 flex items-center gap-1 self-end sm:self-auto hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar Selección</span>
            </button>
          )}
        </div>

        {/* Limit Warning Notice if full */}
        {isLimitReached && (
          <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2 px-5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Has alcanzado el límite máximo de {MAX_SELECTION_LIMIT} soportes seleccionados para una sola campaña. Para agregar otros, elimina primero algunos de la lista.</span>
          </div>
        )}

        {/* List of Selected Supports */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3 bg-white">
          {selectedSupports.length === 0 ? (
            <div className="py-12 text-center text-[#64748B] space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#DCE4DF] mx-auto" />
              <p className="text-sm font-extrabold text-[#082028]">No has seleccionado ningún soporte publicitario aún.</p>
              <p className="text-xs text-[#40515A]">Explora el mapa o catálogo y presiona "Añadir a mi Selección" en los puntos de tu interés.</p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-[#049A41] text-[#082028] text-xs font-extrabold rounded-xl transition-all"
              >
                Explorar Cobertura
              </button>
            </div>
          ) : (
            selectedSupports.map(s => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl border border-[#DCE4DF] bg-[#F7F9F7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#049A41]/50 transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <SupportImage
                    src={s.imageUrl}
                    alt={s.name}
                    supportName={s.name}
                    supportType={s.type}
                    className="w-14 h-14 object-cover rounded-xl border border-[#DCE4DF] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <span className="text-[9px] uppercase font-extrabold bg-[#082028] text-white px-2 py-0.5 rounded">
                        {s.plaza}
                      </span>
                      <span className="text-[9px] uppercase font-extrabold bg-[#E8F0E4] text-[#049A41] px-2 py-0.5 rounded">
                        {s.type}
                      </span>
                      <span className="text-[10px] font-mono text-[#40515A]">{s.size}</span>
                    </div>

                    <h4 className="text-xs font-extrabold text-[#082028] truncate">{s.name}</h4>
                    <p className="text-[11px] text-[#40515A] truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#049A41] shrink-0" />
                      <span>{s.address}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleSupportSelection(s)}
                  className="p-2 text-[#64748B] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors self-end sm:self-center shrink-0"
                  title="Eliminar de la selección"
                  aria-label={`Eliminar ${s.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F7F9F7] border-t border-[#DCE4DF] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 text-xs text-[#40515A]">
            <ShieldCheck className="w-4 h-4 text-[#049A41]" />
            <span className="font-extrabold">Cotización confidencial y sin compromiso.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-[#DCE4DF] bg-white text-[#082028] hover:bg-slate-50 text-xs font-extrabold rounded-xl transition-all"
            >
              Seguir Explorando
            </button>

            <button
              onClick={() => {
                onClose();
                onProceedToMediaKit();
              }}
              disabled={selectedSupports.length === 0}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all ${
                selectedSupports.length === 0
                  ? 'bg-[#DCE4DF] text-[#64748B] cursor-not-allowed'
                  : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Generar Media Kit / Cotizar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
