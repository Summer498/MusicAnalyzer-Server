import { Part } from "./common"
import { Note } from "./common";
import { Applied } from "./common";

type GPR = "2a" | "2b" | "3a" | "3b" | "3c" | "3d" | "4" | "6"

type Group = {
  readonly group?: Group | Group[]
  readonly note?: Note | Note[]
  readonly applied?: Applied<GPR> | Applied<GPR>[]
}

type GroupingPreference = {
  readonly part: Part<"group", Group>
}

export type GroupingStructure = {
  readonly GPR: GroupingPreference
}
