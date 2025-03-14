import { MVVM_ViewModel } from "@music-analyzer/view";
import { play } from "@music-analyzer/synth";
import { NoteSize, NowAt, PianoRollHeight, reservation_range } from "@music-analyzer/view-parameters";
import { BeatBarModel } from "./beat-bar-model";
import { BeatBarView } from "./beat-bar-view";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { Time } from "@music-analyzer/time-and";

const scaled = (e: number) => e * NoteSize.get();

export class BeatBarVM extends MVVM_ViewModel<BeatBarModel, BeatBarView> {
  #y1: number;
  #y2: number;
  sound_reserved: boolean;
  constructor(beat_info: BeatInfo, i: number) {
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

