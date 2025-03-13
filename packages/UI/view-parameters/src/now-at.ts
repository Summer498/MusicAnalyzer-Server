export class NowAt {
  static #value = 0;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}
