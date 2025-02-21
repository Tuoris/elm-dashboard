import { createContext } from "solid-js";
import { CarLiveDataType } from "./types/common";

export const CarLiveDataContext = createContext<CarLiveDataType>({
    coolantTemperature: 0,
    oilTemperature: 0,
    rpm: 0,
    vehicleSpeed: 0,
});