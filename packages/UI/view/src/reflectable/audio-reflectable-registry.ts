export class AudioReflectableRegistry {
  static #count = 0;
  constructor() {
    if (AudioReflectableRegistry.#count >= 1) { throw new Error("this constructor should not be called twice (singleton)"); }
    AudioReflectableRegistry.#count++;
  }
  private readonly listeners: (() => void)[] = []
  addListeners(...listeners: (() => void)[]) { this.listeners.push(...listeners); }
  onUpdate() { this.listeners.forEach(e => e()); }
}
