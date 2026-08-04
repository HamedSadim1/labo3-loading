export type LoadingStyle =
  "fidget" | "dots" | "pulse" | "bar" | "spinner" | "wave";

export type LoadingStage =
  "idle" | "initializing" | "processing" | "finalizing" | "complete";

export type ToastType = "success" | "error" | "info" | "warning";

export type ActivePanel = "dashboard" | "chat" | "settings" | null;

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
