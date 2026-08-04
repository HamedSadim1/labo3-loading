import { createContext } from "react";
import type {
  ActivePanel,
  LoadingMetrics,
  LoadingStyle,
  ToastType,
} from "./types";

export interface AppContextType {
  loadingStyle: LoadingStyle;
  isLoading: boolean;
  theme: "dark" | "light";
  activePanel: ActivePanel;
  metrics: LoadingMetrics;
  setLoadingStyle: (style: LoadingStyle) => void;
  setIsLoading: (loading: boolean) => void;
  toggleTheme: () => void;
  addToast: (message: string, type?: ToastType) => void;
  recordLoadingStart: () => void;
  recordLoadingComplete: (durationMs: number) => void;
  openPanel: (panel: Exclude<ActivePanel, null>) => void;
  closePanel: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
