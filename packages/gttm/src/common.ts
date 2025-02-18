export type Path = "./" | "./.." | "./../.." | "./../../.." | "./../../../.." | "./../../../../.."
export type BeatPos = `P${number}` | `P${number}-${number}-${number}`
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