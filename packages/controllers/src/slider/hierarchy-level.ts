import { Slider } from "./abstract-slider";

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

export const hierarchyLevelController = (hierarchy_level: HierarchyLevel) => {
  const hierarchy_level_div = document.createElement("div");
  hierarchy_level_div.id = "hierarchy-level";
  hierarchy_level_div.appendChild(hierarchy_level.body);
  return hierarchy_level_div;
};

