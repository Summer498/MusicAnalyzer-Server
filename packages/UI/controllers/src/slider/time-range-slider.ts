import { PianoRollRatio } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-ratio";
import { Slider } from "./abstract-slider";

class TimeRangeSlider 
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

export interface TimeRangeSubscriber {
  onTimeRangeChanged: () => void
}

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
  register(...subscribers: TimeRangeSubscriber[]) { this.slider.register(...subscribers) }
}