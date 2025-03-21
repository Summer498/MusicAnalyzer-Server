import { mod } from "@music-analyzer/math";
import { PianoRollBegin } from "../piano-roll";

const black_seed = [2, 4, 6, 9, 11];

const transposed = (e: number) => e - PianoRollBegin.get()

export class BlackPosition {
  static #value: number[];
  static get() {
    return black_seed.map(e => mod(-transposed(-e), 12));
  }
}
