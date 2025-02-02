export class PianoRollWidth {
  static #value = window.innerWidth - 48;
  static get value() { return this.#value; }
  static onWindowResized() {
    PianoRollWidth.#value = window.innerWidth - 48;
  }
}
