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
    const label = HTML.label();
    label.textContent = "detected melody before fix";
    label.setAttribute("for", this.checkbox.id);
    this.body = HTML.span();
    this.body.appendChildren(label);
    this.body.appendChildren(this.checkbox);
  }
}

export class HierarchyLevel implements Controller {
  body: HTMLSpanElement;
  range: HTMLInputElement;
  #display: HTMLSpanElement;
  constructor() {
    this.range = HTML.input_range();
    this.range.setAttribute("id", "hierarchy_level_slider");
    this.range.setAttribute("name", "hierarchy_level_slider");
    this.range.setAttribute("min", "0");
    this.range.setAttribute("max", "1");
    this.range.setAttribute("step", "1");
    this.#display = HTML.span();
    this.#display.textContent = `layer: ${this.range.value}`;
    this.range.addEventListener("input", e => {
      this.#display.textContent = `layer: ${this.range.value}`;
      UpdatableRegistry.instance.onUpdate();
    });
    const label = HTML.label();
    label.textContent = "Melody Hierarchy Level";
    label.setAttribute("for", this.range.id);
    this.body = HTML.span();
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
  body: HTMLSpanElement;
  constructor() {
    const time_range_slider = HTML.input_range({ id: "time_range_slider", name: "time_range_slider", min: 1, max: 10, step: 0.1 });
    const show_time_range_slider_value = HTML.span();
    show_time_range_slider_value.textContent = `${Math.floor(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)) * 100)} %`;
    time_range_slider.addEventListener("input", e => {
      show_time_range_slider_value.textContent = `${Math.floor(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)) * 100)} %`;
      PianoRollTimeLength.setRatio(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)));
      UpdatableRegistry.instance.onUpdate();
    });
    const label = HTML.label();
    label.textContent = "Time Range";
    label.setAttribute("for", time_range_slider.id);
    this.body = HTML.span();
    this.body.appendChild(label);
    this.body.appendChild(time_range_slider);
    this.body.appendChild(show_time_range_slider_value);
  }
}

export class GravitySwitcher implements Controller {
  body: HTMLSpanElement;
  checkbox: HTMLInputElement;
  #gravities: SVGElement[];
  constructor(id: string, label: string, gravities: SVGElement[]) {
    this.checkbox = HTML.input_checkbox({ id, name: id });
    this.checkbox.checked = true;
    this.#gravities = gravities;
    this.checkbox.addEventListener("change", e => {
      this.#gravities.forEach(gravity => gravity.setAttribute("visibility", this.checkbox.checked ? "visible" : "hidden"));
      UpdatableRegistry.instance.onUpdate();
    });
    const label_element = HTML.label();
    label_element.textContent = label;
    label_element.setAttribute("for", this.checkbox.id);
    this.body = HTML.span();
    this.body.appendChild(label_element);
    this.body.appendChild(this.checkbox);
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
    const label = HTML.label();
    label.textContent = "Beep Melody";
    label.setAttribute("for", this.checkbox.id);
    this.body = HTML.span();
    this.body.appendChild(label);
    this.body.appendChild(this.checkbox);
  }
};

export class MelodyBeepVolume implements Controller {
  body: HTMLSpanElement;
  range: HTMLInputElement;
  constructor() {
    this.range = HTML.input_range({ id: "melody_beep_volume", min: 0, max: 100, step: 1 });
    const show_melody_beep_volume = HTML.span();
    show_melody_beep_volume.textContent = `volume: ${this.range.value}`;
    this.range.addEventListener("input", e => {
      show_melody_beep_volume.textContent = `volume: ${this.range.value}`;
      UpdatableRegistry.instance.onUpdate();
    });
    this.body = HTML.span();
    this.body.appendChild(this.range);
    this.body.appendChild(show_melody_beep_volume);
  };
}

export class MelodyColorSelector implements Controller {
  body: HTMLSpanElement;
  constructor() {
    const key_color_selector = HTML.input_radio({ name: "key_color_selector", id: "key_color_selector", value: "key", checked: `${true}` }, "key based color");
    const chord_color_selector = HTML.input_radio({ name: "chord_color_selector", id: "chord_color_selector", value: "chord" }, "chord based color");
    const key_color_label = HTML.label();
    key_color_label.textContent = "key based color";
    key_color_label.setAttribute("for", key_color_selector.id);
    const chord_color_label = HTML.label();
    chord_color_label.textContent = "chord based color";
    chord_color_label.setAttribute("for", chord_color_selector.id);
    this.body = HTML.span();
    this.body.setAttribute("id", "melody_color_selector");
    this.body.appendChild(key_color_label);
    this.body.appendChild(key_color_selector);
    this.body.appendChild(chord_color_label);
    this.body.appendChild(chord_color_selector);
  }
}
