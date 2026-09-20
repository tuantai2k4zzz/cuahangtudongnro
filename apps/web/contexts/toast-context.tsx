'use client';

import * as React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

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
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    showToast: (opts: {
      type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';
      title?: string;
      message: string;
    }) => void;
  };
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = React.useCallback(
    (type: ToastType, message: string, title?: string, duration = 3500) => {
      const id = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, message, title, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useMemo(
    () => ({
      success: (msg: string, title?: string) => addToast('success', msg, title),
      error: (msg: string, title?: string) => addToast('error', msg, title),
      warning: (msg: string, title?: string) => addToast('warning', msg, title),
      info: (msg: string, title?: string) => addToast('info', msg, title),
      showToast: (opts: {
        type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';
        title?: string;
        message: string;
      }) => {
        const typeMap: Record<string, ToastType> = {
          SUCCESS: 'success',
          ERROR: 'error',
          WARNING: 'warning',
          INFO: 'info',
        };
        addToast(typeMap[opts.type] || 'info', opts.message, opts.title);
      },
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
        {toasts.map((t) => {
          const config = {
            success: {
              border: 'border-emerald-500/40',
              bg: 'bg-[#0B1512]/95 text-emerald-300',
              icon: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />,
            },
            error: {
              border: 'border-rose-500/40',
              bg: 'bg-[#180A0E]/95 text-rose-300',
              icon: <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />,
            },
            warning: {
              border: 'border-amber-500/40',
              bg: 'bg-[#181206]/95 text-amber-300',
              icon: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />,
            },
            info: {
              border: 'border-cyan-500/40',
              bg: 'bg-[#06141A]/95 text-cyan-300',
              icon: <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />,
            },
          }[t.type];

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border p-3.5 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${config.border} ${config.bg}`}
            >
              {config.icon}
              <div className="flex-1 text-xs">
                {t.title && <div className="font-bold text-white mb-0.5">{t.title}</div>}
                <div className="leading-relaxed opacity-95">{t.message}</div>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white p-0.5 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}
