import type {
  LoadingMetrics,
  LoadingState,
  LoadingStyle,
  PanelKey,
} from "@/constants";

export type { LoadingState, LoadingStyle };

export type ActivePanel = PanelKey | null;

export type ToastType = "success" | "error" | "info" | "warning";

export type { LoadingMetrics };

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
