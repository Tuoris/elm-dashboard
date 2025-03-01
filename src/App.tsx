import { createContext, createEffect, createSignal, For, type Component } from "solid-js";
import { createStore, Part } from "solid-js/store";

import styles from "./App.module.css";
import { Dashboard } from "./components/Dashboard";
import { CarLiveDataContext } from "./CarLiveDataContext";
import { CarLiveDataType, Logs, ScreenName } from "./types/common";
import { ConnectionScreen } from "./components/ConnectionScreen";
import { Elm327BluetoothAdapter } from "./features/Bluetooth/Bluetooth";
import { COMMANDS } from "./features/Bluetooth/Bluetooth.constants";
import { parseDeferredIntegerValue, sleep } from "./utils";

const SCREENS = {
  connectionScreen: ConnectionScreen,
  dashboard: Dashboard,
};

const bluetoothAdapter = new Elm327BluetoothAdapter();

const App: Component = () => {
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
    coolantTemperature: 0,
    oilTemperature: 0,
    rpm: 0,
    vehicleSpeed: 0,
  });

  console.log([carParams, setCarParams]);
  console.log(bluetoothAdapter);

  const timeBetweenCommands = 20;
  const busyTimeout = 20;

  const mainLoop = async () => {
    const loopCommands: [a: Part<CarLiveDataType, keyof CarLiveDataType>, b: string][] = [
      ["coolantTemperature", COMMANDS.ENGINE_COOLANT_TEMPERATURE],
      // ["oilTemperature", COMMANDS.ENGINE_OIL_TEMPERATURE],
      ["rpm", COMMANDS.ENGINE_SPEED],
      ["vehicleSpeed", COMMANDS.VEHICLE_SPEED],
    ];
    while (true) {
      if (bluetoothAdapter.isConnected) {
        await sleep(timeBetweenCommands / 2);

        for (const [param, command] of loopCommands) {
          console.log("sending", command);
          const value = await bluetoothAdapter.sendData(command);
          setCarParams(param, parseDeferredIntegerValue(value as number));

          console.log("received response, wait to next command");
          await sleep(timeBetweenCommands);
          console.log("ready for next command");
        }
      } else {
        await sleep(busyTimeout);
      }
    }
  };

  createEffect(() => {
    mainLoop();
  });

  const goToMainScreen = () => setCurrentScreenName("connectionScreen");

  return (
    <div class={styles.App}>
      <CarLiveDataContext.Provider value={carParams}>
        <div>{SCREENS[getCurrentScreenName()]({ bluetoothAdapter, logs, setCurrentScreenName, goToMainScreen })}</div>
      </CarLiveDataContext.Provider>
    </div>
  );
};

export default App;
