import { RegisterName } from "../registers/types";

export type RegisterValueRecord = Record<RegisterName, number | string>;

export interface Logger {
  init();

  stop();

  writeRecord(timestamp, record: RegisterValueRecord): Promise<void>;

  writeError(
    timestamp: number,
    registerName: RegisterName,
    value: Error,
  ): Promise<void>;
}
