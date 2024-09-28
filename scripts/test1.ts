import { DockerRunner } from "../src/dockerrun";
import { Controller, RegisterSet } from "../src/controller";
import { RegisterName } from "../src/registers/types";
import { ConsoleLogger } from "../src/logger/consoleLogger";
import { readPowerProfile } from "../src/csv/powerProfileReader";

const dockerRunner = new DockerRunner(5502, "test11");
const controller = new Controller("localhost", 5502, RegisterSet.Socket, [
  RegisterName.ActualAppliedMaxCurrent,
  RegisterName.ApparentEnergyL1,
  RegisterName.ApparentPowerL1,
  RegisterName.RealPowerL1,
  RegisterName.RealEnergyDeliveredL1,
  RegisterName.RealEnergyConsumedL1,
]);
const controller2 = new Controller("localhost", 5502, RegisterSet.Global); //global

async function run() {
  const path = `${process.cwd()}/powerProfiles/power_setpoint_1.csv`;
  await readPowerProfile(path);
  await dockerRunner.run();
  const logger = new ConsoleLogger();
  controller.addLogger(logger);

  await controller.init();
  await controller.initLoggers();
  await controller2.init();
  let val = await controller.readRegisterNumericValue(
    RegisterName.StateOfCharge,
  );
  console.log(`State of charge = ${val}`);
  await new Promise((resolve) => setTimeout(resolve, 6000));
  val = await controller.readRegisterNumericValue(RegisterName.StateOfCharge);
  console.log(`State of charge = ${val}`);
  await controller.triggerExpectedPower(4.5);
  await new Promise((resolve) => setTimeout(resolve, 6000));
  val = await controller.readRegisterNumericValue(RegisterName.StateOfCharge);
  console.log(`State of charge = ${val}`);
  val = await controller2.readRegisterNumericValue(RegisterName.Temperature);
  console.log(`Temperature = ${val}`);
  await controller.triggerExpectedPowerSet(
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    60000,
  );
  await controller.stopLoggers();
  await dockerRunner.stop();
}

run().catch((err) => {
  console.error(err);
  dockerRunner.stop();
});
