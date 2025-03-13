import { PianoRollBegin } from "./piano-roll/piano-roll-begin";
import { PianoRollEnd } from "./piano-roll/piano-roll-end";

export class OctaveCount {
  static get() {
    return Math.ceil(-(PianoRollEnd.get() - PianoRollBegin.get()) / 12);
  }
}
