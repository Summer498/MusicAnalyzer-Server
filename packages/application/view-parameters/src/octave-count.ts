import { PianoRollBegin } from "./piano-roll/piano-roll-begin";
import { PianoRollEnd } from "./piano-roll/piano-roll-end";

export class OctaveCount {
  static #piano_roll_begin: number;
  static #piano_roll_end: number;
  static #value = 4;
  static get() {
    if (
      this.#piano_roll_begin === PianoRollBegin.get()
      && this.#piano_roll_end === PianoRollEnd.get()
    ) { return this.#value; }

    this.#piano_roll_begin = PianoRollBegin.get();
    this.#piano_roll_end = PianoRollEnd.get();
    this.#value = Math.ceil(-(PianoRollEnd.get() - PianoRollBegin.get()) / 12);
    return this.#value;
  }
}
