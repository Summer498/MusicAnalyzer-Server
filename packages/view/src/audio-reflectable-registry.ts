import { AudioReflectable } from "./audio-reflectable";

export class AudioReflectableRegistry {
  private static _instance: AudioReflectableRegistry;
  private readonly registered: AudioReflectable[];
  private constructor() { this.registered = []; }
  public static get instance() {
    return this._instance || (this._instance = new AudioReflectableRegistry());
  }
  register(updatable: AudioReflectable) { this.registered.push(updatable); }
  onAudioUpdate() {
    this.registered.forEach(e => {
      e.onAudioUpdate();
    });
  }
}
