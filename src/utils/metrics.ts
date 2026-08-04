import { STORAGE_CONFIG, type LoadingMetrics } from "@/constants";

export const createDefaultMetrics = (): LoadingMetrics => ({
  totalRuns: 0,
  completedRuns: 0,
  totalDurationMs: 0,
  recentDurations: [],
});

export const clampDuration = (durationMs: number): number =>
  Math.min(Math.max(durationMs, 0), STORAGE_CONFIG.maxDurationMs);

export const normalizeMetrics = (value: unknown): LoadingMetrics => {
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
