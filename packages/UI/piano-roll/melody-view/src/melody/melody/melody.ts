import { MelodyBeepController, MelodyColorController } from "@music-analyzer/controllers";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { MelodyModel } from "./melody-model";
import { MelodyView } from "./melody-view";
import { MelodyBeep } from "./melody-beep";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

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

