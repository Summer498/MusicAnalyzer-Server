import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BlackKeyPrm } from "@music-analyzer/view-parameters";
import { SetColor } from "@music-analyzer/controllers";
import { MelodyModel } from "../model";
import { MelodyView } from "../view";
import { MelodyBeep } from "./melody-beep";
import { IMelody } from "../i-part";
import { Part } from "./abstract-part";

export class Melody
  extends Part<MelodyModel, MelodyView>
  implements IMelody {
  #beeper: MelodyBeep
  constructor(
    melody: SerializedTimeAndAnalyzedMelody,
  ) {
    const model = new MelodyModel(melody);
    super(model, new MelodyView());
    this.#beeper = new MelodyBeep(model);
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
  }
  updateX() { this.view.updateX(this.converter.scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(isNaN(this.model.note) ? -99 : -this.converter.convertToCoordinate(this.converter.transposed(this.model.note))) }
  updateWidth() { this.view.updateWidth(31 / 32 * this.converter.scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(BlackKeyPrm.height) }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
  }
  readonly setColor: SetColor = f => this.view.setColor(f)
  onTimeRangeChanged = this.onWindowResized;
  beep() { this.#beeper.beepMelody(); }
  onMelodyBeepCheckChanged(e: boolean) { this.#beeper.onMelodyBeepCheckChanged(e); }
  onMelodyVolumeBarChanged(e: number) { this.#beeper.onMelodyVolumeBarChanged(e); }
}

