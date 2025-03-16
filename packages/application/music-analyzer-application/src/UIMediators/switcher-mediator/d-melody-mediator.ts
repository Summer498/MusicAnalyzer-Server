import { Checkbox } from "@music-analyzer/controllers";
import { DMelodyGroup } from "@music-analyzer/melody-view";
import { ControllerMediator } from "../controller-mediator";

export class DMelodyMediator extends ControllerMediator<DMelodyGroup> {
  constructor(
    publisher: Checkbox[],
  ) {
    super(publisher);
  }
  override update() {
    const visibility = this.publisher[0].input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}
