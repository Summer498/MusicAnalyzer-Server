export class PianoRollBegin {
  constructor(readonly value: number) { }

  static #value = 83;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}
