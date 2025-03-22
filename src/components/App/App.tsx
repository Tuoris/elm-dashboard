import { createEffect, createSignal, For, type Component } from "solid-js";
import { createStore } from "solid-js/store";

import styles from "./App.module.css";
import { CarLiveDataContext, DEFAULT_CAR_LIVE_DATA } from "../../contexts/CarLiveDataContext";
import { CarLiveDataType, Logs, SCREEN_NAMES, ScreenName } from "../../types/common";
import { Elm327BluetoothAdapter } from "../../features/Bluetooth/Bluetooth";
import { sleep } from "../../utils";
import {
  BUSY_TIMEOUT,
  DASHBOARD_MODES,
  DashboardModeType,
  GRAVITATIONAL_ACCELERATION,
  MODE_LABELS,
} from "../../constants/common.constants";
import { ROUTER } from "../../router";
import { getDashboardModeFromUrl } from "../../helpers/modeFromUrl";
import { readAndSetIceCarParams, readAndSetEvCarParams } from "./App.helpers";
import { quaternionToEulerAngles, toDegrees } from "../../helpers/orientation.helpers";

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

  const [isDemoMode, setIsDemoMode] = createSignal(false);
  const [carParams, setCarParams] = createStore<CarLiveDataType>(DEFAULT_CAR_LIVE_DATA);

  const mainLoop = async () => {
    while (true) {
      if (bluetoothAdapter.isConnected && !isDemoMode()) {
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

  const [getAccelerometer, setAccelerometer] = createSignal({ x: 0, y: 0, z: 0 });
  const [getAbsoluteOrientationSensor, setAbsoluteOrientationSensor] = createSignal({ x: 0, y: 0, z: 0, w: 0 });

  const relativeAcceleration = () => {
    const acceleration = getAccelerometer();
    const absoluteOrientation = getAbsoluteOrientationSensor();
    const [roll, pitch, yaw] = quaternionToEulerAngles([
      absoluteOrientation.x,
      absoluteOrientation.y,
      absoluteOrientation.z,
      absoluteOrientation.w,
    ]);

    // TODO: Use pitch for relativeAcceleration
    return {
      x: acceleration.x,
      y: acceleration.y - Math.sin(roll) * GRAVITATIONAL_ACCELERATION,
      z: acceleration.z - Math.cos(roll) * GRAVITATIONAL_ACCELERATION,
    } as const;
  };

  const checkAccelerometer = async () => {
    let isSensorsAvailable = false;

    try {
      let results;
      results = await Promise.all([
        navigator.permissions.query({ name: "accelerometer" as PermissionName }),
        navigator.permissions.query({ name: "magnetometer" as PermissionName }),
        navigator.permissions.query({ name: "gyroscope" as PermissionName }),
      ]);
      if (results.every((result) => result.state === "granted")) {
        isSensorsAvailable = true;
      } else {
        setLogs([...logs(), { message: "Доступ до даних акселерометра відхилено.", level: "error" }]);
      }
    } catch (error) {
      setLogs([...logs(), { message: "Акселерометр не підтримується.", level: "error" }]);
    }

    if (isSensorsAvailable) {
      const acl = new Accelerometer({ frequency: 10 });
      acl.addEventListener("reading", () => {
        setAccelerometer({ x: acl.x, y: acl.y, z: acl.z });
      });
      acl.start();

      const abso = new AbsoluteOrientationSensor({ frequency: 10 });
      abso.addEventListener("reading", () => {
        const [x, y, z, w] = abso.quaternion;

        setAbsoluteOrientationSensor({ x, y, z, w });
      });
      abso.start();
    }
  };

  checkAccelerometer();

  const goToMainScreen = () => setCurrentScreenName(SCREEN_NAMES.CONNECTION_SCREEN);

  createEffect(() => {
    const relativeAccelerations = relativeAcceleration();

    setCarParams("forwardAccelerationG", -relativeAccelerations.z / GRAVITATIONAL_ACCELERATION);
    setCarParams("rightAccelerationG", relativeAccelerations.x / GRAVITATIONAL_ACCELERATION);
  });

  return (
    <div class={styles.App}>
      <div class={styles.LinkWrapper}>
        <a href="https://utils.tupychak.com.ua/"> ← На головну </a>
      </div>
      <CarLiveDataContext.Provider value={carParams}>
        {ROUTER[getCurrentScreenName()]({
          bluetoothAdapter,
          logs,
          setCurrentScreenName,
          goToMainScreen,
          mode: currentMode,
          isDemoMode,
          setDemoParams: setCarParams,
          currentMode,
          setCurrentMode,
          setIsDemoMode,
        })}
      </CarLiveDataContext.Provider>
    </div>
  );
};

export default App;
