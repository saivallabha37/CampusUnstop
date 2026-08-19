import React from 'react';
import { createPortal } from 'react-dom';

const dialogStyles = {
  success: {
    iconColor: 'text-emerald-300',
    badgeClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
  },
  error: {
    iconColor: 'text-red-300',
    badgeClass: 'bg-red-500/20 text-red-200 border-red-400/30'
  },
  warning: {
    iconColor: 'text-amber-300',
    badgeClass: 'bg-amber-500/20 text-amber-200 border-amber-400/30'
  },
  information: {
    iconColor: 'text-blue-300',
    badgeClass: 'bg-blue-500/20 text-blue-200 border-blue-400/30'
  },
  confirmation: {
    iconColor: 'text-purple-300',
    badgeClass: 'bg-purple-500/20 text-purple-200 border-purple-400/30'
  }
};

const iconForType = (type) => {
  if (type === 'success') {
    return <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.53-9.78a.75.75 0 10-1.06-1.06L9.25 10.38 7.53 8.66a.75.75 0 10-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l3.75-3.75z" clipRule="evenodd" />;
  }
  if (type === 'error') {
    return <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.22 7.16a.75.75 0 011.06 0L10 7.88l.72-.72a.75.75 0 111.06 1.06L11.06 9l.72.72a.75.75 0 11-1.06 1.06L10 10.06l-.72.72a.75.75 0 11-1.06-1.06L8.94 9l-.72-.72a.75.75 0 010-1.06z" clipRule="evenodd" />;
  }
  if (type === 'warning') {
    return <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l5.715 10.16c.75 1.334-.213 2.991-1.742 2.991H4.284c-1.53 0-2.492-1.657-1.742-2.992l5.715-10.16zM10 7a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 0010 7zm0 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />;
  }
  return <path fillRule="evenodd" d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-8.75 3.25a.75.75 0 001.5 0v-3.5a.75.75 0 00-1.5 0v3.5zm.75-5.5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />;
};

const CampusDialog = ({
  open,
  type = 'information',
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
  onConfirm,
  onCancel
}) => {
  if (!open) {
    return null;
  }

  const style = dialogStyles[type] || dialogStyles.information;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg transform transition-all duration-300 scale-100">
        <div className="glass-dark border border-slate-700/60 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.2)] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 rounded-full border px-2 py-1 ${style.badgeClass}`}>
              <svg className={`w-7 h-7 ${style.iconColor}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                {iconForType(type)}
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{message}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            {showCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-600 text-gray-200 hover:bg-slate-700/60 transition-colors duration-200"
              >
                {cancelText}
              </button>
            )}
            <button
              type="button"
              onClick={onConfirm}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold transition-all duration-200"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CampusDialog;
