import { BeatPos, SingleOrArray } from "./common";

type MPR = "3" | "4" | "5a" | "5b" | "5c" | "5d" | "5e"

type Applied = {
  readonly level: number,
  readonly rule: MPR
}

type Metric = {
  readonly dot: number,
  readonly at: number,
  readonly applied?: SingleOrArray<Applied>
  readonly note?: { readonly id: BeatPos }
}
export type MTR = {
  readonly MPR: {
    readonly part: {
      readonly id: BeatPos
      readonly metric: SingleOrArray<Metric>
    }
  }
}