import { Checkbox } from "@music-analyzer/controllers";
import { DMelodyGroup } from "@music-analyzer/melody-view";
import { ControllerMediator } from "../controller-mediator";

export class DMelodyMediator extends ControllerMediator<DMelodyGroup> {
  constructor(
    switchers: Checkbox[],
    d_melody_collection: [DMelodyGroup]
  ) {
    super(switchers, d_melody_collection);
  }
  override update() {
    const visibility = this.controllers[0].input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}
