import React from 'react';
import { useRailSync } from '../../context/RailSyncContext';

export const Toast: React.FC = () => {
  const { toastMessage, dismissToast } = useRailSync();

  if (!toastMessage) return null;

  const bgStyles = {
    success: 'bg-primary text-on-primary border-tertiary-fixed-dim/50',
    info: 'bg-primary-container text-on-primary border-secondary/50',
    warning: 'bg-[#4a2800] text-[#ffddb8] border-[#ffb870]/40',
    error: 'bg-error text-on-error border-error-container/40'
  }[toastMessage.type];

  const iconName = {
    success: 'check_circle',
    info: 'info',
    warning: 'warning',
    error: 'error'
  }[toastMessage.type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md">
      <div className={`flex items-start gap-3 p-4 rounded-lg shadow-xl border ${bgStyles}`}>
        <span
          className="material-symbols-outlined text-[20px] mt-0.5"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {iconName}
        </span>
        <div className="flex-1 text-sm font-medium leading-snug">
          {toastMessage.text}
        </div>
        <button
          onClick={dismissToast}
          className="text-xs opacity-70 hover:opacity-100 cursor-pointer ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export const ToastContainer = Toast;

