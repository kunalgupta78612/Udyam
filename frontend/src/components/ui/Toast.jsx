import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxWidth: '380px',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => {
          let icon = <Info size={18} color="var(--color-primary)" />;
          let borderColor = 'var(--color-primary)';
          let bgColor = 'var(--color-surface)';

          if (toast.type === 'success') {
            icon = <CheckCircle2 size={18} color="var(--color-success)" />;
            borderColor = 'var(--color-success)';
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle size={18} color="var(--color-warning)" />;
            borderColor = 'var(--color-warning)';
          } else if (toast.type === 'error') {
            icon = <AlertCircle size={18} color="var(--color-danger)" />;
            borderColor = 'var(--color-danger)';
          }

          return (
            <div
              key={toast.id}
              className="card card-elevated animate-slide-up"
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1.1rem',
                backgroundColor: bgColor,
                borderLeft: `4px solid ${borderColor}`,
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                fontSize: '0.875rem',
                color: 'var(--color-text)',
              }}
            >
              <div>{icon}</div>
              <div style={{ flex: 1 }}>{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  padding: 0,
                  display: 'flex',
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (msg) => console.log('Toast:', msg),
      removeToast: () => {},
    };
  }
  return context;
}
