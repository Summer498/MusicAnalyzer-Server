import { HierarchyLevel } from "@music-analyzer/controllers";
import { SliderMediator } from "./slider-mediator";

interface HierarchyLevelSubscriber {
  children: { length: number }
  onChangedLayer(value: number): void
}
export class HierarchyLevelMediator extends SliderMediator<HierarchyLevelSubscriber> {
  constructor(
    sliders: HierarchyLevel[],
    subscribers: HierarchyLevelSubscriber[]
  ) {
    const max = Math.max(...subscribers.map(e => e.children.length - 1));
    sliders[0].setHierarchyLevelSliderValues(max);
    super(sliders, subscribers);
  }
  override update() {
    const value = Number(this.controllers[0].input.value);
    this.subscribers.forEach(e => e.onChangedLayer(value));
  }
}
