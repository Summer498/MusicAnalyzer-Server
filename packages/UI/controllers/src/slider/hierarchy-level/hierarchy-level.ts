import { Slider } from "../abstract-slider";
import { HierarchyLevelSubscriber } from "./hierarchy-level-subscriber";

export class HierarchyLevel 
  extends Slider<HierarchyLevelSubscriber> {
  constructor() {
    super("hierarchy_level_slider", "Melody Hierarchy Level", 0, 1, 1);
  };
  override updateDisplay() {
    this.display.textContent = `layer: ${this.input.value}`;
  }
  setHierarchyLevelSliderValues = (max: number) => {
    this.input.max = String(max);
    this.input.value = String(max);
    this.updateDisplay();
  };
  update() {
    const value = Number(this.input.value);
    this.subscribers.forEach(e => e.onChangedLayer(value));
  }
};
