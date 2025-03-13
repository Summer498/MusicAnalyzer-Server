export class CurrentTimeRatio {
  static #value = 1 / 4;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}
