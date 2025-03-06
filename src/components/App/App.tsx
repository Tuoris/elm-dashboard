import { createEffect, createSignal, For, type Component } from "solid-js";
import { createStore } from "solid-js/store";

import styles from "./App.module.css";
import { CarLiveDataContext, DEFAULT_CAR_LIVE_DATA } from "../../contexts/CarLiveDataContext";
import { CarLiveDataType, Logs, SCREEN_NAMES, ScreenName } from "../../types/common";
import { Elm327BluetoothAdapter } from "../../features/Bluetooth/Bluetooth";
import { sleep } from "../../utils";
import { BUSY_TIMEOUT, DASHBOARD_MODES, DashboardModeType, MODE_LABELS } from "../../constants/common.constants";
import { ROUTER } from "../../router";
import { getDashboardModeFromUrl } from "../../helpers/modeFromUrl";
import { readAndSetIceCarParams, readAndSetEvCarParams } from "./App.helpers";

const bluetoothAdapter = new Elm327BluetoothAdapter();

export const App: Component = () => {
  const isWebBluetoothApiAvailable = bluetoothAdapter.checkWebBluetoothApiAvailable();

  const [logs, setLogs] = createSignal<Logs>([
    isWebBluetoothApiAvailable
      ? {
          level: "info",
          message: `Натисніть кнопку [З'єднатись з ELM 327], щоб розпочати роботу...`,
        }
      : {
          level: "error",
          message: "Web Bluetooth API не підтримується браузером.",
        },
  ]);

  bluetoothAdapter.addLogHandler((message, level) => {
    setLogs([...logs(), { message, level }]);
  });

  const [getCurrentScreenName, setCurrentScreenName] = createSignal<ScreenName>(SCREEN_NAMES.CONNECTION_SCREEN);

  const modeFromUrl = getDashboardModeFromUrl();
  const [currentMode, setCurrentMode] = createSignal<DashboardModeType>(
    (modeFromUrl as DashboardModeType) || DASHBOARD_MODES.ICE
  );

  const [carParams, setCarParams] = createStore<CarLiveDataType>(DEFAULT_CAR_LIVE_DATA);

  const mainLoop = async () => {
    while (true) {
      if (bluetoothAdapter.isConnected) {
        const mode = currentMode();

        if (mode === DASHBOARD_MODES.ICE) {
          await readAndSetIceCarParams(bluetoothAdapter, setCarParams);
        } else {
          await readAndSetEvCarParams(bluetoothAdapter, setCarParams);
        }
      } else {
        await sleep(BUSY_TIMEOUT);
      }
    }
  };

  createEffect(() => {
    mainLoop();
  });

  const goToMainScreen = () => setCurrentScreenName(SCREEN_NAMES.CONNECTION_SCREEN);

  return (
    <div class={styles.App}>
      <select
        class={styles.DashboardModeSelector}
        onChange={(event) => setCurrentMode(event.target.value as DashboardModeType)}
      >
        <For each={Object.values(DASHBOARD_MODES)}>
          {(mode) => (
            <option value={currentMode()} selected={mode === currentMode()}>
              {MODE_LABELS[mode]}
            </option>
          )}
        </For>
      </select>
      <CarLiveDataContext.Provider value={carParams}>
        <div>
          {ROUTER[getCurrentScreenName()]({
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
