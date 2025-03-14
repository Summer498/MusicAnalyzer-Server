import { mod } from "@music-analyzer/math";
import { PianoRollBegin } from "../piano-roll/piano-roll-begin";

const black_seed = [2, 4, 6, 9, 11];

const getRelativeX = (e: number) => e - PianoRollBegin.get()

export class BlackPosition {
  static #value: number[];
  static get() {
    return black_seed.map(e => mod(-getRelativeX(-e), 12));
  }
}
