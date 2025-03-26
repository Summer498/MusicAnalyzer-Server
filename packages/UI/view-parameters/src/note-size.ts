import { PianoRollTimeLength } from "./piano-roll";
import { PianoRollWidth } from "./piano-roll";

export class NoteSize {
  static get() {
    return PianoRollWidth.get() / PianoRollTimeLength.get();
  }
}
