import { HierarchyLevel } from "./hierarchy-level";

export class HierarchyLevelController {
  readonly view: HTMLDivElement;
  readonly slider: HierarchyLevel;
  constructor(layer_count: number) {
    const hierarchy_level = new HierarchyLevel();
    this.view = document.createElement("div");
    this.view.id = "hierarchy-level";
    this.view.appendChild(hierarchy_level.body);
    this.slider = hierarchy_level;
    this.slider.setHierarchyLevelSliderValues(layer_count)
  }
  addListeners(...listeners: ((e:number) => void)[]) { this.slider.addListeners(...listeners); }
}