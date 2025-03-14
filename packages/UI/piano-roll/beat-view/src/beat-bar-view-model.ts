import { MVVM_ViewModel } from "@music-analyzer/view";
import { play } from "@music-analyzer/synth";
import { NowAt, reservation_range } from "@music-analyzer/view-parameters";
import { BeatBarModel } from "./beat-bar-model";
import { BeatBarView } from "./beat-bar-view";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { Time } from "@music-analyzer/time-and";

export class BeatBarVM extends MVVM_ViewModel<BeatBarModel, BeatBarView> {
  sound_reserved: boolean;
  constructor(beat_info: BeatInfo, i: number) {
    const model = new BeatBarModel(beat_info, i);
    super(model, new BeatBarView(model));
    this.sound_reserved = false;
  }
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
  onWindowResized() {
    this.view.onWindowResized()
  }
}

