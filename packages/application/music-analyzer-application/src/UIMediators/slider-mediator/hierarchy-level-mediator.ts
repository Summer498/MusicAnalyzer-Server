import { HierarchyLevel } from "@music-analyzer/controllers";
import { ControllerMediator } from "../controller-mediator";

interface HierarchyLevelSubscriber {
  children: { length: number }
  onChangedLayer(value: number): void
}
export class HierarchyLevelMediator extends ControllerMediator<HierarchyLevelSubscriber> {
  constructor(
    publisher: HierarchyLevel[],
    subscribers: HierarchyLevelSubscriber[]
  ) {
    const max = Math.max(...subscribers.map(e => e.children.length - 1));
    publisher[0].setHierarchyLevelSliderValues(max);
    super(publisher);
    this.register(...subscribers);
  }
  override update() {
    const value = Number(this.publisher[0].input.value);
    this.subscribers.forEach(e => e.onChangedLayer(value));
  }
}
