import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { Slider } from "@music-analyzer/controllers";
import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { SliderMediator } from "./slider-mediator";

export class TimeRangeMediator extends SliderMediator<{onUpdate:()=>void}> {
  constructor(
    slider: Slider,
    audio_subscriber: AudioReflectableRegistry,
    window_subscriber: WindowReflectableRegistry,
  ) {
    super(slider, [audio_subscriber, window_subscriber]);
  }

  override update() {
    const time_range = Number(this.controller.input.value);
    const time_range_max = Number(this.controller.input.max);
    const time_range_ratio = Math.pow(2, time_range - time_range_max);
    PianoRollRatio.value = time_range_ratio;
    this.subscribers.forEach(e => e.onUpdate());
  }
}
