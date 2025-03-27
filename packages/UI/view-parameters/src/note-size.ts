import { PianoRollTimeLength } from "./piano-roll/piano-roll-time-length";
import { PianoRollWidth } from "./piano-roll/piano-roll-width";

export class NoteSize {
  static get() {
    return PianoRollWidth.get() / PianoRollTimeLength.get();
  }
}
