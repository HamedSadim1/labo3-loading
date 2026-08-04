import React from "react";
import DialogPanel from "./DialogPanel";
import PanelTrigger from "./PanelTrigger";
import PanelHeader from "./PanelHeader";
import { useApp } from "../context/useApp";
import type { LoadingStyle } from "../context/types";
import { usePanelToggle } from "../hooks/usePanelToggle";
import PanelBody from "./PanelBody";
import Icon from "./Icon";
import { LOADING_STYLE_OPTIONS } from "../constants/loadingStyles";
import { PANEL_IDS, PANEL_KEYS } from "../constants/panels";

const Settings: React.FC = () => {
  const panel = PANEL_IDS.settings;
  const { loadingStyle, loading, setLoadingStyle, addToast } = useApp();
  const { isOpen, toggle, close } = usePanelToggle(PANEL_KEYS.settings);

  const handleStyleChange = (style: LoadingStyle) => {
    setLoadingStyle(style);
    const styleName = LOADING_STYLE_OPTIONS.find(
      (item) => item.value === style,
    )?.label;
    addToast(`Laadstijl gewijzigd naar ${styleName}`, "success");
  };

  return (
    <div className="relative">
      <PanelTrigger
        label={panel.label}
        controls={panel.panel}
        isOpen={isOpen}
        onToggle={toggle}
      >
        <Icon
          name="settings"
          className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90 sm:h-5 sm:w-5"
        />
      </PanelTrigger>

      <DialogPanel
        id={panel.panel}
        titleId={panel.title}
        open={isOpen}
        onClose={close}
        className="sm:w-80"
      >
        <PanelHeader
          title={panel.heading}
          titleId={panel.title}
          onClose={close}
        />

        <PanelBody className="max-h-[calc(100dvh_-_10rem)] p-4 sm:max-h-[calc(100dvh_-_12rem)] sm:p-6">
          <fieldset disabled={loading.status === "running"}>
            <legend className="mb-3 text-sm font-medium text-white/85">
              Laadstijl
            </legend>
            <div
              className="space-y-2"
              role="radiogroup"
              aria-label="Laadstijl kiezen"
            >
              {LOADING_STYLE_OPTIONS.map((style) => (
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
                    const currentIndex = LOADING_STYLE_OPTIONS.findIndex(
                      (item) => item.value === style.value,
                    );
                    const offset = event.key === "ArrowDown" ? 1 : -1;
                    const nextIndex =
                      (currentIndex + offset + LOADING_STYLE_OPTIONS.length) %
                      LOADING_STYLE_OPTIONS.length;
                    handleStyleChange(LOADING_STYLE_OPTIONS[nextIndex].value);
                    event.currentTarget.parentElement
                      ?.querySelector<HTMLButtonElement>(
                        `[data-style="${LOADING_STYLE_OPTIONS[nextIndex].value}"]`,
                      )
                      ?.focus();
                  }}
                  data-style={style.value}
                  onClick={() => handleStyleChange(style.value)}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition duration-200 focus:outline-none brand-focus disabled:cursor-not-allowed disabled:opacity-60 ${
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
        </PanelBody>
      </DialogPanel>
    </div>
  );
};

export default Settings;
