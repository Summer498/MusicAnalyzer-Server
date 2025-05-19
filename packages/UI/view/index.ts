import { CurrentTimeX } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { NowAt } from "@music-analyzer/view-parameters";

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

export class PianoRollTranslateX {
  static get() {
    return CurrentTimeX.get() - NowAt.get() * NoteSize.get();
  }
}
