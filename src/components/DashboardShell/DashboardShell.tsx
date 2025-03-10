import { Accessor, Component, createSignal, For, JSX, Show, useContext } from "solid-js";
import styles from "./DashboardShell.module.css";
import { CarLiveDataContext, DEFAULT_CAR_LIVE_DATA } from "../../contexts/CarLiveDataContext";
import { CarLiveDataType } from "../../types/common";
import { SetStoreFunction } from "solid-js/store";

export const DashboardShell: Component<{
  children: JSX.Element;
  goToMainScreen: () => void;
  isDemoMode: Accessor<boolean>;
  setDemoParams: SetStoreFunction<CarLiveDataType>;
}> = (props) => {
  const [isFullscreen, setIsFullscreen] = createSignal(false);
  let dashboardShellRef: HTMLDivElement | undefined;

  const toggleFullscreen = () => {
    if (!dashboardShellRef) return;

    if (!isFullscreen()) {
      dashboardShellRef.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const carLiveData = useContext(CarLiveDataContext);

  return (
    <div class={styles.DashboardShell} ref={dashboardShellRef}>
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
      <div class={styles.PanelContainer}>{props.children}</div>
      <Show when={props.isDemoMode}>
        <div class={styles.DemoModeParams}>
          <For each={Object.keys(DEFAULT_CAR_LIVE_DATA)}>
            {(carDataKey) => (
              <label>
                <span>{carDataKey}</span>
                <input
                  type="text"
                  value={carLiveData[carDataKey as keyof CarLiveDataType]}
                  onChange={(event) =>
                    props.setDemoParams(carDataKey as keyof CarLiveDataType, parseFloat(event.target.value))
                  }
                />
              </label>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
