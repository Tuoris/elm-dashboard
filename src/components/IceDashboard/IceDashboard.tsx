import { Accessor, type Component } from "solid-js";

import { DashboardShell } from "../DashboardShell/DashboardShell";
import { IceDashboardPanel } from "./IceDashboardPanel";
import { SetStoreFunction } from "solid-js/store";
import { CarLiveDataType } from "../../types/common";

export const IceDashboard: Component<{
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
      <IceDashboardPanel />
    </DashboardShell>
  );
};
