import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    custom: (toast: Omit<ToastItem, "id">) => void;
  };
  dismiss: (id: string) => void;
  toasts: ToastItem[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { id, type, message, title, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }, [dismiss]);

  const toast = {
    success: (message: string, title?: string) => addToast("success", message, title),
    error: (message: string, title?: string) => addToast("error", message, title),
    info: (message: string, title?: string) => addToast("info", message, title),
    warning: (message: string, title?: string) => addToast("warning", message, title),
    custom: (t: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { ...t, id }]);
      if (t.duration !== 0) {
        setTimeout(() => {
          dismiss(id);
        }, t.duration || 5000);
      }
    }
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((item) => (
            <ToastCard key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

interface ToastCardProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ item, onDismiss }) => {
  const { id, type, title, message } = item;

  // Icon selector based on type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-sky-600 shrink-0" />;
    }
  };

  // Color theme selector based on type
  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-emerald-50/95 border-emerald-200 text-emerald-950 shadow-emerald-100/30";
      case "error":
        return "bg-rose-50/95 border-rose-200 text-rose-950 shadow-rose-100/30";
      case "warning":
        return "bg-amber-50/95 border-amber-200 text-amber-950 shadow-amber-100/30";
      case "info":
      default:
        return "bg-sky-50/95 border-sky-200 text-sky-950 shadow-sky-100/30";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
      className={`pointer-events-auto flex gap-3 p-4 border rounded-2xl shadow-xl backdrop-blur-xs relative overflow-hidden font-sans ${getColors()}`}
    >
      <div className="pt-0.5">{getIcon()}</div>
      
      <div className="flex-1 pr-4">
        {title && (
          <h4 className="text-sm font-bold tracking-tight mb-0.5 leading-tight">
            {title}
          </h4>
        )}
        <p className="text-xs leading-relaxed opacity-90">{message}</p>
      </div>

      <button
        onClick={() => onDismiss(id)}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 opacity-60 hover:opacity-100 transition-all cursor-pointer"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  );
};
