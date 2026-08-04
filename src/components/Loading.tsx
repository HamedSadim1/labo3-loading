import React, { useState, useCallback, useEffect, useRef } from "react";
import { delay } from "../utils/delay";
import { useApp } from "../context/useApp";
import { LoadingStyleDisplay } from "./LoadingStyles";

type LoadingStage =
  "idle" | "initializing" | "processing" | "finalizing" | "complete";

interface StageConfig {
  label: string;
  duration: number;
  stageKey: LoadingStage;
  icon: React.ReactNode;
}

const LOADING_DURATION_MULTIPLIER = 2.5;

const STAGES: StageConfig[] = [
  {
    label: "Initialiseren...",
    duration: 1000 * LOADING_DURATION_MULTIPLIER,
    stageKey: "initializing",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
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
    duration: 1500 * LOADING_DURATION_MULTIPLIER,
    stageKey: "processing",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
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
    duration: 800 * LOADING_DURATION_MULTIPLIER,
    stageKey: "finalizing",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
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

const TOTAL_DURATION = STAGES.reduce((sum, stage) => sum + stage.duration, 0);

const Loading: React.FC = () => {
  const {
    loadingStyle,
    addToast,
    setIsLoading,
    recordLoadingStart,
    recordLoadingComplete,
  } = useApp();
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<LoadingStage>("idle");
  const [progress, setProgress] = useState(0);
  const runId = useRef(0);

  useEffect(() => {
    return () => {
      runId.current += 1;
      setIsLoading(false);
    };
  }, [setIsLoading]);

  const handleLoading = useCallback(async () => {
    if (loading) return;

    const currentRun = ++runId.current;
    const startedAt = performance.now();
    const isCurrentRun = () => runId.current === currentRun;

    setLoading(true);
    setIsLoading(true);
    recordLoadingStart();
    setProgress(0);
    addToast("Loading gestart", "info");

    let elapsed = 0;
    for (const currentStage of STAGES) {
      if (!isCurrentRun()) return;
      setStage(currentStage.stageKey);
      const steps = 20;
      const stepDuration = currentStage.duration / steps;
      const stageStart = elapsed;

      for (let step = 0; step < steps; step += 1) {
        await delay(stepDuration);
        if (!isCurrentRun()) return;
        elapsed += stepDuration;
        const baseProgress = (stageStart / TOTAL_DURATION) * 100;
        const stageProgress =
          ((step + 1) / steps) * (currentStage.duration / TOTAL_DURATION) * 100;
        setProgress(Math.min(baseProgress + stageProgress, 99));
      }
    }

    if (!isCurrentRun()) return;
    setProgress(100);
    setStage("complete");
    recordLoadingComplete(performance.now() - startedAt);
    addToast("Loading voltooid", "success");
    await delay(1500);

    if (!isCurrentRun()) return;
    setLoading(false);
    setIsLoading(false);
    setStage("idle");
    setProgress(0);
  }, [
    addToast,
    loading,
    recordLoadingComplete,
    recordLoadingStart,
    setIsLoading,
  ]);

  const currentStage = STAGES.find((item) => item.stageKey === stage);

  return (
    <section
      className="animate-slide-up [animation-delay:0.2s]"
      aria-labelledby="loading-heading"
    >
      <h2 id="loading-heading" className="sr-only">
        Loading demo
      </h2>
      {loading ? (
        <div className="space-y-5" role="status" aria-live="polite">
          <LoadingStyleDisplay style={loadingStyle} isActive />

          <div
            className="space-y-3"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Laden: ${Math.round(progress)} procent`}
          >
            <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
              <span>Progress</span>
              <span className="font-mono text-cyan-200/80">
                {Math.round(progress)}%
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

          <div className="flex items-center justify-center gap-2.5 text-sm text-white/75">
            <span className="text-cyan-200">{currentStage?.icon}</span>
            <span>{currentStage?.label}</span>
          </div>

          {stage === "complete" && (
            <div className="flex justify-center animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
                <span aria-hidden="true">✓</span>
                Klaar om opnieuw te starten
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleLoading}
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-950/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/25 active:translate-y-0 sm:py-4"
          >
            <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative flex items-center justify-center gap-2.5">
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
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
              Start loading
            </span>
          </button>
          <p className="text-center text-xs text-white/40">
            Kies een stijl via instellingen en start de demo.
          </p>
        </div>
      )}
    </section>
  );
};

export default Loading;
