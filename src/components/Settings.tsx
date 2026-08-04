import React from "react";
import DialogPanel from "./DialogPanel";
import IconButton from "./IconButton";
import PanelHeader from "./PanelHeader";
import { useApp } from "../context/useApp";
import type { LoadingStyle } from "../context/types";

const LOADING_STYLES: { value: LoadingStyle; label: string; icon: string }[] = [
  { value: "fidget", label: "Fidgetspinner", icon: "🔄" },
  { value: "dots", label: "Stuiterende stippen", icon: "⚫" },
  { value: "pulse", label: "Pulserende ring", icon: "⭕" },
  { value: "bar", label: "Voortgangsbalk", icon: "📊" },
  { value: "spinner", label: "Klassieke spinner", icon: "💫" },
  { value: "wave", label: "Golfbalken", icon: "〰️" },
];

const Settings: React.FC = () => {
  const {
    loadingStyle,
    loading,
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
    addToast(`Laadstijl gewijzigd naar ${styleName}`, "success");
  };

  return (
    <div className="relative">
      <IconButton
        label="Instellingen"
        active={isOpen}
        aria-expanded={isOpen}
        aria-controls="settings-panel"
        onClick={() => (isOpen ? closePanel() : openPanel("settings"))}
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
            d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06-1.8 1.8-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V20h-2.55v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06-1.8-1.8.06-.06A1.65 1.65 0 008.3 15a1.65 1.65 0 00-1.51-1H6.7v-2.55h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06 1.8-1.8.06.06a1.65 1.65 0 001.82.33 1.65 1.65 0 001-1.51v-.09h2.55v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06 1.8 1.8-.06.06A1.65 1.65 0 0018 10.45a1.65 1.65 0 001.51 1h.09V14h-.09a1.65 1.65 0 00-1.51 1z"
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
        <PanelHeader
          title="Instellingen"
          titleId="settings-title"
          onClose={closePanel}
        />

        <div className="max-h-[calc(100dvh_-_10rem)] overflow-y-auto overscroll-contain p-4 sm:max-h-[calc(100dvh_-_12rem)] sm:p-6">
          <fieldset disabled={loading.status === "running"}>
            <legend className="mb-3 text-sm font-medium text-white/85">
              Laadstijl
            </legend>
            <div
              className="space-y-2"
              role="radiogroup"
              aria-label="Laadstijl kiezen"
            >
              {LOADING_STYLES.map((style) => (
                <button
                  type="button"
                  key={style.value}
                  role="radio"
                  aria-checked={loadingStyle === style.value}
                  tabIndex={loadingStyle === style.value ? 0 : -1}
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowDown" && event.key !== "ArrowUp")
                      return;
                    event.preventDefault();
                    const currentIndex = LOADING_STYLES.findIndex(
                      (item) => item.value === style.value,
                    );
                    const offset = event.key === "ArrowDown" ? 1 : -1;
                    const nextIndex =
                      (currentIndex + offset + LOADING_STYLES.length) %
                      LOADING_STYLES.length;
                    handleStyleChange(LOADING_STYLES[nextIndex].value);
                    event.currentTarget.parentElement
                      ?.querySelector<HTMLButtonElement>(
                        `[data-style="${LOADING_STYLES[nextIndex].value}"]`,
                      )
                      ?.focus();
                  }}
                  data-style={style.value}
                  onClick={() => handleStyleChange(style.value)}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 disabled:cursor-not-allowed disabled:opacity-60 ${
                    loadingStyle === style.value
                      ? "border-cyan-300/40 bg-cyan-300/10 text-white"
                      : "border-transparent bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-lg sm:text-xl" aria-hidden="true">
                    {style.icon}
                  </span>
                  <span className="text-sm font-medium">{style.label}</span>
                  {loadingStyle === style.value && (
                    <span className="ml-auto text-cyan-300" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </fieldset>
          <p className="mt-5 text-sm leading-5 text-white/75">
            Kies je favoriete laadstijl voor de demo. Tijdens het laden blijft
            de huidige stijl actief.
          </p>
        </div>
      </DialogPanel>
    </div>
  );
};

export default Settings;
