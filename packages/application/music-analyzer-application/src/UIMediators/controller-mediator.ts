import { Controller } from "@music-analyzer/controllers";

export abstract class ControllerMediator<Subscriber> {
  protected readonly subscribers: Subscriber[] = [];
  constructor(
    protected readonly publisher: Controller[],
  ) {
    this.init(publisher);
  }
  register(...e: Subscriber[]) { this.subscribers.push(...e) }
  abstract update(): void
  protected init(controllers: Controller[]) {
    controllers.forEach(e => e.input.addEventListener("input", this.update.bind(this)));
    this.update.bind(this)();
  };
}
