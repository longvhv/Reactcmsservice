import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ type, message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />
  };

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const textColors = {
    success: 'text-green-900',
    error: 'text-red-900',
    info: 'text-blue-900'
  };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2">
      <div className={`${backgrounds[type]} border rounded-xl shadow-2xl p-4 flex items-center gap-3 min-w-[300px] max-w-md`}>
        {icons[type]}
        <div className={`flex-1 font-medium ${textColors[type]}`}>
          {message}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/50 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Toast Container Component
export function ToastContainer() {
  return null; // Placeholder - individual components manage their own toasts
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{
    id: number;
    type: 'success' | 'error' | 'info';
    message: string;
  }>>([]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return {
    toasts,
    showSuccess: (message: string) => showToast('success', message),
    showError: (message: string) => showToast('error', message),
    showInfo: (message: string) => showToast('info', message),
    removeToast
  };
}

// Simple toast notification function (for backward compatibility)
const toast = {
  success: (message: string) => {
    console.log('✅', message);
    // In a real app, this would trigger a toast notification
  },
  error: (message: string) => {
    console.error('❌', message);
  },
  info: (message: string) => {
    console.info('ℹ️', message);
  }
};

export default toast;