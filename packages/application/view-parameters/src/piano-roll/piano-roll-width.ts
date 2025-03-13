export class PianoRollWidth {
  static #window_width: number;
  static #value = window.innerWidth - 48;
  static get() {
    if (this.#window_width === window.innerWidth) { return this.#value; }

    this.#window_width = window.innerWidth;
    this.#value = window.innerWidth - 48;
    return this.#value;
  }
}
