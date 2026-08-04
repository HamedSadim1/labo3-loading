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
  LoadingStyle,
  ToastType,
  Toast as ToastItem,
} from "./types";

interface AppProviderProps {
  children: ReactNode;
}

interface StoredSettings {
  loadingStyle?: LoadingStyle;
  theme?: "dark" | "light";
  metrics?: LoadingMetrics;
}

const STORAGE_KEY = "labo3-loading-settings";
const DEFAULT_METRICS: LoadingMetrics = {
  totalRuns: 0,
  completedRuns: 0,
  totalDurationMs: 0,
  recentDurations: [],
};

const readStoredSettings = (): StoredSettings => {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as StoredSettings) : {};
  } catch {
    return {};
  }
};

const isLoadingMetrics = (value: unknown): value is LoadingMetrics => {
  if (!value || typeof value !== "object") return false;
  const metrics = value as Partial<LoadingMetrics>;
  const totalRuns = metrics.totalRuns;
  const completedRuns = metrics.completedRuns;
  const totalDurationMs = metrics.totalDurationMs;
  const recentDurations = metrics.recentDurations;

  if (
    typeof totalRuns !== "number" ||
    typeof completedRuns !== "number" ||
    typeof totalDurationMs !== "number" ||
    !Array.isArray(recentDurations)
  ) {
    return false;
  }

  return (
    Number.isInteger(totalRuns) &&
    totalRuns >= 0 &&
    Number.isInteger(completedRuns) &&
    completedRuns >= 0 &&
    completedRuns <= totalRuns &&
    Number.isFinite(totalDurationMs) &&
    totalDurationMs >= 0 &&
    recentDurations.every(
      (duration) =>
        typeof duration === "number" &&
        Number.isFinite(duration) &&
        duration >= 0,
    )
  );
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const storedSettings = readStoredSettings();
  const [loadingStyle, setLoadingStyle] = useState<LoadingStyle>(
    storedSettings.loadingStyle ?? "fidget",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(
    storedSettings.theme ?? "dark",
  );
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [metrics, setMetrics] = useState<LoadingMetrics>(
    isLoadingMetrics(storedSettings.metrics)
      ? storedSettings.metrics
      : DEFAULT_METRICS,
  );
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastTimers = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          loadingStyle,
          theme,
          metrics,
        } satisfies StoredSettings),
      );
    } catch {
      // Storage can be unavailable in private browsing or restricted iframes.
    }

    document.documentElement.dataset.theme = theme;
  }, [loadingStyle, theme, metrics]);

  useEffect(() => {
    return () => {
      toastTimers.current.forEach((timerId) => window.clearTimeout(timerId));
      toastTimers.current = [];
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);

    const timerId = window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      toastTimers.current = toastTimers.current.filter(
        (item) => item !== timerId,
      );
    }, 3200);
    toastTimers.current.push(timerId);
  }, []);

  const recordLoadingStart = useCallback(() => {
    setMetrics((previous) => ({
      ...previous,
      totalRuns: previous.totalRuns + 1,
    }));
  }, []);

  const recordLoadingComplete = useCallback((durationMs: number) => {
    setMetrics((previous) => ({
      ...previous,
      completedRuns: previous.completedRuns + 1,
      totalDurationMs: previous.totalDurationMs + durationMs,
      recentDurations: [...previous.recentDurations, durationMs].slice(-12),
    }));
  }, []);

  const openPanel = useCallback(
    (panel: Exclude<ActivePanel, null>) => {
      setActivePanel((current) => (current === panel ? null : panel));
    },
    [setActivePanel],
  );

  const closePanel = useCallback(() => {
    setActivePanel(null);
  }, [setActivePanel]);

  useEffect(() => {
    if (!activePanel) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [activePanel, closePanel]);

  const contextValue: AppContextType = {
    loadingStyle,
    isLoading,
    theme,
    activePanel,
    metrics,
    setLoadingStyle,
    setIsLoading,
    toggleTheme,
    addToast,
    recordLoadingStart,
    recordLoadingComplete,
    openPanel,
    closePanel,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:left-auto sm:right-4 sm:max-w-sm"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div className="pointer-events-auto w-full" key={toast.id}>
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() =>
                setToasts((prev) => prev.filter((item) => item.id !== toast.id))
              }
            />
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};
