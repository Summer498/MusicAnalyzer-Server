import { mod } from "@music-analyzer/math";
import { PianoRollBegin } from "../piano-roll/piano-roll-begin";

const white_seed = [0, 1, 3, 5, 7, 8, 10];

const transposed = (e: number) => e - PianoRollBegin.get()

export class WhitePosition {
  static get() {
    return white_seed.map(e => mod(-transposed(-e), 12));
  }
}
