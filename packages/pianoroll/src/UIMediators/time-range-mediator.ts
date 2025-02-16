import { AccompanyToAudioRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { SliderMediator } from "./slider-mediator";
import { Slider } from "@music-analyzer/controllers";
import { PianoRollRatio } from "@music-analyzer/view-parameters";

export class TimeRangeMediator extends SliderMediator<AccompanyToAudioRegistry> {
  constructor(
    slider: Slider,
    accompany_to_audio_registry: AccompanyToAudioRegistry,
  ) {
    super(slider, [accompany_to_audio_registry]);
  }

  override update() {
    const time_range = Number(this.controller.input.value);
    const time_range_max = Number(this.controller.input.max);
    const time_range_ratio = Math.pow(2, time_range - time_range_max);
    PianoRollRatio.value = time_range_ratio;
    this.subscribers.forEach(e => e.onAudioUpdate());
    WindowReflectableRegistry.instance.onWindowResized();
  }
}
