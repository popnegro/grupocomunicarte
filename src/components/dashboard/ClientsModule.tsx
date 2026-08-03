import React, { useState, useMemo } from "react";
import { Cliente, Role, Interaction } from "./types";
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Briefcase, 
  TrendingUp, 
  CheckCircle,
  X,
  Target,
  AlertCircle,
  MessageSquare,
  Calendar,
  ChevronRight,
  Clipboard,
  Activity,
  Clock,
  Save,
  MessageCircle,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ClientsModuleProps {
  clientes: Cliente[];
  userRole: Role;
  onAddCliente: (cliente: Cliente) => void;
  onUpdateCliente: (id: string, updatedFields: Partial<Cliente>) => void;
}

export const ClientsModule: React.FC<ClientsModuleProps> = ({
  clientes,
  userRole,
  onAddCliente,
  onUpdateCliente,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Selected client for detail view (Master-Detail)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // New interaction form state
  const [interactionType, setInteractionType] = useState<"Llamada" | "Reunión" | "Email" | "Propuesta" | "Nota">("Llamada");
  const [interactionDetail, setInteractionDetail] = useState("");

  // Edit notes state
  const [editingNotes, setEditingNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  // Form state for creating new client
  const [newClient, setNewClient] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    categoria: "Directo" as "Directo" | "Agencia" | "Corporativo"
  });

  const filteredClientes = useMemo(() => {
    return clientes.filter((c) =>
      c.empresa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clientes, searchQuery]);

  // Selected client object
  const selectedClient = useMemo(() => {
    const found = clientes.find((c) => c.id === selectedClientId);
    if (found) {
      // Synchronize note editor state when client selection changes
      return found;
    }
    return null;
  }, [clientes, selectedClientId]);

  // Synchronize notes when client changes
  React.useEffect(() => {
    if (selectedClient) {
      setEditingNotes(selectedClient.notas || "");
    } else {
      setEditingNotes("");
    }
    setNotesSaved(false);
  }, [selectedClientId, selectedClient]);

  // Performance KPI stats for CRM
  const metrics = useMemo(() => {
    const total = clientes.length;
    const contactados = clientes.filter(c => c.estado === "contactado" || !c.estado).length;
    const negociando = clientes.filter(c => c.estado === "negociando").length;
    const cerrados = clientes.filter(c => c.estado === "cerrado").length;
    const totalInv = clientes.reduce((acc, c) => acc + (c.totalInversión || 0), 0);
    return { total, contactados, negociando, cerrados, totalInv };
  }, [clientes]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.empresa || !newClient.nombre) return;

    const cliente: Cliente = {
      id: `cl-new-${Date.now()}`,
      nombre: newClient.nombre,
      empresa: newClient.empresa,
      email: newClient.email || "contacto@empresa.com",
      telefono: newClient.telefono || "+54 261 000-0000",
      categoria: newClient.categoria,
      campañasActivas: 0,
      totalInversión: 0,
      estado: "contactado",
      notas: "",
      historialInteracciones: []
    };

    onAddCliente(cliente);
    setShowAddModal(false);
    // Reset
    setNewClient({
      nombre: "",
      empresa: "",
      email: "",
      telefono: "",
      categoria: "Directo"
    });
    triggerToast("¡Cliente registrado en el CRM con éxito!");
  };

  const handleStatusChange = (status: "contactado" | "negociando" | "cerrado") => {
    if (!selectedClientId) return;
    onUpdateCliente(selectedClientId, { estado: status });
    triggerToast(`Estado cambiado a ${status.toUpperCase()}`);
  };

  const handleSaveNotes = () => {
    if (!selectedClientId) return;
    onUpdateCliente(selectedClientId, { notas: editingNotes });
    setNotesSaved(true);
    triggerToast("Notas actualizadas correctamente");
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !interactionDetail.trim()) return;

    const newInteraction: Interaction = {
      id: `int-${Date.now()}`,
      tipo: interactionType,
      detalle: interactionDetail,
      fecha: new Date().toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }) + " hs"
    };

    const currentInteractions = selectedClient.historialInteracciones || [];
    const updatedInteractions = [newInteraction, ...currentInteractions];

    onUpdateCliente(selectedClient.id, {
      historialInteracciones: updatedInteractions
    });

    setInteractionDetail("");
    triggerToast("¡Interacción registrada!");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans space-y-6 text-left">
      
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-sans font-bold py-3 px-5 rounded-lg shadow-lg border border-stone-800 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            CRM Comercial
          </span>
          <h2 className="text-xl font-bold text-stone-950 font-display mt-2">
            Seguimiento de Leads & Cuentas
          </h2>
        </div>

        {(userRole === "admin" || userRole === "comercial_dir" || userRole === "comercial_exec") && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase px-4 py-2 rounded-full flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Lead / Cliente</span>
          </button>
        )}
      </div>

      {/* CRM KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-stone-200 p-4 rounded-lg flex flex-col justify-between text-left shadow-2xs">
          <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider font-mono">Total Leads</span>
          <span className="text-lg font-black text-stone-900 font-mono mt-1">{metrics.total}</span>
        </div>
        <div className="bg-white border border-stone-200 p-4 rounded-lg flex flex-col justify-between text-left shadow-2xs">
          <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider font-mono">Contactados</span>
          <span className="text-lg font-black text-amber-600 font-mono mt-1">{metrics.contactados}</span>
        </div>
        <div className="bg-white border border-stone-200 p-4 rounded-lg flex flex-col justify-between text-left shadow-2xs">
          <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider font-mono">En Negociación</span>
          <span className="text-lg font-black text-blue-600 font-mono mt-1">{metrics.negociando}</span>
        </div>
        <div className="bg-white border border-stone-200 p-4 rounded-lg flex flex-col justify-between text-left shadow-2xs">
          <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider font-mono">Cerrados</span>
          <span className="text-lg font-black text-emerald-600 font-mono mt-1">{metrics.cerrados}</span>
        </div>
        <div className="bg-white border border-stone-200 p-4 rounded-lg flex flex-col justify-between text-left shadow-2xs col-span-2 md:col-span-1">
          <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-wider font-mono">Inversión CRM</span>
          <span className="text-lg font-black text-[#06434a] font-mono mt-1">${metrics.totalInv.toLocaleString()}</span>
        </div>
      </div>

      {/* Main CRM Layout: Master-Detail Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Client List (Master) */}
        <div className={`space-y-4 lg:col-span-5 ${selectedClientId ? "hidden lg:block" : "block"}`}>
          <div className="bg-white border border-stone-200 rounded-lg p-3 shadow-2xs flex items-center gap-3">
            <Search className="h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar por anunciante, empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs focus:outline-none bg-transparent"
            />
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
            {filteredClientes.length > 0 ? (
              filteredClientes.map((c) => {
                const isActive = c.id === selectedClientId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClientId(c.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      isActive
                        ? "bg-[#06434a]/5 border-[#06434a] ring-1 ring-[#06434a]"
                        : "bg-white border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase border ${
                        c.categoria === "Corporativo"
                          ? "bg-purple-50 text-purple-700 border-purple-150"
                          : c.categoria === "Agencia"
                          ? "bg-blue-50 text-blue-700 border-blue-150"
                          : "bg-stone-50 text-stone-700 border-stone-150"
                      }`}>
                        {c.categoria}
                      </span>
                      
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase border ${
                        c.estado === "cerrado"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                          : c.estado === "negociando"
                          ? "bg-blue-50 text-blue-700 border-blue-150"
                          : "bg-amber-50 text-amber-700 border-amber-150"
                      }`}>
                        {c.estado || "contactado"}
                      </span>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-xs font-black text-stone-900 font-display">
                        {c.empresa}
                      </h4>
                      <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
                        Contacto: {c.nombre}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[9px] font-mono text-stone-400 font-bold">
                      <span>{c.campañasActivas} camp. activas</span>
                      <span className="text-[#06434a]">${c.totalInversión.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center border border-dashed border-stone-200 rounded-lg space-y-2 bg-stone-50/20">
                <AlertCircle className="h-8 w-8 text-stone-300 mx-auto" />
                <h3 className="text-xs font-bold text-stone-800">Sin coincidencias</h3>
                <p className="text-[10px] text-stone-500 max-w-[200px] mx-auto">
                  Prueba modificando tu criterio de búsqueda.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Client Detail Panel (Detail) */}
        <div className={`lg:col-span-7 ${selectedClientId ? "block" : "hidden lg:block"}`}>
          {selectedClient ? (
            <div className="bg-white border border-stone-200 rounded-lg p-6 md:p-8 shadow-2xs space-y-6">
              
              {/* Mobile Back Button */}
              <button
                onClick={() => setSelectedClientId(null)}
                className="lg:hidden mb-4 p-2 rounded-full hover:bg-stone-100 text-stone-600 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver al Directorio</span>
              </button>

              {/* Detail Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-stone-150">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold font-mono text-stone-400 uppercase">
                      ID: {selectedClient.id}
                    </span>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase border ${
                      selectedClient.categoria === "Corporativo"
                        ? "bg-purple-50 text-purple-700 border-purple-150"
                        : selectedClient.categoria === "Agencia"
                        ? "bg-blue-50 text-blue-700 border-blue-150"
                        : "bg-stone-50 text-stone-700 border-stone-150"
                    }`}>
                      {selectedClient.categoria}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-stone-950 font-display">
                    {selectedClient.empresa}
                  </h3>
                  <p className="text-xs text-stone-500 font-semibold">
                    Responsable de cuenta: <strong className="text-stone-700">{selectedClient.nombre}</strong>
                  </p>
                </div>

                {/* Lead Status Select Button Group */}
                <div className="space-y-1.5">
                  <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest text-left md:text-right">
                    Estado del Lead
                  </span>
                  <div className="flex gap-1 bg-stone-100 p-1 rounded-lg">
                    {(["contactado", "negociando", "cerrado"] as const).map((st) => {
                      const active = selectedClient.estado === st || (!selectedClient.estado && st === "contactado");
                      return (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(st)}
                          className={`px-3 py-1 rounded text-[9px] font-bold uppercase cursor-pointer transition-all ${
                            active
                              ? st === "cerrado"
                                ? "bg-emerald-600 text-white shadow-3xs"
                                : st === "negociando"
                                ? "bg-blue-600 text-white shadow-3xs"
                                : "bg-amber-600 text-white shadow-3xs"
                              : "text-stone-500 hover:text-stone-800"
                          }`}
                        >
                          {st === "cerrado" ? "Cerrado" : st === "negociando" ? "Negociando" : "Contactado"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Client Contact Coordinates Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-stone-600 bg-stone-50 p-4 rounded-lg">
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-[#06434a]/75" />
                  <div>
                    <span className="block text-[8px] font-bold text-stone-400 uppercase">Email</span>
                    <a href={`mailto:${selectedClient.email}`} className="text-stone-800 hover:underline">
                      {selectedClient.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-[#06434a]/75" />
                  <div>
                    <span className="block text-[8px] font-bold text-stone-400 uppercase">Teléfono Móvil</span>
                    <a href={`tel:${selectedClient.telefono}`} className="text-stone-800 hover:underline">
                      {selectedClient.telefono}
                    </a>
                  </div>
                </div>
              </div>

              {/* Notes Area (Lead Notes) */}
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">
                    Notas Generales / Seguimiento Interno
                  </span>
                  <button
                    onClick={handleSaveNotes}
                    className="text-[9px] font-extrabold uppercase text-[#06434a] hover:text-[#0b5e67] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{notesSaved ? "¡Guardado!" : "Guardar Notas"}</span>
                  </button>
                </div>
                <textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Escribe notas sobre las necesidades del cliente, requerimientos específicos, historial de presupuestos..."
                  className="w-full h-24 p-3 border border-stone-200 rounded-md text-xs focus:outline-none focus:border-[#06434a] bg-stone-50/20 resize-none"
                />
              </div>

              {/* Interacciones CRM (Interaction timeline) */}
              <div className="space-y-5 border-t border-stone-150 pt-5 text-left">
                <span className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">
                  Historial de Interacciones & Bitácora
                </span>

                {/* Form to log interaction */}
                <form onSubmit={handleAddInteraction} className="bg-stone-50 p-4 rounded-lg space-y-3 border border-stone-200">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="md:w-1/3">
                      <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wider mb-1">
                        Tipo de Contacto
                      </label>
                      <select
                        value={interactionType}
                        onChange={(e) => setInteractionType(e.target.value as any)}
                        className="w-full p-2 border border-stone-200 rounded text-xs bg-white cursor-pointer focus:outline-none"
                      >
                        <option value="Llamada">📞 Llamada</option>
                        <option value="Reunión">🤝 Reunión Presencial</option>
                        <option value="Email">📧 Email / Correo</option>
                        <option value="Propuesta">📄 Envío Propuesta</option>
                        <option value="Nota">📝 Nota Interna</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-wider mb-1">
                        Detalle / Minuta de la Interacción
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Se coordinó llamada para revisar el MediaKit el próximo martes."
                        value={interactionDetail}
                        onChange={(e) => setInteractionDetail(e.target.value)}
                        className="w-full p-2 border border-stone-200 rounded text-xs bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#06434a] hover:bg-[#0b5e67] text-white text-[9px] font-extrabold uppercase px-3 py-1.5 rounded-md cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <span>Registrar Interacción</span>
                    </button>
                  </div>
                </form>

                {/* Timeline display */}
                <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-stone-150 pl-1">
                  {selectedClient.historialInteracciones && selectedClient.historialInteracciones.length > 0 ? (
                    selectedClient.historialInteracciones.map((it) => {
                      const iconMap = {
                        Llamada: "📞",
                        Reunión: "🤝",
                        Email: "📧",
                        Propuesta: "📄",
                        Nota: "📝"
                      };

                      return (
                        <div key={it.id} className="relative pl-8 text-xs flex gap-3 flex-col sm:flex-row items-start justify-between">
                          <div className="absolute left-1.5 top-1 h-4.5 w-4.5 rounded-full border border-stone-200 bg-white flex items-center justify-center text-[10px] shadow-3xs">
                            {iconMap[it.tipo] || "📝"}
                          </div>

                          <div className="flex-1">
                            <span className="font-extrabold text-stone-900 block">
                              {it.tipo} - {it.detalle}
                            </span>
                            <span className="text-[9px] text-stone-400 font-mono font-bold mt-0.5 block">
                              Registrado el {it.fecha}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-stone-400 text-[10px] font-medium pl-8">
                      No hay interacciones registradas para este cliente. Utiliza el formulario superior para documentar llamadas o correos.
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200 border-dashed rounded-lg p-16 text-center space-y-3 h-full flex flex-col items-center justify-center">
              <Users className="h-10 w-10 text-stone-300" />
              <h3 className="text-xs font-bold text-stone-850">Detalle de Lead</h3>
              <p className="text-[10px] text-stone-500 max-w-xs mx-auto">
                Selecciona un lead o anunciante del directorio de la izquierda para ver su estado actual, editar notas y registrar interacciones comerciales.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-stone-200 rounded-lg p-6 md:p-8 max-w-sm w-full shadow-2xl space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h3 className="text-sm font-black text-stone-950 font-display uppercase tracking-wider">
                  Registrar Cliente CRM
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 hover:bg-stone-50 rounded-md text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Nombre Comercial Empresa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Toyota Argentina"
                    value={newClient.empresa}
                    onChange={(e) => setNewClient({ ...newClient, empresa: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50/50 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Contacto Directo Responsable *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Luis González"
                    value={newClient.nombre}
                    onChange={(e) => setNewClient({ ...newClient, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50/50 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Email Corporativo</label>
                    <input
                      type="email"
                      placeholder="contacto@empresa.com"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50/50 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Teléfono Móvil</label>
                    <input
                      type="text"
                      placeholder="+54 261..."
                      value={newClient.telefono}
                      onChange={(e) => setNewClient({ ...newClient, telefono: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Segmento de Comercialización</label>
                  <select
                    value={newClient.categoria}
                    onChange={(e) => setNewClient({ ...newClient, categoria: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50 cursor-pointer"
                  >
                    <option value="Directo">Anunciante Directo</option>
                    <option value="Agencia">Agencia de Medios</option>
                    <option value="Corporativo">Gran Cuenta Corporativa</option>
                  </select>
                </div>

                <div className="border-t border-stone-100 pt-4 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
