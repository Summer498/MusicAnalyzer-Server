import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { Slider } from "../abstract-slider";
import { TimeRangeSubscriber } from "./time-range-subscriber";

export class TimeRangeSlider 
  extends Slider<TimeRangeSubscriber> {
  constructor() {
    super("time_range_slider", "Time Range", 1, 10, 0.1, 10);
  };
  override updateDisplay() {
    this.display.textContent = `${Math.floor(Math.pow(2, Number(this.input.value) - Number(this.input.max)) * 100)} %`;
  }
  update() {
    const value = Number(this.input.value);
    const max = Number(this.input.max);
    const ratio = Math.pow(2, value - max);
    PianoRollRatio.set(ratio);
    this.subscribers.forEach(e => e.onTimeRangeChanged());
  }
}
