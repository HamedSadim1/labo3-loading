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
  LoadingStyle,
  ToastType,
  Toast as ToastItem,
} from "./types";

interface AppProviderProps {
  children: ReactNode;
}

interface StoredSettings {
  version?: 1;
  loadingStyle?: LoadingStyle;
  metrics?: LoadingMetrics;
}

const STORAGE_KEY = "labo3-loading-settings";
let fallbackToastId = 0;
const MAX_RECENT_DURATIONS = 12;
const MAX_DURATION_MS = 24 * 60 * 60 * 1000;
const DEFAULT_LOADING: LoadingState = {
  status: "idle",
  stage: "idle",
  progress: 0,
};
const DEFAULT_METRICS: LoadingMetrics = {
  totalRuns: 0,
  completedRuns: 0,
  totalDurationMs: 0,
  recentDurations: [],
};

const isLoadingStyle = (value: unknown): value is LoadingStyle =>
  value === "fidget" ||
  value === "dots" ||
  value === "pulse" ||
  value === "bar" ||
  value === "spinner" ||
  value === "wave";

const normalizeMetrics = (value: unknown): LoadingMetrics => {
  if (!value || typeof value !== "object") return DEFAULT_METRICS;
  const metrics = value as Partial<LoadingMetrics>;
  const totalRuns =
    typeof metrics.totalRuns === "number" &&
    Number.isInteger(metrics.totalRuns) &&
    metrics.totalRuns >= 0
      ? metrics.totalRuns
      : 0;
  const completedRuns =
    typeof metrics.completedRuns === "number" &&
    Number.isInteger(metrics.completedRuns) &&
    metrics.completedRuns >= 0
      ? Math.min(metrics.completedRuns, totalRuns)
      : 0;
  const totalDurationMs =
    typeof metrics.totalDurationMs === "number" &&
    Number.isFinite(metrics.totalDurationMs) &&
    metrics.totalDurationMs >= 0
      ? Math.min(
          metrics.totalDurationMs,
          MAX_DURATION_MS * MAX_RECENT_DURATIONS,
        )
      : 0;
  const recentDurations = Array.isArray(metrics.recentDurations)
    ? metrics.recentDurations
        .filter(
          (duration): duration is number =>
            typeof duration === "number" &&
            Number.isFinite(duration) &&
            duration >= 0 &&
            duration <= MAX_DURATION_MS,
        )
        .slice(-MAX_RECENT_DURATIONS)
    : [];

  return { totalRuns, completedRuns, totalDurationMs, recentDurations };
};

const readStoredSettings = (): StoredSettings => {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as StoredSettings;
    return {
      version: parsed.version === 1 ? 1 : undefined,
      loadingStyle: isLoadingStyle(parsed.loadingStyle)
        ? parsed.loadingStyle
        : undefined,
      metrics: normalizeMetrics(parsed.metrics),
    };
  } catch {
    return {};
  }
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [storedSettings] = useState<StoredSettings>(() => readStoredSettings());
  const [loadingStyle, setLoadingStyle] = useState<LoadingStyle>(
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
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          loadingStyle,
          metrics,
        } satisfies StoredSettings),
      );
    } catch {
      // Storage can be unavailable in private browsing or restricted iframes.
    }
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
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `toast-${++fallbackToastId}`;
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
