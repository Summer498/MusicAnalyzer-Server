import { CurrentTimeRatio } from "./current-time-ratio";
import { PianoRollWidth } from "./piano-roll";

export class CurrentTimeX {
  static get() {
    return PianoRollWidth.get() * CurrentTimeRatio.get();
  }
}
