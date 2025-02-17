import { BeatPos, Note } from "../common";

type MPR = "3" | "4" | "5a" | "5b" | "5c" | "5d" | "5e"

type Applied = {
  readonly level: number,
  readonly rule: MPR
}

type Metric = {
  readonly dot: number,
  readonly at: number,
  readonly applied?: Applied | Applied[]
  readonly note?: Note
}
export type MTR = {
  readonly MPR: {
    readonly part: {
      readonly id: BeatPos
      readonly metric: Metric | Metric[]
    }
  }
}