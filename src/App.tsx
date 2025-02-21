import { createContext, createSignal, For, type Component } from "solid-js";
import { createStore } from "solid-js/store";

import styles from "./App.module.css";
import { Dashboard } from "./components/Dashboard";
import { CarLiveDataContext } from "./CarLiveDataContext";
import { CarLiveDataType } from "./types/common";

const SCREENS = {
  dashboard: Dashboard,
  dashboard2: Dashboard,
};

type ScreenName = keyof typeof SCREENS;

const App: Component = () => {
  const [getCurrentScreenName, setCurrentScreenName] = createSignal<ScreenName>("dashboard");

  const [carParams, setCarParams] = createStore<CarLiveDataType>({
    coolantTemperature: 30,
    oilTemperature: 110,
    rpm: 6500,
    vehicleSpeed: 40,
  });

  return (
    <div class={styles.App}>
      <input
        type="text"
        value={carParams.coolantTemperature}
        onChange={(event) => {
          setCarParams({
            ...carParams,
            coolantTemperature: parseInt(event.target.value),
          });
        }}
      />
      <select onChange={(event) => setCurrentScreenName(event.target.value as ScreenName)}>
        <For each={Object.keys(SCREENS)}>
          {(screenName) => (
            <option value={screenName} selected={screenName === getCurrentScreenName()}>
              {screenName}
            </option>
          )}
        </For>
      </select>
      <CarLiveDataContext.Provider value={carParams}>
        <div>{SCREENS[getCurrentScreenName()]({})}</div>
      </CarLiveDataContext.Provider>
    </div>
  );
};

export default App;
