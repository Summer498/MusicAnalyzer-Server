import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { Controller, createController } from "./controller";

export abstract class Slider<T> implements Controller<T> {
  body!: HTMLSpanElement;
  input!: HTMLInputElement;
  listeners!: ((e: T) => void)[];
  addListeners!: (...listeners: ((e: T) => void)[]) => void;
  init!: () => void;
  readonly display: HTMLSpanElement;
  constructor(id: string, label: string, min: number, max: number, step: number, value?: number) {
    createController<T>(this, "range", id, label);
    this.display = document.createElement("span");
    this.body.appendChild(this.display);

    this.input.min = String(min);
    this.input.max = String(max);
    this.input.step = String(step);
    value && (this.input.value = String(value));

    this.updateDisplay();
    this.input.addEventListener("input", this.updateDisplay.bind(this));
  }
  abstract updateDisplay(): void;
}

class HierarchyLevel
  extends Slider<number> {
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
    this.listeners.forEach(e => e(value));
  }
};

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

export class TimeRangeController {
  readonly view: HTMLDivElement;
  readonly slider: TimeRangeSlider;
  constructor(length: number) {
    const time_range_slider = new TimeRangeSlider();
    this.view = document.createElement("div");
    this.view.id = "time-length";
    this.view.appendChild(time_range_slider.body);
    this.slider = time_range_slider;

    if (length > 30) {
      const window = 30;  // 秒のつもりだが, 秒になってない感じがする
      const ratio = window / length;
      const max = this.slider.input.max;
      const value = max + Math.log2(ratio);
      this.slider.input.value = String(value);
      this.slider.updateDisplay();
    }
  }
  addListeners(...listeners: (() => void)[]) { this.slider.addListeners(...listeners); }
}
class TimeRangeSlider
  extends Slider<number> {
  constructor() {
    super("time_range_slider", "Time Range", 1, 10, 0.1, 10);
  };
  override updateDisplay() {
    [Number(this.input.value)]
      .map(e => e - Number(this.input.max))
      .map(e => Math.pow(2, e))
      .map(e => e * 100)
      .map(e => Math.floor(e))
      .map(e => `${e} %`)
      .map(e => this.display.textContent = e)
  }
  update() {
    const value = Number(this.input.value);
    const max = Number(this.input.max);
    const ratio = Math.pow(2, value - max);
    PianoRollRatio.set(ratio);
    this.listeners.forEach(e => e(ratio));
  }
}
