import type { LoadingMetrics, LoadingStyle } from "../constants";
import {
  createDefaultMetrics,
  isLoadingStyle,
  STORAGE_CONFIG,
} from "../constants";

export interface StoredSettings {
  version?: typeof STORAGE_CONFIG.version;
  loadingStyle?: LoadingStyle;
  metrics?: LoadingMetrics;
}

const normalizeMetrics = (value: unknown): LoadingMetrics => {
  if (!value || typeof value !== "object") return createDefaultMetrics();
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
          STORAGE_CONFIG.maxDurationMs * STORAGE_CONFIG.maxRecentDurations,
        )
      : 0;
  const recentDurations = Array.isArray(metrics.recentDurations)
    ? metrics.recentDurations
        .filter(
          (duration): duration is number =>
            typeof duration === "number" &&
            Number.isFinite(duration) &&
            duration >= 0 &&
            duration <= STORAGE_CONFIG.maxDurationMs,
        )
        .slice(-STORAGE_CONFIG.maxRecentDurations)
    : [];

  return { totalRuns, completedRuns, totalDurationMs, recentDurations };
};

const normalizeStoredSettings = (value: unknown): StoredSettings => {
  if (!value || typeof value !== "object") return {};
  const candidate = value as Record<string, unknown>;

  return {
    version:
      candidate.version === STORAGE_CONFIG.version
        ? STORAGE_CONFIG.version
        : undefined,
    loadingStyle: isLoadingStyle(candidate.loadingStyle)
      ? candidate.loadingStyle
      : undefined,
    metrics: normalizeMetrics(candidate.metrics),
  };
};

export const readStoredSettings = (): StoredSettings => {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.localStorage.getItem(STORAGE_CONFIG.key);
    return stored ? normalizeStoredSettings(JSON.parse(stored)) : {};
  } catch {
    return {};
  }
};

export const writeStoredSettings = (settings: StoredSettings): void => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      STORAGE_CONFIG.key,
      JSON.stringify({ version: STORAGE_CONFIG.version, ...settings }),
    );
  } catch {
    // Storage can be unavailable in private browsing or restricted iframes.
  }
};
