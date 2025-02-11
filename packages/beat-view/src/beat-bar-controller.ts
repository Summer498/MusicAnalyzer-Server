import { BeatBarModel } from "./beat-bar-model";
import { BeatBarView } from "./beat-bar-view";
import { MVCController } from "@music-analyzer/view";
import { play } from "@music-analyzer/synth";
import { NowAt, reservation_range } from "@music-analyzer/view-parameters";

export class BeatBarController extends MVCController {
  readonly model: BeatBarModel;
  readonly view: BeatBarView;
  sound_reserved: boolean;
  constructor(model: BeatBarModel) {
    super();
    this.model = model;
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

