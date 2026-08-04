import type { LoadingMetrics, LoadingStyle } from "../context/types";

export interface StoredSettings {
  version?: 1;
  loadingStyle?: LoadingStyle;
  metrics?: LoadingMetrics;
}

const STORAGE_KEY = "labo3-loading-settings";
const MAX_RECENT_DURATIONS = 12;
const MAX_DURATION_MS = 24 * 60 * 60 * 1000;
export const DEFAULT_METRICS: LoadingMetrics = {
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

const normalizeStoredSettings = (value: unknown): StoredSettings => {
  if (!value || typeof value !== "object") return {};
  const candidate = value as Record<string, unknown>;

  return {
    version: candidate.version === 1 ? 1 : undefined,
    loadingStyle: isLoadingStyle(candidate.loadingStyle)
      ? candidate.loadingStyle
      : undefined,
    metrics: normalizeMetrics(candidate.metrics),
  };
};

export const readStoredSettings = (): StoredSettings => {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeStoredSettings(JSON.parse(stored)) : {};
  } catch {
    return {};
  }
};

export const writeStoredSettings = (settings: StoredSettings): void => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, ...settings }),
    );
  } catch {
    // Storage can be unavailable in private browsing or restricted iframes.
  }
};

export { MAX_DURATION_MS, MAX_RECENT_DURATIONS };
