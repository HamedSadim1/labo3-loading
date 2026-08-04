import React, { useCallback, useEffect, useRef } from "react";
import { delay } from "../utils/delay";
import { useApp } from "../context/useApp";
import { LoadingStyleDisplay } from "./LoadingStyles";
import Icon from "./Icon";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import {
  createDefaultLoadingState,
  LOADING_COMPLETION_DELAY_MS,
  LOADING_COPY,
  LOADING_PROGRESS_STEPS,
  LOADING_STAGES,
  TOTAL_LOADING_DURATION,
} from "../constants/loading";

const STAGES = LOADING_STAGES;
const TOTAL_DURATION = TOTAL_LOADING_DURATION;

const Loading: React.FC = () => {
  const {
    loadingStyle,
    loading,
    addToast,
    setLoadingState,
    recordLoadingStart,
    recordLoadingComplete,
  } = useApp();
  const prefersReducedMotion = usePrefersReducedMotion();
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const wasLoading = useRef(false);
  const restoreFocusRef = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const completedRun = wasLoading.current && loading.status === "idle";
    wasLoading.current = loading.status !== "idle";

    if (
      completedRun &&
      startButtonRef.current &&
      (restoreFocusRef.current || document.activeElement === document.body)
    ) {
      startButtonRef.current.focus();
      restoreFocusRef.current = false;
    }
  }, [loading.status]);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  const cancelLoading = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    isRunningRef.current = false;
    restoreFocusRef.current = true;
    setLoadingState(createDefaultLoadingState());
    addToast(LOADING_COPY.cancelled, "warning");
  }, [addToast, setLoadingState]);

  const handleLoading = useCallback(async () => {
    if (isRunningRef.current) return;

    isRunningRef.current = true;
    const controller = new AbortController();
    controllerRef.current = controller;
    const startedAt = performance.now();
    const durationMultiplier = prefersReducedMotion ? 0.1 : 1;

    setLoadingState({ status: "running", stage: "initializing", progress: 0 });
    recordLoadingStart();
    addToast(LOADING_COPY.started, "info");

    try {
      let elapsed = 0;
      for (const currentStage of STAGES) {
        const steps = LOADING_PROGRESS_STEPS;
        const stepDuration =
          (currentStage.duration * durationMultiplier) / steps;
        const stageStart = elapsed;
        const stageStartProgress =
          (stageStart / (TOTAL_DURATION * durationMultiplier)) * 100;
        setLoadingState({
          status: "running",
          stage: currentStage.stageKey,
          progress: stageStartProgress,
        });

        for (let step = 0; step < steps; step += 1) {
          await delay(stepDuration, controller.signal);
          elapsed += stepDuration;
          const baseProgress =
            (stageStart / (TOTAL_DURATION * durationMultiplier)) * 100;
          const stageProgress =
            ((step + 1) / steps) *
            (currentStage.duration / TOTAL_DURATION) *
            100;
          setLoadingState({
            status: "running",
            stage: currentStage.stageKey,
            progress: Math.min(baseProgress + stageProgress, 99),
          });
        }
      }

      setLoadingState({ status: "complete", stage: "complete", progress: 100 });
      recordLoadingComplete(performance.now() - startedAt);
      addToast(LOADING_COPY.completed, "success");
      await delay(
        LOADING_COMPLETION_DELAY_MS * durationMultiplier,
        controller.signal,
      );
      setLoadingState(createDefaultLoadingState());
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        addToast(LOADING_COPY.failed, "error");
        setLoadingState(createDefaultLoadingState());
      }
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
      isRunningRef.current = false;
    }
  }, [
    addToast,
    prefersReducedMotion,
    recordLoadingComplete,
    recordLoadingStart,
    setLoadingState,
  ]);

  const currentStage = STAGES.find((item) => item.stageKey === loading.stage);
  const currentStageLabel =
    loading.status === "complete"
      ? LOADING_COPY.completeStatus
      : currentStage?.label;

  return (
    <section
      className="animate-slide-up [animation-delay:0.2s]"
      aria-labelledby="loading-heading"
      aria-busy={loading.status === "running"}
    >
      <h2 id="loading-heading" className="sr-only">
        Laaddemo
      </h2>
      {loading.status !== "idle" ? (
        <div className="space-y-5">
          <p className="sr-only" role="status" aria-live="polite">
            {loading.status === "complete"
              ? LOADING_COPY.completeStatus
              : currentStageLabel}
          </p>
          <LoadingStyleDisplay style={loadingStyle} isActive />
          <div
            className="space-y-3"
            role="progressbar"
            aria-valuenow={Math.round(loading.progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Laden: ${Math.round(loading.progress)} procent`}
          >
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-white/80">
              <span>Voortgang</span>
              <span className="font-mono text-cyan-200">
                {Math.round(loading.progress)}%
              </span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-inset ring-white/10">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-cyan-300 via-violet-400 to-fuchsia-400 transition-[width] duration-200 ease-out"
                style={{ width: `${loading.progress}%` }}
              />
              <div className="absolute inset-0 animate-gradient bg-linear-to-r from-transparent via-white/30 to-transparent bg-size-[200%_100%]" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2.5 text-sm text-white/85">
            <Icon
              name={currentStage?.icon ?? "refresh"}
              className="h-5 w-5 text-cyan-200"
            />
            <span>{currentStageLabel}</span>
          </div>
          {loading.status === "complete" && (
            <div className="flex justify-center motion-safe:animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
                <span aria-hidden="true">✓</span>
                Klaar om opnieuw te starten
              </div>
            </div>
          )}
          {loading.status === "running" && (
            <button
              type="button"
              onClick={cancelLoading}
              className="mx-auto block rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 focus:outline-none brand-focus"
            >
              Annuleren
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            ref={startButtonRef}
            type="button"
            onClick={handleLoading}
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl brand-gradient px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-950/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/25 active:scale-[0.98] active:translate-y-0 sm:py-4"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full group-focus-visible:translate-x-full" />
            <span className="relative flex items-center justify-center gap-2.5">
              <Icon
                name="play"
                className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-active:scale-90"
              />
              Start laden
            </span>
          </button>
          <p className="text-center text-xs leading-5 text-white/75">
            Kies een stijl via Instellingen en start de demo.
          </p>
        </div>
      )}
    </section>
  );
};

export default Loading;
