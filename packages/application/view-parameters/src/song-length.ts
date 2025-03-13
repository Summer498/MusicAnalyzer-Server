export class SongLength {
  static #value: number = 0;
  static get() { return this.#value; }
  static set(value: number) { this.#value = value; }
}
