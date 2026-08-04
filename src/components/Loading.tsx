import React, { useState, useCallback } from "react";
import { delay } from "../utils/delay";

type LoadingStage =
  "idle" | "initializing" | "processing" | "finalizing" | "complete";

interface StageConfig {
  label: string;
  duration: number;
  stageKey: LoadingStage;
  icon: React.ReactNode;
}

const STAGES: StageConfig[] = [
  {
    label: "Initialiseren...",
    duration: 1000,
    stageKey: "initializing",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    label: "Verwerken...",
    duration: 1500,
    stageKey: "processing",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
  {
    label: "Afronden...",
    duration: 800,
    stageKey: "finalizing",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  },
];

const TOTAL_DURATION = STAGES.reduce((sum, s) => sum + s.duration, 0);

const Loading = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [stage, setStage] = useState<LoadingStage>("idle");
  const [progress, setProgress] = useState<number>(0);

  const handleLoading = useCallback(async () => {
    setLoading(true);
    setProgress(0);

    let elapsed = 0;
    for (let i = 0; i < STAGES.length; i++) {
      const s = STAGES[i];
      setStage(s.stageKey);

      const stageStart = elapsed;
      const stageDuration = s.duration;
      const steps = 20;
      const stepDuration = stageDuration / steps;

      for (let j = 0; j < steps; j++) {
        await delay(stepDuration);
        elapsed += stepDuration;
        const baseProgress = (stageStart / TOTAL_DURATION) * 100;
        const stageProgress =
          ((j + 1) / steps) * (stageDuration / TOTAL_DURATION) * 100;
        setProgress(Math.min(baseProgress + stageProgress, 99));
      }
    }

    setProgress(100);
    setStage("complete");
    await delay(1500);

    setLoading(false);
    setStage("idle");
    setProgress(0);
  }, []);

  const currentStageConfig = STAGES.find((s) => s.stageKey === stage);

  return (
    <div className="flex flex-col items-center space-y-6 animate-slide-up [animation-delay:0.2s]">
      {loading ? (
        <div
          className="w-full space-y-6"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Laden: ${Math.round(progress)}%`}
        >
          {/* Progress bar */}
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <div
              className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-gradient bg-[length:200%_100%]" />
          </div>

          {/* Stage info */}
          <div className="flex items-center justify-center gap-3 text-white/90">
            <div className="animate-spin-slow text-purple-300">
              {currentStageConfig?.icon}
            </div>
            <span className="text-sm font-medium tracking-wide">
              {currentStageConfig?.label}
            </span>
            <span className="text-xs text-white/50 font-mono">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Completion state */}
          {stage === "complete" && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 text-emerald-300 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium">Voltooid!</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleLoading}
          className="group relative px-8 py-4 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/20"
          aria-label="Start loading procedure"
        >
          {/* Button background */}
          <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300" />
          <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Button shine effect */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

          {/* Button content */}
          <span className="relative z-10 flex items-center gap-3">
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Start Loading
          </span>
        </button>
      )}

      {/* Hint text */}
      {!loading && (
        <p className="text-white/40 text-xs animate-fade-in [animation-delay:0.4s]">
          Klik om de loading procedure te starten
        </p>
      )}
    </div>
  );
};

export default Loading;
