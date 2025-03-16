import { Slider } from "./abstract-slider";

export class HierarchyLevel extends Slider {
  constructor() {
    super("hierarchy_level_slider", "Melody Hierarchy Level", 0, 1, 1);
    this.init()
  };
  override updateDisplay() {
    this.display.textContent = `layer: ${this.input.value}`;
  }
  setHierarchyLevelSliderValues = (max: number) => {
    this.input.max = String(max);
    this.input.value = String(max);
    this.updateDisplay();
  };
  readonly subscribers: HierarchyLevelSubscriber[] = [];
  register(...subscribers: HierarchyLevelSubscriber[]) {
    this.subscribers.push(...subscribers);
    this.update()
  }
  update() {
    const value = Number(this.input.value);
    this.subscribers.forEach(e => e.onChangedLayer(value));
  }
  init() {
    this.input.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
};

export interface HierarchyLevelSubscriber {
  children: { length: number }
  onChangedLayer(value: number): void
}
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
  register(...subscribers: HierarchyLevelSubscriber[]) { this.slider.register(...subscribers) }
}