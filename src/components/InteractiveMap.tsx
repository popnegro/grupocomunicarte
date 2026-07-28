import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { DoohScreen } from "../types";
import { useCms } from "./CmsContext";

interface InteractiveMapProps {
  screens: DoohScreen[];
  selectedScreenId: string | null;
  onSelectScreen?: (id: string | null) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  screens,
  selectedScreenId,
  onSelectScreen,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const activeMarkersRef = useRef<L.Layer[]>([]);
  const activePolylinesRef = useRef<L.Layer[]>([]);
  const initialBoundsFitRef = useRef(false);
  const prevScreenIdsRef = useRef<string>("");
  const [currentZoom, setCurrentZoom] = useState(13);
  const { cart, toggleCart } = useCms();

  // Create custom SVG markers
  const createCustomIcon = (tipo: string, isInCart: boolean) => {
    // Colors matched to type
    const color =
      tipo === "Peatonal"
        ? "#0284c7" // Sky blue
        : tipo === "Vehicular"
        ? "#0d9488" // Teal
        : (tipo === "LeadMóvil" || tipo === "Móvil")
        ? "#f59e0b" // Amber / Orange
        : "#7c3aed"; // Violet
    const border = isInCart ? "#0f172a" : "#ffffff";
    const scale = isInCart ? 1.25 : 1.0;
    const ringColor = isInCart ? "rgba(15, 23, 42, 0.25)" : "rgba(0,0,0,0.1)";

    return L.divIcon({
      html: `
        <div style="transform: scale(${scale}); filter: drop-shadow(0px 3px 6px ${ringColor}); display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
          <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37258 18.6274 0 12 0Z" fill="${color}" stroke="${border}" stroke-width="2"/>
            <circle cx="12" cy="12" r="4.5" fill="${isInCart ? '#ffffff' : border}"/>
          </svg>
        </div>
      `,
      className: "custom-leaflet-pin",
      iconSize: [24, 32],
      iconAnchor: [12, 32],
      popupAnchor: [0, -32],
    });
  };

