export type { LoadingStyle } from "../constants/loadingStyles";

export type LoadingStage =
  "idle" | "initializing" | "processing" | "finalizing" | "complete";

export type ToastType = "success" | "error" | "info" | "warning";

import type { PanelKey } from "../constants/panels";

export type ActivePanel = PanelKey | null;

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface LoadingMetrics {
  totalRuns: number;
  completedRuns: number;
  totalDurationMs: number;
  recentDurations: number[];
}

export interface LoadingState {
  status: "idle" | "running" | "complete";
  stage: LoadingStage;
  progress: number;
}
