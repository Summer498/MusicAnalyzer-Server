export class SongLength {
  constructor(readonly value: number) { }

  static #value: number = 0;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}
