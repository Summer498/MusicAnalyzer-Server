import { Chord } from "../../common/chord";

export interface IChord 
  extends Chord {
  readonly duration: number,
  readonly velocity: number,
}
