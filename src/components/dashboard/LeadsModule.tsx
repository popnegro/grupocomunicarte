import React, { useState, useMemo } from "react";
import { useCms } from "../CmsContext";
import { Lead } from "../../types";
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle, 
  Clock, 
  PhoneCall, 
  X, 
  MoreHorizontal, 
  Download,
  DollarSign,
  TrendingUp,
  Inbox,
  Briefcase,
  ArrowRight
} from "lucide-react";
import { useToast } from "../ui/Toast";

export const LeadsModule: React.FC = () => {
  const { leads, addLead } = useCms();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    source: "Formulario Web",
    status: "new" as const,
    value: 120000,
  });

  // Calculate stats
  const stats = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === "new").length;
    const contacted = leads.filter(l => l.status === "contacted").length;
    const qualified = leads.filter(l => l.status === "qualified").length;
    const closed = leads.filter(l => l.status === "closed").length;
    
    const totalPipelineValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);

    return { total, newLeads, contacted, qualified, closed, totalPipelineValue };
  }, [leads]);

  // Filtered Leads list
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.company.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, search, statusFilter, sourceFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      await addLead({
        name: form.name,
        email: form.email,
        company: form.company,
        source: form.source,
        status: form.status,
        value: Number(form.value) || 0,
      });
      toast.success("Lead registrado con éxito.");
      setShowAddModal(false);
      setForm({
        name: "",
        email: "",
        company: "",
        source: "Formulario Web",
        status: "new",
        value: 120000,
      });
    } catch (err) {
      toast.error("Ocurrió un error al registrar el lead.");
    }
  };

  const getStatusBadge = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return {
          label: "Nuevo",
          classes: "bg-blue-50 text-blue-700 border-blue-200/60",
          icon: <Inbox className="h-3 w-3" />,
        };
      case "contacted":
        return {
          label: "Contactado",
          classes: "bg-amber-50 text-amber-700 border-amber-200/60",
          icon: <PhoneCall className="h-3 w-3" />,
        };
      case "qualified":
        return {
          label: "Calificado",
          classes: "bg-purple-50 text-purple-700 border-purple-200/60",
          icon: <Briefcase className="h-3 w-3" />,
        };
      case "closed":
        return {
          label: "Cerrado Ganado",
          classes: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
          icon: <CheckCircle className="h-3 w-3" />,
        };
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            Pipeline de Ventas
          </span>
          <h2 className="text-xl font-bold text-stone-950 font-display mt-2">
            Gestión de Leads & Prospección Comercial
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Administra las oportunidades de venta entrantes del sitio web y del Quiz de Onboarding interactivo.
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#06434a] hover:bg-[#053a40] text-white text-[11px] font-extrabold py-2.5 px-5 rounded-full shadow-sm flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Lead Manual</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-stone-250/60 rounded-2xl p-5 shadow-2xs space-y-2">
          <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Valor Total de Pipeline</span>
          <span className="text-2xl font-black text-stone-900 font-mono block">
            ${stats.totalPipelineValue.toLocaleString()} <span className="text-xs font-bold text-stone-400">ARS</span>
          </span>
          <span className="block text-[9px] text-stone-400 font-semibold">Inversión estimada acumulada</span>
        </div>

        <div className="bg-white border border-stone-250/60 rounded-2xl p-5 shadow-2xs space-y-2">
          <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Nuevas Oportunidades</span>
          <span className="text-2xl font-black text-blue-600 font-mono block">{stats.newLeads}</span>
          <span className="block text-[9px] text-stone-400 font-semibold">Pendientes de primer contacto</span>
        </div>

        <div className="bg-white border border-stone-250/60 rounded-2xl p-5 shadow-2xs space-y-2">
          <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">En Calificación / Pauta</span>
          <span className="text-2xl font-black text-purple-600 font-mono block">{stats.qualified}</span>
          <span className="block text-[9px] text-stone-400 font-semibold font-mono">Leads listos para cotización</span>
        </div>

        <div className="bg-white border border-stone-250/60 rounded-2xl p-5 shadow-2xs space-y-2">
          <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Tasa de Conversión</span>
          <span className="text-2xl font-black text-emerald-600 font-mono block">
            {stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}%
          </span>
          <span className="block text-[9px] text-stone-400 font-semibold">Cerrados ganados del total</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-3xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-full text-xs font-semibold focus:outline-none focus:border-[#06434a] bg-stone-50/50"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-full">
            <Filter className="h-3 w-3 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-stone-600 focus:outline-none border-none cursor-pointer"
            >
              <option value="all">Todos los Estados</option>
              <option value="new">Nuevo</option>
              <option value="contacted">Contactado</option>
              <option value="qualified">Calificado</option>
              <option value="closed">Ganado</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-full">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-stone-600 focus:outline-none border-none cursor-pointer"
            >
              <option value="all">Todas las Fuentes</option>
              <option value="Formulario Web">Formulario Web</option>
              <option value="Quiz de Onboarding">Quiz de Onboarding</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/70 border-b border-stone-150/80 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                <th className="py-4 px-6">Información Básica</th>
                <th className="py-4 px-6">Empresa</th>
                <th className="py-4 px-6">Fuente de Entrada</th>
                <th className="py-4 px-6">Fecha</th>
                <th className="py-4 px-6">Inversión Estimada</th>
                <th className="py-4 px-6">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400 text-xs font-medium">
                    No se encontraron leads con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const badge = getStatusBadge(lead.status);
                  return (
                    <tr key={lead.id} className="hover:bg-stone-50/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-stone-900 text-xs">{lead.name}</div>
                        <div className="text-[10px] text-stone-400 font-medium">{lead.email}</div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-stone-700 text-xs">
                        {lead.company}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[10px] bg-stone-100 border border-stone-200/50 text-stone-600 font-bold px-2 py-0.5 rounded-full">
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[10px] font-bold text-stone-400 font-mono">
                        {new Date(lead.date).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="py-4 px-6 text-xs font-black text-stone-800 font-mono">
                        ${(lead.value || 0).toLocaleString()} <span className="text-[9px] font-normal text-stone-400">ARS</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 border rounded-full text-[10px] font-extrabold ${badge.classes}`}>
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm">Registrar Lead Comercial</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marcelo Gallardo"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#06434a]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">Email de Contacto *</label>
                <input
                  type="email"
                  required
                  placeholder="gallardo@riverplate.com"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#06434a]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">Nombre de la Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Toyota Argentina"
                  value={form.company}
                  onChange={e => setForm(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#06434a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">Inversión Estimada (ARS)</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={e => setForm(prev => ({ ...prev, value: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#06434a] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">Origen del Lead</label>
                  <select
                    value={form.source}
                    onChange={e => setForm(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-600 bg-white focus:outline-none focus:border-[#06434a]"
                  >
                    <option value="Formulario Web">Formulario Web</option>
                    <option value="Quiz de Onboarding">Quiz de Onboarding</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-full text-xs font-bold text-stone-650 cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#06434a] hover:bg-[#053a40] rounded-full text-xs font-extrabold text-white cursor-pointer transition-colors flex items-center gap-1.5 uppercase tracking-wide"
                >
                  <span>Registrar Lead</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
