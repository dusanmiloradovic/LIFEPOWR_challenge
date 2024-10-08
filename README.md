# LIFEPOWR Technical challenge
Before running the script, ensure the docker image is available locally:  
```docker pull  public.ecr.aws/k1u2a6n3/lp_ev_emulator:latest```

## Running the script with power profiles

If you want to see the real time charts:
1. Start the charts http server:  
       ```npm run chart-server```
2. Run the script:  
       ```npm run loadPowerProfiles```
3. See the real-time charts:  
     Open the browser on the address [http://localhost:3000](http://localhost:3000)  
   That will open a small app with two combo boxes for choosing the power profile, the register, and the real-time chart
4. CSV output files:
   For each profile, the script also logs the value of each register and the timestamp. The output folder is the root of the project, and the  file names are result1.csv, result2.csv,, and result3.csv

### Modifying the script
If you want to change which registers are logged, change the following lines in ```loadPowerProfiles.ts``:  
```
const registersToLog = [
  RegisterName.ActualAppliedMaxCurrent,
  RegisterName.ApparentEnergyL1,
  RegisterName.ApparentPowerL1,
  RegisterName.RealPowerL1,
  RegisterName.RealEnergyDeliveredL1,
  RegisterName.RealEnergyConsumedL1,
];
```
Currently, only numeric registers are supported. Also, all the registers have to belong to the same unit.
If you want to monitor the registers from the "Global" unit, you need to define a different array of registers and an additional controller of the type```RegisterSet.Global``` 

If you don't need real-time charts, comment out the following lines in ```loadPowerProfiles.ts```   (lines 53 and 54)
```
  const ipcLogger = new IPCLogger(powerProfileFile);
  controller.addLogger(ipcLogger);
```
## Library
The project can be used as a library. All the library functionality is exposed through the  ```Controller``` class, exported in the root ```index.ts``` file  
### Instructions
First, define the registers to monitor. All the registers have to belong to the same unit:  
```
const registersToLog = [
  RegisterName.ActualAppliedMaxCurrent,
  RegisterName.ApparentEnergyL1,
  RegisterName.ApparentPowerL1,
  RegisterName.RealPowerL1,
  RegisterName.RealEnergyDeliveredL1,
  RegisterName.RealEnergyConsumedL1,
];
```
If you don't want to monitor the registers, and want to manually read the register values instead, use the empty array  
Next, create an instance of a controller:  
```
const controller = new Controller(tcp_host, tcp_port, register_set, registers_to_log);
```
example:
```
const controller = new Controller(
  "localhost",
  5502,
  RegisterSet.Socket,
  registersToLog,
);
```
Next, you can add one or more loggers: CSVLogger - which output the register values into the csv file; ConsoleLogger-output the register values to console and IPCLogger - used to send logs to the chart server:
```
 const csvLogger = new CSVLogger(csvResultPath);
 controller.addLogger(csvLogger);
```
To set the expected power to EV charger:
```
controller.triggerExpectedPower(kwPower);
```
, and to read the register value:
```
controller.readRegisterNumericValue(registerName);
```
There are also versions of these methods with retries : ```triggerExpectedPowerWithRetry``` and ```readRegisterNumericValueWithRetry```  
To trigger the power set:
```controller.triggerExpectedPowerSet(powerSet,delayBetween)```, where powerSet is array of numbers(kW is the measure), and delayBetween is the delay in ms between triggering.      
Upon completion, you need to stop the loggers:  
```controller.stopLoggers()```
