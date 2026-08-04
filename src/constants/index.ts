export type IconName =
  | "bolt"
  | "bot"
  | "chat"
  | "clock"
  | "close"
  | "dashboard"
  | "play"
  | "refresh"
  | "recent"
  | "runs"
  | "send"
  | "settings"
  | "success";

const APP_NAME = "Labo 3";

export const APP_CONFIG = {
  name: APP_NAME,
  title: `${APP_NAME} - Loading`,
  version: "v3.0",
  description:
    "Een heldere, interactieve loading experience voor je labo-oefening.",
  footerCopy: `Gemaakt voor ${APP_NAME}`,
  statusLabels: {
    ready: "Klaar",
    running: "Bezig",
  },
  toast: {
    maxVisible: 3,
    dismissDelayMs: 3200,
  },
} as const;

export const ID_PREFIXES = {
  toast: "toast",
  message: "message",
  welcomeMessage: "welcome",
} as const;

export const DOM_IDS = {
  appShell: "app-shell",
  appHeader: "app-header",
  loadingHeading: "loading-heading",
  chatMessageInput: "chat-message",
} as const;

export const CHAT_CONFIG = {
  welcomeMessage: "Hoi! Welkom bij de chat. Hoe kan ik je helpen?",
  botResponses: [
    "Hoi! Hoe kan ik je helpen? 👋",
    "Dat is een interessante vraag!",
    "Laat me even denken... 🤔",
    "Goed punt! Ik begrijp het.",
    "Kun je dat uitleggen?",
    "Bedankt voor je bericht! 🙏",
    "Dat klopt helemaal!",
    "Ik snap wat je bedoelt.",
    "Laten we dat samen oplossen!",
    "Geweldig idee! 💡",
  ],
  responseBaseDelayMs: 1000,
  responseVarianceMs: 1000,
  inputLabel: "Bericht invoeren",
  inputPlaceholder: "Typ een bericht...",
  sendButtonLabel: "Bericht versturen",
  messagesLabel: "Chatberichten",
  typingLabel: "Chatbot typt",
  typingDotCount: 3,
  typingDotDelayMs: 150,
  unreadMessageSuffix: "nieuwe berichten",
} as const;

type LoadingStage =
  "idle" | "initializing" | "processing" | "finalizing" | "complete";

type LoadingStatus = "idle" | "running" | "complete";

export interface LoadingState {
  status: LoadingStatus;
  stage: LoadingStage;
  progress: number;
}

export interface LoadingStageConfig {
  label: string;
  duration: number;
  stageKey: Exclude<LoadingStage, "idle" | "complete">;
  icon: IconName;
}

const LOADING_DURATION_MULTIPLIER = 2.5;
const LOADING_STYLE_OPTIONS = [
  { value: "fidget", label: "Fidget spinner", icon: "🔄" },
  { value: "dots", label: "Stuiterende stippen", icon: "⚫" },
  { value: "pulse", label: "Pulserende ring", icon: "⭕" },
  { value: "bar", label: "Voortgangsbalk", icon: "📊" },
  { value: "spinner", label: "Klassieke spinner", icon: "💫" },
  { value: "wave", label: "Golfbalken", icon: "〰️" },
] as const;

export type LoadingStyle = (typeof LOADING_STYLE_OPTIONS)[number]["value"];

export const LOADING_CONFIG = {
  copy: {
    cancelled: "Laden geannuleerd",
    started: "Laden gestart",
    completed: "Laden voltooid",
    failed: "Laden mislukt. Probeer opnieuw.",
    completeStatus: "Laden voltooid",
  },
  normalMotionMultiplier: 1,
  reducedMotionMultiplier: 0.1,
  progressSteps: 20,
  completionDelayMs: 1500,
  maxProgress: 99,
  completeProgress: 100,
  progressScale: 100,
  initialProgress: 0,
  initialStage: "initializing",
  completeStage: "complete",
  stages: [
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
  ] satisfies readonly LoadingStageConfig[],
  styleOptions: LOADING_STYLE_OPTIONS,
  styleAnimation: {
    bouncingDotCount: 3,
    waveBarCount: 5,
    bouncingDotDelayMs: 150,
    waveBarDelayMs: 120,
    waveDuration: "0.9s",
  },
} as const;

export const PANEL_CONFIG = {
  dashboard: {
    key: "dashboard",
    panel: "dashboard-panel",
    title: "dashboard-title",
    label: "Dashboard",
    heading: "Dashboard",
    subtitle: "Live gegevens uit je laadsessies",
  },
  chat: {
    key: "chat",
    panel: "chat-panel",
    title: "chat-title",
    label: "Chat",
    heading: "Chatbot",
    subtitle: "Beschikbaar",
  },
  settings: {
    key: "settings",
    panel: "settings-panel",
    title: "settings-title",
    label: "Instellingen",
    heading: "Instellingen",
  },
} as const;

export type PanelKey = (typeof PANEL_CONFIG)[keyof typeof PANEL_CONFIG]["key"];

export interface LoadingMetrics {
  totalRuns: number;
  completedRuns: number;
  totalDurationMs: number;
  recentDurations: number[];
}

export const STORAGE_CONFIG = {
  version: 1,
  key: "labo3-loading-settings",
  maxRecentDurations: 12,
  maxDurationMs: 24 * 60 * 60 * 1000,
} as const;

export const DASHBOARD_CONFIG = {
  chartMinHeightPercent: 12,
  chartMaxHeightPercent: 100,
  chartScaleFactor: 35,
  minimumAverageDurationMs: 1,
  durationDivisorMs: 1000,
  durationDecimalPlaces: 1,
  percentageScale: 100,
  copy: {
    totalRuns: "Totaal laden",
    averageDuration: "Gemiddelde tijd",
    successRate: "Succespercentage",
    recentRuns: "Recente runs",
    recentSessions: "Recente sessies",
    runsSuffix: "runs",
    tableCaption: "Laadtijd per recente sessie",
    sessionHeader: "Sessie",
    durationHeader: "Duur",
    noSessions: "Nog geen sessies geregistreerd.",
    secondsSuffix: "seconden",
    durationSuffix: "s",
    noValue: "—",
  },
} as const;

export const ANIMATION_CONFIG = {
  numberDurationMs: 550,
} as const;

export const NUMBER_FORMAT_CONFIG = {
  locale: "nl-NL",
  decimalPlaces: 1,
} as const;

export const DIALOG_CONFIG = {
  focusableSelector:
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [contenteditable="true"], [tabindex]:not([tabindex="-1"])',
} as const;

export const SETTINGS_CONFIG = {
  styleChangedToastPrefix: "Laadstijl gewijzigd naar",
  styleLegend: "Laadstijl",
  styleGroupLabel: "Laadstijl kiezen",
  description:
    "Kies je favoriete laadstijl voor de demo. Tijdens het laden blijft de huidige stijl actief.",
} as const;

export const LOADING_UI_COPY = {
  heading: "Laaddemo",
  progressLabel: "Voortgang",
  progressAriaLabel: "Laden",
  percentLabel: "procent",
  startButton: "Start laden",
  idleDescription: "Kies een stijl via Instellingen en start de demo.",
  completeMessage: "Klaar om opnieuw te starten",
  cancelButton: "Annuleren",
  defaultStageIcon: "refresh" as const,
} as const;

export const PANEL_UI_COPY = {
  closeButton: "Sluiten",
} as const;

export const UI_COPY = {
  dismissMessage: "Melding sluiten",
  percentSuffix: "%",
} as const;

export const DEFAULT_LOADING_STYLE: LoadingStyle =
  LOADING_CONFIG.styleOptions[0].value;
