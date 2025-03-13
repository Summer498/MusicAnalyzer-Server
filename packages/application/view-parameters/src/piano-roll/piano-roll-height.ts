import { OctaveCount } from "../octave-count";
import { octave_height } from "./piano-roll-constants";

export class PianoRollHeight {
  static get() {
    return octave_height * OctaveCount.get();
  }
}
