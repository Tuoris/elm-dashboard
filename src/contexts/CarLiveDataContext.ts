import { createContext } from "solid-js";
import { CarLiveDataType } from "../types/common";

export const DEFAULT_CAR_LIVE_DATA = {
  coolantTemperature: 0,
  throttleValue: 0,
  rpm: 0,
  vehicleSpeed: 0,
  socValue: 0,
  batteryPower: 0,
  maxPowerValue: 0,
  maxRegenValue: 0,
  batteryMaxT: 0,
  batteryMinT: 0,
  batteryInletT: 0,
  maxCellVoltageValue: 0,
  minCellVoltageValue: 0,
  sohValue: 0,
  heaterTemp: 0,
};

export const CarLiveDataContext = createContext<CarLiveDataType>(DEFAULT_CAR_LIVE_DATA);

export const CarLiveDataContextProvider = CarLiveDataContext.Provider;
