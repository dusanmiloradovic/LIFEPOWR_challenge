/* eslint-disable @typescript-eslint/no-this-alias */
import { Logger, RegisterValueRecord } from "./types";
import ipc from "node-ipc";

ipc.config.silent = true;
ipc.config.id = "chartClient";

export class IPCLogger implements Logger {
  constructor(private readonly profileName: string) {}

  static connected = false; // we can have only one client connected to the server
  static connecting = false;

  init() {
    const that = this;
    if (IPCLogger.connecting) {
      console.log("Already connecting on another instance");
      return;
    }
    IPCLogger.connecting = true;
    ipc.connectTo("chartServer", function () {
      ipc.of.chartServer.on("connect", () => {
        console.log("ipc logger connected");
        IPCLogger.connected = true;
        IPCLogger.connecting = false;
        ipc.of.chartServer.emit("start.profile", that.profileName);
      });
      ipc.of.chartServer.on("disconnect", () => {
        console.log("ipc logger disconnected");
        IPCLogger.connected = false;
        IPCLogger.connecting = false;
      });
    });
  }

  stop() {
    ipc.disconnect("chartServer");
  }

  async writeError(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async writeRecord(timestamp, record: RegisterValueRecord): Promise<void> {
    if (!IPCLogger.connected) {
      console.error("IPC logger disconnected, can't send message");
      return;
    }
    ipc.of.chartServer.emit("app.message", {
      id: ipc.config.id,
      message: { profileName: this.profileName, timestamp, record },
    });
  }
}
