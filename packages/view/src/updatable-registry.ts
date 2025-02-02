import { AccompanyToAudio } from "./updatable";

export class AccompanyToAudioRegistry {
  private static _instance: AccompanyToAudioRegistry;
  private readonly registered: AccompanyToAudio[];
  private constructor() { this.registered = []; }
  public static get instance() {
    return this._instance || (this._instance = new AccompanyToAudioRegistry());
  }
  register(updatable: AccompanyToAudio) { this.registered.push(updatable); }
  onAudioUpdate() {
    this.registered.forEach(e => {
      e.onAudioUpdate();
    });
  }
}

