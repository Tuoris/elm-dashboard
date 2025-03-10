import { EvDashboardPanel } from "./EvDashboardPanel";
import { DashboardShell } from "../DashboardShell/DashboardShell";
import { Accessor, Component } from "solid-js";
import { CarLiveDataType } from "../../types/common";
import { SetStoreFunction } from "solid-js/store";

export const EvDashboard: Component<{
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
      <EvDashboardPanel />
    </DashboardShell>
  );
};
