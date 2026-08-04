import React from "react";
import { useApp } from "../context/useApp";
import type { LoadingStyle } from "../context/types";

const LOADING_STYLES: { value: LoadingStyle; label: string; icon: string }[] = [
  { value: "fidget", label: "Fidget Spinner", icon: "🔄" },
  { value: "dots", label: "Bouncing Dots", icon: "⚫" },
  { value: "pulse", label: "Pulse Ring", icon: "⭕" },
  { value: "bar", label: "Progress Bar", icon: "📊" },
  { value: "spinner", label: "Classic Spinner", icon: "💫" },
];

const Settings: React.FC = () => {
  const {
    loadingStyle,
    setLoadingStyle,
    addToast,
    activePanel,
    openPanel,
    closePanel,
  } = useApp();
  const isOpen = activePanel === "settings";

  const handleStyleChange = (style: LoadingStyle) => {
    setLoadingStyle(style);
    const styleName = LOADING_STYLES.find((s) => s.value === style)?.label;
    addToast(`Loading stijl gewijzigd naar ${styleName}`, "success");
  };

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        onClick={() => openPanel("settings")}
        className="group relative p-2.5 sm:p-3 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label="Instellingen"
        aria-expanded={isOpen}
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Settings Panel - responsive */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Instellingen"
          className="fixed inset-x-3 top-20 z-50 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-white/20 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl animate-fade-in sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 sm:max-h-none sm:overflow-visible sm:bg-white/10 sm:p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              Instellingen
            </h3>
            <button
              onClick={closePanel}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              aria-label="Sluiten"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
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

          {/* Loading Style Selection */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-white/80 mb-2 sm:mb-3">
              Loading Stijl
            </label>
            <div className="space-y-1.5 sm:space-y-2">
              {LOADING_STYLES.map((style) => (
                <button
                  key={style.value}
                  onClick={() => handleStyleChange(style.value)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 ${
                    loadingStyle === style.value
                      ? "bg-white/20 border border-white/30 text-white"
                      : "bg-white/5 border border-transparent text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-pressed={loadingStyle === style.value}
                >
                  <span className="text-lg sm:text-xl">{style.icon}</span>
                  <span className="text-sm sm:font-medium">{style.label}</span>
                  {loadingStyle === style.value && (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 ml-auto text-emerald-400"
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
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="text-xs text-white/40 text-center">
            Kies je favoriete laad-stijl
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
