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
    clearSelectionError,
  } = useApp();

  if (selectedSupports.length === 0) return null;

  const formatDateShort = (d: string | null) => {
    if (!d) return null;
    const date = new Date(`${d}T00:00:00`);
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const startFormatted = formatDateShort(campaignStartDate);
  const endFormatted = formatDateShort(campaignEndDate);
  const isLimitReached = selectedSupports.length >= MAX_SELECTION_LIMIT;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-4xl -translate-x-1/2">
      <AnimatePresence>
        {selectionError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs font-extrabold text-amber-900 shadow-lg"
            role="alert"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>{selectionError}</span>
            </div>
            <button
              onClick={clearSelectionError}
              className="rounded p-1 text-amber-800 hover:bg-amber-100"
              aria-label="Cerrar aviso"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:p-4"
      >
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#049A41] text-sm font-extrabold text-white shadow-sm">
              {selectedSupports.length}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#082028]">Soportes seleccionados</span>
                <span className="text-[10px] font-mono text-slate-500">{selectedSupports.length}/{MAX_SELECTION_LIMIT}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#049A41]">
                <Calendar className="h-3.5 w-3.5" />
                {startFormatted && endFormatted ? (
                  <span>Período: {startFormatted} → {endFormatted}</span>
                ) : (
                  <span className="font-bold text-amber-700">Período a definir</span>
                )}
              </div>
            </div>
          </div>

          {isLimitReached && (
            <span className="hidden rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-900 md:inline-block">
              Límite alcanzado
            </span>
          )}
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button
            onClick={onOpenReview}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-extrabold text-[#082028] transition-colors hover:bg-slate-100 sm:flex-none"
          >
            <CheckSquare className="h-3.5 w-3.5 text-[#049A41]" />
            <span>Revisar selección</span>
          </button>

          <button
            onClick={onOpenMediaKit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#049A41] px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-[#038537] sm:flex-none"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Solicitar cotización</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
