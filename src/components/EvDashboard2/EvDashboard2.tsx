import { createSignal, type Component } from "solid-js";

import { EvDashboardPanel2 } from "./EvDashboard2Panel";
import { DashboardShell } from "../DashboardShell/DashboardShell";

export const EvDashboard2: Component<{ goToMainScreen: () => void }> = (props) => {
  return (
    <DashboardShell goToMainScreen={props.goToMainScreen}>
      <EvDashboardPanel2 />
    </DashboardShell>
  );
};
