import React from "react";
import type { LoadingStyle } from "../context/types";

interface LoadingStyleProps {
  style: LoadingStyle;
  isActive: boolean;
}

// Fidget Spinner Style
const FidgetSpinner: React.FC = () => (
  <div className="relative w-16 h-16 sm:w-20 sm:h-20">
    <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
    <div className="absolute inset-0 border-4 border-transparent border-t-purple-400 rounded-full animate-spin" />
    <div className="absolute inset-2 border-4 border-transparent border-t-blue-400 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
    <div className="absolute inset-4 border-4 border-transparent border-t-pink-400 rounded-full animate-spin [animation-duration:0.8s]" />
  </div>
);

// Bouncing Dots Style
const BouncingDots: React.FC = () => (
  <div className="flex items-center gap-1.5 sm:gap-2">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

// Pulse Ring Style
const PulseRing: React.FC = () => (
  <div className="relative w-16 h-16 sm:w-20 sm:h-20">
    <div className="absolute inset-0 border-4 border-purple-400/30 rounded-full animate-ping" />
    <div className="absolute inset-2 border-4 border-blue-400/50 rounded-full animate-ping [animation-delay:0.5s]" />
    <div className="absolute inset-4 border-4 border-pink-400/70 rounded-full animate-ping [animation-delay:1s]" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
    </div>
  </div>
);

// Progress Bar Style
const ProgressBar: React.FC = () => (
  <div className="w-full max-w-[200px] sm:max-w-xs">
    <div className="h-2.5 sm:h-3 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
    </div>
    <style>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
  </div>
);

// Classic Spinner Style
const ClassicSpinner: React.FC = () => (
  <div className="relative w-12 h-12 sm:w-16 sm:h-16">
    <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
    <div className="absolute inset-0 border-4 border-transparent border-t-blue-400 border-r-purple-400 rounded-full animate-spin" />
    <div className="absolute inset-3 border-4 border-transparent border-b-pink-400 border-l-blue-400 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
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
  };

  return (
    <div className="flex items-center justify-center p-6 sm:p-8">
      {styleComponents[style]}
    </div>
  );
};

export default LoadingStyleDisplay;
