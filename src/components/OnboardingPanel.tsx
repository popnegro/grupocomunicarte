import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { OnboardingAnswers } from "../types";

interface OnboardingPanelProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  fields: Array<{
    id: keyof OnboardingAnswers;
    label: string;
    type: "text" | "select" | "checkbox";
    options?: string[];
    placeholder?: string;
    required?: boolean;
  }>;
  readOnly?: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onboardingAnswers: OnboardingAnswers;
  updateOnboardingAnswer?: (field: keyof OnboardingAnswers, value: any) => void;
}

export const OnboardingPanel: React.FC<OnboardingPanelProps> = ({
  step,
  totalSteps,
  title,
  description,
  fields,
  readOnly = false,
  onNext,
  onPrevious,
  onboardingAnswers,
  updateOnboardingAnswer, // Now required if not readOnly
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    fields.forEach((field) => {
      if (field.required) {
        const value = onboardingAnswers[field.id];
        if (field.type === "checkbox") {
          if (!Array.isArray(value) || value.length === 0) {
            newErrors[field.id] = "Por favor selecciona al menos una opción.";
          }
        } else if (!value) {
          newErrors[field.id] = "Este campo es requerido.";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (readOnly || validateFields()) {
      onNext();
    }
  };

  const handleChange = (fieldId: keyof OnboardingAnswers, value: any) => {
    if (updateOnboardingAnswer) {
      updateOnboardingAnswer(fieldId, value);
      // Clear error for this field as soon as it's changed
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (fieldId: keyof OnboardingAnswers, option: string, checked: boolean) => {
    if (updateOnboardingAnswer) {
      const currentValues = (onboardingAnswers[fieldId] || []) as string[];
      const newValues = checked
        ? [...currentValues, option]
        : currentValues.filter((v) => v !== option);
      updateOnboardingAnswer(fieldId, newValues);
      // Clear error for this field if at least one option is selected
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (newValues.length > 0) {
          delete newErrors[fieldId];
        }
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-stone-900 font-display">{title}</h2>
        <p className="text-stone-500 max-w-md mx-auto">{description}</p>
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-6">
        {readOnly ? (
          // Review step
          <div className="space-y-4">
            {Object.entries(onboardingAnswers).map(([key, value]) => {
              // Find the field definition to get the label
              const fieldDef = fields.find(f => f.id === key);
              if (!fieldDef) return null; // Skip if field not defined in current panel's fields

              return (
                <div key={key} className="flex flex-col">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{fieldDef.label}</span>
                  <span className="text-sm font-semibold text-stone-800">
                    {Array.isArray(value) ? value.join(", ") : value?.toString() || "-"}
                  </span>
                </div>
              );
            })}
            {Object.keys(onboardingAnswers).length === 0 && (
              <p className="text-sm text-stone-500 text-center">No hay respuestas para revisar.</p>
            )}
          </div>
        ) : (
          // Input fields
          <div className="space-y-5">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label htmlFor={field.id} className="block text-sm font-semibold text-stone-800">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "text" && (
                  <>
                    <input
                      type="text"
                      id={field.id}
                      value={onboardingAnswers[field.id] as string || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-1 focus:ring-[#06434a]/30 focus:border-[#06434a] outline-none transition-colors"
                    />
                    {errors[field.id] && (
                      <p className="text-xs text-red-500 mt-1">{errors[field.id]}</p>
                    )}
                  </>
                )}
                {field.type === "select" && field.options && (
                  <>
                    <select
                      id={field.id}
                      value={onboardingAnswers[field.id] as string || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      required={field.required}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-1 focus:ring-[#06434a]/30 focus:border-[#06434a] outline-none transition-colors bg-white"
                    >
                      <option value="" disabled>Selecciona una opción</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors[field.id] && (
                      <p className="text-xs text-red-500 mt-1">{errors[field.id]}</p>
                    )}
                  </>
                )}
                {field.type === "checkbox" && field.options && (
                  <div className="flex flex-wrap gap-3">
                    {field.options.map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-stone-700">
                        <input
                          type="checkbox"
                          checked={(onboardingAnswers[field.id] as string[] || []).includes(option)}
                          onChange={(e) => handleCheckboxChange(field.id, option, e.target.checked)}
                          className="h-4 w-4 rounded border-stone-300 text-[#06434a] focus:ring-[#06434a]"
                        />
                        {option}
                      </label>
                    ))}
                    {errors[field.id] && (
                      <p className="text-xs text-red-500 mt-1">{errors[field.id]}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4 pt-4 border-t border-stone-200">
        {step > 1 && ( 
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPrevious}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors font-medium text-sm px-4 py-2 rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </motion.button>
        )}
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="ml-auto flex items-center gap-2 bg-[#06434a] hover:bg-[#0b5e67] text-white font-bold text-sm px-6 py-2 rounded-xl transition-colors shadow-sm"
        >
          {step < totalSteps ? "Siguiente" : <>Finalizar <Check className="h-4 w-4" /></>}
          {step < totalSteps && <ChevronRight className="h-4 w-4" />}
        </motion.button>
      </div>
    </div>
  );
};
