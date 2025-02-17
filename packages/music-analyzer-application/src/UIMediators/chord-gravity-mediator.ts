import { Checkbox } from "@music-analyzer/controllers";
import { SwitcherMediator } from "./switcher-mediator";
import { ChordGravityHierarchy } from "@music-analyzer/melody-view";

export class ChordGravityMediator extends SwitcherMediator<ChordGravityHierarchy> {
  constructor(
    switcher: Checkbox,
    chord_gravities: ChordGravityHierarchy
  ) {
    super(switcher, [chord_gravities]);
  }
  override update() {
    const visibility = this.controller.input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}
