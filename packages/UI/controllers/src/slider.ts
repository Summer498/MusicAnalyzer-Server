import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { ControllerView } from "./controller";

export interface Slider<T> {
  readonly body: HTMLSpanElement;
  readonly input: HTMLInputElement;
  readonly display: HTMLSpanElement;
  addListeners(...listeners: ((e: T) => void)[]): void;
  update(): void;
  updateDisplay(): void;
}

export const createSlider = <T>(
  id: string,
  label: string,
  min: number,
  max: number,
  step: number,
  value: number | undefined,
  updateFn: (slider: Slider<T>, listeners: ((e: T) => void)[]) => void,
  updateDisplayFn: (slider: Slider<T>) => void,
): Slider<T> => {
  const view = new ControllerView("range", id, label);
  const display = document.createElement("span");
  view.body.appendChild(display);

  view.input.min = String(min);
  view.input.max = String(max);
  view.input.step = String(step);
  value !== undefined && (view.input.value = String(value));

  const listeners: ((e: T) => void)[] = [];

  const slider: Slider<T> = {
    body: view.body,
    input: view.input,
    display,
    addListeners: () => undefined,
    update: () => undefined,
    updateDisplay: () => undefined,
  };

  slider.addListeners = (...ls: ((e: T) => void)[]) => {
    listeners.push(...ls);
    slider.update();
  };
  slider.update = () => updateFn(slider, listeners);
  slider.updateDisplay = () => updateDisplayFn(slider);

  view.input.addEventListener("input", () => {
    slider.updateDisplay();
    slider.update();
  });

  slider.updateDisplay();
  return slider;
};

export interface HierarchyLevel extends Slider<number> {
  setHierarchyLevelSliderValues(max: number): void;
}

export const createHierarchyLevel = (): HierarchyLevel => {
  const updateDisplay = (s: Slider<number>) => {
    s.display.textContent = `layer: ${s.input.value}`;
  };
  const updateFn = (s: Slider<number>, ls: ((e: number) => void)[]) => {
    const value = Number(s.input.value);
    ls.forEach(e => e(value));
  };
  const slider = createSlider<number>(
    "hierarchy_level_slider",
    "Melody Hierarchy Level",
    0,
    1,
    1,
    undefined,
    updateFn,
    updateDisplay,
  );
  const setHierarchyLevelSliderValues = (max: number) => {
    slider.input.max = String(max);
    slider.input.value = String(max);
    slider.updateDisplay();
  };
  return { ...slider, setHierarchyLevelSliderValues };
};

export interface HierarchyLevelController {
  readonly view: HTMLDivElement;
  readonly slider: HierarchyLevel;
  addListeners(...listeners: ((e: number) => void)[]): void;
}

export const createHierarchyLevelController = (layer_count: number): HierarchyLevelController => {
  const slider = createHierarchyLevel();
  const view = document.createElement("div");
  view.id = "hierarchy-level";
  view.appendChild(slider.body);
  slider.setHierarchyLevelSliderValues(layer_count);
  return {
    view,
    slider,
    addListeners: (...ls: ((e: number) => void)[]) => slider.addListeners(...ls),
  };
};

export interface TimeRangeSlider extends Slider<number> {}

export const createTimeRangeSlider = (): TimeRangeSlider => {
  const updateDisplay = (s: Slider<number>) => {
    const value = Number(s.input.value);
    const max = Number(s.input.max);
    const percent = Math.floor(Math.pow(2, value - max) * 100);
    s.display.textContent = `${percent} %`;
  };
  const updateFn = (s: Slider<number>, ls: ((e: number) => void)[]) => {
    const value = Number(s.input.value);
    const max = Number(s.input.max);
    const ratio = Math.pow(2, value - max);
    PianoRollRatio.set(ratio);
    ls.forEach(e => e(ratio));
  };
  return createSlider<number>(
    "time_range_slider",
    "Time Range",
    1,
    10,
    0.1,
    10,
    updateFn,
    updateDisplay,
  );
};

export interface TimeRangeController {
  readonly view: HTMLDivElement;
  readonly slider: TimeRangeSlider;
  addListeners(...listeners: (() => void)[]): void;
}

export const createTimeRangeController = (length: number): TimeRangeController => {
  const slider = createTimeRangeSlider();
  const view = document.createElement("div");
  view.id = "time-length";
  view.appendChild(slider.body);

  if (length > 30) {
    const window = 30;  // 秒のつもりだが, 秒になってない感じがする
    const ratio = window / length;
    const max = Number(slider.input.max);
    const value = max + Math.log2(ratio);
    slider.input.value = String(value);
    slider.updateDisplay();
  }

  return {
    view,
    slider,
    addListeners: (...ls: (() => void)[]) => slider.addListeners(...ls),
  };
};
