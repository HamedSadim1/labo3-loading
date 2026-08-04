export type LoadingStyle = "fidget" | "dots" | "pulse" | "bar" | "spinner";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}
