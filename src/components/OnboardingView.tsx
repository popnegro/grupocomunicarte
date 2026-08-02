import React, { useState } from "react";
import { useCms } from "./CmsContext";
import { motion, AnimatePresence } from "motion/react";

// Onboarding Panels
import { OnboardingPanel } from "./OnboardingPanel"; // NEW

export const OnboardingView: React.FC = () => {
  const { onboardUser, setActiveView, onboardingAnswers, updateOnboardingAnswer } = useCms();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // Total number of onboarding steps/panels

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step, finish onboarding
      onboardUser();
      setActiveView("dashboard"); // Or a welcome screen
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getPanelContent = (step: number) => {
    switch (step) {
      case 1:
        return {
          title: "¡Bienvenido a Grupo Comunicarte!",
          description: "Configurá tu experiencia para aprovechar al máximo nuestra plataforma DOOH. Te guiaremos en 4 simples pasos.",
          fields: [
            { id: "companyName", label: "¿Cuál es el nombre de tu Agencia o Empresa?", type: "text", required: true },
            { id: "industry", label: "¿Cuál es tu industria principal?", type: "select", options: ["Retail", "Automotriz", "Banca", "Consumo Masivo", "Servicios", "Agencia de Medios", "Otros"], required: true },
          ],
        };
      case 2:
        return {
          title: "¡Hablemos de tus clientes!",
          description: "Entendemos mejor tus necesidades conociendo tu ecosistema.",
          fields: [
            { id: "clientType", label: "¿A qué tipo de clientes apuntas?", type: "checkbox", options: ["Grandes Cuentas", "Pymes Regionales", "Emprendedores", "Segmento Específico"], required: true },
            { id: "targetAudience", label: "¿Cuál es tu principal audiencia objetivo?", type: "text", placeholder: "Ej: Jóvenes 18-35, Familias con niños", required: true },
          ],
        };
      case 3:
        return {
          title: "¿Qué te interesa gestionar en DOOH?",
          description: "Personalizaremos tu Dashboard con los módulos más relevantes.",
          fields: [
            { id: "mainGoals", label: "Seleccioná tus objetivos clave:", type: "checkbox", options: ["Gestión de Inventario", "Creación de MediaKits", "Workflow de Ventas", "Optimización de Revenue", "Reportes Analíticos", "Administración de Usuarios"], required: true },
            { id: "integrationNeeds", label: "¿Necesitás integraciones con otros sistemas?", type: "text", placeholder: "Ej: CRM, Data Studio, Google Ads", required: false },
          ],
        };
      case 4:
        return {
          title: "¡Casi listo! Tu perfil está completo.",
          description: "Revisá tus respuestas antes de finalizar la configuración.",
          readOnly: true, // Indicates this panel is for review
          fields: [], // No new fields, just review
        };
      default:
        return { title: "", description: "", fields: [] };
    }
  };

  const panelContent = getPanelContent(currentStep);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-stone-100 to-stone-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden"
      >
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-stone-900 font-display">Configuración Inicial</h1>
            <div className="text-sm text-stone-500"> 
              Paso {currentStep} de {totalSteps}
            </div>
          </div>

          <div className="w-full bg-stone-200 rounded-full h-2">
            <motion.div
              className="bg-[#06434a] h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <OnboardingPanel
                step={currentStep}
                totalSteps={totalSteps}
                title={panelContent.title}
                description={panelContent.description}
                fields={panelContent.fields as any} // Cast to any to bypass type issues for now
                readOnly={panelContent.readOnly}
                onNext={handleNextStep}
                onPrevious={handlePreviousStep}
                onboardingAnswers={onboardingAnswers}
                updateOnboardingAnswer={updateOnboardingAnswer}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
