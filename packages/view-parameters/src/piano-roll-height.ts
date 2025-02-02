import { octave_height } from "./piano-roll-constants";

export class PianoRollHeight {
  static onUpdate: (() => void)[] = [];
  static #value = octave_height * 4;
  static get value() { return this.#value; }
  static set value(value: number) {
    this.#value = value;
    this.onUpdate.forEach(event => event());
  }
}
