import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

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
  clearSelection: () => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);
  const toggleSelect = useCallback((item: InventoryItem) => {
    if (item.disponibilidad === 'reservado') return;
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(item.canonical_id) ? next.delete(item.canonical_id) : next.add(item.canonical_id);
      return next;
    });
  }, []);
  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);
  const value = useMemo(() => ({ selectedIds, selectedCount: selectedIds.size, isSelected, toggleSelect, clearSelection }), [selectedIds, isSelected, toggleSelect, clearSelection]);
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used within SelectionProvider');
  return ctx;
}
