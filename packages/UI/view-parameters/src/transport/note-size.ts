import { PianoRollTimeLength } from "../length/piano-roll-time-length";
import { PianoRollWidth } from "../width/piano-roll-width";

export class NoteSize {
  static get() {
    return PianoRollWidth.get() / PianoRollTimeLength.get();
  }
}
