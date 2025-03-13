import { PianoRollRatio } from "./piano-roll-ratio";
import { SongLength } from "../song-length";

export class PianoRollTimeLength {
  static get() {
    return PianoRollRatio.get() * SongLength.get();
  }
}
