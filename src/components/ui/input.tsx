import * as React from "react"

import { cn } from "@/src/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, helperText, error, id, disabled, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-stone-400 select-none">
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06434a]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
            error && "border-rose-400 bg-rose-50 text-rose-800",
            className
          )}
          ref={ref}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {error ? (
          <p className="text-[11px] font-semibold text-rose-600">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-stone-400">{helperText}</p>
        ) : null}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
