import { PianoRollTimeLength } from "./piano-roll/piano-roll-time-length";
import { PianoRollWidth } from "./piano-roll/piano-roll-width";

export class NoteSize {
  static #piano_roll_width: number;
  static #piano_roll_time_length: number;
  static #value: number;
  static get() {
    if (
      this.#piano_roll_width === PianoRollWidth.get()
      && this.#piano_roll_time_length === PianoRollTimeLength.get()
    ) { return this.#value; }

    this.#piano_roll_width = PianoRollWidth.get();
    this.#piano_roll_time_length = PianoRollTimeLength.get();
    this.#value = PianoRollWidth.get() / PianoRollTimeLength.get();
    return this.#value;
  }
}
