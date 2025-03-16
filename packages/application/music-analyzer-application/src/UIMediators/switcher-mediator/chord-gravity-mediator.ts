import { Checkbox } from "@music-analyzer/controllers";
import { GravityHierarchy } from "@music-analyzer/melody-view";
import { ControllerMediator } from "../controller-mediator";

export class ChordGravityMediator extends ControllerMediator<GravityHierarchy> {
  constructor(
    publisher: [Checkbox],
    subscribers: [GravityHierarchy]
  ) {
    super(publisher, subscribers);
  }
  override update() {
    const visibility = this.publisher[0].input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}
