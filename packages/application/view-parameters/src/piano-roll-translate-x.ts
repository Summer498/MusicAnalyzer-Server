import { CurrentTimeX } from "./current-time-x";
import { NoteSize } from "./note-size";
import { NowAt } from "./now-at";

export class PianoRollTranslateX {
  static get() {
    return CurrentTimeX.get() - NowAt.get() * NoteSize.get();
  }
}