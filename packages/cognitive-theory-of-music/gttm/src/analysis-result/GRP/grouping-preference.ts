import { Part } from "../common"
import { Group } from "./group"

export type GroupingPreference = {
  readonly part: Part<"group", Group>
}
