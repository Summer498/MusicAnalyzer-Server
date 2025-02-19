import { Checkbox } from "@music-analyzer/controllers";
import { SwitcherMediator } from "./switcher-mediator";
import { GravityHierarchy } from "@music-analyzer/melody-view";

export class ChordGravityMediator extends SwitcherMediator<GravityHierarchy> {
  constructor(
    switcher: Checkbox,
    chord_gravities: GravityHierarchy
  ) {
    super(switcher, [chord_gravities]);
  }
  override update() {
    const visibility = this.controller.input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}
