import { Controller } from "@music-analyzer/controllers";

export abstract class ControllerMediator<Subscriber> {
  constructor(
    protected readonly controller: Controller,
    protected readonly subscribers: Subscriber[]
  ) {
    this.init(controller);
  }
  abstract update(): void
  protected init(controller: Controller) {
    controller.input.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}
