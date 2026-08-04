import React from "react";
import type { ToastType } from "@/context/types";
import { UI_COPY } from "@/constants";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const typeStyles: Record<ToastType, string> = {
    success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    error: "border-rose-400/25 bg-rose-400/10 text-rose-200",
    warning: "border-amber-400/25 bg-amber-400/10 text-amber-200",
    info: "border-cyan-400/25 bg-cyan-400/10 text-cyan-100",
  };

  const icons: Record<ToastType, React.ReactNode> = {
    success: <span aria-hidden="true">✓</span>,
    error: <span aria-hidden="true">×</span>,
    warning: <span aria-hidden="true">!</span>,
    info: <span aria-hidden="true">i</span>,
  };

  return (
    <div
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl shadow-slate-950/30 backdrop-blur-xl animate-slide-up ${typeStyles[type]}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current/30 text-xs font-bold">
        {icons[type]}
      </span>
      <span className="min-w-0 flex-1 text-sm font-medium">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="min-h-11 min-w-11 rounded-lg p-1 text-current/80 transition hover:bg-white/10 hover:text-current focus:outline-none focus-visible:ring-2 focus-visible:ring-current/50"
        aria-label={UI_COPY.dismissMessage}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
};

export default Toast;
