import React from "react";
import DialogPanel from "@/components/DialogPanel";
import PanelTrigger from "@/components/PanelTrigger";
import PanelHeader from "@/components/PanelHeader";
import { useApp } from "@/context/useApp";
import type { LoadingStyle } from "@/constants";
import { usePanelToggle } from "@/hooks/usePanelToggle";
import PanelBody from "@/components/PanelBody";
import Icon from "@/components/Icon";
import { LOADING_CONFIG, PANEL_CONFIG, SETTINGS_CONFIG } from "@/constants";

const Settings: React.FC = () => {
  const panel = PANEL_CONFIG.settings;
  const { loadingStyle, loading, setLoadingStyle, addToast } = useApp();
  const { isOpen, toggle, close } = usePanelToggle(panel.key);

  const handleStyleChange = (style: LoadingStyle) => {
    setLoadingStyle(style);
    const styleName = LOADING_CONFIG.styleOptions.find(
      (item) => item.value === style,
    )?.label;
    addToast(
      `${SETTINGS_CONFIG.styleChangedToastPrefix} ${styleName}`,
      "success",
    );
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
              {SETTINGS_CONFIG.styleLegend}
            </legend>
            <div
              className="space-y-2"
              role="radiogroup"
              aria-label={SETTINGS_CONFIG.styleGroupLabel}
            >
              {LOADING_CONFIG.styleOptions.map((style) => (
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
                    const currentIndex = LOADING_CONFIG.styleOptions.findIndex(
                      (item) => item.value === style.value,
                    );
                    const offset = event.key === "ArrowDown" ? 1 : -1;
                    const nextIndex =
                      (currentIndex +
                        offset +
                        LOADING_CONFIG.styleOptions.length) %
                      LOADING_CONFIG.styleOptions.length;
                    handleStyleChange(
                      LOADING_CONFIG.styleOptions[nextIndex].value,
                    );
                    event.currentTarget.parentElement
                      ?.querySelector<HTMLButtonElement>(
                        `[data-style="${LOADING_CONFIG.styleOptions[nextIndex].value}"]`,
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
            {SETTINGS_CONFIG.description}
          </p>
        </PanelBody>
      </DialogPanel>
    </div>
  );
};

export default Settings;
