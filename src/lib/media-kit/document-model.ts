import type { InventoryItem, MediaKitRequest } from '../../types';
import { isMobileRoute } from '../../types';

export type MediaKitDocumentModel = {
  requestId: string;
  issuedAt: string;
  campaign: { start: string; end: string };
  contact: { name: string; company: string; email: string; phone: string };
  notes: string;
  supports: Array<{ id: string; name: string; city: string; address: string; type: string; images: string[] }>;
};

export function createMediaKitDocumentModel(request: MediaKitRequest, supports: InventoryItem[]): MediaKitDocumentModel {
  return {
    requestId: request.id,
    issuedAt: request.createdAt,
    campaign: { start: request.campaignStart, end: request.campaignEnd },
    contact: { name: request.name, company: request.company ?? '', email: request.email, phone: request.phone ?? '' },
    notes: request.message ?? '',
    supports: supports.map((support) => ({
      id: support.canonical_id,
      name: support.name,
      city: support.ciudad === 'mendoza' ? 'Mendoza' : 'Buenos Aires',
      address: isMobileRoute(support) ? (support.waypoints[0]?.name ?? 'Ruta móvil') : support.address,
      type: support.tipo_soporte,
      images: support.imageUrls ?? [],
    })),
  };
}
