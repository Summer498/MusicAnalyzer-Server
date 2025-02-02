export class NowAt {
  static onUpdate: (() => void)[] = [];
  static #value = 0;
  static get value() { return this.#value; }
  static set value(value: number) {
    this.#value = value;
    this.onUpdate.forEach(event => event());
  }
}
