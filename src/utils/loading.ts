import {
  LOADING_CONFIG,
  type LoadingState,
  type LoadingStyle,
} from "@/constants";

export const createDefaultLoadingState = (): LoadingState => ({
  status: "idle",
  stage: "idle",
  progress: LOADING_CONFIG.initialProgress,
});

export const isLoadingStyle = (value: unknown): value is LoadingStyle =>
  LOADING_CONFIG.styleOptions.some((option) => option.value === value);

export const getTotalLoadingDuration = (): number =>
  LOADING_CONFIG.stages.reduce((sum, stage) => sum + stage.duration, 0);
