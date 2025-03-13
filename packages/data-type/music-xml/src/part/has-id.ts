import { BeatPos } from "./beat-pos"

export type HasID = {
  readonly id: BeatPos | `P${number}-I${number}`
}