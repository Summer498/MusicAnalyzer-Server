import { AudioReflectable } from "./audio-reflectable";

export class AudioReflectableRegistry {
  static #count = 0;
  private readonly registered: AudioReflectable[];
  constructor() {
    if (AudioReflectableRegistry.#count >= 1) { throw new Error("this constructor should not be called twice (singleton)"); }
    AudioReflectableRegistry.#count++;
    this.registered = [];
  }
  register(updatable: AudioReflectable) { this.registered.push(updatable); }
  onUpdate() {
    this.registered.forEach(e => { e.onAudioUpdate(); });
  }
}