  // Create premium cluster marker with a glowing halo and dominant type indicator
  const createClusterIcon = (count: number, dominantTipo: string) => {
    const color =
      dominantTipo === "Peatonal"
        ? "#0284c7" // Sky
        : dominantTipo === "Vehicular"
        ? "#0d9488" // Teal
        : (dominantTipo === "LeadMóvil" || dominantTipo === "Móvil")
        ? "#f59e0b" // Amber/Orange
        : "#7c3aed"; // Purple

    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center rounded-full bg-slate-950 border-2 border-white shadow-lg text-white font-black text-xs cursor-pointer transition-transform hover:scale-110 duration-200" style="width: 38px; height: 38px;">
          <!-- Glowing outer ring -->
          <span class="absolute inset-0 rounded-full animate-pulse opacity-25 bg-slate-950" style="transform: scale(1.25); z-index: -1;"></span>
          <!-- Dynamic Type indicator mini dot -->
          <span class="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border border-white" style="background-color: ${color};"></span>
          <span>${count}</span>
        </div>
      `,
      className: "custom-leaflet-cluster",
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });
  };

  // Perform client-side cluster mapping based on zoom scale
  const getClusters = (activeScreens: DoohScreen[], zoom: number) => {
    // Zoom-scaled distance threshold in degrees
    const threshold = 0.006 * Math.pow(2, 13 - zoom);
    const clusters: {
      id: string;
      center: [number, number];
      screens: DoohScreen[];
    }[] = [];

    activeScreens.forEach((screen) => {
      let added = false;
      for (const cluster of clusters) {
        const dx = screen.lat - cluster.center[0];
        const dy = screen.lng - cluster.center[1];
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < threshold) {
          cluster.screens.push(screen);
          const count = cluster.screens.length;
          cluster.center[0] = (cluster.center[0] * (count - 1) + screen.lat) / count;
          cluster.center[1] = (cluster.center[1] * (count - 1) + screen.lng) / count;
          added = true;
          break;
        }
      }

      if (!added) {
        clusters.push({
          id: `cluster-${screen.id}`,
          center: [screen.lat, screen.lng],
          screens: [screen],
        });
      }
    });

    return clusters;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center on Mendoza coordinates of SEED_SCREENS (roughly -32.889, -68.845)
    const map = L.map(mapContainerRef.current, {
      center: [-32.89, -68.84],
      zoom: 13,
      zoomControl: true,
    });

    // Premium neutral light tile layer (CartoDB Positron) to match our B2B SaaS aesthetic
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }
    ).addTo(map);

    mapRef.current = map;

    // Set current zoom in react state to trigger cluster updates
    map.on("zoomend", () => {
      setCurrentZoom(map.getZoom());
    });

    // Handle popup open events to register click events for custom buttons inside popup
    map.on("popupopen", (e) => {
      const popupNode = e.popup.getElement();
      if (!popupNode) return;

      const buttons = popupNode.querySelectorAll(".popup-cart-btn");
      buttons.forEach((btn) => {
        const screenId = btn.getAttribute("data-screen-id");
        btn.addEventListener("click", () => {
          if (screenId) {
            toggleCart(screenId);
            map.closePopup();
          }
        });
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Markers when screens, cart, or currentZoom change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers and polylines
    activeMarkersRef.current.forEach((layer) => layer.remove());
    activeMarkersRef.current = [];
    markersRef.current = {};
    activePolylinesRef.current.forEach((layer) => layer.remove());
    activePolylinesRef.current = [];

    // Filter to active screens only
    const activeScreens = screens.filter((s) => s.status === "Activo");

    // Draw route polylines and stop markers for LeadMóvil or Móvil screens
    activeScreens.forEach((screen) => {
      if ((screen.tipo === "LeadMóvil" || screen.tipo === "Móvil") && screen.ruta && screen.ruta.length > 0) {
        const pathCoords = screen.ruta.map(r => L.latLng(r.lat, r.lng));
        const polyline = L.polyline(pathCoords, {
          color: "#f59e0b",
          weight: 4,
          opacity: 0.85,
          dashArray: "6, 12"
        }).addTo(map);
        activePolylinesRef.current.push(polyline);

        // Draw individual stops
        screen.ruta.forEach((stop, index) => {
          const isFirstOrLast = index === 0 || index === screen.ruta!.length - 1;
          const stopMarker = L.circleMarker([stop.lat, stop.lng], {
            radius: isFirstOrLast ? 7 : 5,
            fillColor: isFirstOrLast ? "#f59e0b" : "#ffffff",
            color: "#f59e0b",
            weight: 2.5,
            fillOpacity: 1,
          }).addTo(map)
          .bindPopup(`
            <div class="font-sans p-1 text-slate-800">
              <span class="text-[9px] font-bold text-amber-500 uppercase block mb-0.5">Parada ${index + 1} (${screen.nombre})</span>
              <span class="font-bold text-xs text-slate-900">${stop.nombre}</span>
              <span class="text-[10px] text-slate-500 block mt-0.5">${stop.lat.toFixed(4)}, ${stop.lng.toFixed(4)}</span>
            </div>
          `, { closeButton: false });
          activePolylinesRef.current.push(stopMarker);
        });
      }
    });

    // Compute screen clusters for the current zoom level
    const clusters = getClusters(activeScreens, currentZoom);

    // Track if filters have changed to pan the map
    const screenIdsStr = activeScreens.map((s) => s.id).sort().join(",");
    const filtersChanged = screenIdsStr !== prevScreenIdsRef.current;

    // Auto fit bounds on initial load or when filters change
    if ((!initialBoundsFitRef.current || filtersChanged) && activeScreens.length > 0) {
      const latLngs = activeScreens.map((s) => L.latLng(s.lat, s.lng));
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds.pad(0.15));
      initialBoundsFitRef.current = true;
      prevScreenIdsRef.current = screenIdsStr;
    }

    // Add new markers / clusters
    clusters.forEach((cluster) => {
      if (cluster.screens.length === 1) {
        const screen = cluster.screens[0];
        const isInCart = cart.includes(screen.id);
        const icon = createCustomIcon(screen.tipo, isInCart);

        const formattedImpacts =
          screen.impactos >= 1000
            ? (screen.impactos / 1000).toFixed(1) + "k"
            : String(screen.impactos);

        const popupHtml = `
          <div class="p-2 font-sans text-slate-800 max-w-[200px]">
            <span class="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">${screen.tipo}</span>
            <h4 class="text-xs font-black text-slate-950 mb-1 leading-tight">${screen.nombre}</h4>
            <p class="text-[11px] text-slate-500 mb-2">${screen.zona}</p>
            
            <div class="grid grid-cols-2 gap-1.5 bg-slate-50 border border-slate-100 p-1.5 rounded-lg mb-2.5 text-center">
              <div>
                <span class="text-[8px] font-bold text-slate-400 uppercase block">Impactos</span>
                <span class="text-[10px] font-bold text-slate-700">${formattedImpacts}/día</span>
              </div>
              <div>
                <span class="text-[8px] font-bold text-slate-400 uppercase block">Precio/Sem</span>
                <span class="text-[10px] font-bold text-slate-700">${screen.precio === 0 ? "Consultar" : `$${screen.precio.toLocaleString()}`}</span>
              </div>
            </div>

            <button 
              data-screen-id="${screen.id}" 
              class="popup-cart-btn w-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] py-1.5 px-2.5 rounded-md transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>${isInCart ? "Quitar de Cotización" : "Agregar a Cotización"}</span>
            </button>
          </div>
        `;

        const marker = L.marker([screen.lat, screen.lng], { icon })
          .addTo(map)
          .bindPopup(popupHtml, {
            closeButton: false,
            minWidth: 160,
          });

        // Handle marker selection / focus callback
        marker.on("click", () => {
          if (onSelectScreen) {
            onSelectScreen(screen.id);
          }
        });

        markersRef.current[screen.id] = marker;
        activeMarkersRef.current.push(marker);
      } else {
        // Find dominant type inside this cluster to style the dot accent
        const typeCounts = cluster.screens.reduce((acc, curr) => {
          acc[curr.tipo] = (acc[curr.tipo] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        let dominantTipo = "Peatonal";
        let maxCount = 0;
        Object.keys(typeCounts).forEach((tipo) => {
          if (typeCounts[tipo] > maxCount) {
            maxCount = typeCounts[tipo];
            dominantTipo = tipo;
          }
        });

        const icon = createClusterIcon(cluster.screens.length, dominantTipo);
        const clusterMarker = L.marker(cluster.center, { icon }).addTo(map);

        // Click interaction: Fit bounds or list identical overlapping screens
        clusterMarker.on("click", () => {
          if (map.getZoom() >= 17) {
            // Render beautiful catalog list in a popup at high zoom
            let listHtml = `
              <div class="p-2.5 font-sans text-slate-800 max-w-[240px] space-y-2">
                <div class="border-b border-slate-100 pb-1.5">
                  <span class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide block">Grupo de Pantallas (${cluster.screens.length})</span>
                  <h4 class="text-xs font-black text-slate-900">${cluster.screens[0].zona}</h4>
                </div>
                <div class="max-h-[160px] overflow-y-auto space-y-1.5 pr-1" style="scrollbar-width: thin;">
            `;

            cluster.screens.forEach((screen) => {
              const isInCart = cart.includes(screen.id);
              listHtml += `
                <div class="flex items-center justify-between gap-2.5 p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <div class="min-w-0">
                    <span class="text-[10px] font-bold text-slate-900 block truncate">${screen.nombre}</span>
                    <span class="text-[8px] font-bold text-slate-400 uppercase block">${screen.tipo} • ${screen.precio === 0 ? "Consultar" : `$${screen.precio.toLocaleString()}/s`}</span>
                  </div>
                  <button 
                    data-screen-id="${screen.id}" 
                    class="popup-cart-btn px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-white font-bold text-[8px] uppercase rounded-md shrink-0 cursor-pointer"
                  >
                    ${isInCart ? "Quitar" : "Agregar"}
                  </button>
                </div>
              `;
            });

            listHtml += `
                </div>
              </div>
            `;

            L.popup({ minWidth: 200 })
              .setLatLng(cluster.center)
              .setContent(listHtml)
              .openOn(map);
          } else {
            const latLngs = cluster.screens.map((s) => L.latLng(s.lat, s.lng));
            const bounds = L.latLngBounds(latLngs);
            map.fitBounds(bounds.pad(0.25));
          }
        });

        activeMarkersRef.current.push(clusterMarker);
      }
    });
  }, [screens, cart, currentZoom]);

  // Focus on selected screen
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedScreenId) return;

    const targetScreen = screens.find((s) => s.id === selectedScreenId);
    if (targetScreen) {
      // Zoom map in so clusters break up and reveal individual marker
      map.setView([targetScreen.lat, targetScreen.lng], 16, { animate: true, duration: 1 });
      
      // Open the target marker popup after the zoom transition
      setTimeout(() => {
        const marker = markersRef.current[selectedScreenId];
        if (marker) {
          marker.openPopup();
        }
      }, 400);
    }
  }, [selectedScreenId]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px]" style={{ zIndex: 1 }} />
      
      {/* Mini Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-md border border-slate-100 rounded-lg p-2 shadow-sm text-[10px] flex flex-col gap-1 text-slate-600">
        <span className="font-bold text-slate-800 uppercase tracking-wider mb-1 block">Referencias</span>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          <span>Peatonal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-teal-500" />
          <span>Vehicular</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-purple-500" />
          <span>Mixto</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Móvil</span>
        </div>
      </div>
    </div>
  );
};
