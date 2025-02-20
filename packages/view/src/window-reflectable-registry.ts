import { WindowReflectable } from "./window-reflectable";

export class WindowReflectableRegistry {
  static #count = 0;
  private readonly registered: WindowReflectable[];
  constructor() { 
    if(WindowReflectableRegistry.#count >= 1){ throw new Error("this constructor should not be called twice (singleton)"); }
    WindowReflectableRegistry.#count++;
    this.registered = []; 
  }
  register(updatable: WindowReflectable) { this.registered.push(updatable); }
  onUpdate() {
    this.registered.forEach(e => e.onWindowResized());
  }
}
