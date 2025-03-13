import { TimeRangeSlider } from "@music-analyzer/controllers";
import { MelodyHierarchy } from "@music-analyzer/melody-view";
import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { SliderMediator } from "./slider-mediator";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";

const last = <T>(arr: T[]) => { return arr[arr.length - 1]; };

export class TimeRangeMediator extends SliderMediator<{ onUpdate: () => void }> {
  constructor(
    sliders: [TimeRangeSlider],
    melody: [MelodyHierarchy],
    audio_subscriber: AudioReflectableRegistry,
    window_subscriber: WindowReflectableRegistry,
  ) {
    super(sliders, [audio_subscriber, window_subscriber]);
    const length = last(last(melody[0].children).children).model.time.end;
    if (length > 30) {
      const window = 30;  // 秒のつもりだが, 秒になってない感じがする
      const ratio = window / length;
      const max = sliders[0].input.max;
      const value = max + Math.log2(ratio);
      sliders[0].input.value = String(value);
      sliders[0].updateDisplay();
      this.update();
    }
  }
  override update() {
    const value = Number(this.controllers[0].input.value);
    const max = Number(this.controllers[0].input.max);
    const ratio = Math.pow(2, value - max);
    PianoRollRatio.set(ratio);
    this.subscribers.forEach(e => e.onUpdate());
  }
}
