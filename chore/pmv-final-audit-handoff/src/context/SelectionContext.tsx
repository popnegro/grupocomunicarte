import { createContext, useCallback, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { InventoryItem, getDisponibilidad } from '../types';
import { fixedLocations, mobileRoutes } from '../data/inventory';

const STORAGE_KEY = 'grupocomunicarte:selected-supports';

interface SelectionContextValue {
  selectedIds: Set<string>;
  selectedCount: number;
  isSelected: (id: string) => boolean;
  toggleSelect: (item: InventoryItem) => void;
  removeSelected: (id: string) => void;
  clearSelection: () => void;
  getSelectedItems: (allItems: InventoryItem[]) => InventoryItem[];
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

/**
 * Safely reads and validates stored selection IDs from sessionStorage.
 * Discards any IDs that do not exist in inventory or are currently 'reservado'.
 */
function getInitialSelectedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const allInventory = [...fixedLocations, ...mobileRoutes];
      const validIdMap = new Map<string, boolean>();
      for (const item of allInventory) {
        validIdMap.set(item.canonical_id, getDisponibilidad(item) !== 'reservado');
      }
      const sanitizedIds = parsed.filter(
        (id): id is string => typeof id === 'string' && validIdMap.get(id) === true
      );
      return new Set(sanitizedIds);
    }
  } catch {
    // Fail silently and clear corrupted data
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  return new Set();
}

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(getInitialSelectedIds);

  // Sync state to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (selectedIds.size === 0) {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } else {
        const serialized = JSON.stringify(Array.from(selectedIds));
        window.sessionStorage.setItem(STORAGE_KEY, serialized);
      }
    } catch {
      // Fail silently if quota exceeded or storage disabled
    }
  }, [selectedIds]);

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const toggleSelect = useCallback((item: InventoryItem) => {
    // CRITICAL: Reservado items are strictly blocked from selection
    if (getDisponibilidad(item) === 'reservado') return;

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.canonical_id)) {
        next.delete(item.canonical_id);
      } else {
        next.add(item.canonical_id);
      }
      return next;
    });
  }, []);

  const removeSelected = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  const getSelectedItems = useCallback(
    (allItems: InventoryItem[]) => allItems.filter((item) => selectedIds.has(item.canonical_id)),
    [selectedIds]
  );

  const value = useMemo<SelectionContextValue>(() => ({
    selectedIds,
    selectedCount: selectedIds.size,
    isSelected,
    toggleSelect,
    removeSelected,
    clearSelection,
    getSelectedItems,
  }), [selectedIds, isSelected, toggleSelect, removeSelected, clearSelection, getSelectedItems]);

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used within a SelectionProvider');
  return ctx;
}
