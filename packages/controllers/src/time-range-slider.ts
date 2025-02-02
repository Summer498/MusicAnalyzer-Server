import { Controller } from "./controller";
import { AccompanyToAudioRegistry } from "@music-analyzer/view";
import { PianoRollRatio } from "@music-analyzer/view-parameters";

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
    PianoRollRatio.value = Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max));
    const show_time_range_slider_value = document.createElement("span");
    show_time_range_slider_value.textContent = `${Math.floor(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)) * 100)} %`;
    time_range_slider.addEventListener("input", e => {
      show_time_range_slider_value.textContent = `${Math.floor(Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max)) * 100)} %`;
      PianoRollRatio.value = Math.pow(2, Number(time_range_slider.value) - Number(time_range_slider.max));
      AccompanyToAudioRegistry.instance.onAudioUpdate();
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
