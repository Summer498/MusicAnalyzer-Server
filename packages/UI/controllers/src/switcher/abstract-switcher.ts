import { Controller } from "../controller";

export abstract class Checkbox<T> extends Controller {
  constructor(id: string, label: string) {
    super("checkbox", id, label);

    this.input.checked = false;
    this.init()
  }
  readonly subscribers: T[] = [];
  register(...subscribers: T[]) {
    this.subscribers.push(...subscribers);
    this.update()
  }
  abstract update(): void;
  init() {
    this.input.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}