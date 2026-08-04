import React, { useEffect, useRef } from "react";

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

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusableSelector =
      'button:not([disabled]):not([aria-hidden="true"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [contenteditable="true"], [tabindex]:not([tabindex="-1"])';
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
      if (focusable.length === 0) return;

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

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px]"
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
        className={`fixed inset-x-3 top-20 z-50 max-h-[calc(100dvh-6rem)] overflow-hidden rounded-2xl border border-white/20 bg-slate-900/95 shadow-2xl shadow-slate-950/30 backdrop-blur-xl animate-slide-up sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-[calc(100dvh-7rem)] sm:bg-white/10 ${className}`}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </>
  );
};

export default DialogPanel;
