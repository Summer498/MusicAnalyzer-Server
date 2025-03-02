import { Checkbox } from "@music-analyzer/controllers";
import { SwitcherMediator } from "./switcher-mediator";
import { DMelodyGroup } from "@music-analyzer/melody-view";

export class DMelodyMediator extends SwitcherMediator<DMelodyGroup> {
  constructor(
    switcher: Checkbox,
    d_melody_collection: DMelodyGroup
  ) {
    super(switcher, [d_melody_collection]);
  }
  override update() {
    const visibility = this.controller.input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}
