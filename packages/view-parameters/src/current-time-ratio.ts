export class CurrentTimeRatio {
  static #value = 1 / 4;
  static get value() { return this.#value; }
  static set value(value: number) { this.#value = value; }
}
