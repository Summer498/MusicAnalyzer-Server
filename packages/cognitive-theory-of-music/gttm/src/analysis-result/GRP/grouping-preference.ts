import { Part } from "../common/part"
import { Group } from "./group"

export type GroupingPreference = {
  readonly part: Part<"group", Group>
}
