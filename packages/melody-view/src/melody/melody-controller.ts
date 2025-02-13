import { MelodyModel } from "./melody-model";
import { MelodyView } from "./melody-view";
import { play } from "@music-analyzer/synth";
import { NowAt, reservation_range } from "@music-analyzer/view-parameters";

export class MelodyController {
  readonly model: MelodyModel;
  readonly view: MelodyView;
  #do_melody_beep: boolean;
  #beep_volume: number;
  get do_melody_beep() { return this.#do_melody_beep; }
  get beep_volume() { return this.#beep_volume; }

  constructor(
    model: MelodyModel,
  ) {
    this.model = model;
    this.view = new MelodyView(this.model);
    this.#do_melody_beep = false;
    this.#beep_volume = 0;
  }

  beepMelody = () => {
    if (!this.model.note) { return; }
    if (NowAt.value <= this.model.begin && this.model.begin < NowAt.value + reservation_range) {
      if (this.view.sound_reserved === false) {
        const volume = this.beep_volume / 400;
        const pitch = [440 * Math.pow(2, (this.model.note - 69) / 12)];
        const begin_sec = this.model.begin - NowAt.value;
        const length_sec = this.model.end - this.model.begin;
        play(pitch, begin_sec, length_sec, volume);
        this.view.sound_reserved = true;
        setTimeout(() => { this.view.sound_reserved = false; }, reservation_range * 1000);
      }
    }
  };

  onMelodyBeepCheckChanged(do_melody_beep: boolean) { this.#do_melody_beep = do_melody_beep; }
  onMelodyVolumeBarChanged(beep_volume: number) { this.#beep_volume = beep_volume; }
  onAudioUpdate() {
    if (this.do_melody_beep) {
      this.beepMelody();
    }
  }
}

