import { Controller } from "@music-analyzer/controllers";

export abstract class ControllerMediator<Subscriber> {
  protected readonly controller: Controller;
  protected readonly subscribers: Subscriber[];
  constructor(controller: Controller, subscribers: Subscriber[]) {
    this.controller = controller;
    this.subscribers = subscribers;
    this.init(controller);
  }
  abstract update(): void
  protected init(controller: Controller) {
    controller.input.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}
