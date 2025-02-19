import { OctaveCount } from "../octave-count";
import { OctaveHeight } from "./piano-roll-constants";

export class PianoRollHeight {
  static #octave_count: number;
  static #value = OctaveHeight.value * 4;
  static get value() {
    if (this.#octave_count) { return this.#value; }

    this.#value = OctaveHeight.value * OctaveCount.value;
    return this.#value;
  }
}
