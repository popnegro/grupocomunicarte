import React, { useState } from "react";
import { useCms } from "./CmsContext";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, ArrowLeft, Building2, Target, Volume2, Flag, CheckCircle } from "lucide-react";

export const OnboardingView: React.FC = () => {
  const { saveOnboarding, generateAIContent, loadingAI, setActiveView, setCurrentDashboardTab } = useCms();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    businessName: "",
    industry: "",
    targetAudience: "",
    tone: "profesional y confiable",
    goals: [] as string[],
  });

  const goalsList = [
    "Capturar más leads de calidad",
    "Mejorar el posicionamiento SEO",
    "Automatizar ventas B2B",
    "Generar confianza en el mercado",
    "Ofrecer una demo interactiva instantánea",
  ];

  const handleGoalToggle = (goal: string) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const nextStep = () => {
    if (step < 4) setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleFinish = async () => {
    saveOnboarding(form);
    await generateAIContent(form);
    setCurrentDashboardTab("landing-editor");
    setActiveView("dashboard");
  };

  const percent = Math.round((step / 4) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-10 px-4 md:px-8 font-sans">
      {/* Top Header */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <span className="font-semibold text-slate-800 tracking-tight">SmartWeb Onboarding</span>
        </div>
        <div className="text-sm font-medium text-slate-500">Paso {step} de 4</div>
      </div>

      {/* Main Form Area */}
      <div className="max-w-xl w-full mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8 flex-grow flex flex-col justify-center">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-slate-900 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-950 mb-4">
                  <Building2 className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Comencemos con tu negocio</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Introduce el nombre y la industria de tu SaaS, consultoría o emprendimiento.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    placeholder="Ej. GrowthFlow, Consultoría Delta"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    ¿Qué hace tu empresa? (Tu industria / servicio)
                  </label>
                  <textarea
                    rows={3}
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    placeholder="Ej. Ofrecemos optimización automatizada de embudos de venta B2B utilizando analíticas predictivas."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-950 mb-4">
                  <Target className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">¿Quién es tu cliente ideal?</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Define tu público objetivo para redactar una landing ultra-relevante.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Público Objetivo
                  </label>
                  <input
                    type="text"
                    value={form.targetAudience}
                    onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                    placeholder="Ej. Fundadores de startups de tecnología, gerentes de ventas"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-950 mb-4">
                  <Volume2 className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Elige el tono de voz</h1>
                <p className="text-slate-500 text-sm mt-1">
                  La personalidad de tu marca determinará el estilo de la copia redactada por IA.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Profesional y Confiable", desc: "Corporativo, sobrio y seguro", value: "profesional y confiable" },
                  { label: "Innovador y Tecnológico", desc: "Futurista, audaz y moderno", value: "innovador y tecnológico" },
                  { label: "Cercano y Amigable", desc: "Conversacional y simple", value: "cercano y amigable" },
                  { label: "Enérgico y Directo", desc: "Orientado a resultados rápidos", value: "enérgico y directo" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setForm({ ...form, tone: item.value })}
                    className={`p-4 border text-left rounded-xl transition-all ${
                      form.tone === item.value
                        ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                    <span className="block text-xs text-slate-500 mt-1">{item.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-950 mb-4">
                  <Flag className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">¿Cuáles son tus objetivos?</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Selecciona lo que esperas lograr con tu nueva Landing Page.
                </p>
              </div>

              <div className="space-y-2">
                {goalsList.map((goal) => {
                  const isSelected = form.goals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleGoalToggle(goal)}
                      className={`w-full p-3.5 border rounded-lg text-left text-sm flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-slate-900 bg-slate-50 text-slate-950"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span>{goal}</span>
                      {isSelected ? (
                        <CheckCircle className="h-5 w-5 text-slate-900 fill-slate-900/5" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-slate-300" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1 || loadingAI}
            className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors ${
              step === 1
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={step === 1 ? !form.businessName || !form.industry : false}
              className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg transition-all ${
                step === 1 && (!form.businessName || !form.industry) ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={loadingAI}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-slate-950 hover:bg-slate-800 text-white px-6 py-3 rounded-lg shadow-sm transition-all"
            >
              {loadingAI ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redactando con IA...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 fill-white/15" />
                  Generar Landing con IA
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-3xl w-full mx-auto text-center text-xs text-slate-400 mt-8">
        SmartWeb utiliza tecnología de IA generativa de Google Gemini para estructurar, refinar y generar textos de conversión Premium.
      </div>
    </div>
  );
};
