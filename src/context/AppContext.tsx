import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { LoadingStyle, ToastType, Toast } from "./types";

interface AppState {
  loadingStyle: LoadingStyle;
  isLoading: boolean;
  theme: "dark" | "light";
}

export interface AppContextType extends AppState {
  setLoadingStyle: (style: LoadingStyle) => void;
  setIsLoading: (loading: boolean) => void;
  toggleTheme: () => void;
  addToast: (message: string, type?: ToastType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [loadingStyle, setLoadingStyle] = useState<LoadingStyle>("fidget");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        loadingStyle,
        isLoading,
        theme,
        setLoadingStyle,
        setIsLoading,
        toggleTheme,
        addToast,
      }}
    >
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl backdrop-blur-xl border shadow-2xl animate-slide-up flex items-center gap-3 min-w-[280px] ${
              toast.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                : toast.type === "error"
                  ? "bg-red-500/20 border-red-500/30 text-red-300"
                  : toast.type === "warning"
                    ? "bg-amber-500/20 border-amber-500/30 text-amber-300"
                    : "bg-blue-500/20 border-blue-500/30 text-blue-300"
            }`}
          >
            {toast.type === "success" && (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {toast.type === "error" && (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {toast.type === "warning" && (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            )}
            {toast.type === "info" && (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}

            <span className="text-sm font-medium">{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Sluiten"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export default AppContext;
