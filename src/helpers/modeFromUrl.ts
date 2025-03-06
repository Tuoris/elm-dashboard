import { DashboardModeType } from "../constants/common.constants";

export const getDashboardModeFromUrl = () => {
  const modeFromUrl = new URL(window.location.toString()).searchParams.get("mode");

  return modeFromUrl as DashboardModeType;
};
