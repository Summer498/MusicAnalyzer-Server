import { OctaveCount } from "../octave-count";
import { octave_height } from "./piano-roll-constants";

export class PianoRollHeight {
  static #octave_count: number;
  static #value = octave_height * 4;
  static get() {
    if (this.#octave_count) { return this.#value; }

    this.#value = octave_height * OctaveCount.value;
    return this.#value;
  }
}
