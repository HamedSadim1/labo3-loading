export const LOADING_STYLE_OPTIONS = [
  { value: "fidget", label: "Fidget spinner", icon: "🔄" },
  { value: "dots", label: "Stuiterende stippen", icon: "⚫" },
  { value: "pulse", label: "Pulserende ring", icon: "⭕" },
  { value: "bar", label: "Voortgangsbalk", icon: "📊" },
  { value: "spinner", label: "Klassieke spinner", icon: "💫" },
  { value: "wave", label: "Golfbalken", icon: "〰️" },
] as const;

export type LoadingStyle = (typeof LOADING_STYLE_OPTIONS)[number]["value"];

export const isLoadingStyle = (value: unknown): value is LoadingStyle =>
  LOADING_STYLE_OPTIONS.some((option) => option.value === value);
