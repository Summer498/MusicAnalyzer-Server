export class PianoRollRatio {
  constructor(readonly value: number) { }

  static #value: number = 1;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}
