export type Path = "./" | "./.." | "./../.." | "./../../.." | "./../../../.." | "./../../../../.."

export type BeatPos = `P${number}` | `P${number}-${number}-${number}`

export interface IHead<C extends Chord> {
  readonly chord: C
}
export type Chord = {
  readonly note: Note
}
export class Head<C extends Chord> {
  readonly chord: C
  constructor(head: IHead<C>) {
    this.chord = head.chord
  }
}
export type Part<K extends string, V> = {
  readonly id: BeatPos,
} & {
  readonly [P in K]: V
}
export type Applied<Rule extends string> = {
  readonly rule: Rule
}

export type Note = {
  readonly id: BeatPos
}