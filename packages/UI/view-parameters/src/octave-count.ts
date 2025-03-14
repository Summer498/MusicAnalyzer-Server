import { PianoRollBegin } from "./piano-roll/piano-roll-begin";
import { PianoRollEnd } from "./piano-roll/piano-roll-end";

const transposed = (e: number) => e - PianoRollBegin.get()

export class OctaveCount {
  static get() {
    return Math.ceil(-transposed(PianoRollEnd.get()) / 12);
  }
}
