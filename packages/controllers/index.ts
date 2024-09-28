import { HTML } from "@music-analyzer/html";
import { UpdatableRegistry } from "@music-analyzer/view";
import { PianoRollTimeLength } from "@music-analyzer/view-parameters";

export interface Controller {
  body: HTMLSpanElement;
}

export class DMelodySwitcher implements Controller {
  body: HTMLSpanElement;
  checkbox: HTMLInputElement;
  constructor() {
    this.checkbox = HTML.input_checkbox({ id: "d_melody_switcher", name: "d_melody_switcher" });
    this.checkbox.checked = false;
    this.checkbox.addEventListener("change", e => {
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span({}, "", [
      HTML.label({ for: this.checkbox.id }, "detected melody before fix"),
      this.checkbox,
    ]);
  }
}

export class HierarchyLevel implements Controller {
  body: HTMLSpanElement;
  range: HTMLInputElement;
  #display: HTMLSpanElement;
  constructor() {
    this.range = HTML.input_range({ id: "hierarchy_level_slider", name: "hierarchy_level_slider", min: 0, max: 1, step: 1 });
    this.#display = HTML.span({}, `layer: ${this.range.value}`);
    this.range.addEventListener("input", e => {
      this.#display.textContent = `layer: ${this.range.value}`;
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span({}, "", [
      HTML.label({ for: this.range.id }, "Melody Hierarchy Level"),
      this.range,
      this.#display,
    ]);
  }
  setHierarchyLevelSliderValues = (max: number) => {
    console.log(`max: ${max}`);
    this.range.max = String(max);
    this.range.value = String(max);
    this.#display.textContent = `layer: ${this.range.value}`;
  };
};

export class TimeRangeSlider implements Controller {
  body: HTMLSpanElement;
  constructor() {
    const time_range_slider = HTML.input_range({ id: "time_range_slider", name: "time_range_slider", min: 1, max: 10, step: 0.1 });
    const show_time_range_slider_value = HTML.span({}, `${Math.floor(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)) * 100)} %`);
    time_range_slider.addEventListener("input", e => {
      show_time_range_slider_value.textContent = `${Math.floor(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)) * 100)} %`;
      PianoRollTimeLength.setRatio(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)));
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span({}, "", [
      HTML.label({ for: time_range_slider.id }, "Time Range"),
      time_range_slider,
      show_time_range_slider_value,
    ]);
  }
}

export class GravitySwitcher implements Controller {
  body: HTMLSpanElement;
  checkbox: HTMLInputElement;
  #gravities: SVGElement[];
  constructor(id: string, label:string, gravities: SVGElement[]) {
    this.checkbox = HTML.input_checkbox({ id, name: id });
    this.checkbox.checked = true;
    this.#gravities = gravities;
    this.checkbox.addEventListener("change", e => {
      this.#gravities.forEach(gravity => gravity.setAttribute("visibility", this.checkbox.checked ? "visible" : "hidden"));
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span({}, "", [
      HTML.label({ for: this.checkbox.id }, label),
      this.checkbox,
    ]);
  };
}

export class MelodyBeepSwitcher implements Controller {
  body: HTMLSpanElement;
  checkbox: HTMLInputElement;
  constructor() {
    this.checkbox = HTML.input_checkbox({ id: "melody_beep_switcher", name: "melody_beep_switcher" });
    this.checkbox.checked = false;
    this.checkbox.addEventListener("change", e => {
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span({}, "", [
      HTML.label({ for: this.checkbox.id }, "Beep Melody"),
      this.checkbox,
    ]);
  }
};

export class MelodyBeepVolume implements Controller {
  body: HTMLSpanElement;
  range: HTMLInputElement;
  constructor() {
    this.range = HTML.input_range({ id: "melody_beep_volume", min: 0, max: 100, step: 1 });
    const show_melody_beep_volume = HTML.span({}, `volume: ${this.range.value}`);
    this.range.addEventListener("input", e => {
      show_melody_beep_volume.textContent = `volume: ${this.range.value}`;
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span({}, "", [
      this.range,
      show_melody_beep_volume,
    ]);
  };
}

export class MelodyColorSelector implements Controller {
  body: HTMLSpanElement;
  constructor() {
    const key_color_selector = HTML.input_radio({ name: "key_color_selector", id: "key_color_selector", value: "key", checked: `${true}` }, "key based color");
    const chord_color_selector = HTML.input_radio({ name: "chord_color_selector", id: "chord_color_selector", value: "chord" }, "chord based color");
    this.body = HTML.span({ id: "melody_color_selector" }, "", [
      HTML.label({ for: key_color_selector.id }, "key based color"),
      key_color_selector,
      HTML.label({ for: chord_color_selector.id }, "chord based color"),
      chord_color_selector,
    ]);
  }
}
