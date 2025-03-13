import { WindowInnerWidth } from "./windowInnerWidth";

export class PianoRollWidth {
  static get() {
    return WindowInnerWidth.get() - 48;
  }
}
