export type LoadingStyle = "fidget" | "dots" | "pulse" | "bar" | "spinner";

export type ToastType = "success" | "error" | "info" | "warning";

export type ActivePanel = "dashboard" | "chat" | "settings" | null;

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export interface LoadingMetrics {
  totalRuns: number;
  completedRuns: number;
  totalDurationMs: number;
  recentDurations: number[];
}
