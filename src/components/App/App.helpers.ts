import { SetStoreFunction, Part } from "solid-js/store";
import { TIME_BETWEEN_COMMANDS } from "../../constants/common.constants";
import { Elm327BluetoothAdapter } from "../../features/Bluetooth/Bluetooth";
import { COMMANDS } from "../../features/Bluetooth/Bluetooth.constants";
import { CarLiveDataType, CarLiveDataParam } from "../../types/common";
import { parseDeferredIntegerValue, sleep } from "../../utils";

export async function readAndSetIceCarParams(
  bluetoothAdapter: Elm327BluetoothAdapter,
  setCarParams: SetStoreFunction<CarLiveDataType>
) {
  const loopCommands: [a: Part<CarLiveDataType, keyof CarLiveDataType>, b: string][] = [
    ["coolantTemperature", COMMANDS.ENGINE_COOLANT_TEMPERATURE],
    ["throttleValue", COMMANDS.THROTTLE_POSITION],
    ["rpm", COMMANDS.ENGINE_SPEED],
    ["vehicleSpeed", COMMANDS.VEHICLE_SPEED],
  ];

  for (const [param, command] of loopCommands) {
    const value = await bluetoothAdapter.sendData(command);
    setCarParams(param, parseDeferredIntegerValue(value as number));
    await sleep(TIME_BETWEEN_COMMANDS);
  }
}

function setParamsFromResponse(
  commandResponse: unknown,
  paramsToSet: CarLiveDataParam[],
  setCarParams: SetStoreFunction<CarLiveDataType>
) {
  if (typeof commandResponse !== "string") {
    for (const param of paramsToSet) {
      setCarParams(param, (commandResponse as CarLiveDataType)[param]);
    }
  }
}

export async function readAndSetEvCarParams(
  bluetoothAdapter: Elm327BluetoothAdapter,
  setCarParams: SetStoreFunction<CarLiveDataType>
) {
  await bluetoothAdapter.sendData(COMMANDS.HYUNDAI_KONA_REQUEST_TO_BMS);

  const value1 = await bluetoothAdapter.sendData(COMMANDS.HYUNDAI_KONA_BMS_INFO_01);
  setParamsFromResponse(
    value1,
    [
      "socValue",
      "batteryPower",
      "maxRegenValue",
      "maxPowerValue",
      "batteryMaxT",
      "batteryMinT",
      "batteryInletT",
      "maxCellVoltageValue",
      "minCellVoltageValue",
    ],
    setCarParams
  );

  await sleep(TIME_BETWEEN_COMMANDS);

  const command2 = COMMANDS.HYUNDAI_KONA_BMS_INFO_05;
  const value2 = await bluetoothAdapter.sendData(command2);
  setParamsFromResponse(value2, ["heaterTemp", "sohValue"], setCarParams);

  await sleep(TIME_BETWEEN_COMMANDS);

  await bluetoothAdapter.sendData(COMMANDS.HYUNDAI_KONA_REQUEST_TO_ABS);
  const value3 = await bluetoothAdapter.sendData(COMMANDS.HYUNDAI_KONA_ABS_INFO_01);
  setParamsFromResponse(value3, ["vehicleSpeed"], setCarParams);

  await sleep(TIME_BETWEEN_COMMANDS);
}
