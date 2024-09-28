import { DockerRunner } from "../src/dockerrun";
import { Controller, RegisterSet } from "../src/controller";
import { RegisterName } from "../src/registers/types";
import { readPowerProfile } from "../src/csv/powerProfileReader";
import { ConsoleLogger } from "../src/logger/consoleLogger";
import { CSVLogger } from "../src/logger/csvLogger";
import { IPCLogger } from "../src/logger/IPCLogger";

const registersToLog = [
  RegisterName.ActualAppliedMaxCurrent,
  RegisterName.ApparentEnergyL1,
  RegisterName.ApparentPowerL1,
  RegisterName.RealPowerL1,
  RegisterName.RealEnergyDeliveredL1,
  RegisterName.RealEnergyConsumedL1,
];
const dockerRunner1 = new DockerRunner(5502, "profile1");
const dockerRunner2 = new DockerRunner(5503, "profile2");
const dockerRunner3 = new DockerRunner(5504, "profile3");

const controller1 = new Controller(
  "localhost",
  5502,
  RegisterSet.Socket,
  registersToLog,
);
const controller2 = new Controller(
  "localhost",
  5503,
  RegisterSet.Socket,
  registersToLog,
);
const controller3 = new Controller(
  "localhost",
  5504,
  RegisterSet.Socket,
  registersToLog,
);

async function run(
  dockerRunner: DockerRunner,
  controller: Controller,
  powerProfileFile: string,
  csvResultPath: string,
) {
  const path = `${process.cwd()}/powerProfiles/${powerProfileFile}`;
  const powerProfile = await readPowerProfile(path);
  await dockerRunner.run();
  // const logger = new ConsoleLogger();
  // controller.addLogger(logger);
  const csvLogger = new CSVLogger(csvResultPath);
  controller.addLogger(csvLogger);
  const ipcLogger = new IPCLogger(powerProfileFile);
  controller.addLogger(ipcLogger);

  await controller.init();
  await controller.initLoggers();
  await controller.triggerExpectedPowerSet(powerProfile, 1000);
  await controller.stopLoggers();
  await dockerRunner.stop();
}

run(
  dockerRunner1,
  controller1,
  "power_setpoint_1.csv",
  `${process.cwd()}/result1.csv`,
).catch((err) => {
  console.error(err);
  dockerRunner1.stop();
});
run(
  dockerRunner2,
  controller2,
  "power_setpoint_2.csv",
  `${process.cwd()}/result2.csv`,
).catch((err) => {
  console.error(err);
  dockerRunner2.stop();
});
run(
  dockerRunner3,
  controller3,
  "power_setpoint_3.csv",
  `${process.cwd()}/result3.csv`,
).catch((err) => {
  console.error(err);
  dockerRunner3.stop();
});
