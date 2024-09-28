import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Line } from "@nivo/line";

interface ProfileRecord {
  profileName: string;
  timestamp: number;
  record: Record<string, number | string>;
}

type ProfileData = Record<string, ProfileRecord[]>;

function Selector({
  data,
  label,
  onSelect,
}: {
  data: string[];
  label: string;
  onSelect: (value: string) => void;
}) {
  return (
    <span style={{ marginRight: "50px" }}>
      <label htmlFor={label}>{label}</label>
      <select
        className={"combo"}
        name={label}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
          onSelect(event.target.value);
        }}
      >
        {data.map((d) => (
          <option value={d}>{d}</option>
        ))}
      </select>
    </span>
  );
}

export default function RealTimeChart() {
  const state = useRef<ProfileData>({});
  const [chosenProfile, setChosenProfile] = useState<string | undefined>(
    undefined,
  );
  const [chosenRegister, setChosenRegister] = useState<string | undefined>(
    undefined,
  );
  const [, forceRender] = useState();

  async function fetchRegisterLogs() {
    const data = await fetch("/api/get-register-logs");
    const dtaJson = (await data.json()) as ProfileData;
    console.log(dtaJson);
    state.current = dtaJson;
    forceRender(state.current as any);
  }

  useEffect(() => {
    fetchRegisterLogs().catch(console.error);
    const sse = new EventSource("/api/stream-logs");
    sse.onerror = () => {
      console.error("SSE error");
      sse.close();
    };
    sse.onmessage = (event) => {
      if (!state.current || Object.keys(state.current).length === 0) {
        return; // wait first for fetch to finish
      }
      const data = JSON.parse(event.data) as ProfileRecord;
      const existingLog = state.current[data.profileName] ?? [];
      const newLog = [...existingLog, data];
      const newState = { ...state.current, [data.profileName]: newLog };
      state.current = newState;
      forceRender(state.current as any);
    };
    sse.onopen = () => {
      console.log("SSE open");
    };
  }, []);
  const profiles = Object.keys(state.current);
  if (!chosenProfile && profiles.length > 0) {
    setChosenProfile(profiles[0]);
  }
  if (Object.keys(state.current).length === 0) {
    return (
      <h1>No data available yet, start the script and refresh the page</h1>
    );
  }

  const profileLog = chosenProfile ? state.current[chosenProfile] : [];
  const regSet: Set<string> = new Set<string>();
  if (profileLog.length > 0) {
    const profile = profileLog[0]; //assume registers are the same
    Object.keys(profile.record).forEach((record) => {
      regSet.add(record);
    });
  }

  const registers = [...regSet];
  if (!chosenRegister && registers.length > 0) {
    setChosenRegister(registers[0]);
  }

  const chartData = profileLog.map((d) => {
    const time = new Date(d.timestamp);
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    const timeString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    const val = d.record[chosenRegister as string] as number;
    return { x: timeString, y: val };
  });
  const commonProperties = {
    width: 1200,
    height: 600,
    margin: { top: 20, right: 20, bottom: 60, left: 80 },
    animate: true,
    enableTouchCrosshair: false,
    enableSlices: "x",
    initialHiddenIds: ["cognac"],
    enablePoints: false,
  };

  // noinspection TypeScriptValidateTypes
  return (
    <div>
      <span>
        <Selector
          data={profiles}
          label={"Select Profile"}
          onSelect={setChosenProfile}
        />
        <Selector
          data={registers}
          label={"Select Register"}
          onSelect={setChosenRegister}
        />
      </span>
      <div style={{ marginTop: "50px" }}>
        <Line
          {...commonProperties}
          data={[
            {
              id: "signal B",
              data: chartData,
            },
          ]}
          xScale={{
            type: "time",
            format: "%Y-%m-%d %H:%M:%S",
            useUTC: false,
            precision: "second",
          }}
          xFormat="time:%Y-%m-%d %H:%M:%S"
          yScale={{
            type: "linear",
            // stacked: boolean('stacked', false),
          }}
          axisLeft={{
            legend: "linear scale",
            legendOffset: 12,
          }}
          axisBottom={{
            format: "%H:%M",
            tickValues: "every 1 minute",
            legend: "time scale",
            legendOffset: -12,
          }}
          enablePointLabel={true}
          pointSize={16}
          pointBorderWidth={1}
          pointBorderColor={{
            from: "color",
            modifiers: [["darker", 0.3]],
          }}
          useMesh={true}
          enableSlices={false}
        />
      </div>
    </div>
  );
}
