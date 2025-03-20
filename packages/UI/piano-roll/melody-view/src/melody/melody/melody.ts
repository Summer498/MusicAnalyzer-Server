import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { play } from "@music-analyzer/synth";
import { NowAt, reservation_range } from "@music-analyzer/view-parameters";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Time } from "@music-analyzer/time-and";
import { MelodyModel } from "./melody-model";
import { MelodyView } from "./melody-view";
import { MelodyBeepController, MelodyBeepSwitcherSubscriber, MelodyBeepVolumeSubscriber, MelodyColorController } from "@music-analyzer/controllers";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

class MelodyBeep
  implements
  MelodyBeepSwitcherSubscriber,
  MelodyBeepVolumeSubscriber {
  #beep_volume: number;
  #do_melody_beep: boolean;
  #sound_reserved: boolean;
  constructor(
    private readonly model: MelodyModel,
    controllers: [MelodyBeepController]
  ) {
    this.#beep_volume = 0;
    this.#do_melody_beep = false;
    this.#sound_reserved = false;
    controllers[0].register(this);
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

export class Melody
  extends MVVM_ViewModel<MelodyModel, MelodyView> {
  #beeper: MelodyBeep
  constructor(
    melody: TimeAndAnalyzedMelody,
    controllers: [MelodyColorController, MelodyBeepController]
  ) {
    const model = new MelodyModel(melody);
    super(model, new MelodyView(model, [controllers[0]]));
    this.#beeper = new MelodyBeep(model, [controllers[1]]);
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
  }
  updateX() { this.view.updateX(scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(isNaN(this.model.note) ? -99 : -convertToCoordinate(transposed(this.model.note))) }
  updateWidth() { this.view.updateWidth(31 / 32 * scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(BlackKeyPrm.height) }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
  }
  onAudioUpdate() {
    this.#beeper.beepMelody();
  }
}

