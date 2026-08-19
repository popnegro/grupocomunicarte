import { createContext, useCallback, useContext, useMemo, useState, useEffect, type ReactNode } from 'react';

export type InventoryItem = {
  canonical_id: string;
  name: string;
  ciudad: 'mendoza' | 'buenos-aires';
  tipo_soporte: 'tradicional' | 'led' | 'led_movil';
  lat: number;
  lng: number;
  address: string;
  description: string;
  disponibilidad?: 'disponible' | 'reservado';
};

type SelectionContextValue = {
  selectedIds: Set<string>;
  selectedCount: number;
  isSelected: (id: string) => boolean;
  toggleSelect: (item: InventoryItem) => void;
  removeSelected: (id: string) => void;
  clearSelection: () => void;
  reconcileSelection: (items: InventoryItem[]) => void;
};

const STORAGE_KEY = 'grupocomunicarte:selected-supports';
const SelectionContext = createContext<SelectionContextValue | null>(null);

function getInitialSelectedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === 'string' && id.length > 0));
  } catch {
    try { window.sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore storage failures */ }
    return new Set();
  }
}

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(getInitialSelectedIds);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (selectedIds.size === 0) window.sessionStorage.removeItem(STORAGE_KEY);
      else window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(selectedIds)));
    } catch {
      // Storage is an enhancement; the in-memory selection remains authoritative for the session.
    }
  }, [selectedIds]);

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const toggleSelect = useCallback((item: InventoryItem) => {
    if (item.disponibilidad !== 'disponible') return;

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.canonical_id)) next.delete(item.canonical_id);
      else next.add(item.canonical_id);
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

  const reconcileSelection = useCallback((items: InventoryItem[]) => {
    const availableIds = new Set(
      items.filter((item) => item.disponibilidad === 'disponible').map((item) => item.canonical_id)
    );

    setSelectedIds((prev) => {
      const next = new Set(Array.from(prev).filter((id) => availableIds.has(id)));
      if (next.size === prev.size) return prev;
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const value = useMemo<SelectionContextValue>(() => ({
    selectedIds,
    selectedCount: selectedIds.size,
    isSelected,
    toggleSelect,
    removeSelected,
    clearSelection,
    reconcileSelection,
  }), [selectedIds, isSelected, toggleSelect, removeSelected, clearSelection, reconcileSelection]);

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used within SelectionProvider');
  return ctx;
}
