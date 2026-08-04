import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import Toast from "../components/Toast";
import { AppContext, type AppContextType } from "./context";
import type {
  ActivePanel,
  LoadingMetrics,
  LoadingState,
  ToastType,
  Toast as ToastItem,
} from "./types";
import { createId } from "../utils/createId";
import {
  DEFAULT_METRICS,
  MAX_DURATION_MS,
  MAX_RECENT_DURATIONS,
  readStoredSettings,
  writeStoredSettings,
} from "../utils/settingsStorage";

interface AppProviderProps {
  children: ReactNode;
}

const DEFAULT_LOADING: LoadingState = {
  status: "idle",
  stage: "idle",
  progress: 0,
};
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [storedSettings] = useState(() => readStoredSettings());
  const [loadingStyle, setLoadingStyle] = useState(
    storedSettings.loadingStyle ?? "fidget",
  );
  const [loading, setLoadingState] = useState<LoadingState>(DEFAULT_LOADING);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [metrics, setMetrics] = useState<LoadingMetrics>(
    storedSettings.metrics ?? DEFAULT_METRICS,
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
      const id = createId("toast");
      setToasts((previous) => [...previous, { id, message, type }].slice(-3));

      const timerId = window.setTimeout(() => dismissToast(id), 3200);
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
    const safeDuration = Math.min(Math.max(durationMs, 0), MAX_DURATION_MS);
    setMetrics((previous) => ({
      ...previous,
      completedRuns: previous.completedRuns + 1,
      totalDurationMs: previous.totalDurationMs + safeDuration,
      recentDurations: [...previous.recentDurations, safeDuration].slice(
        -MAX_RECENT_DURATIONS,
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
      <div id="app-shell">{children}</div>
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
