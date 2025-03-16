import { Slider } from "./abstract-slider";
import { HierarchyLevelMediator } from "@music-analyzer/music-analyzer-application";

export class HierarchyLevel extends Slider {
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
};

export class HierarchyLevelController {
  readonly view: HTMLDivElement;
  readonly slider: HierarchyLevel;
  constructor() {
    const hierarchy_level = new HierarchyLevel();
    this.view = document.createElement("div");
    this.view.id = "hierarchy-level";
    this.view.appendChild(hierarchy_level.body);
    this.slider = hierarchy_level;
  }
  readonly subscribers: HierarchyLevelMediator[] = [];
  register(...subscribers: HierarchyLevelMediator[]) {
    this.subscribers.push(...subscribers);
  }
}