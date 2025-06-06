export type Path = "./" | "./.." | "./../.." | "./../../.." | "./../../../.." | "./../../../../.."

export type BeatPos = `P${number}` | `P${number}-${number}-${number}`

export interface Head<C extends Chord> {
  readonly chord: C
}

export const createHead = <C extends Chord>(head: Head<C>): Head<C> => ({
  chord: head.chord,
})

export type Chord = {
  readonly note: Note
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