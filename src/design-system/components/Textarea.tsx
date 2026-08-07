import React from "react";
import { cn } from "../utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  helperText?: string;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, label, id, disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={id} className="font-sans text-xs font-bold text-stone-600 block select-none">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-stone-200 bg-white text-stone-850 outline-hidden transition-all placeholder:text-stone-400 focus:border-2 focus:border-[#06434a] focus:ring-1 focus:ring-[#06434a]/20 focus:shadow-xs resize-y min-h-[80px]",
            error && "border-2 border-rose-500 bg-rose-50/30 text-rose-800 placeholder:text-rose-300 focus:border-rose-600 focus:ring-rose-200",
            disabled && "bg-stone-50 text-stone-400 border-stone-150 cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-[11px] font-semibold text-rose-600">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-stone-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
