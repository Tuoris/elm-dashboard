import { Accessor, Component, createEffect, createSignal, For, Match, Setter, Switch } from "solid-js";
import { Elm327BluetoothAdapter } from "../../features/Bluetooth/Bluetooth";
import styles from "./ConnectionScreen.module.css";
import { Logs, ScreenName } from "../../types/common";

type ConnectionScreenProps = {
  bluetoothAdapter: Elm327BluetoothAdapter;
  logs: Accessor<Logs>;
  setCurrentScreenName: Setter<ScreenName>;
  mode: Accessor<string>;
};

const classNameByLogLevel: Record<string, string> = {
  debug: styles.DebugLog,
  info: styles.InfoLog,
  warning: styles.WarningLog,
  error: styles.ErrorLog,
};

export const ConnectionScreen: Component<ConnectionScreenProps> = (props) => {
  const connect = async () => {
    const isProperlyConnected = await props.bluetoothAdapter.connect();
    if (isProperlyConnected) {
      if (props.mode() === "konaEv") {
        props.setCurrentScreenName("evDashboard");
      } else {
        props.setCurrentScreenName("dashboard");
      }
    }
  };

  return (
    <div class={styles.ConnectionScreen}>
      <div class={styles.LinkWrapper}>
        <a href="https://utils.tupychak.com.ua/"> ← На головну </a>
      </div>
      <pre class={styles.ConnectionLogs}>
        <For each={props.logs()}>
          {(log) => <div class={classNameByLogLevel[log?.level || "info"]}>{log.message}</div>}
        </For>
      </pre>
      <div>
        <Switch>
          <Match when={props.bluetoothAdapter.isConnected}>
            <button class={styles.ActionButton} onClick={() => props.setCurrentScreenName("dashboard")}>
              Продовжити
            </button>
          </Match>
          <Match when={!props.bluetoothAdapter.isConnected}>
            <button class={styles.ActionButton} onClick={connect}>
              З'єднатись з ELM 327
            </button>
          </Match>
        </Switch>
      </div>
    </div>
  );
};
