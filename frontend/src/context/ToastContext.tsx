import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Zap, Award, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'xp' | 'level';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  xpAmount?: number;
  levelName?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, options?: { xpAmount?: number; levelName?: string; duration?: number }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((
    message: string,
    type: ToastType,
    options?: { xpAmount?: number; levelName?: string; duration?: number }
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = options?.duration ?? 4000;

    const newToast: Toast = {
      id,
      message,
      type,
      xpAmount: options?.xpAmount,
      levelName: options?.levelName,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Internal Toast Component
const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const iconSize = 18;

  const config = {
    success: {
      border: 'border-emerald-500/20 shadow-emerald-950/20 bg-slate-900/95',
      icon: <CheckCircle2 size={iconSize} className="text-emerald-400 animate-pulse" />,
      textClass: 'text-slate-200',
    },
    error: {
      border: 'border-rose-500/20 shadow-rose-950/20 bg-slate-900/95',
      icon: <AlertCircle size={iconSize} className="text-rose-400 animate-bounce" />,
      textClass: 'text-slate-200',
    },
    info: {
      border: 'border-indigo-500/20 shadow-indigo-950/20 bg-slate-900/95',
      icon: <Info size={iconSize} className="text-indigo-400" />,
      textClass: 'text-slate-200',
    },
    xp: {
      border: 'border-amber-500/30 shadow-amber-500/5 bg-gradient-to-r from-slate-900 via-indigo-950/10 to-slate-900',
      icon: <Zap size={iconSize} fill="currentColor" className="text-amber-400 animate-pulse" />,
      textClass: 'text-amber-400 font-extrabold',
    },
    level: {
      border: 'border-violet-500/30 shadow-violet-500/10 bg-gradient-to-r from-purple-950/20 via-violet-900/10 to-slate-950',
      icon: <Award size={iconSize} className="text-violet-400 animate-pulse" />,
      textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500 font-extrabold',
    },
  };

  const style = config[toast.type] || config.info;

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3.5 p-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-x-0 animate-slide-in ${style.border}`}
      role="alert"
    >
      <div className="flex-shrink-0">{style.icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold leading-relaxed ${style.textClass}`}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800/50 transition-all"
      >
        <X size={14} />
      </button>
    </div>
  );
};
