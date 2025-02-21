import { createContext, createSignal, For, type Component } from "solid-js";
import { createStore } from "solid-js/store";

import styles from "./App.module.css";
import { Dashboard } from "./components/Dashboard";
import { CarLiveDataContext } from "./CarLiveDataContext";
import { CarLiveDataType, DeferredValue, Logs, ScreenName } from "./types/common";
import { ConnectionScreen } from "./components/ConnectionScreen";
import { Elm327BluetoothAdapter } from "./features/Bluetooth/Bluetooth";
import { COMMANDS } from "./features/Bluetooth/Bluetooth.constants";

const SCREENS = {
  connectionScreen: ConnectionScreen,
  dashboard: Dashboard,
};

const App: Component = () => {
  const bluetoothAdapter = new Elm327BluetoothAdapter();

  const [logs, setLogs] = createSignal<Logs>([
    {
      level: "info",
      message: `Натисніть кнопку [З'єднатись з ELM 327], щоб розпочати роботу...`,
    },
  ]);

  bluetoothAdapter.addLogHandler((message, level) => {
    setLogs([...logs(), { message, level }]);
  });

  const [getCurrentScreenName, setCurrentScreenName] = createSignal<ScreenName>("connectionScreen");

  const [carParams, setCarParams] = createStore<CarLiveDataType>({
    coolantTemperature: 30,
    oilTemperature: 110,
    rpm: 6500,
    vehicleSpeed: 40,
  });

  const parseValue = (value: DeferredValue | undefined) => {
    const numberValue = parseInt(`${value}`);
    return isNaN(numberValue) ? 0 : numberValue;
  };

  const mainLoop = async () => {
    if (bluetoothAdapter.isConnected) {
      const coolantTemperature = await bluetoothAdapter.sendData(COMMANDS.ENGINE_COOLANT_TEMPERATURE);
      setCarParams({
        ...carParams,
        coolantTemperature: parseValue(coolantTemperature),
      });
      const oilTemperature = await bluetoothAdapter.sendData(COMMANDS.ENGINE_OIL_TEMPERATURE);
      setCarParams({
        ...carParams,
        oilTemperature: parseValue(oilTemperature),
      });
      const rpm = await bluetoothAdapter.sendData(COMMANDS.ENGINE_SPEED);
      setCarParams({
        ...carParams,
        rpm: parseValue(rpm),
      });
      const vehicleSpeed = await bluetoothAdapter.sendData(COMMANDS.VEHICLE_SPEED);
      setCarParams({
        ...carParams,
        vehicleSpeed: parseValue(vehicleSpeed),
      });
    }

    setTimeout(mainLoop, 300);
  };

  return (
    <div class={styles.App}>
      <CarLiveDataContext.Provider value={carParams}>
        <div>{SCREENS[getCurrentScreenName()]({ bluetoothAdapter, logs, setCurrentScreenName })}</div>
      </CarLiveDataContext.Provider>
    </div>
  );
};

export default App;
