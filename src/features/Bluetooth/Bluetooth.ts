/// <reference types="web-bluetooth" />

import { CONFIGS, COMMANDS } from "./Bluetooth.constants";
import { Deferred, signedIntFromBytes, unsignedIntFromBytes } from "./Bluetooth.utils";

function consoleLoggerHandler(string: string, level: string = "info") {
  console.log(`${new Date().toISOString()}: ${string}`);
}

export class Elm327BluetoothAdapter {
  isConnected = false;
  bluetoothDevice: BluetoothDevice | null = null;
  writeCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  commandSignals = {};
  currentCommand = "";
  sendSignal: Deferred = new Deferred();

  logHandlers = [consoleLoggerHandler];
  log(message: string, level: string = "debug") {
    for (const logHandler of this.logHandlers) {
      logHandler(message, level);
    }
  }

  addLogHandler(logHandler: (string: string, level?: string) => void) {
    this.logHandlers.push(logHandler);
  }

  async connect() {
    this.log("Запит будь-якого пристрою Bluetooth, який підтримує сервіс ELM327...");

    if (!navigator?.bluetooth) {
      this.log(`Web Bluetooth API не підтримується браузером.`, "error");
      return this.isConnected;
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: CONFIGS.map((config) => config.serviceUuid),
      });

