import React from "react";
import { LOADING_CONFIG, LOADING_UI_COPY, UI_COPY } from "../constants";
import Icon from "./Icon";
import type { IconName } from "./Icon";

interface LoadingProgressProps {
  progress: number;
  stageLabel?: string;
  stageIcon?: IconName;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({
  progress,
  stageLabel,
  stageIcon = LOADING_UI_COPY.defaultStageIcon,
}) => {
  const roundedProgress = Math.round(progress);

  return (
    <>
      <div
        className="space-y-3"
        role="progressbar"
        aria-valuenow={roundedProgress}
        aria-valuemin={0}
        aria-valuemax={LOADING_CONFIG.completeProgress}
        aria-label={`${LOADING_UI_COPY.progressAriaLabel}: ${roundedProgress} ${LOADING_UI_COPY.percentLabel}`}
      >
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-white/80">
          <span>{LOADING_UI_COPY.progressLabel}</span>
          <span className="font-mono text-cyan-200">
            {roundedProgress}
            {UI_COPY.percentSuffix}
          </span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-inset ring-white/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-cyan-300 via-violet-400 to-fuchsia-400 transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 animate-gradient bg-linear-to-r from-transparent via-white/30 to-transparent bg-size-[200%_100%]" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2.5 text-sm text-white/85">
        <Icon name={stageIcon} className="h-5 w-5 text-cyan-200" />
        <span>{stageLabel}</span>
      </div>
    </>
  );
};

export default LoadingProgress;
