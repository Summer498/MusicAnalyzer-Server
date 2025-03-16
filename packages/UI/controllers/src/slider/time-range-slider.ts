import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { Slider } from "./abstract-slider";
import { TimeRangeMediator } from "@music-analyzer/music-analyzer-application";

export class TimeRangeSlider extends Slider {
  constructor() {
    super("time_range_slider", "Time Range", 1, 10, 0.1, 10);
  };
  override updateDisplay() {
    this.display.textContent = `${Math.floor(Math.pow(2, Number(this.input.value) - Number(this.input.max)) * 100)} %`;
  }
}

interface TimeRangeSubscriber { onUpdate: () => void }

export class TimeRangeController {
  readonly view: HTMLDivElement;
  readonly slider: TimeRangeSlider;
  constructor() {
    const time_range_slider = new TimeRangeSlider();
    this.view = document.createElement("div");
    this.view.id = "time-length";
    this.view.appendChild(time_range_slider.body);
    this.slider = time_range_slider;
  }
  readonly subscribers: TimeRangeSubscriber[] = [];
  register(...subscribers: TimeRangeSubscriber[]) {
    this.subscribers.push(...subscribers);
  }
  update() {
    const value = Number(this.slider.input.value);
    const max = Number(this.slider.input.max);
    const ratio = Math.pow(2, value - max);
    PianoRollRatio.set(ratio);
    this.subscribers.forEach(e => e.onUpdate());
  }
  init() {
    this.slider.input.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}