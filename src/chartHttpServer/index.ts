import express from "express";
import ipc from "node-ipc";
import { RegisterValueRecord } from "../logger/types";
import { randomUUID } from "crypto";

const app = express();
ipc.config.id = "chartServer";
ipc.config.retry = 1500;
ipc.config.silent = true;

const profileData = {};

const streamingResponses: Record<string, express.Response> = {};

export interface ProfileRecord {
  profileName: string;
  timestamp: number;
  record: RegisterValueRecord;
}

function streamProfileRecord(profileRecord: ProfileRecord) {
  for (const res of Object.values(streamingResponses)) {
    res.write(`data: ${JSON.stringify(profileRecord)}\n\n`);
  }
}

ipc.serve(function () {
  ipc.server.on("start.profile", function (data) {
    profileData[data] = [];
  });
  ipc.server.on("app.message", function (data) {
    const profileRecord = data.message as ProfileRecord;
    let profileArr = profileData[profileRecord?.profileName] as ProfileRecord[];
    if (!profileArr) {
      profileArr = [];
      profileData[profileRecord?.profileName] = profileArr;
    }
    profileArr = [...profileArr, profileRecord];
    profileData[profileRecord?.profileName] = profileArr;
    streamProfileRecord(profileRecord);
  });
});
ipc.server.start();

app.get(
  "/api/get-register-logs",
  (req: express.Request, res: express.Response) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(profileData));
  },
);

app.get("/api/stream-logs", (req: express.Request, res: express.Response) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  const uuid = randomUUID();
  streamingResponses[uuid] = res;
  res.on("close", () => {
    res.end();
    console.log("Connection closed");
    delete streamingResponses[uuid];
  });
});

app.use(express.static("public"));
app.listen(3000, () => console.log("Server running on port 3000"));
