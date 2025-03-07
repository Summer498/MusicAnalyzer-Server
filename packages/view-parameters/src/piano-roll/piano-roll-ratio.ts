export class PianoRollRatio {
  static #value: number = 1;
  static get value() { return this.#value; }
  static set value(value: number) { this.#value = value; }
}
