import { AnimatePresence, motion } from 'motion/react';
import { useSelection } from '../../context/SelectionContext';
import { ArrowRight, Layers, Trash2 } from 'lucide-react';

interface StickySelectionBarProps {
  onOpenMediakit: () => void;
}

export function StickySelectionBar({ onOpenMediakit }: StickySelectionBarProps) {
  const { selectedCount, clearSelection } = useSelection();

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          key="sticky-selection-bar"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-[1100] w-[calc(100%-1.5rem)] max-w-lg md:max-w-xl"
          role="region"
          aria-label="Barra de selección de soportes"
        >
          <div className="bg-gray-900 text-white rounded-2xl p-2.5 sm:px-4 sm:py-3 shadow-2xl border border-gray-800 flex items-center justify-between gap-3 backdrop-blur-md">
            {/* Left Info */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="bg-white text-black text-xs font-black px-2 py-0.5 rounded-full">
                    {selectedCount}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold truncate text-gray-200">
                    {selectedCount === 1 ? 'soporte seleccionado' : 'soportes seleccionados'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={clearSelection}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Vaciar selección"
                aria-label="Vaciar selección"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenMediakit}
                className="bg-white text-black hover:bg-gray-100 font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm whitespace-nowrap"
              >
                <span>Solicitar Media Kit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
