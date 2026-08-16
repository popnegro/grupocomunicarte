import { inventory } from '../data/inventory';
import { getDisponibilidad, type Disponibilidad, type InventoryItem } from '../types';

export interface InventoryFilters {
  query?: string;
  availability?: 'todos' | Disponibilidad;
  plaza?: 'todas' | InventoryItem['ciudad'];
}

export function listInventory(filters: InventoryFilters = {}): InventoryItem[] {
  const query = filters.query?.trim().toLowerCase() ?? '';
  const availability = filters.availability ?? 'todos';
  const plaza = filters.plaza ?? 'todas';

  return inventory.filter((item) => {
    const haystack = `${item.name} ${item.address ?? ''} ${item.ciudad} ${item.tipo_soporte}`.toLowerCase();
    return (
      (!query || haystack.includes(query)) &&
      (availability === 'todos' || getDisponibilidad(item) === availability) &&
      (plaza === 'todas' || item.ciudad === plaza)
    );
  });
}

export function getInventoryStats() {
  return inventory.reduce(
    (stats, item) => {
      stats.total += 1;
      if (getDisponibilidad(item) === 'disponible') stats.available += 1;
      else stats.reserved += 1;
      return stats;
    },
    { total: 0, available: 0, reserved: 0 },
  );
}

export function getInventoryItem(canonicalId: string) {
  return inventory.find((item) => item.canonical_id === canonicalId);
}
