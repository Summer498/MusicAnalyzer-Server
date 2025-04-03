export class NowAt {
  constructor(readonly value: number) { }

  static #value = 0;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}
