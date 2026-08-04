import React from "react";
import IconButton from "./IconButton";

interface PanelHeaderProps {
  title: string;
  titleId: string;
  subtitle?: string;
  onClose: () => void;
  leading?: React.ReactNode;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  titleId,
  subtitle,
  onClose,
  leading,
}) => {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/10 px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex min-w-0 items-center gap-3">
        {leading}
        <div className="min-w-0">
          <h2
            id={titleId}
            className="truncate text-base font-semibold text-white sm:text-lg"
          >
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-xs text-white/75">{subtitle}</p>}
        </div>
      </div>
      <IconButton
        label="Sluiten"
        className="ml-3 shrink-0 sm:p-2"
        onClick={onClose}
      >
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
    </header>
  );
};

export default PanelHeader;
