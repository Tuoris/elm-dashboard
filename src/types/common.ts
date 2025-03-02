export type CarLiveDataType = {
  coolantTemperature: number;
  oilTemperature: number;
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
};

export type Logs = { message: string; level?: string }[];

export type ScreenName = "connectionScreen" | "dashboard" | "evDashboard";
export type DeferredValue = string | number | boolean | undefined | null;
