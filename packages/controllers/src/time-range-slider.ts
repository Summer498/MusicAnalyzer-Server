import { Controller } from "./controller";

export class TimeRangeSlider implements Controller {
  readonly body: HTMLSpanElement;
  readonly slider: HTMLInputElement;
  readonly span: HTMLSpanElement;
  constructor() {
    const time_range_slider = document.createElement("input");
    this.slider = time_range_slider;
    this.slider.type = "range";
    this.slider.id = "time_range_slider";
    this.slider.name = "time_range_slider";
    this.slider.min = `${1}`;
    this.slider.max = `${10}`;
    this.slider.step = `${0.1}`;
    this.slider.value = `${10}`;
    const show_time_range_slider_value = document.createElement("span");
    this.span = show_time_range_slider_value;
    this.span.textContent = `${Math.floor(Math.pow(2, Number(this.slider.value) - Number(this.slider.max)) * 100)} %`;
    const label = document.createElement("label");
    label.textContent = "Time Range";
    label.htmlFor = this.slider.id;
    this.body = document.createElement("span");
    this.body.appendChild(label);
    this.body.appendChild(this.slider);
    this.body.appendChild(this.span);
  }
}
