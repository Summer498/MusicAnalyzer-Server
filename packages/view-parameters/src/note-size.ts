import { PianoRollTimeLength } from "./piano-roll-time-length";
import { PianoRollWidth } from "./piano-roll-width";

export class NoteSize {
  static onUpdate: (() => void)[] = [];
  static #value = PianoRollWidth.value / PianoRollTimeLength.value;
  static get value() { return this.#value; }
  static onChange() {
    this.#value = PianoRollWidth.value / PianoRollTimeLength.value;
    this.onUpdate.forEach(event => event());
  }
  static onWindowResized = this.onChange;
}
