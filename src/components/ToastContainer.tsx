// src/components/ToastContainer.tsx
import React, { useEffect } from 'react';
import { ToastMessage } from '../types';
import { Trophy, Target, Award, AlertTriangle, Info, X } from 'lucide-react';

export type { ToastMessage };

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const duration = toast.duration ?? 4000;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, toast.duration, onDismiss]);

  const getStyleAndIcon = () => {
    switch (toast.type) {
      case 'achievement':
        return {
          border: 'border-amber-500/60 bg-amber-950/80 text-amber-200 shadow-amber-500/20',
          titleColor: 'text-amber-400',
          icon: <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
        };
      case 'goal':
        return {
          border: 'border-emerald-500/60 bg-emerald-950/80 text-emerald-200 shadow-emerald-500/20',
          titleColor: 'text-emerald-400',
          icon: <Target className="w-5 h-5 text-emerald-400 shrink-0" />
        };
      case 'promotion':
        return {
          border: 'border-cyan-500/60 bg-cyan-950/80 text-cyan-200 shadow-cyan-500/20',
          titleColor: 'text-cyan-300',
          icon: <Award className="w-5 h-5 text-cyan-300 shrink-0" />
        };
      case 'crisis':
        return {
          border: 'border-red-500/70 bg-red-950/90 text-red-200 shadow-red-500/30 animate-pulse',
          titleColor: 'text-red-400',
          icon: <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
        };
      case 'info':
      default:
        return {
          border: 'border-blue-500/60 bg-blue-950/80 text-blue-200 shadow-blue-500/20',
          titleColor: 'text-blue-300',
          icon: <Info className="w-5 h-5 text-blue-300 shrink-0" />
        };
    }
  };

  const style = getStyleAndIcon();

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start space-x-3 p-3.5 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 transform translate-y-0 opacity-100 ${style.border}`}
    >
      <div className="mt-0.5">{style.icon}</div>
      <div className="flex-1 min-w-0 pr-1">
        <h4 className={`text-xs font-bold leading-tight ${style.titleColor}`}>
          {toast.title}
        </h4>
        <p className="text-[11px] opacity-90 mt-0.5 leading-snug break-words">
          {toast.description}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        aria-label="알림 닫기"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <aside
      aria-label="알림 피드백"
      className="fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </aside>
  );
};

export default ToastContainer;
