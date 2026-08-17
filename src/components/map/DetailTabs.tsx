import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface DetailTab {
  id: string;
  label: string;
  content: ReactNode;
}

interface DetailTabsProps {
  tabs: DetailTab[];
}

export function DetailTabs({ tabs }: DetailTabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  useEffect(() => {
    if (tabs.length && !tabs.some((tab) => tab.id === activeId)) {
      setActiveId(tabs[0].id);
    }
  }, [tabs, activeId]);

  const selectTab = (index: number) => {
    const tab = tabs[index];
    if (!tab) return;
    setActiveId(tab.id);
    requestAnimationFrame(() => tabRefs.current[index]?.focus());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!tabs.length) return;
    let nextIndex: number | undefined;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      selectTab(nextIndex);
    }
  };

  if (!tabs.length) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
      <div role="tablist" aria-label="Detalle del soporte" className="flex overflow-x-auto border-b border-gray-100 bg-white">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab?.id;
          const panelId = `detail-panel-${tab.id}`;
          return (
            <button
              key={tab.id}
              ref={(element) => { tabRefs.current[index] = element; }}
              id={`detail-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => selectTab(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "relative min-w-max flex-1 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset",
                isActive ? "text-black" : "text-gray-400 hover:text-gray-600"
              )}
            >
              {tab.label}
              {isActive && <motion.div layoutId="detail-tab-underline" className="absolute inset-x-0 bottom-0 h-0.5 bg-black" transition={{ duration: 0.2 }} />}
            </button>
          );
        })}
      </div>

      <div className="min-h-[120px] p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab?.id}
            id={`detail-panel-${activeTab?.id}`}
            role="tabpanel"
            aria-labelledby={`detail-tab-${activeTab?.id}`}
            tabIndex={0}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
