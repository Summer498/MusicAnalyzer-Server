import { Controller } from "@music-analyzer/controllers";

export abstract class ControllerMediator<Subscriber> {
  constructor(
    protected readonly controllers: Controller[],
    protected readonly subscribers: Subscriber[]
  ) {
    this.init(controllers);
  }
  abstract update(): void
  protected init(controllers: Controller[]) {
    controllers.forEach(e=>e.input.addEventListener("input", this.update.bind(this)));
    this.update.bind(this)();
  };
}
