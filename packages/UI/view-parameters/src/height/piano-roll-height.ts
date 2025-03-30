import { OctaveCount } from "../position/octave-count";
import { octave_height } from "../height/octave-height";

export class PianoRollHeight {
  static get() {
    return octave_height * OctaveCount.get();
  }
}
