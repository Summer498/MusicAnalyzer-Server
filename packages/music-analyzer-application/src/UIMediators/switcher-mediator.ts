import { Controller } from "@music-analyzer/controllers";
import { ControllerMediator } from "./controller-mediator";

export abstract class SwitcherMediator<Subscriber> extends ControllerMediator<Subscriber> {
  constructor(controllers: Controller[], subscribers: Subscriber[]) {
    super(controllers, subscribers);
  }
}
