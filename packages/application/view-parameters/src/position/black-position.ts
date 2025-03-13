import { mod } from "@music-analyzer/math";
import { PianoRollBegin } from "../piano-roll/piano-roll-begin";

const black_seed = [2, 4, 6, 9, 11];

export class BlackPosition {
  static #piano_roll_begin: number;
  static #value: number[];
  static get value() {
    if (this.#piano_roll_begin === PianoRollBegin.value) { return this.#value; }

    this.#piano_roll_begin = PianoRollBegin.value;
    this.#value = black_seed.map(e => mod(e + PianoRollBegin.value, 12));
    return this.#value;
  }
}
