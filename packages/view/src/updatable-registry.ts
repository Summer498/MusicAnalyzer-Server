import { Updatable } from "./updatable";

export class UpdatableRegistry {
  private static _instance: UpdatableRegistry;
  private readonly registered: Updatable[];
  private constructor() { this.registered = []; }
  public static get instance() {
    return this._instance || (this._instance = new UpdatableRegistry());
  }
  register(updatable: Updatable) { this.registered.push(updatable); }
  onUpdate() {
    this.registered.forEach(e => {
      e.onUpdate();
    });
  }
}

