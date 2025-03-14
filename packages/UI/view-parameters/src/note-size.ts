import { PianoRollTimeLength, PianoRollWidth } from "./piano-roll";

export class NoteSize {
  static get() {
    return PianoRollWidth.get() / PianoRollTimeLength.get();
  }
}
