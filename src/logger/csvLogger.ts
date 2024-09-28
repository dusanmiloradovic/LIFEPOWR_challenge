import { Logger, RegisterValueRecord } from "./types";
import { RegisterName } from "../registers/types";
import fileStream, { WriteStream } from "fs";

export class CSVLogger implements Logger {
  private stream: WriteStream;
  private registerColumns: RegisterName[];

  constructor(private readonly path: string) {}

  init() {
    this.stream = fileStream.createWriteStream(this.path);
  }

  stop() {
    this.stream.end();
  }

  writeError(
    timestamp: number,
    registerName: RegisterName,
    value: Error,
  ): Promise<void> {
    // there is no point poluting the csv file with error values
    console.error(timestamp, value);
    return;
  }

  async writeRecord(
    timestamp: number,
    record: RegisterValueRecord,
  ): Promise<void> {
    const recordKeys = Object.keys(record) as RegisterName[];
    if (!this.registerColumns) {
      this.registerColumns = recordKeys;
      let header = "Time";
      for (const k of recordKeys) {
        header += `,${k}`;
      }
      header += "\n";
      this.stream.write(header);
    }
    const date = new Date(timestamp);
    let recordStr = date.toTimeString();
    for (const k of this.registerColumns) {
      const val = record[k];
      recordStr += `,${val}`;
    }
    recordStr += "\n";
    this.stream.write(recordStr);
  }
}
