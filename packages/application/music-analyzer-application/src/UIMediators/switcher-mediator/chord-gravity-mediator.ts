import { Checkbox, Controller } from "@music-analyzer/controllers";
import { GravityHierarchy } from "@music-analyzer/melody-view";
import { ControllerMediator } from "../controller-mediator";

export class ChordGravityMediator extends ControllerMediator<GravityHierarchy> {
  constructor(
    publisher: [Checkbox],
  ) {
    super(publisher);
  }
  override update() {
    const visibility = this.publisher[0].input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
  override init(controllers: Controller[]) {
    controllers.forEach(e => e.input.addEventListener("input", this.update.bind(this)));
    this.update.bind(this)();
  };
}
