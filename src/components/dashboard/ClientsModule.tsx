import React, { useState } from "react";
import { Cliente, Role } from "./types";
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
  Target
} from "lucide-react";

interface ClientsModuleProps {
  clientes: Cliente[];
  userRole: Role;
  onAddCliente: (cliente: Cliente) => void;
}

export const ClientsModule: React.FC<ClientsModuleProps> = ({
  clientes,
  userRole,
  onAddCliente,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Form state
  const [newClient, setNewClient] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    categoria: "Directo" as "Directo" | "Agencia" | "Corporativo"
  });

  const filteredClientes = clientes.filter((c) =>
    c.empresa.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      totalInversión: 0
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
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans space-y-6 text-left">
      
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-bold py-3 px-5 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>¡Cliente registrado en el CRM con éxito!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            Directorio Comercial
          </span>
          <h2 className="text-xl font-bold text-stone-950 font-display mt-2">
            Gestión de Clientes & Contactos
          </h2>
        </div>

        {(userRole === "admin" || userRole === "comercial_dir" || userRole === "comercial_exec") && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#06434a] hover:bg-[#0b5e67] text-white text-[10px] font-extrabold uppercase px-4 py-2 rounded-full flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Registrar Cliente</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por anunciante, empresa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200/80 rounded-xl focus:outline-none focus:border-[#06434a]"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClientes.map((c) => (
          <div key={c.id} className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-350 transition-all shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                  c.categoria === "Corporativo"
                    ? "bg-purple-50 text-purple-700 border-purple-150"
                    : c.categoria === "Agencia"
                    ? "bg-blue-50 text-blue-700 border-blue-150"
                    : "bg-stone-50 text-stone-700 border-stone-150"
                }`}>
                  {c.categoria}
                </span>

                <span className="text-[9px] text-stone-400 font-mono font-bold">ID: {c.id}</span>
              </div>

              <div>
                <h4 className="text-xs font-black text-stone-900 leading-snug font-display">
                  {c.empresa}
                </h4>
                <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
                  Contacto: {c.nombre}
                </p>
              </div>

              {/* coordinates */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100 text-[10px] text-stone-500 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#06434a]/75" />
                  <span>{c.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#06434a]/75" />
                  <span>{c.telefono}</span>
                </div>
              </div>
            </div>

            {/* billing performance */}
            <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-[11px] font-bold text-stone-800">
              <div className="text-left">
                <span className="block text-[8px] text-stone-400 uppercase font-mono font-extrabold">Campañas</span>
                <span className="font-mono text-stone-900 mt-0.5 block">{c.campañasActivas} activas</span>
              </div>

              <div className="text-right">
                <span className="block text-[8px] text-stone-400 uppercase font-mono font-extrabold">Inversión acumulada</span>
                <span className="font-mono text-[#06434a] mt-0.5 block">${c.totalInversión.toLocaleString()}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-150 p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl space-y-6 text-left animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-sm font-black text-stone-950 font-display uppercase tracking-wider">
                Registrar Cliente CRM
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-stone-50 rounded-xl text-stone-400 hover:text-stone-700 cursor-pointer"
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
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none"
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
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none"
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
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Teléfono Móvil</label>
                  <input
                    type="text"
                    placeholder="+54 261..."
                    value={newClient.telefono}
                    onChange={(e) => setNewClient({ ...newClient, telefono: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-extrabold text-stone-400 uppercase tracking-widest">Segmento de Comercialización</label>
                <select
                  value={newClient.categoria}
                  onChange={(e) => setNewClient({ ...newClient, categoria: e.target.value as any })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 cursor-pointer"
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
          </div>
        </div>
      )}

    </div>
  );
};
