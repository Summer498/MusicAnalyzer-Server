import { TimeRangeSlider } from "./time-range-slider";

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