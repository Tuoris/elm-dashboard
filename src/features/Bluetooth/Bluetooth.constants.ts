export const COMMANDS = {
  VIN: "0902",
  MONITOR_STATUS_SINCE_DTCS_CLEARED: "0101",
  ENGINE_COOLANT_TEMPERATURE: "0105",
  ENGINE_OIL_TEMPERATURE: "015C",
  CALCULATED_ENGINE_LOAD: "0104",
  ENGINE_SPEED: "010C",
  VEHICLE_SPEED: "010D",
  INTAKE_AIR_TEMPERATURE: "010F",
  MASS_AIR_FLOW_SENSOR: "0110",
  FUEL_TANK_LEVEL: "012F",
  CONTROL_MODULE_VOLTAGE: "0142",
  ENGINE_FUEL_RATE: "015E",
  EXTENDED_TIMEOUT: "AT ST96",
  KIA_NIRO_BMS_INFO_01: "220101",
  KIA_NIRO_BMS_INFO_05: "220105",
  KIA_NIRO_ABS_INFO: "22C101",
};

export const COMMAND_LABELS = {
  [COMMANDS.VIN]: "VIN",
  [COMMANDS.MONITOR_STATUS_SINCE_DTCS_CLEARED]: "Статус моніторингу після видалення кодів несправностей",
  [COMMANDS.ENGINE_COOLANT_TEMPERATURE]: "Температура ох. рідини двигуна",
  [COMMANDS.ENGINE_OIL_TEMPERATURE]: "Температура моторної оливи",
  [COMMANDS.CALCULATED_ENGINE_LOAD]: "Розрахункове навантаження двигуна",
  [COMMANDS.ENGINE_SPEED]: "Оберти двигуна",
  [COMMANDS.VEHICLE_SPEED]: "Швидкість",
  [COMMANDS.INTAKE_AIR_TEMPERATURE]: "Температура повітря на вході",
  [COMMANDS.MASS_AIR_FLOW_SENSOR]: "Датчик масової витрати повітря",
  [COMMANDS.FUEL_TANK_LEVEL]: "Рівень палива в баку",
  [COMMANDS.CONTROL_MODULE_VOLTAGE]: "Напруга на ЕБУ",
  [COMMANDS.ENGINE_FUEL_RATE]: "Витрата пального",
  [COMMANDS.EXTENDED_TIMEOUT]: "Збільшити час відповіді",
  [COMMANDS.KIA_NIRO_BMS_INFO_01]: "Kia Niro інформація з BMS #1",
  [COMMANDS.KIA_NIRO_BMS_INFO_05]: "Kia Niro інформація з BMS #5",
  [COMMANDS.KIA_NIRO_ABS_INFO]: "Kia Niro інформація з ABS #1",
};

export const CONFIGS = [
  {
    name: "Блакитний клон ELM 327",
    serviceUuid: "0000fff0-0000-1000-8000-00805f9b34fb",
    characteristicUuid: 0xfff1,
  },
  {
    name: "Vgate iCar2 Bluetooth 4.0",
    serviceUuid: "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
    characteristicUuid: "bef8d6c9-9c21-4c9e-b632-bd58c1009f9f",
  },
];
