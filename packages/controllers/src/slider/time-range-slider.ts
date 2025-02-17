import { Slider } from "./abstract-slider";

export class TimeRangeSlider extends Slider {
  constructor() {
    super("time_range_slider", "Time Range", 1, 10, 0.1, 10);
  };
  override updateDisplay() {
    this.display.textContent = `${Math.floor(Math.pow(2, Number(this.input.value) - Number(this.input.max)) * 100)} %`;
  }
}

export class TimeRangeController {
  readonly view: HTMLDivElement;
  readonly slider: TimeRangeSlider;
  constructor() {
    const time_range_slider = new TimeRangeSlider();
    this.view = document.createElement("div");
    this.view.id = "time-length";
    this.view.appendChild(time_range_slider.body);
    this. slider = time_range_slider;
  }
}