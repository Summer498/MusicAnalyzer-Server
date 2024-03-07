import { BeatPos, SingleOrArray } from "./common";

type MPR = "3" | "4" | "5a" | "5b" | "5c" | "5d" | "5e"

type Metric = {
  dot: number,
  at: number,
  applied?: SingleOrArray<{ level: number, rule: MPR }>
  note?: { id: BeatPos }
}
export type MTR = {
  MPR: {
    part: {
      id: BeatPos
      metric: SingleOrArray<Metric>
    }
  }
}