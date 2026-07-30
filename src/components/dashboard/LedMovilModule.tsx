import React, { useState } from "react";
import { LedVehicle } from "./types";
import { 
  Radio, 
  MapPin, 
  Battery, 
  Clock, 
  Plus, 
  Trash2, 
  Sparkles, 
  Navigation, 
  Check, 
  ArrowUp, 
  ArrowDown,
  X,
  Smartphone,
  CheckCircle,
  Tv
} from "lucide-react";

interface LedMovilModuleProps {
  vehicles: LedVehicle[];
  onUpdateVehicle: (id: string, data: Partial<LedVehicle>) => void;
  onAddVehicle: (vh: LedVehicle) => void;
}

interface Stop {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
}

export const LedMovilModule: React.FC<LedMovilModuleProps> = ({
  vehicles,
  onUpdateVehicle,
  onAddVehicle,
}) => {
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(vehicles[0]?.id || null);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Stop editor form
  const [stopNombre, setStopNombre] = useState("");
  const [stopLat, setStopLat] = useState(-32.8950);
  const [stopLng, setStopLng] = useState(-68.8480);

  // Initial mockup stops for Mendoza Express
  const [routeStops, setRouteStops] = useState<Stop[]>([
    { id: "st-1", nombre: "Plaza Independencia (Inicio)", lat: -32.8894, lng: -68.8458 },
    { id: "st-2", nombre: "Arístides Villanueva Zona Bares", lat: -32.8940, lng: -68.8510 },
    { id: "st-3", nombre: "Palmares Open Mall", lat: -32.9560, lng: -68.8590 },
    { id: "st-4", nombre: "Nudo Vial Acceso Este", lat: -32.8930, lng: -68.8250 }
  ]);

  // Form for new vehicle
  const [newVehicleForm, setNewVehicleForm] = useState({
    patente: "",
    chofer: "",
    rutaActiva: "Circuito Centro Comercial"
  });

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stopNombre) return;

    const newStop: Stop = {
      id: `stop-${Date.now()}`,
      nombre: stopNombre,
      lat: Number(stopLat),
      lng: Number(stopLng),
    };

    setRouteStops((prev) => [...prev, newStop]);
    setStopNombre("");
    triggerToast(`Parada "${stopNombre}" agregada al recorrido.`);
  };

  const handleRemoveStop = (id: string) => {
    setRouteStops((prev) => prev.filter((s) => s.id !== id));
    triggerToast("Parada eliminada de la ruta.");
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicleForm.patente || !newVehicleForm.chofer) return;

    const newVh: LedVehicle = {
      id: `vh-new-${Date.now()}`,
      patente: newVehicleForm.patente,
      chofer: newVehicleForm.chofer,
      rutaActiva: newVehicleForm.rutaActiva,
      bateria: "100%",
      velocidad: "0 km/h",
      gpsStatus: "Online",
      estado: "Disponible",
    };

    onAddVehicle(newVh);
    setShowAddVehicleModal(false);
    setNewVehicleForm({ patente: "", chofer: "", rutaActiva: "Circuito Centro Comercial" });
    triggerToast("Nueva unidad LED Móvil registrada con éxito.");
  };

  return (
    <div className="flex flex-col lg:flex-row h-full font-sans max-w-7xl mx-auto items-stretch relative">
      
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-bold py-3 px-5 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>{showToast}</span>
        </div>
      )}

      {/* 1. Left Sidebar: Vehicles Fleet */}
      <div className="w-full lg:w-72 border-r border-stone-200/80 bg-stone-50/50 flex flex-col justify-between overflow-y-auto shrink-0 p-5 space-y-4">
        
        <div className="space-y-4">
          <div className="text-left flex items-center justify-between">
            <div>
              <span className="text-[8px] bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
                Soporte Dinámico
              </span>
              <h3 className="text-xs font-black text-stone-900 font-display mt-1.5 uppercase tracking-wider">
                Flota LED Móvil
              </h3>
            </div>

            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="p-1.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-stone-700 cursor-pointer shadow-2xs"
              title="Registrar Unidad"
            >
              <Plus className="h-3.5 w-3.5 text-[#06434a]" />
            </button>
          </div>

          <div className="border-t border-stone-200/60 pt-3 space-y-2">
            {vehicles.map((vh) => {
              const isActive = vh.id === activeVehicleId;
              return (
                <div
                  key={vh.id}
                  onClick={() => setActiveVehicleId(vh.id)}
                  className={`p-3.5 rounded-xl cursor-pointer text-left transition-all flex flex-col justify-between gap-1.5 border ${
                    isActive 
                      ? "bg-white border-[#06434a] ring-1 ring-[#06434a]/15 shadow-2xs" 
                      : "bg-transparent border-transparent hover:bg-stone-100/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-black text-stone-850 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md leading-none">
                      {vh.patente}
                    </span>
                    <span className={`text-[7px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                      vh.estado === "En ruta"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse"
                        : vh.estado === "Disponible"
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : "bg-stone-100 text-stone-600"
                    }`}>
                      {vh.estado}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold text-stone-900 truncate font-display">
                      Chofer: {vh.chofer}
                    </h4>
                    <p className="text-[9px] text-stone-400 font-semibold truncate">
                      {vh.rutaActiva}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-stone-500 font-bold border-t border-stone-100/60 pt-1.5 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Battery className="h-3 w-3 text-emerald-600" />
                      <span>{vh.bateria}</span>
                    </span>
                    <span className="font-mono">{vh.velocidad}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. Main Area: Map Stop Route Planner */}
      <div className="flex-1 overflow-y-auto p-8 bg-white flex flex-col items-stretch">
        {activeVehicle ? (
          <div className="space-y-6 text-left max-w-4xl mx-auto w-full">
            
            {/* Main Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-stone-200 pb-5 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                    GPS: {activeVehicle.gpsStatus}
                  </span>
                  <span className="text-[9px] text-stone-400 font-mono font-bold">
                    ID Unidad: {activeVehicle.id}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900 font-display mt-2 flex items-center gap-2">
                  <Tv className="h-5 w-5 text-[#06434a]" />
                  <span>Unidad LED Móvil {activeVehicle.patente}</span>
                </h2>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                  Operador a cargo: <strong className="text-stone-800 font-bold">{activeVehicle.chofer}</strong> • Ruta asignada: {activeVehicle.rutaActiva}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {activeVehicle.estado !== "En ruta" ? (
                  <button
                    onClick={() => {
                      onUpdateVehicle(activeVehicle.id, { estado: "En ruta", velocidad: "25 km/h" });
                      triggerToast("Unidad iniciada en ruta comercial.");
                    }}
                    className="bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase px-4 py-2 rounded-full flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                  >
                    <Navigation className="h-3.5 w-3.5 animate-spin" />
                    <span>Iniciar Recorrido</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onUpdateVehicle(activeVehicle.id, { estado: "Disponible", velocidad: "0 km/h" });
                      triggerToast("Recorrido comercial pausado.");
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-extrabold uppercase px-4 py-2 rounded-full flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                  >
                    <span>Detener Unidad</span>
                  </button>
                )}
              </div>
            </div>

            {/* GPS Metrics simulation */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-stone-50 border border-stone-200/80 p-4 rounded-xl">
              <div className="text-left space-y-0.5">
                <span className="block text-[8px] font-bold text-stone-400 uppercase">Velocidad Actual</span>
                <span className="text-xs font-black text-stone-800 font-mono block">
                  {activeVehicle.velocidad}
                </span>
              </div>

              <div className="text-left space-y-0.5">
                <span className="block text-[8px] font-bold text-stone-400 uppercase">Batería LED</span>
                <span className="text-xs font-black text-stone-800 font-mono block">
                  {activeVehicle.bateria}
                </span>
              </div>

              <div className="text-left space-y-0.5">
                <span className="block text-[8px] font-bold text-stone-400 uppercase">Señal Satelital</span>
                <span className="text-xs font-black text-emerald-600 font-mono block">
                  Excelente (98%)
                </span>
              </div>

              <div className="text-left space-y-0.5">
                <span className="block text-[8px] font-bold text-stone-400 uppercase">Tránsito Circundante</span>
                <span className="text-xs font-black text-stone-800 font-mono block">
                  Moderado
                </span>
              </div>
            </div>

            {/* Stop list and planning form */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
              
              {/* Route stop list */}
              <div className="md:col-span-7 space-y-4">
                <h4 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider font-mono">
                  Secuencia de Paradas Registradas
                </h4>

                <div className="space-y-3.5 pl-3 border-l-2 border-stone-200">
                  {routeStops.map((stop, index) => (
                    <div
                      key={stop.id}
                      className="relative p-3.5 bg-white border border-stone-200 rounded-xl hover:border-stone-300 transition-all shadow-2xs flex items-center justify-between"
                    >
                      <span className="absolute left-[-21px] top-1/2 -translate-y-1/2 h-4 w-4 bg-[#06434a] border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-extrabold font-mono">
                        {index + 1}
                      </span>

                      <div className="text-left pl-2">
                        <h5 className="text-[11px] font-bold text-stone-900 leading-none">
                          {stop.nombre}
                        </h5>
                        <span className="text-[9px] text-stone-400 font-mono font-medium block mt-1">
                          Coordenadas: {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemoveStop(stop.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg cursor-pointer transition-colors shrink-0"
                        title="Remover Parada"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  {routeStops.length === 0 && (
                    <p className="text-[10px] text-stone-400 text-left py-4">No hay paradas asignadas a esta ruta comercial.</p>
                  )}
                </div>
              </div>

              {/* Stop creator form */}
              <div className="md:col-span-5 bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-4">
                <h4 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider font-mono">
                  Planificar Nueva Parada
                </h4>

                <form onSubmit={handleAddStop} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-bold text-stone-400 uppercase">Nombre del Hito comercial</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Entrada Shopping"
                      value={stopNombre}
                      onChange={(e) => setStopNombre(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[8px] font-bold text-stone-400 uppercase">Latitud</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={stopLat}
                        onChange={(e) => setStopLat(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[8px] font-bold text-stone-400 uppercase">Longitud</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={stopLng}
                        onChange={(e) => setStopLng(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase py-2 rounded-lg cursor-pointer transition-colors shadow-2xs"
                  >
                    Agregar Parada GPS
                  </button>
                </form>

                <div className="p-3 bg-white rounded-xl border border-stone-150 text-[10px] text-stone-500 leading-relaxed text-left">
                  🌐 <strong>Instrucciones:</strong> El vehiculo recalculará la ruta GPS automáticamente optimizando la velocidad para cumplir con las paradas del circuito programado.
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="py-24 text-center text-stone-400 text-xs">
            <Radio className="h-10 w-10 mx-auto text-stone-300 mb-2 animate-pulse" />
            <span>Seleccione una unidad LED Móvil de la flota para planificar.</span>
          </div>
        )}
      </div>

      {/* Register vehicle modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-150 p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl space-y-6 text-left animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-sm font-black text-stone-950 font-display uppercase tracking-wider">
                Registrar Unidad LED Móvil
              </h3>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                className="p-1.5 hover:bg-stone-50 rounded-xl text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Patente / Dominio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: AB-123-CD"
                  value={newVehicleForm.patente}
                  onChange={(e) => setNewVehicleForm({ ...newVehicleForm, patente: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Chofer a cargo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Juan Gómez"
                  value={newVehicleForm.chofer}
                  onChange={(e) => setNewVehicleForm({ ...newVehicleForm, chofer: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Circuito de Ruta Comercial</label>
                <input
                  type="text"
                  value={newVehicleForm.rutaActiva}
                  onChange={(e) => setNewVehicleForm({ ...newVehicleForm, rutaActiva: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none"
                />
              </div>

              <div className="border-t border-stone-100 pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 font-bold uppercase text-[10px] rounded-full hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#06434a] hover:bg-[#0b5e67] text-white font-extrabold uppercase text-[10px] rounded-full cursor-pointer shadow-sm"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
