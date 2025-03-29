import { OctaveCount } from "./octave-count";
import { octave_height } from "./octave-height";

export class PianoRollHeight {
  static get() {
    return octave_height * OctaveCount.get();
  }
}
