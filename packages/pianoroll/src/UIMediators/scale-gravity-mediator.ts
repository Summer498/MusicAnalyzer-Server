import { Switcher } from "@music-analyzer/controllers";
import { ScaleGravityHierarchy } from "@music-analyzer/melody-view";
import { SwitcherMediator } from "./switcher-mediator";

export class ScaleGravityMediator extends SwitcherMediator<ScaleGravityHierarchy> {
  constructor(
    switcher: Switcher,
    scale_gravities: ScaleGravityHierarchy
  ) {
    super(switcher, [scale_gravities]);
  }
  override update() {
    const visibility = this.controller.input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}
