import { MelodyHierarchy } from "@music-analyzer/melody-view";
import { Checkbox } from "@music-analyzer/controllers";
import { ControllerMediator } from "../controller-mediator";

export class MelodyBeepMediator extends ControllerMediator<MelodyHierarchy> {
  constructor(
    switchers: Checkbox[],
    melody_hierarchy: [MelodyHierarchy],
  ) {
    switchers[0].input.checked = true;
    super(switchers, melody_hierarchy);
  }
  override update() {
    const visibility = this.controllers[0].input.checked;
    this.subscribers.forEach(e => e.onMelodyBeepCheckChanged(visibility));
  };
}
