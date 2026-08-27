import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        right: '1.75rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.75rem 1.1rem',
        borderRadius: 'var(--radius-sm)',
        background: isSuccess
          ? '#0a1d17'
          : isError
          ? '#1f0d12'
          : 'var(--bg-surface-2)',
        border: `1px solid ${
          isSuccess
            ? 'rgba(16, 185, 129, 0.4)'
            : isError
            ? 'rgba(244, 63, 94, 0.4)'
            : 'var(--border-medium)'
        }`,
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
        color: '#ffffff',
        fontSize: '0.875rem',
        fontWeight: 500,
        maxWidth: '400px',
        animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {isSuccess && <CheckCircle2 size={18} color="#10b981" />}
      {isError && <AlertCircle size={18} color="#f43f5e" />}
      {!isSuccess && !isError && <Info size={18} color="#00d2ff" />}

      <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>

      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-tertiary)',
          cursor: 'pointer',
          padding: '0.2rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}
