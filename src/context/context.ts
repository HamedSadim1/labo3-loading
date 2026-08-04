import { createContext } from "react";
import type {
  ActivePanel,
  LoadingMetrics,
  LoadingState,
  LoadingStyle,
  ToastType,
} from "@/context/types";

export interface AppContextType {
  loadingStyle: LoadingStyle;
  loading: LoadingState;
  activePanel: ActivePanel;
  metrics: LoadingMetrics;
  setLoadingStyle: (style: LoadingStyle) => void;
  setLoadingState: (state: LoadingState) => void;
  addToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
  recordLoadingStart: () => void;
  recordLoadingComplete: (durationMs: number) => void;
  openPanel: (panel: Exclude<ActivePanel, null>) => void;
  closePanel: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
