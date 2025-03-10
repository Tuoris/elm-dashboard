import { Accessor, createSignal, type Component } from "solid-js";

import { EvDashboardPanel2 } from "./EvDashboard2Panel";
import { DashboardShell } from "../DashboardShell/DashboardShell";
import { SetStoreFunction } from "solid-js/store";
import { CarLiveDataType } from "../../types/common";

export const EvDashboard2: Component<{
  goToMainScreen: () => void;
  isDemoMode: Accessor<boolean>;
  setDemoParams: SetStoreFunction<CarLiveDataType>;
}> = (props) => {
  return (
    <DashboardShell
      goToMainScreen={props.goToMainScreen}
      isDemoMode={props.isDemoMode}
      setDemoParams={props.setDemoParams}
    >
      <EvDashboardPanel2 />
    </DashboardShell>
  );
};
