import { PianoRollTimeLength } from "./piano-roll-time-length";
import { PianoRollWidth } from "./piano-roll-width";

export class NoteSize {
  static #piano_roll_width: number;
  static #piano_roll_time_length: number;
  static #value: number;
  static get value() {
    if (
      this.#piano_roll_width === PianoRollWidth.value
      && this.#piano_roll_time_length === PianoRollTimeLength.value
    ) { return this.#value; }

    this.#piano_roll_width = PianoRollWidth.value;
    this.#piano_roll_time_length = PianoRollTimeLength.value;
    this.#value = PianoRollWidth.value / PianoRollTimeLength.value;
    return this.#value;
  }
}
