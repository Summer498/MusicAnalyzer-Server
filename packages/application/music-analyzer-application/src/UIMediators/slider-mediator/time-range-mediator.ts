import { TimeRangeSlider } from "@music-analyzer/controllers";
import { MelodyHierarchy } from "@music-analyzer/melody-view";
import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { ControllerMediator } from "../controller-mediator";

const last = <T>(arr: T[]) => { return arr[arr.length - 1]; };

export class TimeRangeMediator extends ControllerMediator<{ onUpdate: () => void }> {
  constructor(
    publisher: [TimeRangeSlider],
    melody: [MelodyHierarchy],
    audio_subscriber: AudioReflectableRegistry,
    window_subscriber: WindowReflectableRegistry,
  ) {
    super(publisher, [audio_subscriber, window_subscriber]);
    const length = last(last(melody[0].children).children).model.time.end;
    if (length > 30) {
      const window = 30;  // 秒のつもりだが, 秒になってない感じがする
      const ratio = window / length;
      const max = publisher[0].input.max;
      const value = max + Math.log2(ratio);
      publisher[0].input.value = String(value);
      publisher[0].updateDisplay();
      this.update();
    }
  }
  override update() {
    const value = Number(this.publisher[0].input.value);
    const max = Number(this.publisher[0].input.max);
    const ratio = Math.pow(2, value - max);
    PianoRollRatio.set(ratio);
    this.subscribers.forEach(e => e.onUpdate());
  }
}
