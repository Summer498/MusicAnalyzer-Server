import { MelodyHierarchy } from "@music-analyzer/melody-view";
import { SwitcherMediator } from "./switcher-mediator";
import { Switcher } from "@music-analyzer/controllers";

export class MelodyBeepMediator extends SwitcherMediator<MelodyHierarchy> {
  constructor(
    switcher: Switcher,
    melody_hierarchy: MelodyHierarchy,
  ) {
    switcher.input.checked = true;
    super(switcher, [melody_hierarchy]);
  }
  override update() {
    const visibility = this.controller.input.checked;
    this.subscribers.forEach(e => e.onMelodyBeepCheckChanged(visibility));
  };
}
