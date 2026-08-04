import React from "react";
import type { LoadingStyle } from "../context/types";

interface LoadingStyleProps {
  style: LoadingStyle;
  isActive: boolean;
}

const BOUNCING_DOT_COUNT = 3;
const WAVE_BAR_COUNT = 5;
const WAVE_ANIMATION_DURATION = "0.9s";

const FidgetSpinner: React.FC = () => (
  <div className="relative h-16 w-16 sm:h-20 sm:w-20" aria-hidden="true">
    <div className="absolute inset-0 rounded-full border-4 border-white/20" />
    <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-violet-400" />
    <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-t-cyan-400 [animation-direction:reverse] [animation-duration:1.5s]" />
    <div className="absolute inset-4 animate-spin rounded-full border-4 border-transparent border-t-fuchsia-400 [animation-duration:0.8s]" />
  </div>
);

const BouncingDots: React.FC = () => (
  <div className="flex items-center gap-1.5 sm:gap-2" aria-hidden="true">
    {Array.from({ length: BOUNCING_DOT_COUNT }, (_, index) => index).map(
      (index) => (
        <div
          key={index}
          className="h-3 w-3 animate-bounce rounded-full bg-linear-to-r from-cyan-300 to-violet-400 sm:h-4 sm:w-4"
          style={{ animationDelay: `${index * 0.15}s` }}
        />
      ),
    )}
  </div>
);

const PulseRing: React.FC = () => (
  <div className="relative h-16 w-16 sm:h-20 sm:w-20" aria-hidden="true">
    <div className="absolute inset-0 animate-ping rounded-full border-4 border-violet-400/30" />
    <div className="absolute inset-2 animate-ping rounded-full border-4 border-cyan-400/50 [animation-delay:0.5s]" />
    <div className="absolute inset-4 animate-ping rounded-full border-4 border-fuchsia-400/70 [animation-delay:1s]" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-5 w-5 animate-pulse rounded-full bg-linear-to-r from-cyan-300 to-violet-400 sm:h-6 sm:w-6" />
    </div>
  </div>
);

const ProgressBar: React.FC = () => (
  <div className="w-full max-w-50 sm:max-w-xs" aria-hidden="true">
    <div className="h-2.5 overflow-hidden rounded-full bg-white/10 sm:h-3">
      <div className="h-full animate-shimmer rounded-full bg-linear-to-r from-cyan-300 via-violet-400 to-fuchsia-400 bg-size-[200%_100%]" />
    </div>
  </div>
);

const ClassicSpinner: React.FC = () => (
  <div className="relative h-12 w-12 sm:h-16 sm:w-16" aria-hidden="true">
    <div className="absolute inset-0 rounded-full border-4 border-white/10" />
    <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-r-violet-400 border-t-cyan-400" />
    <div className="absolute inset-3 animate-spin rounded-full border-4 border-transparent border-b-fuchsia-400 border-l-cyan-400 [animation-direction:reverse] [animation-duration:1.5s]" />
  </div>
);

const WaveBars: React.FC = () => (
  <div
    className="flex h-16 items-center justify-center gap-1.5 sm:h-20 sm:gap-2"
    aria-hidden="true"
  >
    {Array.from({ length: WAVE_BAR_COUNT }, (_, index) => index).map(
      (index) => (
        <span
          key={index}
          className="h-8 w-1.5 animate-pulse rounded-full bg-linear-to-b from-cyan-300 via-violet-400 to-fuchsia-400 sm:w-2"
          style={{
            animationDelay: `${index * 0.12}s`,
            animationDuration: WAVE_ANIMATION_DURATION,
          }}
        />
      ),
    )}
  </div>
);

export const LoadingStyleDisplay: React.FC<LoadingStyleProps> = ({
  style,
  isActive,
}) => {
  if (!isActive) return null;

  const styleComponents: Record<LoadingStyle, React.ReactNode> = {
    fidget: <FidgetSpinner />,
    dots: <BouncingDots />,
    pulse: <PulseRing />,
    bar: <ProgressBar />,
    spinner: <ClassicSpinner />,
    wave: <WaveBars />,
  };

  return (
    <div className="flex items-center justify-center p-6 sm:p-8">
      {styleComponents[style]}
    </div>
  );
};
