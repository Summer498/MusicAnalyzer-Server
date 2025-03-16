import { Checkbox } from "@music-analyzer/controllers";
import { GravityHierarchy } from "@music-analyzer/melody-view";
import { ControllerMediator } from "../controller-mediator";

export class ChordGravityMediator extends ControllerMediator<GravityHierarchy> {
  constructor(
    switchers: [Checkbox],
    chord_gravities: [GravityHierarchy]
  ) {
    super(switchers, chord_gravities);
  }
  override update() {
    const visibility = this.controllers[0].input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}
