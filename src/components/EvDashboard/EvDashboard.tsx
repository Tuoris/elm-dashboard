import { createSignal, For, useContext, type Component } from "solid-js";

import styles from "./EvDashboard.module.css";
import { CarLiveDataType } from "../../types/common";
import { Part } from "solid-js/store";
import { CarLiveDataContext } from "../../CarLiveDataContext";

export const EvDashboard: Component<{ goToMainScreen: () => void }> = (props) => {
  const [isFullscreen, setIsFullscreen] = createSignal(false);
  let dashboardRef: HTMLDivElement | undefined;

  const carLiveData = useContext(CarLiveDataContext);

  const toggleFullscreen = () => {
    if (!dashboardRef) return;

    if (!isFullscreen()) {
      dashboardRef.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

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
    "sohValue",
    "heaterTemp",
  ];

  return (
    <div class={styles.Dashboard} ref={dashboardRef}>
      <div class={styles.TopControlButtons}>
        <button
          class={styles.ControlButton}
          onClick={props.goToMainScreen}
          aria-label="Повернутись до головного екрану"
        >
          {"❮"}
        </button>
        <button class={styles.ControlButton} onClick={toggleFullscreen} aria-label="Розгорнути на повний екран">
          {"⛶"}
        </button>
      </div>
      <div class={styles.DashContainer}>
        <div class={styles.ParamsContainer}>
          <For each={params}>
            {(param) => (
              <div class={styles.ParamRow}>
                <div>{param as string}</div>
                <div>{carLiveData ? carLiveData[param as keyof CarLiveDataType].toFixed(2) : null}</div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
