import { PianoRollBegin } from "./piano-roll-begin";
import { PianoRollEnd } from "./piano-roll-end";

export class OctaveCount {
  static #piano_roll_begin: number;
  static #piano_roll_end: number;
  static #value = 4;
  static get value() {
    if (
      this.#piano_roll_begin === PianoRollBegin.value
      && this.#piano_roll_end === PianoRollEnd.value
    ) { return this.#value; }

    this.#piano_roll_begin = PianoRollBegin.value;
    this.#piano_roll_end = PianoRollEnd.value;
    this.#value = Math.ceil(-(PianoRollEnd.value - PianoRollBegin.value) / 12);
    return this.#value;
  }
}
