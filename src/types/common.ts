export type CarLiveDataType = {
  coolantTemperature: number;
  throttleValue: number;
  rpm: number;
  vehicleSpeed: number;
  socValue: number;
  batteryPower: number;
  maxPowerValue: number;
  maxRegenValue: number;
  batteryMaxT: number;
  batteryMinT: number;
  batteryInletT: number;
  maxCellVoltageValue: number;
  minCellVoltageValue: number;
  sohValue: number;
  heaterTemp: number;
  forwardAccelerationG: number;
  rightAccelerationG: number;
};

export type CarLiveDataParam = keyof CarLiveDataType;

export type LogMessage = { message: string; level?: string };
export type Logs = LogMessage[];

export const SCREEN_NAMES = {
  CONNECTION_SCREEN: "connectionScreen",
  DASHBOARD: "dashboard",
  EV_DASHBOARD: "evDashboard",
  EV_DASHBOARD_2: "evDashboard2",
  EV_DASHBOARD_3: "evDashboard3",
} as const;

export type ScreenName = (typeof SCREEN_NAMES)[keyof typeof SCREEN_NAMES];

export type DeferredValue = string | number | boolean | undefined | null;
