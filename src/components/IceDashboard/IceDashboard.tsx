import { type Component } from "solid-js";

import { DashboardShell } from "../DashboardShell/DashboardShell";
import { IceDashboardPanel } from "./IceDashboardPanel";

export const IceDashboard: Component<{ goToMainScreen: () => void }> = (props) => {
  return (
    <DashboardShell goToMainScreen={props.goToMainScreen}>
      <IceDashboardPanel />
    </DashboardShell>
  );
};
