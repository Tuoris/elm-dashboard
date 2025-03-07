import { ConnectionScreen } from "./components/ConnectionScreen";
import { Dashboard } from "./components/Dashboard";
import { EvDashboard } from "./components/EvDashboard";
import { EvDashboard2 } from "./components/EvDashboard2";
import { ScreenName } from "./types/common";

export const ROUTER: Record<ScreenName, any> = {
  connectionScreen: ConnectionScreen,
  dashboard: Dashboard,
  evDashboard: EvDashboard,
  evDashboard2: EvDashboard2,
};