      this.log(`Запит пристрою: ${device.name} (${device.id})`);
      this.bluetoothDevice = device;
      return await this.connectAndSetupBluetoothScanner();
    } catch (error) {
      this.log(`Помилка: ${error}`, "error");
      return this.isConnected;
    }
  }

  async connectAndSetupBluetoothScanner() {
    if (!this.bluetoothDevice || !this.bluetoothDevice.gatt) {
      return this.isConnected;
    }

    const server = await this.bluetoothDevice.gatt.connect();
    this.log("Сервер GATT підключено.");
    this.log("Отримання сервісу пристрою...");

    let service;
    let serviceIndex;
    for (const [index, config] of CONFIGS.entries()) {
      try {
        service = await server.getPrimaryService(config.serviceUuid);
        serviceIndex = index;
        this.log("Сервіс знайдено, отримання характеристики (джерела даних)...");
      } catch {
        this.log(`Сервіс ${config.serviceUuid} не підтримується...`);
      }
    }

    if (!service || !serviceIndex) {
      this.log("Пристрій не підтримує жодного з профілів комунікації.", "error");
      return this.isConnected;
    }

    const characteristicUUID = CONFIGS[serviceIndex].characteristicUuid;
    const characteristic = await service.getCharacteristic(characteristicUUID);

    this.log(`Знайдено характеристику: ${characteristicUUID}`);
    this.writeCharacteristic = characteristic;

    await this.writeCharacteristic.startNotifications();
    this.log("Створення підписки на отримання відповідей.");
    this.writeCharacteristic.addEventListener("characteristicvaluechanged", (event) => {
      const eventTarget = event?.currentTarget;
      const rawValue = (eventTarget as unknown as { value: DataView })?.value;
      this.receiveValue(rawValue);
    });

    await this.sendData("AT Z");
    await this.sendData("AT E=0");
    await this.sendData("AT ST=96");
    await this.sendData("0100");

    this.log("Підписку створено - готовий до роботи.");

    this.isConnected = true;
    return this.isConnected;
  }

  receiveValue(rawValue: DataView) {
    const rawBytes = Array.from(new Int8Array(rawValue.buffer)).map((n) => n.toString(16).padStart(2, "0"));
    console.log(`Raw bytes: ${rawBytes.join(" ")}`);
    const value = new TextDecoder().decode(rawValue).trim();
    this.log(`Отримано: ${value}`);
    const result = this.parseResponse(value);
    if (result) {
      this.sendSignal.resolve(result);
    }
  }

  sendData(data: string) {
    if (!this.writeCharacteristic) {
      this.log(`Спроба надіслати команду: ${data} - відсутнє підключення.`, "error");
      return;
    }

    this.sendSignal = new Deferred();

    if (data) {
      this.log(`Надсилання: ${data}`);
      this.writeCharacteristic.writeValue(new TextEncoder().encode(data + "\r"));
      this.currentCommand = data.trim();
    }

    return this.sendSignal.promise;
  }

  parseResponse(value: string) {
    const handlers = {
      [COMMANDS.VIN]: this.parseVINResponse,
      [COMMANDS.MONITOR_STATUS_SINCE_DTCS_CLEARED]: this.parseMonitorStatusSinceDtcsCleared,
      [COMMANDS.ENGINE_COOLANT_TEMPERATURE]: this.parseEngineCoolantTemperature,
      [COMMANDS.ENGINE_OIL_TEMPERATURE]: this.parseEngineOilTemperature,
      [COMMANDS.CALCULATED_ENGINE_LOAD]: this.parseCalculatedEngineLoadResponse,
      [COMMANDS.ENGINE_SPEED]: this.parseEngineSpeed,
      [COMMANDS.VEHICLE_SPEED]: this.parseVehicleSpeed,
      [COMMANDS.INTAKE_AIR_TEMPERATURE]: this.parseIntakeAirTemperature,
      [COMMANDS.MASS_AIR_FLOW_SENSOR]: this.parseMassAirFlowSensorValue,
      [COMMANDS.FUEL_TANK_LEVEL]: this.parseFuelTankLevel,
      [COMMANDS.ENGINE_FUEL_RATE]: this.parseEngineFuelRate,
      [COMMANDS.CONTROL_MODULE_VOLTAGE]: this.parseControlModuleVoltage,
      [COMMANDS.KIA_NIRO_BMS_INFO_01]: this.parseKiaNiroBmsInfo01,
      [COMMANDS.KIA_NIRO_BMS_INFO_05]: this.parseKiaNiroBmsInfo05,
      [COMMANDS.KIA_NIRO_ABS_INFO]: this.parseKiaNiroAbsInfo,
    };

    const handler = handlers[this.currentCommand];
    if (handler) {
      return handler.bind(this)(value);
    }

    return this.defaultHandler(value);
  }

  defaultHandler(value: string) {
    if (value.includes(">")) {
      return true;
    }
  }

  parseMonitorStatusSinceDtcsCleared(value: string) {
    if (!value.startsWith("41 01")) {
      return;
    }

    const separateBytes = value.trim().split(" ");
    const byteA = separateBytes[2];
    const byteABits = unsignedIntFromBytes(byteA).toString(2);
    const checkEngineLightOn = byteABits[0] === "1";
    const numberOfConfirmedEmissionsRelatedDtcs = parseInt(byteABits.slice(1), 2);

    this.log(`Лампа "Check Engine" ${checkEngineLightOn ? "горить" : "не горить"}.`, "info");
    this.log(
      `Кількість підтверджених DTC, пов'язаних з викидами:
    ${numberOfConfirmedEmissionsRelatedDtcs}`,
      "info"
    );
    // TODO: Parse rest oof the data

    return numberOfConfirmedEmissionsRelatedDtcs;
  }

  parseEngineCoolantTemperature(value: string) {
    if (!value.startsWith("41 05")) {
      return;
    }

    const separateBytes = value.trim().split(" ");
    const temperatureByte = separateBytes[2];
    const temperatureValue = unsignedIntFromBytes(temperatureByte) - 40;

    this.log(`Температура охолоджувальної рідини двигуна: ${temperatureValue} °C`, "info");

    return temperatureValue;
  }

  vinBuffer: string[] = [];

  parseVINResponse(value: string) {
    if (value === "0902") {
      return;
    }

    if (value && value !== ">") {
      this.vinBuffer.push(value);
      return;
    }

    const separateBytes = this.vinBuffer.map((line) => line.split(" "));
    const dataBytesWithoutPrefix = separateBytes.map((bytes) => bytes.slice(3));
    const dataBytesWithLeftPadding = dataBytesWithoutPrefix.flat();
    const indexOfFirstMeaningfulByte = dataBytesWithLeftPadding.findIndex((byte) => byte !== "00");
    const dataBytes = dataBytesWithLeftPadding.slice(indexOfFirstMeaningfulByte);

    const vinString = dataBytes.map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");

    this.log(`VIN: ${vinString}`, "info");

    this.vinBuffer = [];
    return vinString;
  }

  parseCalculatedEngineLoadResponse(value: string) {
    if (!value.startsWith("41 04")) {
      return;
    }

    const separateBytes = value.trim().split(" ");
    const engineLoadByte = separateBytes[2];
    const engineLoadValue = unsignedIntFromBytes(engineLoadByte) / 2.55;

    this.log(`Розрахункове навантаження двигуна: ${engineLoadValue} %`, "info");

    return engineLoadValue;
  }

  parseEngineOilTemperature(value: string) {
    if (!value.startsWith("41 5C")) {
      return;
    }

    const separateBytes = value.trim().split(" ");
    const temperatureByte = separateBytes[2];
    const temperatureValue = unsignedIntFromBytes(temperatureByte) - 40;

    this.log(`Температура моторної оливи: ${temperatureValue} °C`, "info");

    return temperatureValue;
  }

  parseEngineSpeed(value: string) {
    if (!value.startsWith("41 0C")) {
      return;
    }

    const separateBytes = value.trim().split(" ");
    const rpmByteA = separateBytes[2];
    const rpmByteB = separateBytes[3];
    const rpmValue = unsignedIntFromBytes([rpmByteA, rpmByteB]) / 4;

    this.log(`Оберти двигуна: ${rpmValue} об/хв`, "info");

    return rpmValue;
  }

  parseVehicleSpeed(value: string) {
    if (!value.startsWith("41 0D")) {
      return;
    }

    const separateBytes = value.trim().split(" ");
    const speedByte = separateBytes[2];
    const speedValue = unsignedIntFromBytes(speedByte);

    this.log(`Швидкість: ${speedValue} км/год`, "info");

    return speedValue;
  }

  parseIntakeAirTemperature(value: string) {
    if (!value.startsWith("41 0F")) {
      return;
    }

    const separateBytes = value.trim().split(" ");
    const temperatureByte = separateBytes[2];
    const temperatureValue = unsignedIntFromBytes(temperatureByte) - 40;

    this.log(`Температура повітря на вході: ${temperatureValue} °C`, "info");

    return temperatureValue;
  }

  parseMassAirFlowSensorValue(value: string) {
    if (!value.startsWith("41 10")) {
      return;
    }

    const separateBytes = value.trim().split(" ");
    const massAirFlowA = separateBytes[2];
    const massAirFlowB = separateBytes[3];
    const massAirFlowValue = unsignedIntFromBytes([massAirFlowA, massAirFlowB]) / 100;

    this.log(`Масова витрата повітря: ${massAirFlowValue.toFixed(2)} г/c`, "info");

    return massAirFlowValue;
  }

  parseFuelTankLevel(value: string) {
    if (!value.startsWith("41 2F")) {
      return;
    }

    const separateBytes = value.trim().split(" ");
    const fuelTankLevelByte = separateBytes[2];
    const fuelTankLevelValue = (100 / 255) * unsignedIntFromBytes(fuelTankLevelByte);

    this.log(`Рівень палива в баку: ${fuelTankLevelValue.toFixed(2)} %`, "info");

    return fuelTankLevelValue;
  }

  parseControlModuleVoltage(value: string) {
    if (!value.startsWith("41 42")) {
      return;
    }

    const separateBytes = value.trim().split(" ");
    const voltageByteA = separateBytes[2];
    const voltageByteB = separateBytes[3];
    const voltageValue = unsignedIntFromBytes([voltageByteA, voltageByteB]) / 1000;

    this.log(`Напруга на електронному блоці управління: ${voltageValue.toFixed(2)} В`, "info");

    return voltageValue;
  }

  parseEngineFuelRate(value: string) {
    if (!value.startsWith("41 5E")) {
      return;
    }

    const separateBytes = value.trim().split(" ");
    const rateByteA = separateBytes[2];
    const rateByteB = separateBytes[3];
    const rateValue = unsignedIntFromBytes([rateByteA, rateByteB]) / 20;

    this.log(`Витрата пального: ${rateValue.toFixed(2)} л/год`, "info");

    return rateValue;
  }

  parseBmsInfoBuffer(buffer: string[]) {
    const joinedBuffer = buffer.join("").replaceAll("\n", "");

    const numberedPackets = Array.from(joinedBuffer.matchAll(/\d\:(\s[0-9A-F][0-9A-F]){7}/gm).map((match) => match[0]));

    const packets = numberedPackets.map((packet) => packet.split(":")[1].trim().split(" "));

    return packets;
  }

  bmsInfoBuffer01: string[] = [];

  parseKiaNiroBmsInfo01(value: string) {
    if (value.includes(">")) {
      const separatePacketBytes = this.parseBmsInfoBuffer(this.bmsInfoBuffer01);

      console.table(separatePacketBytes);

      if (separatePacketBytes.length !== 8) {
        this.bmsInfoBuffer01 = [];
        this.log(
          `Помилка при отриманні інформації з BMS #1 Kia Niro - неправильна кількість пакетів: ${separatePacketBytes.length}.`
        );
        return "<parseKiaNiroBmsInfo error>";
      }

      console.table(separatePacketBytes);

      const batteryCurrentValue = signedIntFromBytes(separatePacketBytes[1].slice(0, 2)) / 10;
      const batteryVoltageValue = signedIntFromBytes(separatePacketBytes[1].slice(2, 4)) / 10;
      const batteryPower = batteryCurrentValue * batteryVoltageValue;

      const battery12VVoltage = unsignedIntFromBytes(separatePacketBytes[3][5]) / 10;

      const socValue = unsignedIntFromBytes(separatePacketBytes[0][1]) / 2;

      const maxRegenValue = unsignedIntFromBytes(separatePacketBytes[0].slice(2, 4)) / 100;

      const maxPowerValue = unsignedIntFromBytes(separatePacketBytes[0].slice(4, 6)) / 100;

      const batteryMaxT = signedIntFromBytes(separatePacketBytes[1][4]);
      const batteryMinT = signedIntFromBytes(separatePacketBytes[1][5]);

      const maxCellVoltageValue = (unsignedIntFromBytes(separatePacketBytes[2][6]) * 2) / 100;
      const minCellVoltageValue = (unsignedIntFromBytes(separatePacketBytes[3][1]) * 2) / 100;

      this.log(`Інформація з BMS #1 Kia Niro:`, "info");
      this.log(`- рівень заряду: ${socValue} %`, "info");
      this.log(`- доступна потужність рекуперації: ${maxRegenValue} кВт`, "info");
      this.log(`- доступна потужність: ${maxPowerValue} кВт`, "info");
      this.log(`- температура акумулятора (макс.): ${batteryMaxT} °C`, "info");
      this.log(`- температура акумулятора (мін.): ${batteryMinT} °C`, "info");
      this.log(`- мінімальна напруга комірки: ${maxCellVoltageValue} В`, "info");
      this.log(`- максимальна напруга комірки: ${minCellVoltageValue} В`, "info");
      this.log(
        `- потужність ${batteryPower > 0 ? "розряджання" : "заряджання"} акумулятора: ${
          Math.abs(batteryPower) / 1000
        } кВт`,
        "info"
      );
      this.log(
        `- струм батареї: ${batteryCurrentValue} А / ${batteryCurrentValue > 0 ? "розряджання" : "заряджання"}`,
        "info"
      );
      this.log(`- напруга батареї: ${batteryVoltageValue} В`, "info");
      this.log(`- напруга 12В батареї: ${battery12VVoltage} В`, "info");

      this.bmsInfoBuffer01 = [];
    }

    this.bmsInfoBuffer01.push(value);
  }

  bmsInfoBuffer05: string[] = [];
  parseKiaNiroBmsInfo05(value: string) {
    if (value.includes(">")) {
      const separatePacketBytes = this.parseBmsInfoBuffer(this.bmsInfoBuffer05);

      const heaterTemp = signedIntFromBytes(separatePacketBytes[2][6]);

      const sohByteA = separatePacketBytes[3][1];
      const sohByteB = separatePacketBytes[3][2];

      const sohValue = unsignedIntFromBytes([sohByteA, sohByteB]) / 10;

      this.log(`Інформація з BMS #5 Kia Niro:`, "info");
      this.log(`- здоров'я акумулятора (SOH): ${sohValue} %`, "info");
      this.log(`- температура обігрівача акумулятора: ${heaterTemp} °C`, "info");

      this.bmsInfoBuffer05 = [];
    }

    this.bmsInfoBuffer05.push(value);
  }

  absInfoBuffer: string[] = [];
  // WIP
  parseKiaNiroAbsInfo(value: string) {
    console.log(this.absInfoBuffer);

    if (value.includes(">")) {
      console.log(this.absInfoBuffer);

      const separatePacketBytes = this.parseBmsInfoBuffer(this.absInfoBuffer);

      const speedDisplayValue = unsignedIntFromBytes(separatePacketBytes[1][5]);

      const speedByteA = separatePacketBytes[1][6];
      const speedByteB = separatePacketBytes[2][1];
      const speedValue = unsignedIntFromBytes([speedByteA, speedByteB]);

      this.log(`Інформація з ABS Kia Niro:`, "info");
      for (const line of separatePacketBytes) {
        this.log(`${line.join(" ")}`, "info");
      }
      this.log(`- швидкість (на дисплеї) ${speedDisplayValue}`, "info");
      this.log(`- швидкість точна ${speedValue}`, "info");

      this.absInfoBuffer = [];
    }

    this.absInfoBuffer.push(value);
  }
}
