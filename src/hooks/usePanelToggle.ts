import type { ActivePanel } from "../context/types";
import { useApp } from "../context/useApp";

export const usePanelToggle = (panel: Exclude<ActivePanel, null>) => {
  const { activePanel, openPanel, closePanel } = useApp();
  const isOpen = activePanel === panel;

  const toggle = () => {
    if (isOpen) closePanel();
    else openPanel(panel);
  };

  return { activePanel, isOpen, toggle, close: closePanel };
};
