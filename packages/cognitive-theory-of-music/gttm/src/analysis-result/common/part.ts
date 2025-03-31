import { BeatPos } from "./facade";

export type Part<K extends string, V> = {
  readonly id: BeatPos,
} & {
  readonly [P in K]: V
}