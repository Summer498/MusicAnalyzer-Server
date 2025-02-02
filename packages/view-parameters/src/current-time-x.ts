import { CurrentTimeRatio } from "./current-time-ratio";
import { PianoRollWidth } from "./piano-roll-width";

export class CurrentTimeX {
  static #piano_roll_width: number;
  static #current_time_ratio: number;
  static #value: number;
  static get value() {
    if (
      this.#piano_roll_width === PianoRollWidth.value
      && this.#current_time_ratio === CurrentTimeRatio.value
    ) { return this.#value; }

    this.#piano_roll_width = PianoRollWidth.value;
    this.#current_time_ratio = CurrentTimeRatio.value;
    this.#value = PianoRollWidth.value * CurrentTimeRatio.value;
    return this.#value;
  }
}
