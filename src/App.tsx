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
import { EvDashboard } from "./components/EvDashboard";

const SCREENS = {
  connectionScreen: ConnectionScreen,
  dashboard: Dashboard,
  evDashboard: EvDashboard,
};

const modes = ["ice", "konaEv"];
const modeLabels: Record<string, string> = {
  ice: "ДВЗ",
  konaEv: "Kona EV",
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

  const modeFromUrl = new URL(window.location.toString()).searchParams.get("mode");
  const [currentMode, setCurrentMode] = createSignal<"ice" | "ev">((modeFromUrl as "ice" | "ev") || "ice");

  const [carParams, setCarParams] = createStore<CarLiveDataType>({
    coolantTemperature: 0,
    throttleValue: 0,
    rpm: 0,
    vehicleSpeed: 0,
    socValue: 0,
    batteryPower: 0,
    maxRegenValue: 0,
    maxPowerValue: 0,
    batteryMaxT: 0,
    batteryMinT: 0,
    batteryInletT: 0,
    maxCellVoltageValue: 0,
    minCellVoltageValue: 0,
    sohValue: 0,
    heaterTemp: 0,
  });

  console.log([carParams, setCarParams]);
  console.log(bluetoothAdapter);

  createEffect(() => {
    console.log(currentMode());
  });

  const timeBetweenCommands = 20;
  const busyTimeout = 20;

  const mainLoop = async () => {
    const loopCommands: [a: Part<CarLiveDataType, keyof CarLiveDataType>, b: string][] = [
      ["coolantTemperature", COMMANDS.ENGINE_COOLANT_TEMPERATURE],
      ["throttleValue", COMMANDS.THROTTLE_POSITION],
      ["rpm", COMMANDS.ENGINE_SPEED],
      ["vehicleSpeed", COMMANDS.VEHICLE_SPEED],
    ];
    while (true) {
      if (bluetoothAdapter.isConnected) {
        await sleep(timeBetweenCommands / 2);

        const mode = currentMode();

        if (mode === "ice") {
          for (const [param, command] of loopCommands) {
            console.log("sending", command);
            const value = await bluetoothAdapter.sendData(command);
            setCarParams(param, parseDeferredIntegerValue(value as number));

            console.log("received response, wait to next command");
            await sleep(timeBetweenCommands);
            console.log("ready for next command");
          }
        } else {
          const command = COMMANDS.HYUNDAI_KONA_BMS_INFO_01;
          const params: Part<CarLiveDataType, keyof CarLiveDataType>[] = [
            "socValue",
            "batteryPower",
            "maxRegenValue",
            "maxPowerValue",
            "batteryMaxT",
            "batteryMinT",
            "batteryInletT",
            "maxCellVoltageValue",
            "minCellVoltageValue",
          ];
          console.log("sending", command);
          const value = await bluetoothAdapter.sendData(command);
          if (typeof value === "string") {
            await sleep(timeBetweenCommands);
            continue;
          }
          for (const param of params) {
            setCarParams(param, (value as CarLiveDataType)[param as keyof CarLiveDataType]);
            await sleep(timeBetweenCommands);
          }

          const command2 = COMMANDS.HYUNDAI_KONA_BMS_INFO_05;
          const params2: Part<CarLiveDataType, keyof CarLiveDataType>[] = ["heaterTemp", "sohValue"];
          const value2 = await bluetoothAdapter.sendData(command2);
          if (typeof value2 === "string") {
            await sleep(timeBetweenCommands);
            continue;
          }
          for (const param of params2) {
            setCarParams(param, (value2 as CarLiveDataType)[param as keyof CarLiveDataType]);
            await sleep(timeBetweenCommands);
          }

          console.log("ready for next command");
          console.log("received response, wait to next command");
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
      <select
        style={{ position: "absolute", right: "1rem", top: "1rem", width: "50%" }}
        onChange={(event) => setCurrentMode(event.target.value as "ice" | "ev")}
      >
        <For each={modes}>{(mode) => <option selected={mode === currentMode()}>{modeLabels[mode]}</option>}</For>
      </select>
      <CarLiveDataContext.Provider value={carParams}>
        <div>
          {SCREENS[getCurrentScreenName()]({
            bluetoothAdapter,
            logs,
            setCurrentScreenName,
            goToMainScreen,
            mode: currentMode,
          })}
        </div>
      </CarLiveDataContext.Provider>
    </div>
  );
};

export default App;
