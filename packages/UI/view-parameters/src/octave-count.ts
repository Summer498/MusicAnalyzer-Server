import { PianoRollBegin } from "./piano-roll/piano-roll-begin";
import { PianoRollEnd } from "./piano-roll/piano-roll-end";

const getRelativeX = (e: number) => e - PianoRollBegin.get()

export class OctaveCount {
  static get() {
    return Math.ceil(-getRelativeX(PianoRollEnd.get()) / 12);
  }
}
