import { ConnectionScreen } from "./components/ConnectionScreen";
import { EvDashboard } from "./components/EvDashboard";
import { EvDashboard2 } from "./components/EvDashboard2";
import { IceDashboard } from "./components/IceDashboard";
import { ScreenName } from "./types/common";

export const ROUTER: Record<ScreenName, any> = {
  connectionScreen: ConnectionScreen,
  dashboard: IceDashboard,
  evDashboard: EvDashboard,
  evDashboard2: EvDashboard2,
};
