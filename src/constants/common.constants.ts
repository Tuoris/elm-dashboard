export const DASHBOARD_MODES = {
  ICE: "ice",
  KONA_EV: "konaEv",
  KONA_EV_FUTURISTIC: "konaEv2",
} as const;

export type DashboardModeType = (typeof DASHBOARD_MODES)[keyof typeof DASHBOARD_MODES];

export const MODE_LABELS: Record<DashboardModeType, string> = {
  [DASHBOARD_MODES.ICE]: "ДВЗ",
  [DASHBOARD_MODES.KONA_EV]: "Kona EV",
  [DASHBOARD_MODES.KONA_EV_FUTURISTIC]: "Kona EV / Futuristic",
};
export const TIME_BETWEEN_COMMANDS = 20;
export const BUSY_TIMEOUT = 20;
