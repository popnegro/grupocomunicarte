import React from "react";
import { cn } from "../utils/cn";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  helperText?: string;
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, helperText, label, id, disabled, options, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={id} className="font-sans text-xs font-bold text-stone-600 block select-none">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-stone-200 bg-white text-stone-850 outline-hidden transition-all placeholder:text-stone-400 focus:border-2 focus:border-[#06434a] focus:ring-1 focus:ring-[#06434a]/20 focus:shadow-xs appearance-none pr-8 cursor-pointer",
              error && "border-2 border-rose-500 bg-rose-50/30 text-rose-800 focus:border-rose-600 focus:ring-rose-200",
              disabled && "bg-stone-50 text-stone-400 border-stone-150 cursor-not-allowed",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-stone-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {error ? (
          <p className="text-[11px] font-semibold text-rose-600">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-stone-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
