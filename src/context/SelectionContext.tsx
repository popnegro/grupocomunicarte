import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { InventoryItem, getDisponibilidad } from '../types';
interface SelectionContextValue { selectedIds: Set<string>; selectedCount: number; isSelected: (id: string) => boolean; toggleSelect: (item: InventoryItem) => void; removeSelected: (id: string) => void; clearSelection: () => void; getSelectedItems: (allItems: InventoryItem[]) => InventoryItem[]; }
const SelectionContext = createContext<SelectionContextValue | null>(null);
export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);
  const toggleSelect = useCallback((item: InventoryItem) => { if (getDisponibilidad(item) === 'reservado') return; setSelectedIds(prev => { const next = new Set(prev); if (next.has(item.canonical_id)) next.delete(item.canonical_id); else next.add(item.canonical_id); return next; }); }, []);
  const removeSelected = useCallback((id: string) => setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; }), []);
  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);
  const getSelectedItems = useCallback((allItems: InventoryItem[]) => allItems.filter(item => selectedIds.has(item.canonical_id)), [selectedIds]);
  const value = useMemo(() => ({ selectedIds, selectedCount: selectedIds.size, isSelected, toggleSelect, removeSelected, clearSelection, getSelectedItems }), [selectedIds, isSelected, toggleSelect, removeSelected, clearSelection, getSelectedItems]);
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}
export function useSelection() { const ctx = useContext(SelectionContext); if (!ctx) throw new Error('useSelection must be used within a SelectionProvider'); return ctx; }
