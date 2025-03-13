import { CurrentTimeRatio } from "./current-time-ratio";
import { PianoRollWidth } from "./piano-roll/piano-roll-width";

export class CurrentTimeX {
  static #value: number;
  static get() {
    this.#value = PianoRollWidth.get() * CurrentTimeRatio.get();
    return this.#value;
  }
}
