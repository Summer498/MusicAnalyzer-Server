class WindowInnerWidth {
  static get() { return window.innerWidth; }
}

export class PianoRollWidth {
  static get() {
    return WindowInnerWidth.get() - 48;
  }
}
