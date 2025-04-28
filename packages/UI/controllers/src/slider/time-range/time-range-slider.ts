import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { Slider } from "../abstract-slider";

export class TimeRangeSlider
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
