import type { MediaKitRequest } from '../types';

export interface MediaKitRepository {
  create(request: MediaKitRequest): Promise<MediaKitRequest>;
  list(): Promise<MediaKitRequest[]>;
}

/** Persistence boundary. Replace the adapter when the backend is connected. */
export const mediaKitRepository: MediaKitRepository = {
  async create(request) {
    throw new Error(`Media Kit persistence is not configured for ${request.id}.`);
  },
  async list() {
    return [];
  },
};
