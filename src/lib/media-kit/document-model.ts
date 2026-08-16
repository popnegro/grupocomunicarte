import type { InventoryItem } from '../../types';
import type { MediaKitRequest } from '../media-kit-repository';

export type MediaKitDocumentModel = {
  requestId: string;
  issuedAt: string;
  campaign: { start: string; end: string };
  contact: { name: string; company: string; email: string; phone: string };
  notes: string;
  supports: Array<{
    id: string;
    name: string;
    city: string;
    address: string;
    type: string;
    images: string[];
  }>;
};

export function createMediaKitDocumentModel(request: MediaKitRequest, supports: InventoryItem[]): MediaKitDocumentModel {
  return {
    requestId: request.id,
    issuedAt: request.createdAt,
    campaign: { start: request.campaignStart, end: request.campaignEnd },
    contact: request.contact,
    notes: request.notes,
    supports: supports.map((support) => ({
      id: support.canonical_id,
      name: support.name,
      city: support.ciudad === 'mendoza' ? 'Mendoza' : 'Buenos Aires',
      address: support.address || 'Ubicación no especificada',
      type: support.tipo_soporte,
      images: support.images ?? [],
    })),
  };
}
