import { BeatPos, Path } from "./common";

type Chord = {
  duration: number,
  velocity: number,
  note: { id: BeatPos }
}

type Temp = {
  difference: number,
  stable: 0 | "unknown" | Path,
  pred: { temp: 0 | "-inf" | Path }
  succ: { temp: 0 | "+inf" | Path }
}

type TS = {
  ts: {
    timespan: number,
    leftend: number,
    rightend: number,
    head: { chord: Chord },
    at: { temp: Temp },
    primary?: TS
    secondary?: TS
  }
}

export type TSR = {
  tstree: TS
}