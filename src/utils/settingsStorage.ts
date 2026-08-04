import type { LoadingMetrics, LoadingStyle } from "@/constants";
import { STORAGE_CONFIG } from "@/constants";
import { isLoadingStyle } from "@/utils/loading";
import { normalizeMetrics } from "@/utils/metrics";

export interface StoredSettings {
  version?: typeof STORAGE_CONFIG.version;
  loadingStyle?: LoadingStyle;
  metrics?: LoadingMetrics;
}

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
