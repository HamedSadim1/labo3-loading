import type { IconName } from "../components/Icon";
import type { LoadingStage } from "../context/types";

export interface LoadingStageConfig {
  label: string;
  duration: number;
  stageKey: Exclude<LoadingStage, "idle" | "complete">;
  icon: IconName;
}

const LOADING_DURATION_MULTIPLIER = 2.5;

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
