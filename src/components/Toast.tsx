// Toast Notification System
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

let toastId = 0;
const toastListeners: Array<(toast: Toast) => void> = [];

export const toast = {
  success: (message: string, duration = 3000) => {
    const newToast: Toast = { id: toastId++, type: 'success', message, duration };
    toastListeners.forEach(listener => listener(newToast));
  },
  error: (message: string, duration = 3000) => {
    const newToast: Toast = { id: toastId++, type: 'error', message, duration };
    toastListeners.forEach(listener => listener(newToast));
  },
  warning: (message: string, duration = 3000) => {
    const newToast: Toast = { id: toastId++, type: 'warning', message, duration };
    toastListeners.forEach(listener => listener(newToast));
  },
  info: (message: string, duration = 3000) => {
    const newToast: Toast = { id: toastId++, type: 'info', message, duration };
    toastListeners.forEach(listener => listener(newToast));
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts(prev => [...prev, toast]);
      
      if (toast.duration) {
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, toast.duration);
      }
    };

    toastListeners.push(listener);

    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      default: return null;
    }
  };

  const getToastColor = (type: string) => {
    switch (type) {
      case 'success': return 'from-green-500 to-green-600 text-white';
      case 'error': return 'from-red-500 to-red-600 text-white';
      case 'warning': return 'from-orange-500 to-orange-600 text-white';
      case 'info': return 'from-blue-500 to-blue-600 text-white';
      default: return 'from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="fixed top-20 right-6 z-[100] space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto bg-gradient-to-r ${getToastColor(toast.type)} rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 animate-slide-in-right min-w-[320px]`}
        >
          {getToastIcon(toast.type)}
          <span className="flex-1 font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// Export for global use
export default toast;