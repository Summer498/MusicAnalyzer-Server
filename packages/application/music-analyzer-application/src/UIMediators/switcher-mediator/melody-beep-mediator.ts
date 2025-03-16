import { MelodyHierarchy } from "@music-analyzer/melody-view";
import { Checkbox, Controller } from "@music-analyzer/controllers";
import { ControllerMediator } from "../controller-mediator";

export class MelodyBeepMediator extends ControllerMediator<MelodyHierarchy> {
  constructor(
    publisher: Checkbox[],
  ) {
    super(publisher);
  }
  override update() {
    const visibility = this.publisher[0].input.checked;
    this.subscribers.forEach(e => e.onMelodyBeepCheckChanged(visibility));
  };
  override init(controllers: Controller[]) {
    controllers.forEach(e => e.input.addEventListener("input", this.update.bind(this)));
    this.update.bind(this)();
  };
}
