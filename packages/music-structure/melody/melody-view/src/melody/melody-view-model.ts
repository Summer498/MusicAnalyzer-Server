import { MVVM_ViewModel } from "@music-analyzer/view";
import { play } from "@music-analyzer/synth";
import { NowAt, reservation_range } from "../../../../../application/view-parameters";
import { MelodyModel } from "./melody-model";
import { MelodyView } from "./melody-view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Time } from "@music-analyzer/time-and";

export class MelodyVM extends MVVM_ViewModel<MelodyModel, MelodyView> {
  #do_melody_beep: boolean;
  #beep_volume: number;
  get do_melody_beep() { return this.#do_melody_beep; }
  get beep_volume() { return this.#beep_volume; }
  constructor(melody: TimeAndAnalyzedMelody) {
    const model = new MelodyModel(melody);
    super(model, new MelodyView(model));
    this.#do_melody_beep = false;
    this.#beep_volume = 0;
  }

  #beepMelody = () => {
    const volume = this.beep_volume / 400;
    const pitch = [440 * Math.pow(2, (this.model.note - 69) / 12)];
    const begin_sec = this.model.time.begin - NowAt.value;
    const length_sec = this.model.time.duration;
    play(pitch, begin_sec, length_sec, volume);
    this.view.sound_reserved = true;
    setTimeout(() => { this.view.sound_reserved = false; }, reservation_range * 1000);
  };
  beepMelody = () => {
    if (!this.model.note) { return; }
    const model_is_in_range =
      new Time(0, reservation_range)
        .map(e => e + NowAt.value)
        .has(this.model.time.begin)
    if (model_is_in_range) {
      if (this.view.sound_reserved === false) { this.#beepMelody(); }
    }
  };
  setColor(getColor: (e: MelodyModel) => string) {
    this.view.setColor(getColor);
  }
  updateColor() { this.view.updateColor(); }
  onMelodyBeepCheckChanged(do_melody_beep: boolean) { this.#do_melody_beep = do_melody_beep; }
  onMelodyVolumeBarChanged(beep_volume: number) { this.#beep_volume = beep_volume; }
  onAudioUpdate() {
    if (this.do_melody_beep) {
      this.beepMelody();
    }
  }
}

