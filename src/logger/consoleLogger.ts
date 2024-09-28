import { Logger, RegisterValueRecord } from "./types";
import { RegisterName } from "../registers/types";

export class ConsoleLogger implements Logger {
  init() {
    console.log("Starting with logging");
  }

  stop() {
    console.log("Logging finished");
  }

  async writeError(
    timestamp: number,
    registerName: RegisterName,
    value: Error,
  ): Promise<void> {
    console.error(timestamp, value);
  }

  async writeRecord(timestamp, record: RegisterValueRecord): Promise<void> {
    const d = new Date(timestamp);
    let recordStr = `${d}: `;
    for (const k in record) {
      recordStr += `${k}=${record[k]} `;
    }
    console.log(recordStr);
  }
}
