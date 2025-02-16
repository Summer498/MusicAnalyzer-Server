import { mod } from "@music-analyzer/math";
import { PianoRollBegin } from "../piano-roll/piano-roll-begin";

const white_seed = [0, 1, 3, 5, 7, 8, 10];


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
