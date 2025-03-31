import { MVVM_ViewModel_Impl } from "./facade";
import { play } from "./facade";
import { NoteSize } from "./facade";
import { NowAt } from "./facade";
import { PianoRollHeight } from "./facade";
import { reservation_range } from "./facade";
import { BeatInfo } from "./facade";
import { Time } from "./facade";
import { TimeRangeSubscriber } from "./facade";
import { BeatBarModel } from "./beat-bar-model";
import { BeatBarView } from "./beat-bar-view";

const scaled = (e: number) => e * NoteSize.get();

export class BeatBar
  extends MVVM_ViewModel_Impl<BeatBarModel, BeatBarView>
  implements TimeRangeSubscriber {
  #y1: number;
  #y2: number;
  sound_reserved: boolean;
  constructor(
    beat_info: BeatInfo,
    i: number
  ) {
    const model = new BeatBarModel(beat_info, i);
    super(model, new BeatBarView(model));
    this.sound_reserved = false;
    this.#y1 = 0;
    this.#y2 = PianoRollHeight.get();
    this.updateX();
    this.updateY();
  }
  updateX() {
    this.view.updateX(
      scaled(this.model.time.begin),
      scaled(this.model.time.begin),
    )
  }
  updateY() {
    this.view.updateY(
      this.#y1,
      this.#y2,
    )
  }
  onWindowResized() {
    this.updateX();
  }
  onTimeRangeChanged = this.onWindowResized

  beepBeat() {
    const model_is_in_range = new Time(0, reservation_range)
      .map(e => e + NowAt.get())
      .has(this.model.time.begin);
    if (model_is_in_range) {
      if (this.sound_reserved === false) {
        play([220], this.model.time.begin - NowAt.get(), 0.125);
        this.sound_reserved = true;
        setTimeout(() => { this.sound_reserved = false; }, reservation_range * 1000);
      }
    }
  }
  onAudioUpdate() {
    // NOTE: うるさいので停止中
    0 && this.beepBeat();
  }
}

