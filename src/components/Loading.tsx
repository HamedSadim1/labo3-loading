import React, { useCallback, useEffect, useRef } from "react";
import { delay } from "../utils/delay";
import { useApp } from "../context/useApp";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import {
  DOM_IDS,
  createDefaultLoadingState,
  LOADING_CONFIG,
  LOADING_UI_COPY,
  TOTAL_LOADING_DURATION,
} from "../constants";
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
    addToast(LOADING_CONFIG.copy.cancelled, "warning");
  }, [addToast, setLoadingState]);

  const handleLoading = useCallback(async () => {
    if (isRunningRef.current) return;

    isRunningRef.current = true;
    const controller = new AbortController();
    controllerRef.current = controller;
    const startedAt = performance.now();
    const durationMultiplier = prefersReducedMotion
      ? LOADING_CONFIG.reducedMotionMultiplier
      : LOADING_CONFIG.normalMotionMultiplier;

    setLoadingState({
      status: "running",
      stage: LOADING_CONFIG.initialStage,
      progress: LOADING_CONFIG.initialProgress,
    });
    recordLoadingStart();
    addToast(LOADING_CONFIG.copy.started, "info");

    try {
      let elapsed = 0;
      for (const currentStage of LOADING_CONFIG.stages) {
        const stepDuration =
          (currentStage.duration * durationMultiplier) /
          LOADING_CONFIG.progressSteps;
        const stageStart = elapsed;
        const stageStartProgress =
          (stageStart / (TOTAL_LOADING_DURATION * durationMultiplier)) *
          LOADING_CONFIG.progressScale;
        setLoadingState({
          status: "running",
          stage: currentStage.stageKey,
          progress: stageStartProgress,
        });

        for (let step = 0; step < LOADING_CONFIG.progressSteps; step += 1) {
          await delay(stepDuration, controller.signal);
          elapsed += stepDuration;
          const baseProgress =
            (stageStart / (TOTAL_LOADING_DURATION * durationMultiplier)) *
            LOADING_CONFIG.progressScale;
          const stageProgress =
            ((step + 1) / LOADING_CONFIG.progressSteps) *
            (currentStage.duration / TOTAL_LOADING_DURATION) *
            LOADING_CONFIG.progressScale;
          setLoadingState({
            status: "running",
            stage: currentStage.stageKey,
            progress: Math.min(
              baseProgress + stageProgress,
              LOADING_CONFIG.maxProgress,
            ),
          });
        }
      }

      setLoadingState({
        status: "complete",
        stage: LOADING_CONFIG.completeStage,
        progress: LOADING_CONFIG.completeProgress,
      });
      recordLoadingComplete(performance.now() - startedAt);
      addToast(LOADING_CONFIG.copy.completed, "success");
      await delay(
        LOADING_CONFIG.completionDelayMs * durationMultiplier,
        controller.signal,
      );
      setLoadingState(createDefaultLoadingState());
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        addToast(LOADING_CONFIG.copy.failed, "error");
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

  const currentStage = LOADING_CONFIG.stages.find(
    (item) => item.stageKey === loading.stage,
  );
  const currentStageLabel =
    loading.status === "complete"
      ? LOADING_CONFIG.copy.completeStatus
      : currentStage?.label;

  return (
    <section
      className="animate-slide-up [animation-delay:0.2s]"
      aria-labelledby={DOM_IDS.loadingHeading}
      aria-busy={loading.status === "running"}
    >
      <h2 id={DOM_IDS.loadingHeading} className="sr-only">
        {LOADING_UI_COPY.heading}
      </h2>
      {loading.status !== "idle" ? (
        <>
          <p className="sr-only" role="status" aria-live="polite">
            {loading.status === "complete"
              ? LOADING_CONFIG.copy.completeStatus
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
