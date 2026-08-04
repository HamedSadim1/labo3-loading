import React from "react";
import IconButton from "./IconButton";

interface PanelTriggerProps {
  label: string;
  controls: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const PanelTrigger: React.FC<PanelTriggerProps> = ({
  label,
  controls,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <IconButton
      label={label}
      active={isOpen}
      aria-expanded={isOpen}
      aria-controls={controls}
      onClick={onToggle}
    >
      {children}
    </IconButton>
  );
};

export default PanelTrigger;
