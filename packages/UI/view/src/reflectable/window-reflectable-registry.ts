export class WindowReflectableRegistry {
  static #count = 0;
  constructor() {
    if (WindowReflectableRegistry.#count >= 1) { throw new Error("this constructor should not be called twice (singleton)"); }
    WindowReflectableRegistry.#count++;
  }
  private readonly listeners: (() => void)[] = [];
  addListeners(...listeners: (() => void)[]) { this.listeners.push(...listeners); }
  onUpdate() { this.listeners.forEach(e => e()); }
}
