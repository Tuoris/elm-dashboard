import { Accessor, Component, createEffect, createSignal, For, Match, Setter, Show, Switch } from "solid-js";
import { Elm327BluetoothAdapter } from "../../features/Bluetooth/Bluetooth";
import styles from "./ConnectionScreen.module.css";
import { Logs, SCREEN_NAMES, ScreenName } from "../../types/common";
import { DASHBOARD_MODES, DashboardModeType, MODE_LABELS } from "../../constants/common.constants";

type ConnectionScreenProps = {
  bluetoothAdapter: Elm327BluetoothAdapter;
  logs: Accessor<Logs>;
  setCurrentScreenName: Setter<ScreenName>;
  mode: Accessor<string>;
  isDemoMode: Accessor<boolean>;
  currentMode: Accessor<DashboardModeType>;
  setCurrentMode: Setter<DashboardModeType>;
  setIsDemoMode: Setter<boolean>;
};

const classNameByLogLevel: Record<string, string> = {
  debug: styles.DebugLog,
  info: styles.InfoLog,
  warning: styles.WarningLog,
  error: styles.ErrorLog,
};

export const ConnectionScreen: Component<ConnectionScreenProps> = (props) => {
  const setCurrentScreenForMode = () => {
    if (props.mode() === DASHBOARD_MODES.KONA_EV) {
      props.setCurrentScreenName(SCREEN_NAMES.EV_DASHBOARD);
    } else if (props.mode() === DASHBOARD_MODES.KONA_EV_FUTURISTIC) {
      props.setCurrentScreenName(SCREEN_NAMES.EV_DASHBOARD_2);
    } else {
      props.setCurrentScreenName(SCREEN_NAMES.DASHBOARD);
    }
  };

  const connect = async () => {
    if (props.isDemoMode()) {
      setCurrentScreenForMode();
    } else {
      const isProperlyConnected = await props.bluetoothAdapter.connect();
      if (isProperlyConnected) {
        setCurrentScreenForMode();
      }
    }
  };

  return (
    <div class={styles.ConnectionScreen}>
      <div class={styles.ModeControls}>
        <select
          class={styles.DashboardModeSelector}
          onChange={(event) => props.setCurrentMode(event.target.value as DashboardModeType)}
        >
          <For each={Object.values(DASHBOARD_MODES)}>
            {(mode) => (
              <option value={mode} selected={mode === props.currentMode()}>
                {MODE_LABELS[mode]}
              </option>
            )}
          </For>
        </select>
        <label class={styles.DemoModeLabel}>
          <span>Демо режим</span>
          <input
            type="checkbox"
            checked={props.isDemoMode()}
            onChange={() => props.setIsDemoMode((currentValue) => !currentValue)}
          />
        </label>
      </div>
      <pre class={styles.ConnectionLogs}>
        <For each={props.logs()}>
          {(log) => <div class={classNameByLogLevel[log?.level || "info"]}>{log.message}</div>}
        </For>
      </pre>
      <div>
        <Switch>
          <Match when={props.bluetoothAdapter.isConnected}>
            <button class={styles.ActionButton} onClick={setCurrentScreenForMode}>
              Продовжити
            </button>
          </Match>
          <Match when={!props.bluetoothAdapter.isConnected}>
            <button class={styles.ActionButton} onClick={connect}>
              З'єднатись з ELM 327
              <Show when={props.isDemoMode()}> (Демо)</Show>
            </button>
          </Match>
        </Switch>
      </div>
    </div>
  );
};
