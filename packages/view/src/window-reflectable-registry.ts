import { WindowReflectable } from "./window-reflectable";

export class WindowReflectableRegistry {
  private static _instance: WindowReflectableRegistry;
  private readonly registered: WindowReflectable[];
  private constructor() { this.registered = []; }
  public static get instance() {
    return this._instance || (this._instance = new WindowReflectableRegistry());
  }
  register(updatable: WindowReflectable) { this.registered.push(updatable); }
  onWindowResized() {
    /*
    PianoRollWidth.onWindowResized();
    CurrentTimeX.onWindowResized();
    NoteSize.onWindowResized();
    */

    this.registered.forEach(e => e.onWindowResized());
  }
}
