class WindowInnerWidth {
  _get() { return window.innerWidth; }
  static get() { return window.innerWidth; }
}

export class PianoRollWidth {
  _get() { return window.innerWidth - 48; }
  static get() { return WindowInnerWidth.get() - 48; }
}
