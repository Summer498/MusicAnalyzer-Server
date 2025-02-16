import { Controller } from "@music-analyzer/controllers";
import { ControllerMediator } from "./controller-mediator";

export abstract class SwitcherMediator<Subscriber> extends ControllerMediator<Subscriber> {
  constructor(controller: Controller, subscribers: Subscriber[]) {
    super(controller, subscribers);
  }
}
