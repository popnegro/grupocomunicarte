import React from 'react';
import { Sparkles } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-bold py-3 px-5 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
      <span>{message}</span>
    </div>
  );
};
