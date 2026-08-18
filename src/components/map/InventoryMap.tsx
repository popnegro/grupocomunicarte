import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { InventoryItem } from '../../context/SelectionContext';
import { useSelection } from '../../context/SelectionContext';
import 'leaflet/dist/leaflet.css';

function FitBounds({ items }: { items: InventoryItem[] }) {
  const map = useMap();
  useEffect(() => {
    if (!items.length) return;
    const valid = items.filter(item => Number.isFinite(item.lat) && Number.isFinite(item.lng));
    if (!valid.length) return;
    map.fitBounds(valid.map(item => [item.lat, item.lng] as [number, number]), { padding: [40, 40], maxZoom: 14 });
  }, [items, map]);
  return null;
}

export default function InventoryMap({ items, onSelect }: { items: InventoryItem[]; onSelect: (item: InventoryItem) => void }) {
  const { isSelected } = useSelection();
  return (
    <div className="h-full w-full min-h-[420px] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
      <MapContainer center={[-32.89, -68.84]} zoom={11} scrollWheelZoom className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds items={items} />
        {items.map(item => (
          <CircleMarker
            key={item.canonical_id}
            center={[item.lat, item.lng]}
            radius={isSelected(item.canonical_id) ? 10 : 7}
            pathOptions={{ color: isSelected(item.canonical_id) ? '#000' : '#e53935', fillColor: '#e53935', fillOpacity: 0.9, weight: 2 }}
            eventHandlers={{ click: () => onSelect(item) }}
          >
            <Tooltip direction="top" offset={[0, -6]}>{item.name}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
