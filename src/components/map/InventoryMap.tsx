import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, CircleMarker, Tooltip, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import { LocationRecord, MobileRoute, InventoryItem, getDisponibilidad } from '../../types';
import { LocationDetail } from './LocationDetail';
import { MapPin, X } from 'lucide-react';
import { getIcon } from '../../lib/map-icons';
import { useSelection } from '../../context/SelectionContext';

interface InventoryMapProps {
  locations: LocationRecord[];
  routes: MobileRoute[];
  onOpenMediakit: () => void;
}

function MapUpdater({ locations, routes }: { locations: LocationRecord[], routes: MobileRoute[] }) {
  const map = useMap();

  useEffect(() => {
    const validLocations = locations.filter(loc => loc.lat !== null && loc.lng !== null);

    if (validLocations.length === 0 && routes.length === 0) return;

    const bounds = L.latLngBounds([]);

    validLocations.forEach(loc => {
      if (loc.lat && loc.lng) {
        bounds.extend([loc.lat, loc.lng]);
      }
    });

    routes.forEach(route => {
      if (route.routePath && route.routePath.length > 0) {
        route.routePath.forEach(point => bounds.extend(point as [number, number]));
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [locations, routes, map]);

  return null;
}

export default function InventoryMap({ locations, routes, onOpenMediakit }: InventoryMapProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { isSelected } = useSelection();

  const handleSelect = (item: InventoryItem) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  const validLocations = locations.filter(loc => loc.lat !== null && loc.lng !== null);

  return (
    <div className="relative w-full h-full bg-gray-100 z-0">
      <MapContainer
        center={[-34.6037, -58.3816]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {validLocations.map((loc) => (
          <Marker
            key={loc.canonical_id}
            position={[loc.lat!, loc.lng!]}
            icon={getIcon(loc.tipo_soporte, {
              isActive: selectedItem?.canonical_id === loc.canonical_id,
              isReservado: getDisponibilidad(loc) === 'reservado',
              isSelected: isSelected(loc.canonical_id),
            })}
            eventHandlers={{
              click: () => handleSelect(loc),
            }}
          />
        ))}

        {routes.map((route) => (
          <LayerGroup key={route.canonical_id}>
            <Polyline
              positions={route.routePath as [number, number][]}
              color="#E53935"
              weight={4}
              opacity={0.8}
              dashArray="10, 10"
              eventHandlers={{
                click: () => handleSelect(route),
              }}
            />
            {route.waypoints?.map((wp, idx) => {
              if (wp.lat === null || wp.lng === null) return null;
              return (
                <CircleMarker
                  key={'wp-' + idx}
                  center={[wp.lat, wp.lng]}
                  radius={6}
                  pathOptions={{
                    color: 'white',
                    weight: 2,
                    fillColor: '#E53935',
                    fillOpacity: 1,
                  }}
                  eventHandlers={{
                    click: () => handleSelect(route),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={1} className="font-semibold shadow-lg rounded-md text-sm border-0 bg-white px-2 py-1">
                    {wp.name}
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </LayerGroup>
        ))}

        <MapUpdater locations={locations} routes={routes} />
      </MapContainer>

      {/* Mobile/Desktop Detail Panel Overlay */}
      {selectedItem && (
        <div className="absolute bottom-0 left-0 right-0 md:bottom-auto md:top-4 md:left-auto md:right-4 md:w-[400px] bg-white rounded-t-3xl md:rounded-2xl shadow-2xl md:shadow-xl z-[1000] md:border border-gray-100 overflow-hidden flex flex-col max-h-[75vh] md:max-h-[85vh] transition-transform">

          <div className="p-4 bg-white md:bg-gray-50 flex justify-between items-center border-b border-gray-100 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Detalle de Soporte</span>
            <button
              onClick={handleCloseDetail}
              className="p-1.5 bg-gray-50 md:bg-white rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition-colors shadow-sm"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 md:p-6 overflow-y-auto">
            <LocationDetail
              item={selectedItem}
              onOpenMediakit={() => {
                setSelectedItem(null);
                onOpenMediakit();
              }}
            />
          </div>
        </div>
      )}

      {/* Legend / Status for Empty or Pending */}
      {validLocations.length === 0 && routes.length === 0 && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[500] flex items-center justify-center p-4">
           <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-sm text-center">
              <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">No hay soportes para mostrar</h3>
              <p className="text-sm text-gray-500">Ajustá los filtros para ver el inventario disponible en el mapa.</p>
           </div>
        </div>
      )}
    </div>
  );
}
