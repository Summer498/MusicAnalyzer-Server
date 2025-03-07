import { Checkbox } from "@music-analyzer/controllers";
import { GravityHierarchy } from "@music-analyzer/melody-view";
import { SwitcherMediator } from "./switcher-mediator";

export class ScaleGravityMediator extends SwitcherMediator<GravityHierarchy> {
  constructor(
    switcher: Checkbox,
    scale_gravities: GravityHierarchy
  ) {
    super(switcher, [scale_gravities]);
  }
  override update() {
    const visibility = this.controller.input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}
