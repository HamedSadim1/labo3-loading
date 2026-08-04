export const PANEL_KEYS = {
  dashboard: "dashboard",
  chat: "chat",
  settings: "settings",
} as const;

export type PanelKey = (typeof PANEL_KEYS)[keyof typeof PANEL_KEYS];

export const PANEL_IDS = {
  [PANEL_KEYS.dashboard]: {
    panel: "dashboard-panel",
    title: "dashboard-title",
    label: "Dashboard",
    heading: "Dashboard",
    subtitle: "Live gegevens uit je laadsessies",
  },
  [PANEL_KEYS.chat]: {
    panel: "chat-panel",
    title: "chat-title",
    label: "Chat",
    heading: "Chatbot",
    subtitle: "Beschikbaar",
  },
  [PANEL_KEYS.settings]: {
    panel: "settings-panel",
    title: "settings-title",
    label: "Instellingen",
    heading: "Instellingen",
  },
} as const;
