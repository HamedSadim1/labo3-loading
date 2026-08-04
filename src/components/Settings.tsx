import React from "react";
import DialogPanel from "./DialogPanel";
import IconButton from "./IconButton";
import { useApp } from "../context/useApp";
import type { LoadingStyle } from "../context/types";

const LOADING_STYLES: { value: LoadingStyle; label: string; icon: string }[] = [
  { value: "fidget", label: "Fidget Spinner", icon: "🔄" },
  { value: "dots", label: "Bouncing Dots", icon: "⚫" },
  { value: "pulse", label: "Pulse Ring", icon: "⭕" },
  { value: "bar", label: "Progress Bar", icon: "📊" },
  { value: "spinner", label: "Classic Spinner", icon: "💫" },
  { value: "wave", label: "Wave Bars", icon: "〰️" },
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
    const styleName = LOADING_STYLES.find(
      (item) => item.value === style,
    )?.label;
    addToast(`Loading stijl gewijzigd naar ${styleName}`, "success");
  };

  return (
    <div className="relative">
      <IconButton
        label="Instellingen"
        active={isOpen}
        aria-expanded={isOpen}
        aria-controls="settings-panel"
        onClick={() => openPanel("settings")}
      >
        <svg
          className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90 sm:h-5 sm:w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06-1.8 1.8-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V20h-2.55v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06-1.8-1.8.06-.06A1.65 1.65 0 008.3 15a1.65 1.65 0 00-1.51-1H6.7v-2.55h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06 1.8-1.8.06.06a1.65 1.65 0 001.82.33 1.65 1.65 0 001-1.51v-.09h2.55v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06 1.8 1.8-.06.06a1.65 1.65 0 00-.33 1.82 1.65 1.65 0 001.51 1h.09V14h-.09a1.65 1.65 0 00-1.51 1z"
          />
        </svg>
      </IconButton>

      <DialogPanel
        id="settings-panel"
        titleId="settings-title"
        open={isOpen}
        onClose={closePanel}
        className="sm:w-80"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
          <h2
            id="settings-title"
            className="text-base font-semibold text-white sm:text-lg"
          >
            Instellingen
          </h2>
          <IconButton label="Sluiten" className="sm:p-2" onClick={closePanel}>
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>

        <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto p-4 sm:max-h-[calc(100dvh-12rem)] sm:p-6">
          <div className="mb-5">
            <p
              id="loading-style-label"
              className="mb-3 text-sm font-medium text-white/80"
            >
              Loading stijl
            </p>
            <div className="space-y-2" aria-labelledby="loading-style-label">
              {LOADING_STYLES.map((style) => (
                <button
                  type="button"
                  key={style.value}
                  onClick={() => handleStyleChange(style.value)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 ${
                    loadingStyle === style.value
                      ? "border-cyan-300/40 bg-cyan-300/10 text-white"
                      : "border-transparent bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-pressed={loadingStyle === style.value}
                >
                  <span className="text-lg sm:text-xl" aria-hidden="true">
                    {style.icon}
                  </span>
                  <span className="text-sm font-medium">{style.label}</span>
                  {loadingStyle === style.value && (
                    <svg
                      className="ml-auto h-5 w-5 text-cyan-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
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
          <p className="text-xs leading-5 text-white/75">
            Kies je favoriete laadstijl voor de demo.
          </p>
        </div>
      </DialogPanel>
    </div>
  );
};

export default Settings;
