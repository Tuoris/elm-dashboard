import { DeferredValue } from "../../types/common";

export class Deferred {
  resolve: (value: DeferredValue | PromiseLike<DeferredValue>) => void = () => {};
  reject: (reason?: any) => void = () => {};
  promise: Promise<DeferredValue> = new Promise(() => {});

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export function unsignedIntFromBytes(byteOrBytes: string | string[]) {
  const bytesCombined = Array.isArray(byteOrBytes) ? byteOrBytes.join("") : byteOrBytes;

  const integerValue = parseInt(bytesCombined, 16);

  return integerValue;
}

export function signedIntFromBytes(byteOrBytes: string | string[]) {
  const unsignedIntegerValue = unsignedIntFromBytes(byteOrBytes);

  const numberOfBytes = Array.isArray(byteOrBytes) ? byteOrBytes.length : 1;

  const numberOfValuesPerBytes = 2 ** (8 * numberOfBytes);

  return unsignedIntegerValue < numberOfValuesPerBytes / 2
    ? unsignedIntegerValue
    : unsignedIntegerValue - numberOfValuesPerBytes;
}
