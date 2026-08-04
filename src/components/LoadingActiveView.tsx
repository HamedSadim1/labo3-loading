import React from "react";
import LoadingProgress from "@/components/LoadingProgress";
import { LoadingStyleDisplay } from "@/components/LoadingStyles";
import type { IconName } from "@/components/Icon";
import { LOADING_UI_COPY } from "@/constants";

interface LoadingActiveViewProps {
  loadingStyle: React.ComponentProps<typeof LoadingStyleDisplay>["style"];
  progress: number;
  stageLabel?: string;
  stageIcon?: IconName;
  isComplete: boolean;
  onCancel: () => void;
}

const LoadingActiveView: React.FC<LoadingActiveViewProps> = ({
  loadingStyle,
  progress,
  stageLabel,
  stageIcon,
  isComplete,
  onCancel,
}) => (
  <div className="space-y-5">
    <LoadingStyleDisplay style={loadingStyle} isActive />
    <LoadingProgress
      progress={progress}
      stageLabel={stageLabel}
      stageIcon={stageIcon}
    />
    {isComplete && (
      <div className="flex justify-center motion-safe:animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
          <span aria-hidden="true">✓</span>
          {LOADING_UI_COPY.completeMessage}
        </div>
      </div>
    )}
    {!isComplete && (
      <button
        type="button"
        onClick={onCancel}
        className="mx-auto block rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 focus:outline-none brand-focus"
      >
        {LOADING_UI_COPY.cancelButton}
      </button>
    )}
  </div>
);

export default LoadingActiveView;
