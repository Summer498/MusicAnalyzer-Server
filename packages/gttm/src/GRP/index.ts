import { BeatPos, Note } from "../common";

type GPR = "2a" | "2b" | "3a" | "3b" | "3c" | "3d" | "4" | "6"

type AppliedGPR = {
  readonly rule: GPR
}
type Group = {
  readonly group?: Group | Group[]
  readonly note?: Note | Note[]
  readonly applied?: AppliedGPR | AppliedGPR[]
}

export type GRP = {
  readonly GPR: {
    readonly part: {
      readonly id: BeatPos,
      readonly group: Group
    }
  }
}