import { PianoRollWidth } from "../width/piano-roll-width";


import { PianoRollRatio } from "../length";
import { SongLength } from "../length";

class PianoRollTimeLength {
  static get() {
    return PianoRollRatio.get() * SongLength.get();
  }
}


export class NoteSize {
  static get() {
    return PianoRollWidth.get() / PianoRollTimeLength.get();
  }
}
