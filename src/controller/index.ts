import ModbusRTU from "modbus-serial";
import { RegisterName } from "../registers/types";
import { getRegister } from "../registers";
import { getRegisterReader } from "./registerReader";
import { getRegisterWriter } from "./registerWriter";
import { Logger, RegisterValueRecord } from "../logger/types";

const OPERATING_VOLTAGE = 230;
const RETRY_DELAY_MS = 50;

export enum RegisterSet {
  Socket,
  Global,
}

interface ValueWithDelay {
  //after the value has been set to register, delay the execution for fixed number of ms
  value: number;
  delayMs: number;
}

export class Controller {
  client: ModbusRTU;
  loggers: Logger[] = [];

  constructor(
    private readonly ip: string,
    private readonly port: number,
    private readonly registerSet: RegisterSet,
    private readonly registersToLog?: RegisterName[],
  ) {
    this.client = new ModbusRTU();
  }

  public async init() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.client.connectTCP(this.ip, { port: this.port });
    this.client.setID(this.registerSet === RegisterSet.Socket ? 1 : 200); // Unit ID, as per the spec
  }

  public async initLoggers() {
    for (const logger of this.loggers) {
      await logger.init();
    }
  }

  public async stopLoggers() {
    for (const logger of this.loggers) {
      await logger.stop();
    }
  }

  public addLogger(logger: Logger) {
    this.loggers.push(logger);
  }

  public async readRegisterNumericValue(
    registerName: RegisterName,
  ): Promise<number> {
    const register = getRegister(registerName);
    const reader = getRegisterReader(this.client, register);
    return reader.getNumericValue();
  }

  public async triggerExpectedPower(kwPower: number): Promise<void> {
    const current = (kwPower * 1000) / OPERATING_VOLTAGE;
    const register = getRegister(RegisterName.ModbusSlaveMaxCurrent);
    const writer = getRegisterWriter(this.client, register);
    await writer.setNumericValue(current);
  }

  public async logRegisters(maxDelay?: number): Promise<void> {
    if (!this.registersToLog) {
      return;
    }
    const rec = {} as RegisterValueRecord;
    const delayUntil = Date.now() + (maxDelay ?? 0);
    for (const register of this.registersToLog) {
      rec[register] = await this.readRegisterNumericValueWithRetry(
        register,
        delayUntil,
      );
    }
    for (const logger of this.loggers) {
      await logger.writeRecord(Date.now(), rec);
    }
  }

  public async triggerExpectedPowerWithRetry(
    kwPower: number,
    tryUntil: number,
  ): Promise<void> {
    // This should handle any temporary network disconnections and retry until tryUntil is reached
    // and only then it throws an error
    // TODO write a test for this
    try {
      await this.triggerExpectedPower(kwPower);
      await this.logRegisters();
    } catch (e) {
      console.error(e);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      const now = Date.now();
      if (tryUntil > now) {
        await this.triggerExpectedPowerWithRetry(kwPower, tryUntil);
      } else {
        throw new Error("Timeout error");
      }
    }
  }

  public async triggerExpectedPowerAndDelayReturn(
    valWithDelay: ValueWithDelay,
  ): Promise<void> {
    // the idea is to do it sequentially with arbitrary of fixed time delays
    let now = Date.now();
    const delayUntil = now + valWithDelay.delayMs;
    await this.triggerExpectedPowerWithRetry(valWithDelay.value, delayUntil);
    now = Date.now();
    const delay = delayUntil - now;
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  public async triggerExpectedPowerSet(
    powerSet: number[],
    delayBetween: number,
  ): Promise<void> {
    const pSetVals = powerSet.map(
      (n) => ({ delayMs: delayBetween, value: n }) as ValueWithDelay,
    );
    for (const val of pSetVals) {
      try {
        await this.triggerExpectedPowerAndDelayReturn(val);
      } catch (err) {
        console.error(err); // TODO put this into logger
      }
    }
  }

  public async readRegisterNumericValueWithRetry(
    registerName: RegisterName,
    tryUntil: number,
  ): Promise<number> {
    try {
      return await this.readRegisterNumericValue(registerName);
    } catch (e) {
      console.error(e);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      const now = Date.now();
      if (tryUntil > now) {
        return this.readRegisterNumericValueWithRetry(registerName, tryUntil);
      } else {
        throw new Error("Timeout error");
      }
    }
  }
}
