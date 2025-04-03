import { OctaveCount } from "./octave-count";
import { octave_height } from "./octave-height";

export class PianoRollHeight {
  constructor(
    private readonly count: OctaveCount
  ) { }
  _get() { return octave_height * this.count._get(); }

  static get() { return octave_height * OctaveCount.get(); }
}
