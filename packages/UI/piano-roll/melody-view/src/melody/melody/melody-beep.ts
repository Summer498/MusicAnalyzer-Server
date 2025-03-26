import { play } from "@music-analyzer/synth";
import { NowAt } from "@music-analyzer/view-parameters";
import { reservation_range } from "@music-analyzer/view-parameters";
import { Time } from "@music-analyzer/time-and";
import { MelodyModel } from "./melody-model";
import { MelodyBeepController } from "@music-analyzer/controllers";
import { MelodyBeepSwitcherSubscriber } from "@music-analyzer/controllers";
import { MelodyBeepVolumeSubscriber } from "@music-analyzer/controllers";

export interface RequiredByMelodyBeep {
  readonly melody_beep: MelodyBeepController,
}
export class MelodyBeep
  implements
  MelodyBeepSwitcherSubscriber,
  MelodyBeepVolumeSubscriber {
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
