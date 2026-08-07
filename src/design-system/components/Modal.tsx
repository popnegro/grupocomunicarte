import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Content wrapper */}
      <div className={cn(
        "bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden w-full relative z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200",
        sizes[size]
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-stone-100">
          {title ? (
            <h3 className="text-lg font-bold font-display text-stone-900">{title}</h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-stone-50"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto text-left text-sm text-stone-500 font-medium leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
