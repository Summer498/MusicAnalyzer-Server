import { MelodyHierarchy } from "@music-analyzer/melody-view";
import { Checkbox } from "@music-analyzer/controllers";
import { ControllerMediator } from "../controller-mediator";

export class MelodyBeepMediator extends ControllerMediator<MelodyHierarchy> {
  constructor(
    publisher: Checkbox[],
    subscribers: [MelodyHierarchy],
  ) {
    publisher[0].input.checked = true;
    super(publisher, subscribers);
  }
  override update() {
    const visibility = this.publisher[0].input.checked;
    this.subscribers.forEach(e => e.onMelodyBeepCheckChanged(visibility));
  };
}
