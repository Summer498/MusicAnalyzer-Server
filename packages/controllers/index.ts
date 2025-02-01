import { UpdatableRegistry } from "@music-analyzer/view";
import { PianoRollTimeLength } from "@music-analyzer/view-parameters";

export interface Controller {
  readonly body: HTMLSpanElement;
}

export class DMelodySwitcher implements Controller {
  readonly body: HTMLSpanElement;
  readonly checkbox: HTMLInputElement;
  constructor() {
    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.name = "d_melody_switcher";
    this.checkbox.id = "d_melody_switcher";
    this.checkbox.checked = false;
    this.checkbox.addEventListener("change", e => {
      UpdatableRegistry.instance.onUpdate();
    });
    const label = document.createElement("label");
    label.textContent = "detected melody before fix";
    label.htmlFor = this.checkbox.id;
    this.body = document.createElement("span");
    this.body.appendChild(label);
    this.body.appendChild(this.checkbox);
  }
}

export class HierarchyLevel implements Controller {
  readonly body: HTMLSpanElement;
  readonly range: HTMLInputElement;
  readonly #display: HTMLSpanElement;
  constructor() {
    this.range = document.createElement("input");
    this.range.type = "range";
    this.range.id = "hierarchy_level_slider";
    this.range.min = String(0);
    this.range.max = String(1);
    this.range.step = String(1);
    this.#display = document.createElement("span");
    this.#display.textContent = `layer: ${this.range.value}`;
    this.range.addEventListener("input", e => {
      this.#display.textContent = `layer: ${this.range.value}`;
      UpdatableRegistry.instance.onUpdate();
    });
    const label = document.createElement("label");
    label.textContent = "Melody Hierarchy Level";
    label.htmlFor = this.range.id;
    this.body = document.createElement("span");
    this.body.appendChild(label);
    this.body.appendChild(this.range);
    this.body.appendChild(this.#display);
  }
  setHierarchyLevelSliderValues = (max: number) => {
    console.log(`max: ${max}`);
    this.range.max = String(max);
    this.range.value = String(max);
    this.#display.textContent = `layer: ${this.range.value}`;
  };
};

export class TimeRangeSlider implements Controller {
  readonly body: HTMLSpanElement;
  constructor() {
    const time_range_slider = document.createElement("input");
    time_range_slider.type = "range";
    time_range_slider.id = "time_range_slider";
    time_range_slider.name = "time_range_slider";
    time_range_slider.min = `${1}`;
    time_range_slider.max = `${10}`;
    time_range_slider.step = `${0.1}`;
    time_range_slider.value = `${10}`;
    PianoRollTimeLength.setRatio(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)));
    const show_time_range_slider_value = document.createElement("span");
    show_time_range_slider_value.textContent = `${Math.floor(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)) * 100)} %`;
    time_range_slider.addEventListener("input", e => {
      show_time_range_slider_value.textContent = `${Math.floor(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)) * 100)} %`;
      PianoRollTimeLength.setRatio(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)));
      UpdatableRegistry.instance.onUpdate();
    });
    const label = document.createElement("label");
    label.textContent = "Time Range";
    label.htmlFor = time_range_slider.id;
    this.body = document.createElement("span");
    this.body.appendChild(label);
    this.body.appendChild(time_range_slider);
    this.body.appendChild(show_time_range_slider_value);
  }
}

export class GravitySwitcher implements Controller {
  readonly body: HTMLSpanElement;
  readonly checkbox: HTMLInputElement;
  readonly #gravities: SVGElement[];
  constructor(id: string, label: string, gravities: SVGElement[]) {
    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.id = id;
    this.checkbox.name = id;
    this.checkbox.checked = true;
    this.#gravities = gravities;
    this.checkbox.addEventListener("change", e => {
      this.#gravities.forEach(gravity => gravity.style.visibility = this.checkbox.checked ? "visible" : "hidden");
      UpdatableRegistry.instance.onUpdate();
    });
    const label_element = document.createElement("label");
    label_element.textContent = label;
    label_element.htmlFor = this.checkbox.id;
    this.body = document.createElement("span");
    this.body.appendChild(label_element);
    this.body.appendChild(this.checkbox);
  };
}

export class MelodyBeepSwitcher implements Controller {
  readonly body: HTMLSpanElement;
  readonly checkbox: HTMLInputElement;
  constructor() {
    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.id = "melody_beep_switcher";
    this.checkbox.name = "melody_beep_switcher";
    this.checkbox.checked = false;
    this.checkbox.addEventListener("change", e => {
      UpdatableRegistry.instance.onUpdate();
    });
    const label = document.createElement("label");
    label.textContent = "Beep Melody";
    label.htmlFor = this.checkbox.id;
    this.body = document.createElement("span");
    this.body.appendChild(label);
    this.body.appendChild(this.checkbox);
  }
};

export class MelodyBeepVolume implements Controller {
  readonly body: HTMLSpanElement;
  readonly range: HTMLInputElement;
  constructor() {
    this.range = document.createElement("input");
    this.range.type = "range";
    this.range.id = "melody_beep_volume";
    this.range.min = String(0);
    this.range.max = String(100);
    this.range.step = String(1);
    const show_melody_beep_volume = document.createElement("span");
    show_melody_beep_volume.textContent = `volume: ${this.range.value}`;
    this.range.addEventListener("input", e => {
      show_melody_beep_volume.textContent = `volume: ${this.range.value}`;
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = document.createElement("span");
    this.body.appendChild(this.range);
    this.body.appendChild(show_melody_beep_volume);
  };
}

export class MelodyColorSelector implements Controller {
  readonly body: HTMLSpanElement;
  constructor() {
    const key_color_selector = document.createElement("input");
    key_color_selector.id = "key_color_selector";
    key_color_selector.name = "key_color_selector";
    key_color_selector.type = "radio";
    key_color_selector.value = "key";
    key_color_selector.checked = true;
    key_color_selector.textContent = "key based color";
    const chord_color_selector = document.createElement("input");
    chord_color_selector.id = "chord_color_selector";
    chord_color_selector.type = "radio";
    chord_color_selector.name = "chord_color_selector";
    chord_color_selector.value = "chord";
    chord_color_selector.textContent = "chord based color";
    const key_color_label = document.createElement("label");
    key_color_label.textContent = "key based color";
    key_color_label.htmlFor = key_color_selector.id;
    const chord_color_label = document.createElement("label");
    chord_color_label.textContent = "chord based color";
    chord_color_label.htmlFor = chord_color_selector.id;
    this.body = document.createElement("span");
    this.body.id = "melody_color_selector";
    this.body.appendChild(key_color_label);
    this.body.appendChild(key_color_selector);
    this.body.appendChild(chord_color_label);
    this.body.appendChild(chord_color_selector);
  }
}
