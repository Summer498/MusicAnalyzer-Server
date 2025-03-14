import { Checkbox } from "@music-analyzer/controllers";
import { GravityHierarchy } from "@music-analyzer/melody-view";
import { SwitcherMediator } from "./switcher-mediator";

export class ScaleGravityMediator extends SwitcherMediator<GravityHierarchy> {
  constructor(
    switchers: [Checkbox],
    scale_gravities: [GravityHierarchy]
  ) {
    super(switchers, scale_gravities);
  }
  override update() {
    const visibility = this.controllers[0].input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => { e.svg.style.visibility = visibility });
  }
}
