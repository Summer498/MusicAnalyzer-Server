import { play } from "@music-analyzer/synth/src/play";
import { NowAt } from "@music-analyzer/view-parameters/src/now-at";
import { reservation_range } from "@music-analyzer/view-parameters/src/reservation-range";
import { Time } from "@music-analyzer/time-and/src/time";
import { MelodyModel } from "./melody-model";
import { MelodyBeepSwitcherSubscriber } from "@music-analyzer/controllers/src/melody-beep-controller/melody-beep-toggle/melody-beep-switcher-subscriber";
import { MelodyBeepVolumeSubscriber } from "@music-analyzer/controllers/src/melody-beep-controller/melody-beep-volume/melody-beep-volume-subscriber";

export interface IMelodyBeep
  extends
  MelodyBeepSwitcherSubscriber,
  MelodyBeepVolumeSubscriber { }

export class MelodyBeep
  implements IMelodyBeep {
  #beep_volume: number;
  #do_melody_beep: boolean;
  #sound_reserved: boolean;
  constructor(
    private readonly model: MelodyModel,
  ) {
    this.#beep_volume = 0;
    this.#do_melody_beep = false;
    this.#sound_reserved = false;
  }
  #beepMelody = () => {
    const volume = this.#beep_volume / 400;
    const pitch = [440 * Math.pow(2, (this.model.note - 69) / 12)];
    const begin_sec = this.model.time.begin - NowAt.get();
    const length_sec = this.model.time.duration;
    play(pitch, begin_sec, length_sec, volume);
    this.#sound_reserved = true;
    setTimeout(() => { this.#sound_reserved = false; }, reservation_range * 1000);
  };
  beepMelody = () => {
    if (!this.#do_melody_beep) { return; }
    if (!this.model.note) { return; }
    const model_is_in_range =
      new Time(0, reservation_range)
        .map(e => e + NowAt.get())
        .has(this.model.time.begin)
    if (model_is_in_range) {
      if (this.#sound_reserved === false) { this.#beepMelody(); }
    }
  };
  onMelodyBeepCheckChanged(do_melody_beep: boolean) { this.#do_melody_beep = do_melody_beep; }
  onMelodyVolumeBarChanged(beep_volume: number) { this.#beep_volume = beep_volume; }
}
