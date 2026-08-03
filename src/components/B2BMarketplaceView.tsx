import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Check, X, Calendar, ArrowRight, Sparkles, Receipt, Percent, Tag, User, Mail, Building, ShieldCheck, Download, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useCms } from "./CmsContext";

export const B2BMarketplaceView: React.FC = () => {
  const { screens, cart, toggleCart, clearCart, addLead } = useCms();
  const [selectedZone, setSelectedZone] = useState<string>("Todas");
  const [selectedType, setSelectedType] = useState<string>("Todos");
  const [weeks, setWeeks] = useState<number>(4);
  const [startDate, setStartDate] = useState<string>("");

  // Reservation form
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientCompany, setClientCompany] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const zones = ["Todas", "Centro", "Palmares", "Las Heras", "Ciudad", "Guaymallén", "Maipú", "Godoy Cruz", "Luján"];
  const types = ["Todos", "Peatonal", "Vehicular", "Mixto", "Móvil"];

  // Filters screens
  const filteredScreens = screens.filter((screen) => {
    const zoneMatch = selectedZone === "Todas" || screen.zona === selectedZone;
    const typeMatch = selectedType === "Todos" || screen.tipo === selectedType;
    return zoneMatch && typeMatch;
  });

  // Calculations
  const cartScreens = screens.filter((s) => cart.includes(s.id));
  const subtotalPerWeek = cartScreens.reduce((acc, s) => acc + s.precio, 0);
  const rawTotal = subtotalPerWeek * weeks;

  // Progressive discount: 1 week = 0%, 2-3 weeks = 5%, 4+ weeks = 10%
  let discountPercent = 0;
  if (weeks >= 4) discountPercent = 10;
  else if (weeks >= 2) discountPercent = 5;

  const discountAmount = Math.round((rawTotal * discountPercent) / 100);
  const finalTotal = rawTotal - discountAmount;
  const totalImpacts = cartScreens.reduce((acc, s) => acc + s.impactos, 0) * weeks;

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg("Debes agregar al menos una pantalla al carrito para solicitar reserva.");
      return;
    }
    if (!clientName || !clientEmail || !clientCompany || !startDate) {
      setErrorMsg("Completa todos los campos obligatorios.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      // Add lead into our real CRM context database
      await addLead({
        name: clientName,
        email: clientEmail,
        company: clientCompany,
        source: `B2B Reserva (${cart.length} Pantallas)`,
        status: "new",
        value: finalTotal
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("No se pudo registrar la reserva. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    clearCart();
    setClientName("");
    setClientEmail("");
    setClientCompany("");
    setStartDate("");
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Upper Title Panel */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full uppercase tracking-wider">
            Portal Agencia & B2B
          </span>
          <h2 className="text-xl font-black tracking-tight">Marketplace de Espacios OOH</h2>
          <p className="text-xs text-slate-400">
            Reserva tus pantallas LED digitales directo de inventario en Mendoza con cotización transparente y descuentos progresivos.
          </p>
        </div>
        <ShoppingBag className="h-10 w-10 text-slate-400 shrink-0 hidden md:block" />
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-200 rounded-2xl p-8 max-w-xl mx-auto text-center space-y-6 shadow-xl"
          >
            <div className="mx-auto h-16 w-16 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center border-2 border-slate-200">
              <ShieldCheck className="h-8 w-8 text-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest">
                Solicitud Recibida Correctamente
              </span>
              <h3 className="text-lg font-black text-slate-950">¡Propuesta comercial bloqueada!</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hemos ingresado tu solicitud al CRM de Grupo Comunicarte con el identificador <strong className="text-slate-800">#{Date.now().toString().slice(-6)}</strong>. Un Ejecutivo comercial auditará la disponibilidad y se comunicará contigo a <strong className="text-slate-800">{clientEmail}</strong> en un lapso de 2 horas hábiles.
              </p>
            </div>

            {/* Receipt Summary card */}
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 text-xs space-y-2.5 text-left max-w-md mx-auto">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                <span>Resumen de Cotización</span>
                <span>Mendoza OOH</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Cliente / Empresa</span>
                <span className="font-semibold text-slate-800">{clientName} ({clientCompany})</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Fechas Tentativas</span>
                <span className="font-semibold text-slate-800">Desde: {startDate} ({weeks} semanas)</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Espacios Reservados</span>
                <span className="font-semibold text-slate-800">{cart.length} Pantallas</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Impactos Totales Estimados</span>
                <span className="font-semibold text-slate-800 font-mono">{totalImpacts.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-sm font-black text-slate-950">
                <span>Total Estimado Neto</span>
                <span className="text-[#06434a] font-extrabold">Bajo cotización</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
              <Button
                onClick={() => {
                  // Simulate print download
                  alert("Descargando PDF de cotización preliminar...");
                }}
                variant="outline"
                className="w-full sm:w-auto text-xs font-bold h-9.5 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="h-4 w-4 text-slate-500" />
                Descargar Comprobante PDF
              </Button>
              <Button
                onClick={handleReset}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-4 h-9.5 rounded-xl cursor-pointer"
              >
                Volver al Marketplace
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" key="marketplace">
            {/* Left Column: Screen browser catalogs */}
            <div className="lg:col-span-8 space-y-5">
              {/* Filter controls */}
              <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  {/* Zone Filter dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px]">Zona Mendoza</label>
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="block w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-950 uppercase"
                    >
                      {zones.map((z) => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
                  </div>

                  {/* Type Filter dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px]">Formato Pantalla</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="block w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-950 uppercase"
                    >
                      {types.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-500">
                  Mostrando <strong className="text-slate-800">{filteredScreens.length}</strong> de <strong className="text-slate-800">{screens.length}</strong> espacios
                </div>
              </div>

              {/* Screens catalog list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredScreens.map((screen) => {
                  const isSelected = cart.includes(screen.id);
                  return (
                    <div
                      key={screen.id}
                      className={`bg-white border rounded-2xl shadow-xs overflow-hidden flex flex-col transition-all group ${
                        isSelected ? "border-slate-900" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* Card visual mock background */}
                      <div className="h-28 bg-slate-950 p-4.5 flex flex-col justify-between relative">
                        {/* Simulation LED image fallback */}
                        <div className="absolute inset-0 bg-linear-to-b from-slate-950/20 via-slate-950/80 to-slate-950" />
                        
                        <div className="flex justify-between items-start relative z-10">
                          <span className="px-2.5 py-0.5 bg-slate-900 text-white font-bold text-[9px] rounded-full uppercase tracking-wider border border-slate-800">
                            {screen.tipo}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-xs">
                            ID: {screen.id}
                          </span>
                        </div>

                        <div className="relative z-10 space-y-0.5">
                          <h4 className="font-extrabold text-sm text-white line-clamp-1">{screen.nombre}</h4>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{screen.zona}</span>
                        </div>
                      </div>

                      {/* Card Content info */}
                      <div className="p-4 flex-grow flex flex-col justify-between space-y-4 text-xs">
                        <p className="text-[11px] text-slate-500 leading-normal line-clamp-2 min-h-8">
                          {screen.nota || "Espectacular dispositivo digital con rotación de marca garantizada y sensor fotográfico de impactos automatizado."}
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-slate-400 uppercase font-bold">Imp. Semanales</span>
                            <span className="font-bold font-mono text-slate-900 text-[13px]">
                              {screen.impactos.toLocaleString("es-AR")}
                            </span>
                          </div>
                          <div className="space-y-0.5 text-right">
                            <span className="text-[9px] text-slate-400 uppercase font-bold">Inversión/Semana</span>
                            <span className="font-bold text-slate-950 text-[13px]">
                              Bajo cotización
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={() => toggleCart(screen.id)}
                          className={`w-full py-2 h-auto text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? "bg-slate-950 hover:bg-slate-900 text-white"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200"
                          }`}
                        >
                          {isSelected ? (
                            <span className="flex items-center justify-center gap-1.5">
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              Quitar del Presupuesto
                            </span>
                          ) : (
                            "Agregar a mi Cotización"
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Checkout Proposal Form */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Cotización Estimada ({cart.length})
                  </h3>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-[10px] text-rose-500 hover:text-rose-700 font-bold uppercase cursor-pointer"
                    >
                      Vaciar
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs space-y-3">
                    <ShoppingBag className="h-8 w-8 text-slate-300 mx-auto" />
                    <p className="leading-relaxed">Tu canasta de reserva de pantallas está vacía. Añade dispositivos del inventario para cotizar.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Compact cart list preview */}
                    <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs">
                      {cartScreens.map((sc) => (
                        <div key={sc.id} className="py-2.5 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 truncate block">{sc.nombre}</span>
                            <span className="text-[10px] text-slate-400 font-semibold block uppercase">{sc.zona}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-[#06434a]">Bajo cotización</span>
                            <button
                              onClick={() => toggleCart(sc.id)}
                              className="text-[10px] text-rose-500 block hover:underline ml-auto"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Week slider selector */}
                    <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>Semanas de Campaña:</span>
                        <span className="text-slate-950 font-mono">{weeks} Semanas</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="12"
                        step="1"
                        value={weeks}
                        onChange={(e) => setWeeks(Number(e.target.value))}
                        className="w-full accent-slate-950 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                        <span>1 Sem.</span>
                        <span>4 Sem. (Mín. Recom)</span>
                        <span>12 Sem.</span>
                      </div>
                    </div>

                    {/* Value Cost breakdown list */}
                    <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Suma de Tarifas Semanales</span>
                        <span className="font-semibold text-[#06434a]">Bajo cotización</span>
                      </div>
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Costo Bruto por {weeks} Semanas</span>
                        <span className="font-semibold text-[#06434a]">Bajo cotización</span>
                      </div>
                      
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Audiencia Semanal Acumulada</span>
                        <span className="font-semibold text-slate-800 font-mono">{(totalImpacts / weeks).toLocaleString("es-AR")} imp.</span>
                      </div>

                      <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-black text-slate-950">
                        <span>Total Solicitado</span>
                        <span className="text-[#06434a] font-extrabold">Bajo cotización</span>
                      </div>
                    </div>

                    {/* Booking/Checkout CRM lead capture form */}
                    <form onSubmit={handleCreateReservation} className="border-t border-slate-100 pt-4 space-y-3.5 text-xs">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Datos del Solicitante / Bloqueo CRM
                      </span>

                      {errorMsg && (
                        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-start gap-1.5 font-bold">
                          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Nombre del Contacto *"
                            className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl w-full text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-slate-950"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="Email Corporativo *"
                            className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl w-full text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-slate-950"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="relative">
                          <Building className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={clientCompany}
                            onChange={(e) => setClientCompany(e.target.value)}
                            placeholder="Agencia / Marca Comercial *"
                            className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl w-full text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-slate-950"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha Tentativa Lanzamiento</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="date"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl w-full text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-slate-950"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-2.5 h-auto rounded-xl flex items-center justify-center gap-1.5 cursor-pointer pt-3 shadow-md"
                      >
                        {submitting ? "Procesando..." : "Solicitar Bloqueo de Espacios"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
