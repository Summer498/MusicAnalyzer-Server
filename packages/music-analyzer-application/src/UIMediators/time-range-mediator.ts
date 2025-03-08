import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { Slider, TimeRangeSlider } from "@music-analyzer/controllers";
import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { SliderMediator } from "./slider-mediator";
import { MelodyHierarchy } from "@music-analyzer/melody-view";

const last = <T>(arr: T[]) => { return arr[arr.length - 1]; };

export class TimeRangeMediator extends SliderMediator<{ onUpdate: () => void }> {
  constructor(
    slider: Slider,
    melody: MelodyHierarchy,
    audio_subscriber: AudioReflectableRegistry,
    window_subscriber: WindowReflectableRegistry,
  ) {
    super(slider, [audio_subscriber, window_subscriber]);
    const length = last(last(melody.children).children).model.time.end;
    if (length > 30) {
      const window = 30;  // 秒のつもりだが, 秒になってない感じがする
      const ratio = window / length;
      const max = slider.input.max;
      const value = max + Math.log2(ratio);
      slider.input.value = String(value);
      (slider as TimeRangeSlider).updateDisplay();
      this.update();
    }
  }
  override update() {
    const value = Number(this.controller.input.value);
    const max = Number(this.controller.input.max);
    const ratio = Math.pow(2, value - max);
    PianoRollRatio.value = ratio;
    this.subscribers.forEach(e => e.onUpdate());
  }
}
