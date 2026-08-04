import React, { useCallback, useEffect, useRef } from "react";
import { delay } from "../utils/delay";
import { useApp } from "../context/useApp";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import {
  createDefaultLoadingState,
  LOADING_COMPLETION_DELAY_MS,
  LOADING_COPY,
  LOADING_PROGRESS_STEPS,
  LOADING_STAGES,
  TOTAL_LOADING_DURATION,
} from "../constants/loading";
import LoadingActiveView from "./LoadingActiveView";
import LoadingIdleView from "./LoadingIdleView";

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
      for (const currentStage of LOADING_STAGES) {
        const stepDuration =
          (currentStage.duration * durationMultiplier) / LOADING_PROGRESS_STEPS;
        const stageStart = elapsed;
        const stageStartProgress =
          (stageStart / (TOTAL_LOADING_DURATION * durationMultiplier)) * 100;
        setLoadingState({
          status: "running",
          stage: currentStage.stageKey,
          progress: stageStartProgress,
        });

        for (let step = 0; step < LOADING_PROGRESS_STEPS; step += 1) {
          await delay(stepDuration, controller.signal);
          elapsed += stepDuration;
          const baseProgress =
            (stageStart / (TOTAL_LOADING_DURATION * durationMultiplier)) * 100;
          const stageProgress =
            ((step + 1) / LOADING_PROGRESS_STEPS) *
            (currentStage.duration / TOTAL_LOADING_DURATION) *
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

  const currentStage = LOADING_STAGES.find(
    (item) => item.stageKey === loading.stage,
  );
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
        <>
          <p className="sr-only" role="status" aria-live="polite">
            {loading.status === "complete"
              ? LOADING_COPY.completeStatus
              : currentStageLabel}
          </p>
          <LoadingActiveView
            loadingStyle={loadingStyle}
            progress={loading.progress}
            stageLabel={currentStageLabel}
            stageIcon={currentStage?.icon}
            isComplete={loading.status === "complete"}
            onCancel={cancelLoading}
          />
        </>
      ) : (
        <LoadingIdleView
          onStart={handleLoading}
          startButtonRef={startButtonRef}
        />
      )}
    </section>
  );
};

export default Loading;
