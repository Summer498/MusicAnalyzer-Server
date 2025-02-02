import { mod } from "@music-analyzer/math";
import { PianoRollBegin } from "./piano-roll-begin";

const black_seed = [2, 4, 6, 9, 11];
const white_seed = [0, 1, 3, 5, 7, 8, 10];

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

export class WhitePosition {
  static #piano_roll_begin: number;
  static #value: number[];
  static get value() {
    if (this.#piano_roll_begin === PianoRollBegin.value) { return this.#value; }

    this.#piano_roll_begin = PianoRollBegin.value;
    this.#value = white_seed.map(e => mod(e + PianoRollBegin.value, 12));
    return this.#value;
  }
}
