import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#111c2d] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#3b485d] flex items-center gap-3 text-xs max-w-sm">
        <span className="material-symbols-outlined text-[#82f5c1] text-lg">check_circle</span>
        <span className="flex-1 font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>
  );
};
