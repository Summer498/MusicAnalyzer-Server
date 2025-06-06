import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { createControllerView } from "./controller";

export interface Slider<T> {
  readonly body: HTMLSpanElement;
  readonly input: HTMLInputElement;
  readonly display: HTMLSpanElement;
  addListeners(...listeners: ((e: T) => void)[]): void;
  updateDisplay(): void;
}

export const createSlider = <T>(ops: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value?: number;
  updateDisplay(input: HTMLInputElement, display: HTMLSpanElement): void;
  getValue(input: HTMLInputElement): T;
}): Slider<T> => {
  const view = createControllerView("range", ops.id, ops.label);
  const { body, input } = view;
  const display = document.createElement("span");
  body.appendChild(display);

  input.min = String(ops.min);
  input.max = String(ops.max);
  input.step = String(ops.step);
  if (ops.value !== undefined) input.value = String(ops.value);

  const listeners: ((e: T) => void)[] = [];

  const updateDisplay = () => ops.updateDisplay(input, display);
  const update = () => {
    const value = ops.getValue(input);
    listeners.forEach(e => e(value));
  };

  input.addEventListener("input", () => {
    updateDisplay();
    update();
  });

  updateDisplay();
  update();

  return {
    body,
    input,
    display,
    addListeners: (...ls: ((e: T) => void)[]) => { listeners.push(...ls); update(); },
    updateDisplay,
  };
};

interface HierarchyLevel extends Slider<number> {
  setHierarchyLevelSliderValues(max: number): void;
}

const createHierarchyLevel = (): HierarchyLevel => {
  const slider = createSlider<number>({
    id: "hierarchy_level_slider",
    label: "Melody Hierarchy Level",
    min: 0,
    max: 1,
    step: 1,
    updateDisplay: (input, display) => { display.textContent = `layer: ${input.value}`; },
    getValue: input => Number(input.value),
  });

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

export interface TimeRangeController {
  readonly view: HTMLDivElement;
  readonly slider: TimeRangeSlider;
  addListeners(...listeners: (() => void)[]): void;
}

interface TimeRangeSlider extends Slider<number> {}

const createTimeRangeSlider = (): TimeRangeSlider =>
  createSlider<number>({
    id: "time_range_slider",
    label: "Time Range",
    min: 1,
    max: 10,
    step: 0.1,
    value: 10,
    updateDisplay: (input, display) => {
      const ratio = Math.pow(2, Number(input.value) - Number(input.max));
      display.textContent = `${Math.floor(ratio * 100)} %`;
    },
    getValue: input => {
      const ratio = Math.pow(2, Number(input.value) - Number(input.max));
      PianoRollRatio.set(ratio);
      return ratio;
    },
  });

export const createTimeRangeController = (length: number): TimeRangeController => {
  const slider = createTimeRangeSlider();
  const view = document.createElement("div");
  view.id = "time-length";
  view.appendChild(slider.body);

  if (length > 30) {
    const window = 30;  // 秒のつもりだが, 秒になってない感じがする
    const ratio = window / length;
    const max = slider.input.max;
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
