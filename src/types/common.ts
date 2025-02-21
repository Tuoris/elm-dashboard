export type CarLiveDataType = {
  coolantTemperature: number;
  oilTemperature: number;
  rpm: number;
  vehicleSpeed: number;
};

export type Logs = { message: string; level?: string }[];

export type ScreenName = "connectionScreen" | "dashboard";
export type DeferredValue = string | number | boolean;
