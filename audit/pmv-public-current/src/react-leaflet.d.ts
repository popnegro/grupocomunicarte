declare module 'react-leaflet' {
  import type { ComponentType } from 'react';

  export const MapContainer: ComponentType<any>;
  export const TileLayer: ComponentType<any>;
  export const Marker: ComponentType<any>;
  export const Polyline: ComponentType<any>;
  export const CircleMarker: ComponentType<any>;
  export const Tooltip: ComponentType<any>;
  export const LayerGroup: ComponentType<any>;
  export function useMap(): any;
}
