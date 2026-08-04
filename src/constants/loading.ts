import type { IconName } from "../components/Icon";
import type { LoadingStage, LoadingState } from "../context/types";
export interface LoadingStageConfig {
  label: string;
  duration: number;
  stageKey: Exclude<LoadingStage, "idle" | "complete">;
  icon: IconName;
}

export const createDefaultLoadingState = (): LoadingState => ({
  status: "idle",
  stage: "idle",
  progress: 0,
});

export const LOADING_COPY = {
  cancelled: "Laden geannuleerd",
  started: "Laden gestart",
  completed: "Laden voltooid",
  failed: "Laden mislukt. Probeer opnieuw.",
  completeStatus: "Laden voltooid",
} as const;

const LOADING_DURATION_MULTIPLIER = 2.5;
export const LOADING_PROGRESS_STEPS = 20;
export const LOADING_COMPLETION_DELAY_MS = 1500;

export const LOADING_STAGES: LoadingStageConfig[] = [
  {
    label: "Initialiseren...",
    duration: 1000 * LOADING_DURATION_MULTIPLIER,
    stageKey: "initializing",
    icon: "settings",
  },
  {
    label: "Verwerken...",
    duration: 1500 * LOADING_DURATION_MULTIPLIER,
    stageKey: "processing",
    icon: "refresh",
  },
  {
    label: "Afronden...",
    duration: 800 * LOADING_DURATION_MULTIPLIER,
    stageKey: "finalizing",
    icon: "success",
  },
];

export const TOTAL_LOADING_DURATION = LOADING_STAGES.reduce(
  (sum, stage) => sum + stage.duration,
  0,
);
