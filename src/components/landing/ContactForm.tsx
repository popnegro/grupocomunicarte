import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { useCms } from "@/components/CmsContext";

export const ContactForm: React.FC = () => {
  const { addLead } = useCms();
  
  // STEP 1: Required fields only
  const [step, setStep] = useState<1 | 2>(1);
  const [basicForm, setBasicForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [advancedForm, setAdvancedForm] = useState({
    phone: "",
    company: "",
    budget: "",
    timeline: "3-6 meses",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (basicForm.name && basicForm.email) {
      // Can submit now (MVP) or go to step 2 (enhanced)
      setStep(2); // Progress to advanced options
    }
  };

  const handleFullSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await addLead({
      name: basicForm.name,
      email: basicForm.email,
      phone: advancedForm.phone,
      company: advancedForm.company,
      source: "Formulario de Contacto",
      status: "new",
      value: advancedForm.budget ? parseInt(advancedForm.budget) : 1000,
    });
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-5xl">✅</div>
        <h3 className="text-xl font-bold text-stone-900">¡Gracias!</h3>
        <p className="text-stone-500">
          Nos pondremos en contacto en las próximas 24 horas.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Progress indicator */}
      {step === 2 && (
        <div className="flex gap-2">
          <div className="h-1 flex-1 bg-[#06434a] rounded-full" />
          <div className="h-1 flex-1 bg-stone-200 rounded-full" />
        </div>
      )}

      {/* STEP 1: Minimal fields */}
      {step === 1 && (
        <form onSubmit={handleBasicSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              value={basicForm.name}
              onChange={(e) => setBasicForm({ ...basicForm, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#06434a]/30 focus:border-[#06434a]"
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-900 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={basicForm.email}
              onChange={(e) => setBasicForm({ ...basicForm, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#06434a]/30 focus:border-[#06434a]"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-900 mb-2">
              ¿Cómo podemos ayudarte? *
            </label>
            <textarea
              value={basicForm.message}
              onChange={(e) => setBasicForm({ ...basicForm, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#06434a]/30 focus:border-[#06434a] resize-none h-24"
              placeholder="Cuéntanos qué buscas..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#06434a] hover:bg-[#0b5e67] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            Continuar
          </button>

          <p className="text-xs text-stone-500 text-center">
            Te pediremos más detalles en el siguiente paso
          </p>
        </form>
      )}

      {/* STEP 2: Optional fields */}
      {step === 2 && (
        <form onSubmit={handleFullSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={advancedForm.phone}
                onChange={(e) => setAdvancedForm({ ...advancedForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm"
                placeholder="(opcional)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-900 mb-2">
                Empresa
              </label>
              <input
                type="text"
                value={advancedForm.company}
                onChange={(e) => setAdvancedForm({ ...advancedForm, company: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm"
                placeholder="(opcional)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-2">
                Presupuesto Estimado
              </label>
              <select
                value={advancedForm.budget}
                onChange={(e) => setAdvancedForm({ ...advancedForm, budget: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm"
              >
                <option value="">Seleccionar...</option>
                <option value="5000">Hasta $5.000</option>
                <option value="15000">$5.000 - $15.000</option>
                <option value="50000">$15.000 - $50.000</option>
                <option value="100000">$50.000+</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-900 mb-2">
                Timeline
              </label>
              <select
                value={advancedForm.timeline}
                onChange={(e) => setAdvancedForm({ ...advancedForm, timeline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm"
              >
                <option>Inmediato</option>
                <option>1-3 meses</option>
                <option>3-6 meses</option>
                <option>6-12 meses</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border border-stone-200 text-stone-900 font-bold py-3 rounded-xl hover:bg-stone-50 transition-all"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-accent hover:bg-[#06a376] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Enviando..." : <>
                <Mail className="h-4 w-4" />
                Enviar
              </>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
