import { BeatInfo } from "@music-analyzer/beat-estimation";
import { BeatBarModel } from "./beat-bar-model";
import { BeatBarView } from "./beat-bar-view";
import { Controller } from "@music-analyzer/view";
import { play } from "@music-analyzer/synth";
import { NowAt, reservation_range } from "@music-analyzer/view-parameters";

export class BeatBarController implements Controller {
  readonly model: BeatBarModel;
  readonly view: BeatBarView;
  sound_reserved: boolean;
  constructor(beat_info: BeatInfo, i: number) {
    this.model = new BeatBarModel(beat_info, i);
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
    this.view.onAudioUpdate();
    // NOTE: うるさいので停止中
    0 && this.beepBeat();
  }
}

