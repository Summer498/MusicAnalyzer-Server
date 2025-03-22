import { Chord } from "../../common";

export interface IChord 
  extends Chord {
  readonly duration: number,
  readonly velocity: number,
}
