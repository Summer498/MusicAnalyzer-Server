export class PianoRollEnd {
  constructor(readonly value: number) { }

  static #value = 83 + 24;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}
