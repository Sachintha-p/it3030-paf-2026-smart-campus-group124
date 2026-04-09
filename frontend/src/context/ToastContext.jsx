import React, { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ToastContext = createContext(null);

const warningToast = (message, options = {}) =>
  toast(message, {
    icon: '⚠️',
    style: {
      background: '#172040',
      color: '#e2e8f0',
      border: '1px solid rgba(245, 158, 11, 0.25)',
    },
    ...options,
  });

export const ToastProvider = ({ children }) => {
  const value = {
    success: (message, options) => toast.success(message, options),
    error: (message, options) => toast.error(message, options),
    warning: (message, options) => warningToast(message, options),
    info: (message, options) => toast(message, options),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1a2032',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          },
          success: {
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#0f1629',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0f1629',
            },
          },
        }}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
