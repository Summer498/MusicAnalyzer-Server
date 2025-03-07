import { HierarchyLevel } from "@music-analyzer/controllers";
import { SliderMediator } from "./slider-mediator";

interface HierarchyLevelSubscriber {
  children: { length: number }
  onChangedLayer(value: number): void
}
export class HierarchyLevelMediator extends SliderMediator<HierarchyLevelSubscriber> {
  constructor(
    slider: HierarchyLevel,
    ...subscribers: HierarchyLevelSubscriber[]
  ) {
    const max = Math.max(...subscribers.map(e => e.children.length - 1));
    slider.setHierarchyLevelSliderValues(max);
    super(slider, subscribers);
  }
  override update() {
    const value = Number(this.controller.input.value);
    this.subscribers.forEach(e => e.onChangedLayer(value));
  }
}
