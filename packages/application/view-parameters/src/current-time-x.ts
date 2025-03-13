import { CurrentTimeRatio } from "./current-time-ratio";
import { PianoRollWidth } from "./piano-roll/piano-roll-width";

export class CurrentTimeX {
  static #piano_roll_width: number;
  static #current_time_ratio: number;
  static #value: number;
  static get value() {
    if (
      this.#piano_roll_width === PianoRollWidth.get()
      && this.#current_time_ratio === CurrentTimeRatio.get()
    ) { return this.#value; }

    this.#piano_roll_width = PianoRollWidth.get();
    this.#current_time_ratio = CurrentTimeRatio.get();
    this.#value = PianoRollWidth.get() * CurrentTimeRatio.get();
    return this.#value;
  }
}
