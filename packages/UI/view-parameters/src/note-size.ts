import { PianoRollWidth } from "./piano-roll-width";


import { PianoRollRatio } from "./piano-roll-ratio";
import { SongLength } from "./song-length";

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
