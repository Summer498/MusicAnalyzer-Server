import { Chord } from "./chord";

export interface IHead<C extends Chord> {
  readonly chord: C
}