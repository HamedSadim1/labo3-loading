export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const getPrefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia(REDUCED_MOTION_QUERY).matches;
