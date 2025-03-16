import { Controller } from "@music-analyzer/controllers";
import { ControllerMediator } from "../controller-mediator";

abstract class SliderMediator<Subscriber> extends ControllerMediator<Subscriber> {
  constructor(controllers: Controller[], subscribers: Subscriber[]) {
    super(controllers, subscribers);
  }
}
