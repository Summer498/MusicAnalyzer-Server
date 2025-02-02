export class PianoRollBegin {
  static onUpdate: (() => void)[] = [];
  static #value = 83;
  static get value() { return this.#value; }
  static set value(value: number) {
    this.#value = value;
    this.onUpdate.forEach(event => event());
  }
}
