import {
  Register,
  RegisterDataType,
  RegisterName,
  RegisterType,
} from "./types";

const registerMap: Record<RegisterName, Register> = {
  MeterState: {
    name: RegisterName.MeterState,
    type: RegisterType.Socket,
    address: 300,
    dataType: RegisterDataType.UInt16,
  },
  MeterLastValueTimestamp: {
    name: RegisterName.MeterLastValueTimestamp,
    type: RegisterType.Socket,
    address: 301,
    dataType: RegisterDataType.UInt64,
  },
  MeterType: {
    name: RegisterName.MeterType,
    type: RegisterType.Socket,
    address: 305,
    dataType: RegisterDataType.UInt16,
  },
  VoltageL1_N: {
    name: RegisterName.VoltageL1_N,
    type: RegisterType.Socket,
    address: 306,
    dataType: RegisterDataType.Float32,
  },
  CurrentN: {
    name: RegisterName.CurrentN,
    type: RegisterType.Socket,
    address: 318,
    dataType: RegisterDataType.Float32,
  },
  PowerFactorL1: {
    name: RegisterName.PowerFactorL1,
    type: RegisterType.Socket,
    address: 328,
    dataType: RegisterDataType.Float32,
  },
  Frequency: {
    name: RegisterName.Frequency,
    type: RegisterType.Socket,
    address: 336,
    dataType: RegisterDataType.Float32,
  },
  RealPowerL1: {
    name: RegisterName.RealPowerL1,
    type: RegisterType.Socket,
    address: 338,
    dataType: RegisterDataType.Float32,
  },
  ApparentPowerL1: {
    name: RegisterName.ApparentPowerL1,
    type: RegisterType.Socket,
    address: 346,
    dataType: RegisterDataType.Float32,
  },
  ReactivePowerL1: {
    name: RegisterName.ReactivePowerL1,
    type: RegisterType.Socket,
    address: 354,
    dataType: RegisterDataType.Float32,
  },
  RealEnergyDeliveredL1: {
    name: RegisterName.RealEnergyDeliveredL1,
    type: RegisterType.Socket,
    address: 362,
    dataType: RegisterDataType.Double,
  },
  RealEnergyConsumedL1: {
    name: RegisterName.RealEnergyConsumedL1,
    type: RegisterType.Socket,
    address: 378,
    dataType: RegisterDataType.Double,
  },
  ApparentEnergyL1: {
    name: RegisterName.ApparentEnergyL1,
    type: RegisterType.Socket,
    address: 394,
    dataType: RegisterDataType.Double,
  },
  ReactiveEnergyL1: {
    name: RegisterName.ReactiveEnergyL1,
    type: RegisterType.Socket,
    address: 410,
    dataType: RegisterDataType.Double,
  },
  Availability: {
    name: RegisterName.Availability,
    type: RegisterType.Socket,
    address: 1200,
    dataType: RegisterDataType.UInt16,
  },
  Mode3State: {
    name: RegisterName.Mode3State,
    type: RegisterType.Socket,
    address: 1201,
    dataType: RegisterDataType.Char,
  },
  ActualAppliedMaxCurrent: {
    name: RegisterName.ActualAppliedMaxCurrent,
    type: RegisterType.Socket,
    address: 1206,
    dataType: RegisterDataType.Float32,
  },
  ModbusSlaveMaxCurrent: {
    name: RegisterName.ModbusSlaveMaxCurrent,
    type: RegisterType.Socket,
    address: 1210,
    dataType: RegisterDataType.Float32,
  },
  ModbusSlaveReceivedSetPointAccountedFor: {
    name: RegisterName.ModbusSlaveReceivedSetPointAccountedFor,
    type: RegisterType.Socket,
    address: 1214,
    dataType: RegisterDataType.UInt16,
  },
  StateOfCharge: {
    name: RegisterName.StateOfCharge,
    type: RegisterType.Socket,
    address: 1216,
    dataType: RegisterDataType.Int16,
  },
  Name: {
    name: RegisterName.Name,
    type: RegisterType.Global,
    address: 100,
    dataType: RegisterDataType.Char,
  },
  Manufacturer: {
    name: RegisterName.Manufacturer,
    type: RegisterType.Global,
    address: 117,
    dataType: RegisterDataType.Char,
  },
  ModbusTableVersion: {
    name: RegisterName.ModbusTableVersion,
    type: RegisterType.Global,
    address: 122,
    dataType: RegisterDataType.Int16,
  },
  FirmwareVersion: {
    name: RegisterName.FirmwareVersion,
    type: RegisterType.Global,
    address: 123,
    dataType: RegisterDataType.Char,
  },
  PlatformType: {
    name: RegisterName.PlatformType,
    type: RegisterType.Global,
    address: 140,
    dataType: RegisterDataType.Char,
  },
  StationSerialNumber: {
    name: RegisterName.StationSerialNumber,
    type: RegisterType.Global,
    address: 157,
    dataType: RegisterDataType.Char,
  },
  DateYear: {
    name: RegisterName.DateYear,
    type: RegisterType.Global,
    address: 168,
    dataType: RegisterDataType.Int16,
  },
  DateMonth: {
    name: RegisterName.DateMonth,
    type: RegisterType.Global,
    address: 169,
    dataType: RegisterDataType.Int16,
  },
  DateDay: {
    name: RegisterName.DateDay,
    type: RegisterType.Global,
    address: 170,
    dataType: RegisterDataType.Int16,
  },
  TimeHour: {
    name: RegisterName.TimeHour,
    type: RegisterType.Global,
    address: 171,
    dataType: RegisterDataType.Int16,
  },
  TimeMinute: {
    name: RegisterName.TimeMinute,
    type: RegisterType.Global,
    address: 172,
    dataType: RegisterDataType.Int16,
  },
  TimeSecond: {
    name: RegisterName.TimeSecond,
    type: RegisterType.Global,
    address: 173,
    dataType: RegisterDataType.Int16,
  },
  Uptime: {
    name: RegisterName.Uptime,
    type: RegisterType.Global,
    address: 174,
    dataType: RegisterDataType.UInt64,
  },
  TimeZone: {
    name: RegisterName.TimeZone,
    type: RegisterType.Global,
    address: 178,
    dataType: RegisterDataType.Int16,
  },
  StationActiveMaxCurrent: {
    name: RegisterName.StationActiveMaxCurrent,
    type: RegisterType.Global,
    address: 1100,
    dataType: RegisterDataType.Float32,
  },
  Temperature: {
    name: RegisterName.Temperature,
    type: RegisterType.Global,
    address: 1102,
    dataType: RegisterDataType.Float32,
  },
  OCPPState: {
    name: RegisterName.OCPPState,
    type: RegisterType.Global,
    address: 1104,
    dataType: RegisterDataType.UInt16,
  },
  NrOfSockets: {
    name: RegisterName.NrOfSockets,
    type: RegisterType.Global,
    address: 1105,
    dataType: RegisterDataType.UInt16,
  },
};

export function getRegister(registerName: RegisterName): Register {
  return registerMap[registerName];
}
