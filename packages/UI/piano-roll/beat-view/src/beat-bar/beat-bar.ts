import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { MVVM_ViewModel} from "@music-analyzer/view/src/mvc";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { play } from "@music-analyzer/synth";
import { NoteSize } from "@music-analyzer/view-parameters/src/note-size";
import { NowAt } from "@music-analyzer/view-parameters/src/now-at";
import { PianoRollHeight } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-height";
import { reservation_range } from "@music-analyzer/view-parameters/src/reservation-range";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { Time } from "@music-analyzer/time-and";
import { BeatBarModel } from "./beat-bar-model";
import { BeatBarView } from "./beat-bar-view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

const scaled = (e: number) => e * NoteSize.get();

export interface RequiredByBeatBar {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}
export class BeatBar
  extends MVVM_ViewModel<BeatBarModel, BeatBarView>
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

