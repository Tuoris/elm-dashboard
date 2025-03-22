import { ConnectionScreen } from "./components/ConnectionScreen";
import { EvDashboard } from "./components/EvDashboard";
import { EvDashboard2 } from "./components/EvDashboard2";
import { EvDashboard3 } from "./components/EvDashboard3/EvDashboard3";
import { IceDashboard } from "./components/IceDashboard";
import { ScreenName } from "./types/common";

export const ROUTER: Record<ScreenName, any> = {
  connectionScreen: ConnectionScreen,
  dashboard: IceDashboard,
  evDashboard: EvDashboard,
  evDashboard2: EvDashboard2,
  evDashboard3: EvDashboard3,
};
