import { BeatPos, SingleOrArray } from "./common";

type GPR = "2a" | "2b" | "3a" | "3b" | "3c" | "3d" | "4" | "6"
type Group = {
  readonly group?: SingleOrArray<Group>
  readonly note?: SingleOrArray<{ readonly id: BeatPos }>
  readonly applied?: SingleOrArray<{ readonly rule: GPR }>
}

export type GRP = {
  readonly GPR: {
    readonly part: {
      readonly id: BeatPos,
      readonly group: Group
    }
  }
}