import { CurrentTimeRatio } from "./current-time-ratio";
import { PianoRollWidth } from "./piano-roll-width";

export class CurrentTimeX {
  constructor(
    private readonly width: PianoRollWidth,
    private readonly ratio: CurrentTimeRatio,
  ) { }
  _get() { return this.width._get() * this.ratio.value; }

  static get() {
    return PianoRollWidth.get() * CurrentTimeRatio.get();
  }
}
