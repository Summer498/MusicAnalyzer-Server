import { Controller, HierarchyLevel } from "@music-analyzer/controllers";
import { ControllerMediator } from "../controller-mediator";

interface HierarchyLevelSubscriber {
  children: { length: number }
  onChangedLayer(value: number): void
}
export class HierarchyLevelMediator extends ControllerMediator<HierarchyLevelSubscriber> {
  constructor(
    publisher: HierarchyLevel[],
    layer_count: number,
  ) {
    publisher[0].setHierarchyLevelSliderValues(layer_count);
    super(publisher);
  }
  override update() {
    const value = Number(this.publisher[0].input.value);
    this.subscribers.forEach(e => e.onChangedLayer(value));
  }
  override init(controllers: Controller[]) {
    controllers.forEach(e => e.input.addEventListener("input", this.update.bind(this)));
    this.update.bind(this)();
  };
}
