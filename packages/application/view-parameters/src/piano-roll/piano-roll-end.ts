export class PianoRollEnd {
  static #value = 83 + 24;
  static get value() { return this.#value; }
  static set(value: number) { this.#value = value; }
}
