import { BeatPos } from "@music-analyzer/musicxml/src/part/beat-pos";

export type Part<K extends string, V> = {
  readonly id: BeatPos,
} & {
  readonly [P in K]: V
}