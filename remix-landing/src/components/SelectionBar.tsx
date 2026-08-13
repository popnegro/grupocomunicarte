import { useApp } from '../context/AppContext';
import { CheckSquare, Calendar, FileText, ArrowRight, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SelectionBarProps {
  onOpenReview: () => void;
  onOpenMediaKit: () => void;
}

export function SelectionBar({ onOpenReview, onOpenMediaKit }: SelectionBarProps) {
  const { 
    selectedSupports, 
    campaignStartDate, 
    campaignEndDate, 
    MAX_SELECTION_LIMIT,
    selectionError,
    clearSelectionError
  } = useApp();

  if (selectedSupports.length === 0) return null;

  const formatDateShort = (d: string | null) => {
    if (!d) return null;
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const startFormatted = formatDateShort(campaignStartDate);
  const endFormatted = formatDateShort(campaignEndDate);
  const isLimitReached = selectedSupports.length >= MAX_SELECTION_LIMIT;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl">
      <AnimatePresence>
        {selectionError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-2 p-3 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg border border-amber-400 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{selectionError}</span>
            </div>
            <button 
              onClick={clearSelectionError}
              className="p-1 hover:bg-amber-600/30 rounded text-slate-950"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-[#082028] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-[#049A41]/40 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        {/* Left Info */}
        <div className="flex items-center space-x-3.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#049A41] text-[#082028] flex items-center justify-center font-extrabold text-sm shadow-md">
              {selectedSupports.length}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white">
                  Soportes Seleccionados
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
                  ({selectedSupports.length}/{MAX_SELECTION_LIMIT})
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 text-[11px] text-[#049A41] font-semibold mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                {startFormatted && endFormatted ? (
                  <span>Período: {startFormatted} → {endFormatted}</span>
                ) : (
                  <span className="text-amber-400 font-bold">Sin período definido</span>
                )}
              </div>
            </div>
          </div>

          {isLimitReached && (
            <span className="text-[10px] font-extrabold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md hidden md:inline-block">
              Límite Máximo Alcanzado
            </span>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={onOpenReview}
            className="flex-1 sm:flex-none px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-xl transition-all border border-white/15 flex items-center justify-center gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Ver selección ({selectedSupports.length})</span>
          </button>

          <button
            onClick={onOpenMediaKit}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            <span>Solicitar Media Kit ({selectedSupports.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
