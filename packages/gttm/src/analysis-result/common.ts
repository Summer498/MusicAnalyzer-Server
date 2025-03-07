import { BeatPos } from "@music-analyzer/musicxml";
export { BeatPos } from "@music-analyzer/musicxml";

export type Path = "./" | "./.." | "./../.." | "./../../.." | "./../../../.." | "./../../../../.."
export type Note = {
  readonly id: BeatPos
}
export type Chord = {
  readonly note: Note
}
export type Head<C extends Chord> = {
  readonly chord: C
}
export type Part<K extends string, V> = {
  readonly id: BeatPos,
} & {
  readonly [P in K]: V
}
export type Applied<Rule extends string> = {
  readonly rule: Rule
}