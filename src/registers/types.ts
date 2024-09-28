export enum RegisterName {
  MeterState = "MeterState",
  MeterLastValueTimestamp = "MeterLastValueTimestamp",
  MeterType = "MeterType",
  VoltageL1_N = "VoltageL1_N",
  CurrentN = "CurrentN",
  PowerFactorL1 = "PowerFactorL1",
  Frequency = "Frequency",
  RealPowerL1 = "RealPowerL1",
  ApparentPowerL1 = "ApparentPowerL1",
  ReactivePowerL1 = "ReactivePowerL1",
  RealEnergyDeliveredL1 = "RealEnergyDeliveredL1",
  RealEnergyConsumedL1 = "RealEnergyConsumedL1",
  ApparentEnergyL1 = "ApparentEnergyL1",
  ReactiveEnergyL1 = "ReactiveEnergyL1",
  Availability = "Availability",
  ActualAppliedMaxCurrent = "ActualAppliedMaxCurrent",
  Mode3State = "Mode3State",
  ModbusSlaveMaxCurrent = "ModbusSlaveMaxCurrent",
  ModbusSlaveReceivedSetPointAccountedFor = "ModbusSlaveReceivedSetPointAccountedFor",
  StateOfCharge = "StateOfCharge",
  Name = "Name",
  Manufacturer = "Manufacturer",
  ModbusTableVersion = "ModbusTableVersion",
  FirmwareVersion = "FirmwareVersion",
  PlatformType = "PlatformType",
  StationSerialNumber = "StationSerialNumber",
  DateYear = "DateYear",
  DateMonth = "DateMonth",
  DateDay = "DateDay",
  TimeHour = "TimeHour",
  TimeMinute = "TimeMinute",
  TimeSecond = "TimeSecond",
  Uptime = "Uptime",
  TimeZone = "TimeZone",
  StationActiveMaxCurrent = "StationActiveMaxCurrent",
  Temperature = "Temperature",
  OCPPState = "OCPPState",
  NrOfSockets = "NrOfSockets",
}

export enum RegisterType {
  Global,
  Socket,
}

export enum RegisterDataType {
  UInt16,
  UInt64,
  Float32,
  Double,
  Int16,
  Char,
}

export interface Register {
  name: RegisterName;
  address: number;
  type: RegisterType;
  dataType: RegisterDataType;
}
