import { fixedLocations, mobileRoutes } from '../data/inventory';
import { getDisponibilidad, type InventoryItem, type Disponibilidad } from '../types';

export const allInventory: InventoryItem[] = [...fixedLocations, ...mobileRoutes];

export interface InventoryFilters {
  query?: string;
  availability?: 'todos' | Disponibilidad;
  plaza?: 'todas' | InventoryItem['ciudad'];
}

function getAddress(item: InventoryItem): string {
  return 'address' in item 
    ? item.address 
    : item.waypoints?.map((point) => point.name).join(' · ') || 'Ruta móvil';
}

export function listInventory(filters: InventoryFilters = {}): InventoryItem[] {
  const query = filters.query?.trim().toLowerCase() ?? '';
  const availability = filters.availability ?? 'todos';
  const plaza = filters.plaza ?? 'todas';

  return allInventory.filter((item) => {
    const haystack = `${item.name} ${getAddress(item)} ${item.ciudad} ${item.tipo_soporte}`.toLowerCase();
    
    return (
      (!query || haystack.includes(query)) &&
      (availability === 'todos' || getDisponibilidad(item) === availability) &&
      (plaza === 'todas' || item.ciudad === plaza)
    );
  });
}

export function getInventoryStats() {
  return allInventory.reduce((stats, item) => {
    stats.total += 1;
    if (getDisponibilidad(item) === 'disponible') {
      stats.available += 1;
    } else {
      stats.reserved += 1;
    }
    return stats;
  }, { total: 0, available: 0, reserved: 0 });
}
