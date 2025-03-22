import { Accessor, createSignal, type Component } from "solid-js";

import { EvDashboardPanel3 } from "./EvDashboard3Panel";
import { DashboardShell } from "../DashboardShell/DashboardShell";
import { SetStoreFunction } from "solid-js/store";
import { CarLiveDataType } from "../../types/common";

export const EvDashboard3: Component<{
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
      <EvDashboardPanel3 />
    </DashboardShell>
  );
};
