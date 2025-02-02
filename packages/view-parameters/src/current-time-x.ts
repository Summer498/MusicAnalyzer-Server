import { CurrentTimeRatio } from "./current-time-ratio";
import { PianoRollWidth } from "./piano-roll-width";

export class CurrentTimeX {
  static onUpdate: (() => void)[] = [];
  static #value = PianoRollWidth.value * CurrentTimeRatio.value;
  static get value() { return this.#value; }
  static onWindowResized() {
    this.#value = PianoRollWidth.value * CurrentTimeRatio.value;
    this.onUpdate.forEach(event => event());
  }
}
