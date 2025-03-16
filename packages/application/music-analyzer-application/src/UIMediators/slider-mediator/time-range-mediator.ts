import { Controller, TimeRangeSlider } from "@music-analyzer/controllers";
import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { ControllerMediator } from "../controller-mediator";

export class TimeRangeMediator extends ControllerMediator<{ onUpdate: () => void }> {
  constructor(
    publisher: [TimeRangeSlider],
    length: number,
  ) {
    super(publisher);
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
  override init(controllers: Controller[]) {
    controllers.forEach(e => e.input.addEventListener("input", this.update.bind(this)));
    this.update.bind(this)();
  };
}
