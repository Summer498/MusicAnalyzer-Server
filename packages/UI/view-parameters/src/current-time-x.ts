import { CurrentTimeRatio } from "./current-time-ratio";
import { PianoRollWidth } from "./piano-roll/piano-roll-width";

export class CurrentTimeX {
  static get() {
    return PianoRollWidth.get() * CurrentTimeRatio.get();
  }
}
