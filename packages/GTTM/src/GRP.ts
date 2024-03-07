import { BeatPos, SingleOrArray } from "./common";

type GPR = "2a" | "2b" | "3a" | "3b" | "3c" | "3d" | "4" | "6"
type Group = {
  group?: SingleOrArray<Group>
  note?: SingleOrArray<{ id: BeatPos }>
  applied?: SingleOrArray<{ rule: GPR }>
}

export type GRP = {
  GPR: {
    part: {
      id: BeatPos,
      group: Group
    }
  }
}