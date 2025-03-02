import { MVVM_ViewModel } from "@music-analyzer/view";
import { play } from "@music-analyzer/synth";
import { NowAt, reservation_range } from "@music-analyzer/view-parameters";
import { BeatBarModel } from "./beat-bar-model";
import { BeatBarView } from "./beat-bar-view";

export class BeatBarVM extends MVVM_ViewModel {
  readonly view: BeatBarView;
  sound_reserved: boolean;
  constructor(
    readonly model: BeatBarModel
  ) {
    super();
    this.view = new BeatBarView(this.model);
    this.sound_reserved = false;
  }
  beepBeat() {
    if (NowAt.value <= this.model.begin && this.model.begin < NowAt.value + reservation_range) {
      if (this.sound_reserved === false) {
        play([220], this.model.begin - NowAt.value, 0.125);
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

