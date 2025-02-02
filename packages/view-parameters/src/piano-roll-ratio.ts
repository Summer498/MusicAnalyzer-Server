export class PianoRollRatio {
  static #value: number;
  static get value() { return this.#value; }
  static set value(value: number) { this.#value = value; }
}
