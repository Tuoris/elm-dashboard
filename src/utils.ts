import { DeferredValue } from "./types/common";

export const sleep = (timeout: number) => new Promise((resolve) => setTimeout(() => resolve(true), timeout));

export const parseDeferredIntegerValue = (value: DeferredValue | undefined) => {
  const numberValue = parseInt(`${value}`);
  return isNaN(numberValue) ? 0 : numberValue;
};
