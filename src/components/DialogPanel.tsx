import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { DIALOG_CONFIG, DOM_IDS } from "@/constants";

interface DialogPanelProps {
  id: string;
  titleId: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const DialogPanel: React.FC<DialogPanelProps> = ({
  id,
  titleId,
  open,
  onClose,
  children,
  className = "",
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const appShell = document.getElementById(DOM_IDS.appShell);
    const previousAriaHidden = appShell?.getAttribute("aria-hidden") ?? null;
    const previousInert = appShell?.inert ?? false;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    if (appShell) {
      appShell.setAttribute("aria-hidden", "true");
      appShell.inert = true;
    }

    const panel = panelRef.current;
    const focusableSelector = DIALOG_CONFIG.focusableSelector;
    const getFocusable = () =>
      panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(focusableSelector),
          ).filter(
            (element) =>
              !element.hasAttribute("hidden") &&
              element.getClientRects().length > 0,
          )
        : [];

    getFocusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panel) return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (appShell) {
        if (previousAriaHidden === null)
          appShell.removeAttribute("aria-hidden");
        else appShell.setAttribute("aria-hidden", previousAriaHidden);
        appShell.inert = previousInert;
      }
      window.requestAnimationFrame(() => {
        const nextDialog = document.querySelector('[role="dialog"]');
        const previousFocus = previousFocusRef.current;
        if (
          !nextDialog &&
          previousFocus?.isConnected &&
          !previousFocus.hasAttribute("disabled") &&
          !previousFocus.closest("[hidden]")
        ) {
          previousFocus.focus({ preventScroll: true });
        }
      });
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[90] bg-slate-950/55 backdrop-blur-[2px]"
        onMouseDown={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`fixed inset-x-3 top-[max(4.5rem,env(safe-area-inset-top))] z-[100] flex max-h-[calc(100dvh_-_6rem_-_env(safe-area-inset-bottom))] flex-col overflow-hidden overscroll-contain rounded-2xl border border-white/20 bg-slate-900/95 shadow-2xl shadow-slate-950/30 backdrop-blur-xl motion-safe:animate-slide-up sm:inset-x-auto sm:right-4 sm:top-[calc(4.5rem_+_env(safe-area-inset-top))] sm:mt-2 sm:max-h-[calc(100dvh_-_7rem_-_env(safe-area-inset-bottom))] sm:bg-white/10 ${className}`}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </>,
    document.body,
  );
};

export default DialogPanel;
