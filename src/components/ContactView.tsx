import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Lead } from "../types";

interface ContactViewProps {
  slug: string;
  addLead: (lead: Omit<Lead, "id" | "date">) => Promise<Lead | null>;
}

export const ContactView: React.FC<ContactViewProps> = ({ slug, addLead }) => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    spacePreference: slug.includes("buenos-aires") ? "Buenos Aires" : "Mendoza",
    message: "",
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;

    setIsSubmittingContact(true);
    await addLead({
      name: contactForm.name,
      email: contactForm.email,
      company: contactForm.company || "Subpage Contact",
      source: `Contacto SEO - Ruta: ${slug}`,
      status: "new",
      value: 1200,
    });
    setIsSubmittingContact(false);
    setContactSubmitted(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
      <div className="border-b border-slate-150 pb-4">
        <h2 className="text-xl font-black text-slate-900">Formulario Comercial de Cotización B2B</h2>
        <p className="text-slate-500 text-xs mt-1">
          Ingresa tus datos y alcance de campaña para recibir una propuesta OOH personalizada.
        </p>
      </div>

      {!contactSubmitted ? (
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Ana de la Cruz"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Empresa
              </label>
              <input
                type="text"
                value={contactForm.company}
                onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                placeholder="Acme Corp"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Correo Corporativo
              </label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="ana@empresa.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                placeholder="+54 9 261 555-5555"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Territorio de Campaña de Interés
            </label>
            <select value={contactForm.spacePreference} onChange={(e) => setContactForm({ ...contactForm, spacePreference: e.target.value })} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer">
              <option value="Mendoza">Mendoza</option>
              <option value="Buenos Aires">Buenos Aires</option>
              <option value="Ambos">Ambos Territorios</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Comentarios o Detalles Especiales
            </label>
            <textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Contanos sobre las marcas y tiempos de tu campaña..." rows={4} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900" />
          </div>

          <button type="submit" disabled={isSubmittingContact} className="w-full bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-sm transition-all cursor-pointer">
            {isSubmittingContact ? "Procesando..." : "Enviar Solicitud SEO"}
          </button>
        </form>
      ) : (
        <div className="text-center py-10 space-y-4">
          <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <LucideIcons.CheckCircle className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h4 className="font-extrabold text-slate-900 text-sm">¡Solicitud Registrada con Éxito!</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              La consulta generó de forma automática un nuevo Lead calificado en el CMS. Podés confirmarlo accediendo a la pestaña de Leads del dashboard principal.
            </p>
          </div>
          <button onClick={() => setContactSubmitted(false)} className="text-xs font-bold text-slate-500 hover:text-slate-800 underline underline-offset-4 cursor-pointer">
            Enviar otra consulta
          </button>
        </div>
      )}
    </div>
  );
};