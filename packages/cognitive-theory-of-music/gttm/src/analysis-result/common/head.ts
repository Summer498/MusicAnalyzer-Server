import { Chord } from "./chord"
import { IHead } from "./i-head"

export class Head<C extends Chord> {
  readonly chord: C
  constructor(head: IHead<C>) {
    this.chord = head.chord
  }
}