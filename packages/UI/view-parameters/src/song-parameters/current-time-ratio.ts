export class CurrentTimeRatio {
  constructor(readonly value: number) { };

  static #value = 1 / 4;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}
