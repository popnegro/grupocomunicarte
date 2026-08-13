import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Support } from '../types';
import { MapPin, Navigation } from 'lucide-react';

interface InteractiveMapProps {
  onOpenSpecs?: (support: Support) => void;
  filteredSupportsList?: Support[];
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ onOpenSpecs, filteredSupportsList }) => {
  const { 
    supports, currentPlaza, currentType, currentStatus, searchQuery,
    selectedSupports, activeSupportId, setActiveSupportId 
  } = useApp();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute filtered supports if not provided as prop
  const filteredSupports = filteredSupportsList || supports.filter(s => {
    const matchesPlaza = currentPlaza === 'Todas' || s.plaza === currentPlaza;
    const matchesType = currentType === 'Todos' || s.type === currentType;
    const matchesStatus = currentStatus === 'Todos' || s.status === currentStatus;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      s.name.toLowerCase().includes(query) ||
      s.address.toLowerCase().includes(query) ||
      s.plaza.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.id.toLowerCase().includes(query);

    return matchesPlaza && matchesType && matchesStatus && matchesSearch;
  });

  const activePin = filteredSupports.find(s => s.id === activeSupportId) || null;

  const handleSelectSupport = (support: Support) => {
    setActiveSupportId(support.id);
    if (onOpenSpecs) {
      onOpenSpecs(support);
    }
  };

  // Localized Map Viewport Boundaries based on our geolocations
  const MENDOZA_BOUNDS = {
    minLat: -32.925,
    maxLat: -32.880,
    minLng: -68.875,
    maxLng: -68.815
  };

  const BA_BOUNDS = {
    minLat: -34.630,
    maxLat: -34.480,
    minLng: -58.540,
    maxLng: -58.350
  };

  const getBounds = () => {
    return currentPlaza === 'Mendoza' ? MENDOZA_BOUNDS : BA_BOUNDS;
  };

  // Convert GPS Coordinates to Canvas Percentages
  const gpsToPercent = (lat: number, lng: number) => {
    const bounds = getBounds();
    const latSpan = bounds.maxLat - bounds.minLat;
    const lngSpan = bounds.maxLng - bounds.minLng;

    const y = 100 - (((lat - bounds.minLat) / latSpan) * 100);
    const x = ((lng - bounds.minLng) / lngSpan) * 100;

    return {
      x: Math.max(6, Math.min(94, x)),
      y: Math.max(6, Math.min(94, y))
    };
  };

  // Redraw path routes for moving screens on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw coordinate gridlines on light canvas
    ctx.strokeStyle = '#DCE4DF';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < rect.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, rect.height);
      ctx.stroke();
    }
    for (let j = 0; j < rect.height; j += 40) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(rect.width, j);
      ctx.stroke();
    }

    // Draw routes for LED Móvil in Brand Green #049A41
    filteredSupports.forEach(support => {
      if (support.type === 'LED Móvil' && support.routePoints && support.routePoints.length > 1) {
        ctx.beginPath();
        support.routePoints.forEach((point, idx) => {
          const pos = gpsToPercent(point.lat, point.lng);
          const pxX = (pos.x / 100) * rect.width;
          const pxY = (pos.y / 100) * rect.height;

          if (idx === 0) {
            ctx.moveTo(pxX, pxY);
          } else {
            ctx.lineTo(pxX, pxY);
          }
        });

        ctx.strokeStyle = '#049A41';
        ctx.lineWidth = 3.5;
        ctx.lineJoin = 'round';
        ctx.stroke();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  }, [filteredSupports, currentPlaza]);

  return (
    <div className="w-full h-[520px] lg:h-[620px] bg-[#F7F9F7] border border-[#DCE4DF] rounded-2xl overflow-hidden shadow-xs relative select-none" id="interactive-map">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Informative overlay corner */}
      <div className="absolute top-3 left-3 bg-white/95 text-[#082028] text-[10px] font-bold px-3 py-1.5 rounded-xl border border-[#DCE4DF] flex items-center gap-2 shadow-xs backdrop-blur-xs z-20">
        <Navigation className="w-3.5 h-3.5 text-[#7C3AED]" />
        <span>Vista Territorial Satelital: <strong className="text-[#7C3AED]">{currentPlaza}</strong></span>
      </div>

      {/* Render Map Pin Buttons */}
      {filteredSupports.map(s => {
        const pct = gpsToPercent(s.latitude, s.longitude);
        const isSelected = selectedSupports.some(sel => sel.id === s.id);
        const isActive = activePin?.id === s.id;

        return (
          <button
            key={s.id}
            onClick={() => handleSelectSupport(s)}
            style={{ left: `${pct.x}%`, top: `${pct.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
          >
            <div className="relative group">
              {/* Core Pin PinPoint */}
              <div className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 transition-all ${
                isActive
                  ? 'bg-[#082028] text-white border-white scale-125 z-20 shadow-lg'
                  : isSelected
                    ? 'bg-[#7C3AED] text-white border-white scale-110'
                    : 'bg-white text-[#082028] border-[#7C3AED] hover:bg-purple-50'
              }`}>
                <MapPin className="w-4 h-4" />
              </div>

              {/* Micro Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 bg-[#082028] text-white text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-30">
                {s.name}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};


