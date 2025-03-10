import { EvDashboardPanel } from "./EvDashboardPanel";
import { DashboardShell } from "../DashboardShell/DashboardShell";
import { Component } from "solid-js";

export const EvDashboard: Component<{ goToMainScreen: () => void }> = (props) => {
  return (
    <DashboardShell goToMainScreen={props.goToMainScreen}>
      <EvDashboardPanel />
    </DashboardShell>
  );
};
