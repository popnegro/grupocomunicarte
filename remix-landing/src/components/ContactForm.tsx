import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, Building, User, FileText, CheckCircle, AlertCircle, Trash2, ArrowRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ContactForm: React.FC = () => {
  const { 
    selectedSupports, 
    toggleSupportSelection, 
    submitLead, 
    clearSelection,
    campaignStartDate,
    campaignEndDate,
    isSubmittingLead
  } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatDateShort = (d: string | null) => {
    if (!d) return null;
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const startFormatted = formatDateShort(campaignStartDate);
  const endFormatted = formatDateShort(campaignEndDate);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingLead) return;

    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMsg('Por favor complete los campos obligatorios: Nombre, Correo y Teléfono.');
      return;
    }

    if (selectedSupports.length === 0) {
      setErrorMsg('Debe seleccionar al menos un soporte publicitario para solicitar una cotización.');
      return;
    }

    setErrorMsg(null);

    const success = await submitLead(formData);

    if (success) {
      setSubmitted(true);
      setFormData({ name: '', company: '', email: '', phone: '', message: '' });
    } else {
      setErrorMsg('No se pudo procesar la solicitud en este momento. Intente más tarde.');
    }
  };

  return (
    <div className="bg-white border border-[#DCE4DF] rounded-2xl shadow-xs overflow-hidden" id="contact-form-container">
      <div className="p-5 bg-[#F7F9F7] border-b border-[#DCE4DF]">
        <h3 className="text-sm font-extrabold text-[#082028]">Solicitar Presupuesto y Media Kit</h3>
        <p className="text-xs text-[#40515A] mt-0.5">Complete sus datos y recibirá la propuesta comercial formal.</p>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 text-center flex flex-col items-center justify-center min-h-95"
          >
            <div className="w-16 h-16 bg-[#E8F0E4] rounded-full flex items-center justify-center mb-4 border border-[#049A41]/30">
              <CheckCircle className="w-10 h-10 text-[#049A41]" />
            </div>
            <h4 className="text-[#082028] font-extrabold text-lg">¡Solicitud Enviada con Éxito!</h4>
            <p className="text-[#40515A] text-xs mt-2 max-w-sm leading-relaxed">
              Hemos registrado su selección de pantallas de Grupo Comunicarte. Un ejecutivo comercial procesará su Media Kit personalizado y se contactará a la brevedad.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 px-5 py-2.5 bg-[#082028] hover:bg-[#06181f] text-white text-xs font-bold rounded-xl transition-all"
            >
              Realizar Nueva Consulta
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 space-y-6"
          >
            {/* Display Selected Screens List & Campaign Dates Context */}
            <div>
              {/* Campaign Dates Info Box */}
              <div className="mb-3 p-3 bg-[#E8F0E4] border border-[#049A41]/30 rounded-xl flex items-center justify-between text-xs text-[#082028]">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#049A41] shrink-0" />
                  <div>
                    <span className="font-extrabold text-[10px] uppercase text-[#40515A] block">Período de Campaña:</span>
                    {startFormatted && endFormatted ? (
                      <span className="font-extrabold text-[#082028]">{startFormatted} → {endFormatted}</span>
                    ) : (
                      <span className="text-amber-700 font-bold">Por definir con ejecutivo</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-extrabold text-[#40515A] uppercase tracking-wider">
                  Pantallas Seleccionadas ({selectedSupports.length})
                </span>
                {selectedSupports.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-[10px] text-red-600 hover:underline font-bold"
                  >
                    Borrar Selección
                  </button>
                )}
              </div>

              {selectedSupports.length === 0 ? (
                <div className="border-2 border-dashed border-[#DCE4DF] rounded-xl p-6 text-center text-xs text-[#64748B] bg-[#F7F9F7]">
                  Haga clic en los pines del mapa o en las tarjetas para armar su selección publicitaria.
                </div>
              ) : (
                <div className="max-h-40 overflow-y-auto border border-[#DCE4DF] rounded-xl divide-y divide-[#DCE4DF] p-1.5 bg-[#F7F9F7] space-y-1">
                  {selectedSupports.map(s => (
                    <div key={s.id} className="flex justify-between items-center p-2 rounded-lg bg-white shadow-2xs">
                      <div className="min-w-0 pr-4">
                        <p className="text-xs font-bold text-[#082028] truncate">{s.name}</p>
                        <p className="text-[9px] text-[#40515A] truncate">{s.plaza} • {s.size}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSupportSelection(s)}
                        className="text-[#64748B] hover:text-red-600 p-1 rounded-full transition-colors shrink-0"
                        title="Quitar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3.5">
                {/* Name */}
                <div className="relative">
                  <label className="block text-[10px] uppercase font-extrabold text-[#40515A] tracking-wider mb-1">Nombre Completo *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Juan Pérez"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F7] focus:bg-white border border-[#DCE4DF] focus:border-[#049A41] rounded-xl text-xs font-bold text-[#082028] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="relative">
                  <label className="block text-[10px] uppercase font-extrabold text-[#40515A] tracking-wider mb-1">Empresa / Agencia</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Ej: Agencia Comunicaciones"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F7] focus:bg-white border border-[#DCE4DF] focus:border-[#049A41] rounded-xl text-xs font-bold text-[#082028] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Grid Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="relative">
                    <label className="block text-[10px] uppercase font-extrabold text-[#40515A] tracking-wider mb-1">Correo Electrónico *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="juan@empresa.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F7] focus:bg-white border border-[#DCE4DF] focus:border-[#049A41] rounded-xl text-xs font-bold text-[#082028] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[10px] uppercase font-extrabold text-[#40515A] tracking-wider mb-1">Teléfono Móvil *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Ej: +54 9 261 555 1234"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F7] focus:bg-white border border-[#DCE4DF] focus:border-[#049A41] rounded-xl text-xs font-bold text-[#082028] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="relative">
                  <label className="block text-[10px] uppercase font-extrabold text-[#40515A] tracking-wider mb-1">Comentarios o Requisitos Especiales</label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3 w-4 h-4 text-[#64748B]" />
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Escriba comentarios, fechas de inicio estimadas o consultas sobre la campaña..."
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F7] focus:bg-white border border-[#DCE4DF] focus:border-[#049A41] rounded-xl text-xs font-bold text-[#082028] outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmittingLead || selectedSupports.length === 0}
                className={`w-full py-3.5 px-4 text-xs font-extrabold text-white rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all ${
                  selectedSupports.length === 0
                    ? 'bg-[#DCE4DF] text-[#64748B] cursor-not-allowed'
                    : isSubmittingLead
                      ? 'bg-[#082028] text-white cursor-wait'
                      : 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-md'
                }`}
              >
                {isSubmittingLead ? 'Procesando...' : 'Solicitar Presupuesto Oficial'}
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
