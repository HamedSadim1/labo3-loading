import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import Toast from "@/components/Toast";
import {
  APP_CONFIG,
  DEFAULT_LOADING_STYLE,
  STORAGE_CONFIG,
  DOM_IDS,
  ID_PREFIXES,
} from "@/constants";
import { AppContext, type AppContextType } from "@/context/context";
import type {
  ActivePanel,
  LoadingMetrics,
  ToastType,
  Toast as ToastItem,
} from "@/context/types";
import { createId } from "@/utils/createId";
import { createDefaultLoadingState } from "@/utils/loading";
import { clampDuration, createDefaultMetrics } from "@/utils/metrics";
import {
  readStoredSettings,
  writeStoredSettings,
} from "@/utils/settingsStorage";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [storedSettings] = useState(() => readStoredSettings());
  const [loadingStyle, setLoadingStyle] = useState(
    storedSettings.loadingStyle ?? DEFAULT_LOADING_STYLE,
  );
  const [loading, setLoadingState] = useState(createDefaultLoadingState);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [metrics, setMetrics] = useState<LoadingMetrics>(
    storedSettings.metrics ?? createDefaultMetrics(),
  );
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastTimers = useRef(new Map<string, number>());

  useEffect(() => {
    writeStoredSettings({ loadingStyle, metrics });
  }, [loadingStyle, metrics]);

  useEffect(() => {
    const activeIds = new Set(toasts.map((toast) => toast.id));
    toastTimers.current.forEach((timerId, id) => {
      if (!activeIds.has(id)) {
        window.clearTimeout(timerId);
        toastTimers.current.delete(id);
      }
    });
  }, [toasts]);

  useEffect(() => {
    const timers = toastTimers.current;
    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
      timers.clear();
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    const timerId = toastTimers.current.get(id);
    if (timerId !== undefined) {
      window.clearTimeout(timerId);
      toastTimers.current.delete(id);
    }
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = createId(ID_PREFIXES.toast);
      setToasts((previous) =>
        [...previous, { id, message, type }].slice(
          -APP_CONFIG.toast.maxVisible,
        ),
      );

      const timerId = window.setTimeout(
        () => dismissToast(id),
        APP_CONFIG.toast.dismissDelayMs,
      );
      toastTimers.current.set(id, timerId);
    },
    [dismissToast],
  );

  const recordLoadingStart = useCallback(() => {
    setMetrics((previous) => ({
      ...previous,
      totalRuns: previous.totalRuns + 1,
    }));
  }, []);

  const recordLoadingComplete = useCallback((durationMs: number) => {
    const safeDuration = clampDuration(durationMs);
    setMetrics((previous) => ({
      ...previous,
      completedRuns: previous.completedRuns + 1,
      totalDurationMs: previous.totalDurationMs + safeDuration,
      recentDurations: [...previous.recentDurations, safeDuration].slice(
        -STORAGE_CONFIG.maxRecentDurations,
      ),
    }));
  }, []);

  const openPanel = useCallback((panel: Exclude<ActivePanel, null>) => {
    setActivePanel((current) => (current === panel ? null : panel));
  }, []);

  const closePanel = useCallback(() => {
    setActivePanel(null);
  }, []);

  const contextValue: AppContextType = {
    loadingStyle,
    loading,
    activePanel,
    metrics,
    setLoadingStyle,
    setLoadingState,
    addToast,
    dismissToast,
    recordLoadingStart,
    recordLoadingComplete,
    openPanel,
    closePanel,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div id={DOM_IDS.appShell}>{children}</div>
      <div className="pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-60 flex flex-col items-end gap-2 sm:left-auto sm:right-4 sm:max-w-sm">
        {toasts.map((toast) => (
          <div className="pointer-events-auto w-full" key={toast.id}>
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => dismissToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};
