import { promises as fs } from "fs";
import { parse } from "csv-parse/sync";

export async function readPowerProfile(path: string) {
  const content = await fs.readFile(path);
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const records = parse(content, { columns: true }) as any[];
  const profile = records.map((record) =>
    parseFloat(record["power_setpoint_kW"]),
  );
  return profile;
}
