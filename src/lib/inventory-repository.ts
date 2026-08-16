import type { Disponibilidad, InventoryItem } from '../types';
import { getInventoryItem, getInventoryStats, listInventory, type InventoryFilters } from './inventory';

/**
 * Persistence boundary for inventory administration.
 * The current adapter is read-only; a backend can replace it without changing UI consumers.
 */
export interface InventoryRepository {
  list(filters?: InventoryFilters): Promise<InventoryItem[]>;
  get(canonicalId: string): Promise<InventoryItem | undefined>;
  stats(): Promise<ReturnType<typeof getInventoryStats>>;
  updateAvailability(canonicalId: string, availability: Disponibilidad): Promise<InventoryItem>;
}

export const inventoryRepository: InventoryRepository = {
  async list(filters) {
    return listInventory(filters);
  },
  async get(canonicalId) {
    return getInventoryItem(canonicalId);
  },
  async stats() {
    return getInventoryStats();
  },
  async updateAvailability(canonicalId, availability) {
    throw new Error(`Inventory persistence is not configured for ${canonicalId} (${availability}).`);
  },
};
