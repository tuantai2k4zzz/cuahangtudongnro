'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog box */}
      <div
        className={cn(
          'relative w-full max-h-[92dvh] sm:max-h-[90vh] flex flex-col rounded-2xl border border-slate-700/80 bg-[#0F1523] p-3.5 sm:p-6 shadow-2xl shadow-cyan-500/10 z-10 animate-in fade-in-0 zoom-in-95 my-auto overflow-hidden',
          maxWidth
        )}
      >
        <div className="flex items-start sm:items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 shrink-0">
          <div className="pr-2 min-w-0 flex-1">
            <h2 className="text-base sm:text-xl font-bold text-white tracking-wide truncate sm:whitespace-normal">
              {title}
            </h2>
            {description && (
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-none">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 sm:mt-4 overflow-y-auto flex-1 pr-0.5 sm:pr-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
