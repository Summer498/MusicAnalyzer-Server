import { mod } from "@music-analyzer/math";
import { PianoRollBegin } from "../piano-roll/piano-roll-begin";

const white_seed = [0, 1, 3, 5, 7, 8, 10];


export class WhitePosition {
  static #piano_roll_begin: number;
  static #value: number[];
  static get() {
    if (this.#piano_roll_begin === PianoRollBegin.get()) { return this.#value; }

    this.#piano_roll_begin = PianoRollBegin.get();
    this.#value = white_seed.map(e => mod(e + PianoRollBegin.get(), 12));
    return this.#value;
  }
}
