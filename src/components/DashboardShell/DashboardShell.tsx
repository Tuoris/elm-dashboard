import { Component, createSignal, JSX } from "solid-js";
import styles from "./DashboardShell.module.css";

export const DashboardShell: Component<{ children: JSX.Element; goToMainScreen: () => void }> = (props) => {
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
    </div>
  );
};
